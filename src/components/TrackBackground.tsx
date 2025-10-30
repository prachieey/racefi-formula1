import { useEffect, useRef } from 'react';

export default function TrackBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;
    let offset = 0;

    const drawTrack = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(220, 38, 38, 0.1)';
      ctx.lineWidth = 2;

      const lineSpacing = 40;
      const numLines = Math.ceil(canvas.height / lineSpacing) + 2;

      for (let i = 0; i < numLines; i++) {
        const y = (i * lineSpacing - offset) % canvas.height;

        ctx.beginPath();
        ctx.setLineDash([20, 20]);
        ctx.moveTo(canvas.width * 0.2, y);
        ctx.lineTo(canvas.width * 0.2, y + lineSpacing * 0.3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.8, y);
        ctx.lineTo(canvas.width * 0.8, y + lineSpacing * 0.3);
        ctx.stroke();
      }

      offset += 1.5;
      if (offset > lineSpacing) offset = 0;

      animationFrameId = requestAnimationFrame(drawTrack);
    };

    drawTrack();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 z-0"
    />
  );
}
