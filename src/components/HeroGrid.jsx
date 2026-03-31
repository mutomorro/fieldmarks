import { useEffect, useRef } from 'react';

export default function HeroGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Mouse state
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseActive = false;
    const mouseRadius = 100;

    // Detect touch device - fall back to breathing only
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    function resize() {
      const rect = canvas.closest('[data-hero-grid]').getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking on the hero section
    const heroEl = canvas.closest('[data-hero-grid]').parentElement;

    function onMouseMove(e) {
      if (isTouch) return;
      const rect = canvas.closest('[data-hero-grid]').getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    }

    function onMouseLeave() {
      mouseActive = false;
    }

    heroEl.style.pointerEvents = 'auto';
    heroEl.addEventListener('mousemove', onMouseMove);
    heroEl.addEventListener('mouseleave', onMouseLeave);

    const cols = 36;
    const rows = 18;
    const markSize = 3.5;
    let time = 0;
    let raf;

    // Smooth mouse position (for easing back)
    let smoothMouseX = -1000;
    let smoothMouseY = -1000;
    let smoothMouseActive = 0; // 0-1 for fade in/out

    function draw() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      // Ease the mouse influence in and out
      const targetActive = mouseActive ? 1 : 0;
      smoothMouseActive += (targetActive - smoothMouseActive) * 0.08;

      if (mouseActive) {
        smoothMouseX += (mouseX - smoothMouseX) * 0.15;
        smoothMouseY += (mouseY - smoothMouseY) * 0.15;
      }

      const spacingX = w / (cols + 1);
      const spacingY = h / (rows + 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = spacingX * (c + 1);
          const baseY = spacingY * (r + 1);

          // Breathing wave animation
          const wave1 = Math.sin((c * 0.25) + (r * 0.18) + time * 0.006) * 3.5;
          const wave2 = Math.cos((r * 0.35) + time * 0.005) * 2.5;
          const wave3 = Math.sin((c * 0.12) + (r * 0.12) + time * 0.003) * 1.5;

          let dx = wave1 + wave3;
          let dy = wave2;

          // Mouse displacement - push dots away from cursor
          if (smoothMouseActive > 0.01) {
            const dotX = baseX + dx;
            const dotY = baseY + dy;
            const distX = dotX - smoothMouseX;
            const distY = dotY - smoothMouseY;
            const dist = Math.sqrt(distX * distX + distY * distY);

            if (dist < mouseRadius && dist > 0.1) {
              const falloff = 1 - (dist / mouseRadius);
              const strength = falloff * falloff * 18 * smoothMouseActive;
              dx += (distX / dist) * strength;
              dy += (distY / dist) * strength;
            }
          }

          const x = baseX + dx;
          const y = baseY + dy;

          const sizeWave = Math.sin((c * 0.18) + (r * 0.25) + time * 0.004);
          const size = markSize + sizeWave * 1;

          // Opacity: fade towards left where text lives
          const textFade = Math.min(c / 6, 1);
          const heroFade = c < 18 && r < 12
            ? Math.max(0, 1 - (1 - c / 18) * (1 - r / 12) * 1.5)
            : 1;
          const baseOpacity = 0.25 + sizeWave * 0.1;
          const opacity = baseOpacity * Math.min(textFade, heroFade);

          // Accent dots
          const isAccent = (c === 28 && r === 7) || (c === 22 && r === 13) || (c === 31 && r === 3);

          if (isAccent) {
            ctx.fillStyle = `rgba(155, 81, 224, ${Math.min(opacity + 0.25, 0.7)})`;
          } else {
            ctx.fillStyle = `rgba(34, 28, 43, ${opacity})`;
          }

          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      time++;
      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      heroEl.removeEventListener('mousemove', onMouseMove);
      heroEl.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(raf);
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
