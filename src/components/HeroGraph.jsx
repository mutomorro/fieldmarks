import { useEffect, useRef, useState } from 'react';

/**
 * HeroGraph - A low-opacity constellation background for the homepage hero.
 * Renders graph nodes as small square marks with thin connecting edges.
 * No interactivity, no labels - purely decorative texture.
 */

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
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

    function resize() {
      // Walk up to the .hero-graph-wrapper (Astro wraps React components in an extra div)
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

    // Deterministic layout: cluster by theme, spread across canvas
    function layoutNodes() {
      const themes = [...new Set(nodes.map(n => n.theme))];
      const angleStep = (2 * Math.PI) / Math.max(themes.length, 1);
      const cx = width / 2;
      const cy = height / 2;
      const spread = Math.min(width, height) * 0.38;

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
        const scatter = Math.min(width, height) * 0.12;
        n.x = centre.x + (rng() - 0.5) * scatter * 2;
        n.y = centre.y + (rng() - 0.5) * scatter * 2;
        n._phase = rng() * Math.PI * 2;
      });
    }

    function hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
      }
      return Math.abs(hash);
    }

    // Fetch and set up graph data
    fetch('/graph-data.json')
      .then(r => r.json())
      .then(data => {
        nodes = data.nodes.map(n => ({
          id: n.id,
          theme: n.theme,
          colour: n.colour,
          connectionCount: n.connectionCount || 1,
          _hash: hashCode(n.id),
          x: 0,
          y: 0,
          _phase: 0,
        }));

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

      // Build node lookup for edge drawing
      const nodeMap = {};
      nodes.forEach(n => { nodeMap[n.id] = n; });

      // Draw edges
      ctx.lineWidth = 0.5;
      for (const e of edges) {
        const s = nodeMap[e.source];
        const tgt = nodeMap[e.target];
        if (!s || !tgt) continue;

        // Breathing on edges
        const breathe = 0.06 + 0.02 * Math.sin(t * 0.5 + s._phase);
        ctx.strokeStyle = `rgba(34, 28, 43, ${breathe})`;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();
      }

      // Draw nodes as small squares
      const maxConns = Math.max(1, ...nodes.map(n => n.connectionCount));

      for (const n of nodes) {
        const connRatio = n.connectionCount / maxConns;
        const baseSize = 2 + connRatio * 2;
        const breathe = 1 + 0.15 * Math.sin(t * 0.8 + n._phase);
        const size = baseSize * breathe;

        // Accent nodes (purple) for highly connected
        const isAccent = connRatio > 0.6;
        const baseOpacity = isAccent ? 0.16 : 0.13;
        const opacity = baseOpacity * breathe;

        if (isAccent) {
          ctx.fillStyle = `rgba(155, 81, 224, ${opacity})`;
        } else {
          ctx.fillStyle = `rgba(34, 28, 43, ${opacity})`;
        }

        ctx.fillRect(n.x - size / 2, n.y - size / 2, size, size);
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
