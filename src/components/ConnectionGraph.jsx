import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

/**
 * ConnectionGraph - D3 force-directed graph for the "See connections" view
 * 
 * Expects graphData prop with shape:
 *   { nodes: [{ id, title, theme, oneLiner, connectionCount }],
 *     edges: [{ source, target, note? }] }
 * 
 * Also expects themes prop with shape:
 *   [{ slug, title, colour }]
 */

const DEEP = '#221C2B';
const CREAM = '#FAF6F1';
const ACCENT = '#9B51E0';
const MID = '#423B49';

export default function ConnectionGraph({ graphData, themes = [] }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const [search, setSearch] = useState('');
  const [activeThemes, setActiveThemes] = useState(new Set(themes.map(t => t.slug)));
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });

  // Theme colour lookup
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

  // Build and run simulation
  useEffect(() => {
    if (!graphData?.nodes?.length || !svgRef.current) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Filter nodes by active themes
    const visibleNodes = graphData.nodes.filter(n => activeThemes.has(n.theme));
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    const visibleEdges = graphData.edges.filter(
      e => visibleIds.has(e.source?.id || e.source) && visibleIds.has(e.target?.id || e.target)
    );

    // Deep copy to avoid D3 mutating our data
    const nodes = visibleNodes.map(n => ({ ...n }));
    const edges = visibleEdges.map(e => ({
      source: e.source?.id || e.source,
      target: e.target?.id || e.target,
      note: e.note,
    }));

    // Size scale based on connection count
    const maxConns = Math.max(1, ...nodes.map(n => n.connectionCount || 1));
    const radiusScale = d3.scaleSqrt().domain([1, maxConns]).range([4, 14]);

    // Zoom behaviour
    const g = svg.append('g');
    const zoom = d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Edges
    const edgeGroup = g.append('g').attr('class', 'edges');
    const edgeSelection = edgeGroup.selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', DEEP)
      .attr('stroke-opacity', 0.08)
      .attr('stroke-width', 1);

    // Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeSelection = nodeGroup.selectAll('circle')
      .data(nodes, d => d.id)
      .join('circle')
      .attr('r', d => radiusScale(d.connectionCount || 1))
      .attr('fill', d => themeColour(d.theme))
      .attr('fill-opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        highlightConnected(d.id, true);
      })
      .on('mouseleave', (event, d) => {
        setHoveredNode(null);
        highlightConnected(d.id, false);
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

    // Highlight function
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
          if (!highlight) return 0.08;
          const sid = e.source?.id || e.source;
          const tid = e.target?.id || e.target;
          return (sid === nodeId || tid === nodeId) ? 0.4 : 0.03;
        })
        .attr('stroke-width', e => {
          if (!highlight) return 1;
          const sid = e.source?.id || e.source;
          const tid = e.target?.id || e.target;
          return (sid === nodeId || tid === nodeId) ? 2 : 1;
        });

      nodeSelection
        .attr('fill-opacity', d => {
          if (!highlight) return 0.7;
          return (d.id === nodeId || connectedIds.has(d.id)) ? 1 : 0.15;
        });
    }

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => radiusScale(d.connectionCount || 1) + 3))
      .on('tick', () => {
        edgeSelection
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        nodeSelection
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions, activeThemes, themeColour]);

  // Search highlighting
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const term = search.toLowerCase().trim();

    svg.selectAll('.nodes circle')
      .attr('stroke', d => {
        if (!term) return 'white';
        return d.title.toLowerCase().includes(term) ? ACCENT : 'white';
      })
      .attr('stroke-width', d => {
        if (!term) return 1.5;
        return d.title.toLowerCase().includes(term) ? 3 : 1.5;
      })
      .attr('fill-opacity', d => {
        if (!term) return 0.7;
        return d.title.toLowerCase().includes(term) ? 1 : 0.2;
      });
  }, [search]);

  // Theme toggle
  const toggleTheme = (slug) => {
    setActiveThemes(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {/* Controls bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '0 4px',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Find a concept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              padding: '6px 12px',
              border: `1px solid ${DEEP}15`,
              outline: 'none',
              color: DEEP,
              width: '200px',
            }}
          />
        </div>

        {/* Theme filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {themes.map(t => (
            <button
              key={t.slug}
              onClick={() => toggleTheme(t.slug)}
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '12px',
                fontWeight: activeThemes.has(t.slug) ? 400 : 300,
                padding: '3px 10px',
                border: `1px solid ${activeThemes.has(t.slug) ? t.colour : DEEP + '15'}`,
                background: activeThemes.has(t.slug) ? t.colour + '12' : 'transparent',
                color: activeThemes.has(t.slug) ? DEEP : DEEP + '60',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Graph canvas */}
      <div style={{
        background: DEEP,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ display: 'block' }}
        />

        {/* Hover tooltip */}
        {hoveredNode && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'white',
            padding: '12px 16px',
            maxWidth: '320px',
            pointerEvents: 'none',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                display: 'inline-block',
                background: themeColour(hoveredNode.theme),
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '16px',
                fontWeight: 400,
                color: DEEP,
              }}>
                {hoveredNode.title}
              </span>
            </div>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              color: MID,
              margin: 0,
              lineHeight: 1.5,
            }}>
              {hoveredNode.oneLiner}
            </p>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '12px',
              fontWeight: 300,
              color: MID + '80',
              margin: '6px 0 0 0',
            }}>
              {hoveredNode.connectionCount || 0} connections - click to read
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
