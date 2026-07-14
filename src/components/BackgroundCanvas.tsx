'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse position
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Initialize dot grid nodes
    const spacing = 40;
    const cols = Math.ceil(width / spacing) + 4;
    const rows = Math.ceil(height / spacing) + 4;

    interface Node {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      noiseSeed: number;
    }

    const nodes: Node[] = [];
    for (let i = -2; i < cols; i++) {
      for (let j = -2; j < rows; j++) {
        nodes.push({
          baseX: i * spacing,
          baseY: j * spacing,
          x: i * spacing,
          y: j * spacing,
          noiseSeed: Math.random() * 100,
        });
      }
    }

    let time = 0;

    const render = () => {
      time += 0.01;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Clear with very slight transparency to enable subtle trails if desired, or solid black
      ctx.fillStyle = '#131313';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines or dots
      ctx.fillStyle = 'rgba(79, 219, 200, 0.15)'; // Teal dots

      nodes.forEach((node) => {
        // Subtle organic drift
        const driftX = Math.sin(time * 0.5 + node.noiseSeed) * 6;
        const driftY = Math.cos(time * 0.5 + node.noiseSeed) * 6;

        const currentX = node.baseX + driftX;
        const currentY = node.baseY + driftY;

        // Mouse magnetic attraction
        const dx = mouse.x - currentX;
        const dy = mouse.y - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let finalX = currentX;
        let finalY = currentY;
        let dotAlpha = 0.12;
        let dotSize = 1.2;

        if (dist < 180) {
          const factor = (180 - dist) / 180;
          // Pull dots towards mouse slightly
          finalX += (dx / dist) * factor * 15;
          finalY += (dy / dist) * factor * 15;

          // Increase size and opacity when close to cursor
          dotAlpha += factor * 0.5;
          dotSize += factor * 1.5;
        }

        node.x = finalX;
        node.y = finalY;

        // Draw dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 219, 200, ${dotAlpha})`;
        ctx.fill();
      });

      // Draw lines between very close dots near the cursor to create network nodes
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.strokeStyle = 'rgba(79, 219, 200, 0.04)';
        ctx.lineWidth = 0.8;

        for (let i = 0; i < nodes.length; i++) {
          const n1 = nodes[i];
          const mDist = Math.sqrt((mouse.x - n1.x) ** 2 + (mouse.y - n1.y) ** 2);
          if (mDist > 180) continue;

          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Connect nearest neighbor dots
            if (dist < spacing * 1.4) {
              const alpha = Math.max(0, (1 - dist / (spacing * 1.4)) * (1 - mDist / 180) * 0.25);
              if (alpha > 0) {
                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.strokeStyle = `rgba(79, 219, 200, ${alpha})`;
                ctx.stroke();
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="bg-interactive-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#131313]"
      style={{ display: 'block' }}
    />
  );
}
