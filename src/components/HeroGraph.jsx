import { useEffect, useRef } from 'react';

/**
 * HeroGraph - Full-bleed constellation background for the homepage hero.
 * Renders actual graph-data.json as a low-opacity network of circles and edges,
 * using the same theme colour palette as the /connections page.
 */

/* Same soft luminous palette as ConnectionGraph.jsx */
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

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export default function HeroGraph() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    let nodes = [];
    let edges = [];
    let width = 0;
    let height = 0;
    let maxConns = 1;

    function resize() {
      const wrapper = canvas.closest('.hero-graph-wrapper') || canvas.parentElement;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length) layoutNodes();
    }

    function layoutNodes() {
      const themes = [...new Set(nodes.map(n => n.theme))];
      const angleStep = (2 * Math.PI) / Math.max(themes.length, 1);
      // Centre the graph across the full canvas, biased slightly right
      const cx = width * 0.55;
      const cy = height * 0.5;
      const spread = Math.min(width, height) * 0.42;

      const themeCentres = {};
      themes.forEach((t, i) => {
        themeCentres[t] = {
          x: cx + spread * Math.cos(i * angleStep - Math.PI / 2),
          y: cy + spread * Math.sin(i * angleStep - Math.PI / 2),
        };
      });

      nodes.forEach(n => {
        const rng = seededRandom(n._hash);
        const centre = themeCentres[n.theme] || { x: cx, y: cy };
        // Wider scatter so it feels spread across the whole hero
        const scatter = Math.min(width, height) * 0.18;
        n.x = centre.x + (rng() - 0.5) * scatter * 2;
        n.y = centre.y + (rng() - 0.5) * scatter * 2;
        n._phase = rng() * Math.PI * 2;
        // Depth layer for opacity variation (0=faint, 1=slightly brighter)
        n._depth = rng();
      });
    }

    fetch('/graph-data.json')
      .then(r => r.json())
      .then(data => {
        nodes = data.nodes.map(n => ({
          id: n.id,
          theme: n.theme,
          colour: n.colour,
          connectionCount: n.connectionCount || 1,
          _hash: hashCode(n.id),
          _rgb: hexToRgb(themeColours[n.theme] || '#9B8EC4'),
          x: 0,
          y: 0,
          _phase: 0,
          _depth: 0,
        }));

        maxConns = Math.max(1, ...nodes.map(n => n.connectionCount));

        const nodeSet = new Set(nodes.map(n => n.id));
        edges = data.edges
          .filter(e => nodeSet.has(e.source) && nodeSet.has(e.target))
          .map(e => ({ source: e.source, target: e.target }));

        layoutNodes();
        startAnimation();
      })
      .catch(() => {});

    let startTime = null;

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      const t = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      if (!nodes.length) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const nodeMap = {};
      nodes.forEach(n => { nodeMap[n.id] = n; });

      // -- Draw edges --
      ctx.lineWidth = 0.5;
      for (const e of edges) {
        const s = nodeMap[e.source];
        const tgt = nodeMap[e.target];
        if (!s || !tgt) continue;

        // Left-fade: reduce opacity for edges on the left side
        const avgX = (s.x + tgt.x) / 2;
        const leftFade = Math.min(1, avgX / (width * 0.4));

        const baseOpacity = 0.10 + 0.05 * Math.sin(t * 0.4 + s._phase);
        const opacity = baseOpacity * leftFade;

        // Use the source node's theme colour for the edge
        ctx.strokeStyle = `rgba(${s._rgb}, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();
      }

      // -- Draw nodes as circles --
      for (const n of nodes) {
        const connRatio = n.connectionCount / maxConns;

        // Radius: 2-5px based on connection count
        const baseRadius = 2 + connRatio * 3;
        const breathe = 1 + 0.12 * Math.sin(t * 0.7 + n._phase);
        const radius = baseRadius * breathe;

        // Left-fade: softer on the left where text sits
        const leftFade = Math.min(1, n.x / (width * 0.35));

        // Opacity: 0.15-0.30 with depth variation
        const depthBoost = n._depth * 0.08;
        const connBoost = connRatio * 0.06;
        const baseOpacity = 0.15 + depthBoost + connBoost;
        const opacity = baseOpacity * breathe * leftFade;

        ctx.fillStyle = `rgba(${n._rgb}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    function startAnimation() {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
