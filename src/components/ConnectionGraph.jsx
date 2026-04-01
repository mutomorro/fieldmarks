import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

/* ── Soft, glowing theme palette ── */
const themeColours = {
  'core-building-blocks':      '#9B8EC4',
  'system-behaviours':         '#D4897A',
  'systems-archetypes':        '#6DC4B8',
  'leverage-and-intervention': '#7ABF7E',
  'complexity-and-uncertainty': '#6BA3D6',
  'mental-models':             '#B088C4',
  'resilience-and-change':     '#D4A76A',
  'boundaries-and-power':      '#D47A8E',
  'organisational-systems':    '#A3B86C',
  'measurement-and-signals':   '#D4B067',
  'design-and-intervention':   '#5CB8A8',
  'natural-metaphors':         '#6AAF6E',
  'human-dimensions':          '#9B7EC4',
};

const themeNames = {
  'core-building-blocks':      'Core building blocks',
  'system-behaviours':         'System behaviours and patterns',
  'systems-archetypes':        'Systems archetypes',
  'leverage-and-intervention': 'Leverage and intervention',
  'complexity-and-uncertainty': 'Complexity and uncertainty',
  'mental-models':             'Mental models and ways of seeing',
  'resilience-and-change':     'Resilience, adaptation, and change',
  'boundaries-and-power':      'Boundaries, perspectives, and power',
  'organisational-systems':    'Organisational and social systems',
  'measurement-and-signals':   'Measurement, signals, and sense',
  'design-and-intervention':   'Design and intervention approaches',
  'natural-metaphors':         'Natural and ecological metaphors',
  'human-dimensions':          'Human dimensions',
};

