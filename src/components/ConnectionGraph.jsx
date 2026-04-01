import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

/**
 * ConnectionGraph - D3 force-directed graph with square mark nodes
 *
 * Expects graphData prop: { nodes: [{ id, title, theme, oneLiner, connectionCount }],
 *                           edges: [{ source, target, note? }] }
 * Expects themes prop:    [{ slug, title, colour }]
 */

const DEEP = '#221C2B';
const SOFT = '#9A9399';
const ACCENT = '#9B51E0';
const MID = '#423B49';

export default function ConnectionGraph({ graphData, themes = [] }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const breathingRef = useRef(null);
  const [search, setSearch] = useState('');
  const [activeThemes, setActiveThemes] = useState(new Set(themes.map(t => t.slug)));
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });

  const themeColour = useCallback((themeSlug) => {
    const t = themes.find(th => th.slug === themeSlug);
    return t?.colour || ACCENT;
  }, [themes]);

  // Responsive sizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({
          width: Math.max(600, width),
          height: Math.max(500, Math.min(800, width * 0.6)),
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Main simulation
  useEffect(() => {
    if (!graphData?.nodes?.length || !svgRef.current) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Cancel previous breathing animation
    if (breathingRef.current) {
      cancelAnimationFrame(breathingRef.current);
      breathingRef.current = null;
    }

    // Filter by active themes
    const visibleNodes = graphData.nodes.filter(n => activeThemes.has(n.theme));
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    const visibleEdges = graphData.edges.filter(
      e => visibleIds.has(e.source?.id || e.source) && visibleIds.has(e.target?.id || e.target)
    );

    // Deep copy
    const nodes = visibleNodes.map(n => ({ ...n }));
    const edges = visibleEdges.map(e => ({
      source: e.source?.id || e.source,
      target: e.target?.id || e.target,
      note: e.note,
    }));

    // Size scale
    const maxConns = Math.max(1, ...nodes.map(n => n.connectionCount || 1));
    const sizeScale = d3.scaleSqrt().domain([1, maxConns]).range([4, 13]);

    // Theme centre points for clustering force
    const uniqueThemes = [...new Set(nodes.map(n => n.theme))];
    const angleStep = (2 * Math.PI) / Math.max(uniqueThemes.length, 1);
    const clusterRadius = Math.min(width, height) * 0.25;
    const themeCentres = {};
    uniqueThemes.forEach((slug, i) => {
      themeCentres[slug] = {
        x: width / 2 + clusterRadius * Math.cos(i * angleStep - Math.PI / 2),
        y: height / 2 + clusterRadius * Math.sin(i * angleStep - Math.PI / 2),
      };
    });

    // Zoom
    const g = svg.append('g');
    const zoom = d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Edges
    const edgeGroup = g.append('g').attr('class', 'edges');
    const edgeSelection = edgeGroup.selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', DEEP)
      .attr('stroke-opacity', 0.06)
      .attr('stroke-width', 0.8);

    // Nodes as square <rect> marks
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeSelection = nodeGroup.selectAll('rect')
      .data(nodes, d => d.id)
      .join('rect')
      .attr('width', d => sizeScale(d.connectionCount || 1) * 2)
      .attr('height', d => sizeScale(d.connectionCount || 1) * 2)
      .attr('fill', d => themeColour(d.theme))
      .attr('fill-opacity', 0.75)
      .attr('stroke', 'none')
      .attr('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        highlightConnected(d.id, true);
        // Pause breathing on hovered node
        d._hovered = true;
      })
      .on('mouseleave', (event, d) => {
        setHoveredNode(null);
        highlightConnected(d.id, false);
        d._hovered = false;
      })
      .on('click', (event, d) => {
        window.location.href = `/concept/${d.id}`;
      })
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Highlight connections
    function highlightConnected(nodeId, highlight) {
      const connectedIds = new Set();
      edges.forEach(e => {
        const sid = e.source?.id || e.source;
        const tid = e.target?.id || e.target;
        if (sid === nodeId) connectedIds.add(tid);
        if (tid === nodeId) connectedIds.add(sid);
      });

      edgeSelection
        .attr('stroke-opacity', e => {
          if (!highlight) return 0.06;
          const sid = e.source?.id || e.source;
          const tid = e.target?.id || e.target;
          return (sid === nodeId || tid === nodeId) ? 0.35 : 0.02;
        })
        .attr('stroke-width', e => {
          if (!highlight) return 0.8;
          const sid = e.source?.id || e.source;
          const tid = e.target?.id || e.target;
          return (sid === nodeId || tid === nodeId) ? 2 : 0.8;
        })
        .attr('stroke', e => {
          if (!highlight) return DEEP;
          const sid = e.source?.id || e.source;
          const tid = e.target?.id || e.target;
          return (sid === nodeId || tid === nodeId) ? themeColour(nodes.find(n => n.id === nodeId)?.theme) : DEEP;
        });

      nodeSelection
        .attr('fill-opacity', d => {
          if (!highlight) return 0.75;
          return (d.id === nodeId || connectedIds.has(d.id)) ? 1 : 0.1;
        });
    }

    // Theme clustering force
    function forceCluster(alpha) {
      const strength = 0.15;
      for (const d of nodes) {
        const centre = themeCentres[d.theme];
        if (centre) {
          d.vx += (centre.x - d.x) * strength * alpha;
          d.vy += (centre.y - d.y) * strength * alpha;
        }
      }
    }

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(70).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => sizeScale(d.connectionCount || 1) + 4))
      .force('cluster', forceCluster)
      .on('tick', () => {
        edgeSelection
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        nodeSelection
          .attr('x', d => d.x - sizeScale(d.connectionCount || 1))
          .attr('y', d => d.y - sizeScale(d.connectionCount || 1));
      });

    simulationRef.current = simulation;

    // Breathing animation - gentle sine-wave opacity pulse
    let startTime = null;
    function breathe(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // seconds

      nodeSelection.attr('fill-opacity', d => {
        if (d._hovered) return 1;
        // Each node gets a slightly different phase based on index
        const phase = nodes.indexOf(d) * 0.4;
        const pulse = 0.65 + 0.12 * Math.sin(elapsed * 1.2 + phase);
        return pulse;
      });

      breathingRef.current = requestAnimationFrame(breathe);
    }
    // Start breathing after simulation settles a bit
    setTimeout(() => {
      breathingRef.current = requestAnimationFrame(breathe);
    }, 2000);

    return () => {
      simulation.stop();
      if (breathingRef.current) {
        cancelAnimationFrame(breathingRef.current);
      }
    };
  }, [graphData, dimensions, activeThemes, themeColour]);

  // Search highlighting
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const term = search.toLowerCase().trim();

    svg.selectAll('.nodes rect')
      .attr('stroke', d => {
        if (!term) return 'none';
        return d.title.toLowerCase().includes(term) ? DEEP : 'none';
      })
      .attr('stroke-width', d => {
        if (!term) return 0;
        return d.title.toLowerCase().includes(term) ? 2 : 0;
      })
      .attr('fill-opacity', d => {
        if (!term) return 0.75;
        return d.title.toLowerCase().includes(term) ? 1 : 0.08;
      });
  }, [search]);

  // Theme legend highlight - click to flash a whole theme for 3s
  const flashTheme = (slug) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll('.nodes rect')
      .attr('fill-opacity', d => d.theme === slug ? 1 : 0.06);
    svg.selectAll('.edges line')
      .attr('stroke-opacity', 0.02);

    setTimeout(() => {
      svg.selectAll('.nodes rect').attr('fill-opacity', 0.75);
      svg.selectAll('.edges line').attr('stroke-opacity', 0.06);
    }, 3000);
  };

  const toggleTheme = (slug) => {
    setActiveThemes(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const nodeCount = graphData?.nodes?.filter(n => activeThemes.has(n.theme)).length || 0;
  const edgeCount = graphData?.edges?.filter(e => {
    const sid = e.source?.id || e.source;
    const tid = e.target?.id || e.target;
    const visibleIds = new Set(graphData.nodes.filter(n => activeThemes.has(n.theme)).map(n => n.id));
    return visibleIds.has(sid) && visibleIds.has(tid);
  }).length || 0;

  return (
    <div ref={containerRef} style={{ width: '100%' }}>

      {/* Search + stats bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Find a concept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 400,
              padding: '8px 14px',
              border: '1px solid rgba(34,28,43,0.1)',
              outline: 'none',
              color: DEEP,
              background: '#FFFFFF',
              width: '220px',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = ACCENT}
            onBlur={(e) => e.target.style.borderColor = 'rgba(34,28,43,0.1)'}
          />
        </div>
        <span style={{
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: SOFT,
        }}>
          {nodeCount} concepts &middot; {edgeCount} connections
        </span>
      </div>

      {/* Theme legend - click to flash, right section toggles visibility */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '24px',
      }}>
        {themes.map(t => {
          const active = activeThemes.has(t.slug);
          return (
            <button
              key={t.slug}
              onClick={() => toggleTheme(t.slug)}
              onDoubleClick={() => flashTheme(t.slug)}
              title={`Click to ${active ? 'hide' : 'show'}, double-click to highlight`}
              style={{
                fontFamily: "'Source Sans 3', system-ui, sans-serif",
                fontSize: '12px',
                fontWeight: active ? 500 : 400,
                padding: '4px 12px',
                border: `1px solid ${active ? t.colour + '40' : 'rgba(34,28,43,0.08)'}`,
                background: active ? t.colour + '0F' : 'transparent',
                color: active ? DEEP : SOFT,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                display: 'inline-block',
                background: active ? t.colour : SOFT + '40',
                flexShrink: 0,
              }} />
              {t.title}
            </button>
          );
        })}
      </div>

      {/* Graph canvas - light background */}
      <div style={{
        background: '#FAF9F7',
        border: '1px solid rgba(34,28,43,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ display: 'block' }}
        />

        {/* Tooltip */}
        {hoveredNode && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: '#FFFFFF',
            border: '1px solid rgba(34,28,43,0.08)',
            padding: '14px 18px',
            maxWidth: '340px',
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(34,28,43,0.06)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                display: 'inline-block',
                background: themeColour(hoveredNode.theme),
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Source Sans 3', system-ui, sans-serif",
                fontSize: '16px',
                fontWeight: 400,
                color: DEEP,
              }}>
                {hoveredNode.title}
              </span>
            </div>
            <p style={{
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 400,
              color: MID,
              margin: 0,
              lineHeight: 1.55,
            }}>
              {hoveredNode.oneLiner}
            </p>
            <p style={{
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              color: SOFT,
              margin: '8px 0 0 0',
            }}>
              {hoveredNode.connectionCount || 0} connections &mdash; click to read
            </p>
          </div>
        )}

        {/* Interaction hints */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '16px',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
          fontSize: '11px',
          fontWeight: 400,
          color: SOFT + '80',
          textAlign: 'right',
          lineHeight: 1.6,
          pointerEvents: 'none',
        }}>
          drag to move &middot; scroll to zoom
        </div>
      </div>
    </div>
  );
}
