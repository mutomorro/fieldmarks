import { useEffect, useRef } from 'react';

export default function HeroGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const cols = 36;
    const rows = 18;
    const markSize = 3.5;
    let time = 0;
    let raf;

    function draw() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const spacingX = w / (cols + 1);
      const spacingY = h / (rows + 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = spacingX * (c + 1);
          const baseY = spacingY * (r + 1);

          const wave1 = Math.sin((c * 0.25) + (r * 0.18) + time * 0.006) * 3.5;
          const wave2 = Math.cos((r * 0.35) + time * 0.005) * 2.5;
          const wave3 = Math.sin((c * 0.12) + (r * 0.12) + time * 0.003) * 1.5;

          const dx = wave1 + wave3;
          const dy = wave2;

          const x = baseX + dx;
          const y = baseY + dy;

          const sizeWave = Math.sin((c * 0.18) + (r * 0.25) + time * 0.004);
          const size = markSize + sizeWave * 1;

          const textFade = Math.min(c / 6, 1);
          const heroFade = c < 18 && r < 12
            ? Math.max(0, 1 - (1 - c / 18) * (1 - r / 12) * 1.5)
            : 1;
          const baseOpacity = 0.25 + sizeWave * 0.1;
          const opacity = baseOpacity * Math.min(textFade, heroFade);

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