/* ── Deterministic hash for consistent per-node depth ── */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export default function ConnectionGraph() {
  const svgRef = useRef(null);
  const animRef = useRef(null);
  const simRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [search, setSearch] = useState('');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [legendOpen, setLegendOpen] = useState(true);
  const [activeTheme, setActiveTheme] = useState(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Fetch graph data
  useEffect(() => {
    fetch('/graph-data.json')
      .then(r => r.json())
      .then(setGraphData)
      .catch(console.error);
  }, []);

  // Track window size
  useEffect(() => {
    const onResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Collapse legend on mobile
  useEffect(() => {
    if (dimensions.width < 768) setLegendOpen(false);
  }, [dimensions.width]);

  const colour = useCallback((theme) => themeColours[theme] || '#9B8EC4', []);

  /* ════════════════════════════════════════════
     Main D3 simulation + rendering
     ════════════════════════════════════════════ */
  useEffect(() => {
    if (!graphData?.nodes?.length || !svgRef.current) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }

    // ── Deep copies ──
    const nodes = graphData.nodes.map(n => ({ ...n }));
    const edges = graphData.edges.map(e => ({
      source: e.source?.id || e.source,
      target: e.target?.id || e.target,
      note: e.note,
    }));

    const maxConns = Math.max(1, ...nodes.map(n => n.connectionCount || 1));

    // ── Depth assignment (0 = background, 1 = mid, 2 = foreground) ──
    // Nodes with more connections trend toward foreground
    nodes.forEach(n => {
      const h = hashCode(n.id);
      const connFactor = (n.connectionCount || 1) / maxConns; // 0..1
      const rand = (h % 100) / 100; // 0..1
      const score = connFactor * 0.6 + rand * 0.4; // weighted blend
      n._depth = score < 0.33 ? 0 : score < 0.66 ? 1 : 2;
      n._phase = (h % 1000) / 1000 * Math.PI * 2; // drift phase offset
    });

    // ── Depth-based visual params ──
    function nodeRadius(d) {
      const base = d._depth === 0 ? 3.5 : d._depth === 1 ? 5.5 : 9;
      const connBonus = (d.connectionCount || 1) / maxConns * 3;
      return base + connBonus;
    }
    function nodeOpacity(d) {
      return d._depth === 0 ? 0.4 : d._depth === 1 ? 0.7 : 1.0;
    }

    // ── Theme cluster centres ──
    const uniqueThemes = [...new Set(nodes.map(n => n.theme))];
    const angleStep = (2 * Math.PI) / Math.max(uniqueThemes.length, 1);
    const clusterRadius = Math.min(width, height) * 0.38;
    const themeCentres = {};
    uniqueThemes.forEach((slug, i) => {
      themeCentres[slug] = {
        x: width / 2 + clusterRadius * Math.cos(i * angleStep - Math.PI / 2),
        y: height / 2 + clusterRadius * Math.sin(i * angleStep - Math.PI / 2),
      };
    });

    // ── SVG structure ──
    const defs = svg.append('defs');
    // Glow filter (used on foreground nodes only for performance)
    const glowFilter = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    const merge = glowFilter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');

    // Zoom + pan
    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);
    // Prevent scroll propagation
    svg.on('wheel.zoom', function(event) { event.preventDefault(); }, { passive: false });

    // ── Edges ──
    const edgeGroup = g.append('g').attr('class', 'edges');
    const edgeSelection = edgeGroup.selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.15)')
      .attr('stroke-opacity', 0.05)
      .attr('stroke-width', 0.4);

    // ── Glow circles (behind main nodes) ──
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const glowSelection = nodeGroup.selectAll('circle.glow')
      .data(nodes, d => d.id)
      .join('circle')
      .attr('class', 'glow')
      .attr('r', d => nodeRadius(d) * 2.5)
      .attr('fill', d => colour(d.theme))
      .attr('fill-opacity', d => d._depth === 2 ? 0.12 : d._depth === 1 ? 0.06 : 0.03)
      .attr('pointer-events', 'none');

    // ── Main nodes ──
    const nodeSelection = nodeGroup.selectAll('circle.node')
      .data(nodes, d => d.id)
      .join('circle')
      .attr('class', 'node')
      .attr('r', d => nodeRadius(d))
      .attr('fill', d => colour(d.theme))
      .attr('fill-opacity', d => nodeOpacity(d))
      .attr('cursor', 'pointer')
      .attr('filter', d => d._depth === 2 ? 'url(#glow)' : null);

    // ── Labels (hidden by default, shown when theme is active) ──
    const labelSelection = nodeGroup.selectAll('text.label')
      .data(nodes, d => d.id)
      .join('text')
      .attr('class', 'label')
      .text(d => d.title)
      .attr('font-family', "'Source Sans 3', system-ui, sans-serif")
      .attr('font-size', '11px')
      .attr('font-weight', 400)
      .attr('fill', 'rgba(255,255,255,0.85)')
      .attr('dx', d => nodeRadius(d) + 5)
      .attr('dy', '0.35em')
      .attr('pointer-events', 'none')
      .attr('opacity', 0);

    // ── Interaction handlers ──
    nodeSelection
      .on('mouseenter', (event, d) => {
        d._hovered = true;
        setHoveredNode(d);
        const [mx, my] = d3.pointer(event, svg.node());
        setTooltipPos({ x: mx, y: my });
        highlightConnected(d.id, true);
      })
      .on('mouseleave', (event, d) => {
        d._hovered = false;
        setHoveredNode(null);
        highlightConnected(d.id, false);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        window.location.href = `/concept/${d.id}`;
      })
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
          d._dragging = true;
        })
        .on('drag', (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.005);
          d.fx = null; d.fy = null;
          d._dragging = false;
        })
      );

    // ── Highlight connections on hover ──
    function highlightConnected(nodeId, highlight) {
      const connectedIds = new Set();
      edges.forEach(e => {
        const sid = e.source?.id || e.source;
        const tid = e.target?.id || e.target;
        if (sid === nodeId) connectedIds.add(tid);
        if (tid === nodeId) connectedIds.add(sid);
      });

      const nodeColour = colour(nodes.find(n => n.id === nodeId)?.theme);

      edgeSelection
        .attr('stroke', e => {
          if (!highlight) return 'rgba(255,255,255,0.15)';
          const sid = e.source?.id || e.source;
          const tid = e.target?.id || e.target;
          return (sid === nodeId || tid === nodeId) ? nodeColour : 'rgba(255,255,255,0.08)';
        })
        .attr('stroke-opacity', e => {
          if (!highlight) return 0.05;
          const sid = e.source?.id || e.source;
          const tid = e.target?.id || e.target;
          return (sid === nodeId || tid === nodeId) ? 0.45 : 0.015;
        })
        .attr('stroke-width', e => {
          if (!highlight) return 0.4;
          const sid = e.source?.id || e.source;
          const tid = e.target?.id || e.target;
          return (sid === nodeId || tid === nodeId) ? 1.4 : 0.3;
        });

      nodeSelection
        .attr('fill-opacity', d => {
          if (!highlight) return nodeOpacity(d);
          return (d.id === nodeId || connectedIds.has(d.id)) ? 1 : 0.08;
        })
        .attr('r', d => {
          if (!highlight) return nodeRadius(d);
          return (d.id === nodeId) ? nodeRadius(d) * 1.4 : connectedIds.has(d.id) ? nodeRadius(d) * 1.15 : nodeRadius(d) * 0.8;
        });

      glowSelection
        .attr('fill-opacity', d => {
          if (!highlight) return d._depth === 2 ? 0.12 : d._depth === 1 ? 0.06 : 0.03;
          return (d.id === nodeId || connectedIds.has(d.id)) ? 0.2 : 0.01;
        });
    }

    // ── Cluster force (looser) ──
    function forceCluster(alpha) {
      const strength = 0.08;
      for (const d of nodes) {
        const centre = themeCentres[d.theme];
        if (centre) {
          d.vx += (centre.x - d.x) * strength * alpha;
          d.vy += (centre.y - d.y) * strength * alpha;
        }
      }
    }

    // ── Simulation ──
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(120).strength(0.2))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force('collision', d3.forceCollide().radius(d => nodeRadius(d) + 5))
      .force('cluster', forceCluster)
      .alphaDecay(0.02)
      .alphaMin(0.004) // never fully cools — keeps drift alive
      .on('tick', ticked);

    simRef.current = simulation;

    function ticked() {
      edgeSelection
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      nodeSelection
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      glowSelection
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      labelSelection
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    }

    // ── Continuous drift animation ──
    let startTime = null;
    function drift(timestamp) {
      if (!startTime) startTime = timestamp;
      const t = (timestamp - startTime) / 1000;

      for (const d of nodes) {
        if (d._hovered || d._dragging || d.fx != null) continue;
        // Gentle sine/cosine drift with per-node phase
        const dx = Math.sin(t * 0.3 + d._phase) * 0.12;
        const dy = Math.cos(t * 0.25 + d._phase * 1.3) * 0.1;
        d.vx += dx;
        d.vy += dy;
      }

      // Keep simulation warm
      if (simulation.alpha() < 0.01) {
        simulation.alpha(0.01).restart();
      }

      // Subtle breathing on glow circles
      glowSelection.attr('fill-opacity', d => {
        if (d._hovered) return 0.25;
        const base = d._depth === 2 ? 0.12 : d._depth === 1 ? 0.06 : 0.03;
        const pulse = 1 + 0.15 * Math.sin(t * 0.8 + d._phase);
        return base * pulse;
      });

      animRef.current = requestAnimationFrame(drift);
    }
    // Start drift after initial layout stabilises a bit
    const driftTimer = setTimeout(() => {
      animRef.current = requestAnimationFrame(drift);
    }, 1500);

    return () => {
      simulation.stop();
      clearTimeout(driftTimer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [graphData, dimensions, colour]);

  /* ── Search highlighting ── */
  useEffect(() => {
    if (!svgRef.current || !graphData) return;
    const svg = d3.select(svgRef.current);
    const term = search.toLowerCase().trim();

    svg.selectAll('circle.node')
      .attr('fill-opacity', d => {
        if (!term) return d._depth === 0 ? 0.4 : d._depth === 1 ? 0.7 : 1.0;
        return d.title.toLowerCase().includes(term) ? 1 : 0.05;
      })
      .attr('r', d => {
        const base = d._depth === 0 ? 3.5 : d._depth === 1 ? 5.5 : 9;
        const connBonus = (d.connectionCount || 1) / Math.max(1, ...graphData.nodes.map(n => n.connectionCount || 1)) * 3;
        const r = base + connBonus;
        if (!term) return r;
        return d.title.toLowerCase().includes(term) ? r * 1.3 : r * 0.7;
      });

    svg.selectAll('circle.glow')
      .attr('fill-opacity', d => {
        if (!term) return d._depth === 2 ? 0.12 : d._depth === 1 ? 0.06 : 0.03;
        return d.title.toLowerCase().includes(term) ? 0.2 : 0.01;
      });

    svg.selectAll('.edges line')
      .attr('stroke-opacity', term ? 0.01 : 0.05);
  }, [search, graphData]);

  /* ── Theme lock highlight ── */
  const toggleTheme = useCallback((slug) => {
    setActiveTheme(prev => prev === slug ? null : slug);
  }, []);

  // Apply active theme visuals
  useEffect(() => {
    if (!svgRef.current || !graphData) return;
    const svg = d3.select(svgRef.current);
    const slug = activeTheme;

    svg.selectAll('circle.node')
      .transition().duration(400)
      .attr('fill-opacity', d => {
        if (!slug) return d._depth === 0 ? 0.4 : d._depth === 1 ? 0.7 : 1.0;
        return d.theme === slug ? 1 : 0.04;
      });
    svg.selectAll('circle.glow')
      .transition().duration(400)
      .attr('fill-opacity', d => {
        if (!slug) return d._depth === 2 ? 0.12 : d._depth === 1 ? 0.06 : 0.03;
        return d.theme === slug ? 0.25 : 0.005;
      });
    svg.selectAll('.edges line')
      .transition().duration(400)
      .attr('stroke-opacity', slug ? 0.01 : 0.05);
    svg.selectAll('text.label')
      .transition().duration(400)
      .attr('opacity', d => {
        if (!slug) return 0;
        return d.theme === slug ? 1 : 0;
      });
  }, [activeTheme, graphData]);

  const nodeCount = graphData?.nodes?.length || 0;
  const edgeCount = graphData?.edges?.length || 0;

  const orderedThemes = [
    'core-building-blocks', 'system-behaviours', 'systems-archetypes',
    'leverage-and-intervention', 'complexity-and-uncertainty', 'mental-models',
    'resilience-and-change', 'boundaries-and-power', 'organisational-systems',
    'measurement-and-signals', 'design-and-intervention', 'natural-metaphors',
    'human-dimensions',
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* ── SVG Canvas ── */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block', position: 'absolute', inset: 0 }}
      />

      {/* ── Search bar (top-left, below nav) ── */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '24px',
        zIndex: 10,
      }}>
        <input
          type="text"
          placeholder="Find a concept..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontSize: '14px',
            fontWeight: 400,
            padding: '10px 16px',
            background: 'rgba(26, 21, 37, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.8)',
            borderRadius: '8px',
            width: '240px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
      </div>

      {/* ── Theme legend (bottom-left) ── */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        zIndex: 10,
        background: 'rgba(26, 21, 37, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: legendOpen ? '14px 18px' : '10px 14px',
        maxWidth: '280px',
        transition: 'all 0.3s ease',
      }}>
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          style={{
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: legendOpen ? '10px' : 0,
            display: 'block',
            width: '100%',
            textAlign: 'left',
          }}
        >
          Themes {legendOpen ? '−' : '+'}
        </button>
        {legendOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {orderedThemes.map(slug => (
              <button
                key={slug}
                onClick={() => toggleTheme(slug)}
                style={{
                  fontFamily: "'Source Sans 3', system-ui, sans-serif",
                  fontSize: '12px',
                  fontWeight: activeTheme === slug ? 500 : 400,
                  color: activeTheme === slug ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: themeColours[slug],
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${themeColours[slug]}60`,
                }} />
                {themeNames[slug]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Stats (bottom-right) ── */}
      <div style={{
        position: 'absolute',
        bottom: '28px',
        right: '24px',
        zIndex: 10,
        fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '12px',
        fontWeight: 400,
        letterSpacing: '0.04em',
        color: 'rgba(255,255,255,0.25)',
      }}>
        {nodeCount} concepts &middot; {edgeCount} connections
      </div>

      {/* ── Interaction hints (top-right) ── */}
      <div style={{
        position: 'absolute',
        top: '80px',
        right: '24px',
        zIndex: 10,
        fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '11px',
        fontWeight: 400,
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'right',
        lineHeight: 1.6,
        pointerEvents: 'none',
      }}>
        drag to move &middot; scroll to zoom
      </div>

      {/* ── Tooltip ── */}
      {hoveredNode && (
        <div style={{
          position: 'absolute',
          left: Math.min(tooltipPos.x + 16, dimensions.width - 320),
          top: Math.min(tooltipPos.y - 10, dimensions.height - 140),
          zIndex: 20,
          background: 'rgba(26, 21, 37, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '14px 18px',
          maxWidth: '300px',
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: colour(hoveredNode.theme),
              boxShadow: `0 0 8px ${colour(hoveredNode.theme)}80`,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
              fontSize: '15px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
            }}>
              {hoveredNode.title}
            </span>
          </div>
          {hoveredNode.oneLiner && (
            <p style={{
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {hoveredNode.oneLiner}
            </p>
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
          }}>
            <span style={{
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: colour(hoveredNode.theme),
              opacity: 0.8,
            }}>
              {themeNames[hoveredNode.theme] || hoveredNode.theme}
            </span>
            <span style={{
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.3)',
            }}>
              {hoveredNode.connectionCount || 0} connections
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
