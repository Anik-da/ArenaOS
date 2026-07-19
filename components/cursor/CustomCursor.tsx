'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

type CursorVariant = 'default' | 'hover';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState<string>('');
  const [colorTheme, setColorTheme] = useState<'ember' | 'violet' | 'mint' | 'gold' | 'default'>('default');

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const clickWaveRef = useRef<SVGSVGElement>(null);

  // Keep track of positions
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const dot = useRef({ x: -100, y: -100 });
  const trails = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 6 }).map(() => ({ x: -100, y: -100 }))
  );

  const trailRefs = useRef<HTMLDivElement[]>([]);
  const trailCount = 6;

  const getThemeColorHex = useCallback((solid: boolean) => {
    switch (colorTheme) {
      case 'ember':
        return solid ? '#ff6b2c' : 'rgba(255,107,44,0.3)';
      case 'violet':
        return solid ? '#8b5cf6' : 'rgba(139,92,246,0.3)';
      case 'mint':
        return solid ? '#5eead4' : 'rgba(94,234,212,0.3)';
      case 'gold':
        return solid ? '#e8b04b' : 'rgba(232,176,75,0.3)';
      default:
        return solid ? '#ffffff' : 'rgba(255,255,255,0.1)';
    }
  }, [colorTheme]);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    // 1. Move Listener: update coordinates instantly (very cheap)
    const move = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    // 2. High performance requestAnimationFrame loop for hardware-sync updates
    let rafId = 0;
    const tick = () => {
      // Lerp dot (fast follow)
      dot.current.x += (mouse.current.x - dot.current.x) * 0.45;
      dot.current.y += (mouse.current.y - dot.current.y) * 0.45;

      // Lerp ring (smooth lag behind dot)
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;

      // Direct DOM manipulation bypassing React render pipeline
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Dynamic trail lerping for comet tail effect
      let prevX = dot.current.x;
      let prevY = dot.current.y;
      trails.current.forEach((t, i) => {
        t.x += (prevX - t.x) * 0.35;
        t.y += (prevY - t.y) * 0.35;

        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) translate(-50%, -50%)`;
        }
        prevX = t.x;
        prevY = t.y;
      });

      // Update interactive label position
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${mouse.current.x + 22}px, ${mouse.current.y + 22}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // 3. Document level hover detection - completely avoids layout reflows from document.elementFromPoint
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Interactive element checks
      const interactive = target.closest(
        'a, button, [role="button"], [data-cursor], input, textarea, select, [data-cursor-label]'
      ) as HTMLElement | null;

      if (interactive) {
        setVariant('hover');
        setLabel(interactive.getAttribute('data-cursor-label') ?? '');
      } else {
        setVariant('default');
        setLabel('');
      }

      // Color theme zone checks based on nearest section
      const section = target.closest('section');
      if (section) {
        const id = section.id;
        if (id === 'hero') setColorTheme('ember');
        else if (id === 'features') setColorTheme('ember');
        else if (id === 'command') setColorTheme('mint');
        else if (id === 'twin') setColorTheme('violet');
        else if (id === 'analytics') setColorTheme('gold');
        else if (id === 'copilot') setColorTheme('mint');
        else setColorTheme('default');
      }
    };

    // 4. Click ripple effect (one-off GSAP trigger)
    const handleMouseDown = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      gsap.to(dotRef.current, { scale: 0.5, duration: 0.1 });
      gsap.to(ringRef.current, { scale: 0.8, duration: 0.1 });

      if (clickWaveRef.current) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', '8');
        circle.setAttribute('fill', 'none');
        
        let strokeColor = 'rgba(255, 255, 255, 0.4)';
        if (colorTheme === 'ember') strokeColor = 'rgba(255, 107, 44, 0.6)';
        else if (colorTheme === 'violet') strokeColor = 'rgba(139, 92, 246, 0.6)';
        else if (colorTheme === 'mint') strokeColor = 'rgba(94, 234, 212, 0.6)';
        else if (colorTheme === 'gold') strokeColor = 'rgba(232, 176, 75, 0.6)';

        circle.setAttribute('stroke', strokeColor);
        circle.setAttribute('stroke-width', '2');
        clickWaveRef.current.appendChild(circle);

        gsap.to(circle, {
          attr: { r: 60 },
          opacity: 0,
          strokeWidth: 0.5,
          duration: 0.65,
          ease: 'power2.out',
          onComplete: () => circle.remove(),
        });
      }
    };

    const handleMouseUp = () => {
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
      gsap.to(ringRef.current, { scale: 1, duration: 0.2 });
    };

    // Bind event listeners
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [colorTheme, variant]);

  // Handle ring morphing animations when interactive elements are hovered
  useEffect(() => {
    if (!enabled) return;

    if (ringRef.current) {
      if (variant === 'hover') {
        gsap.to(ringRef.current, {
          width: 60,
          height: 60,
          borderRadius: '12px',
          rotation: 45,
          borderColor: getThemeColorHex(true),
          boxShadow: `0 0 16px ${getThemeColorHex(false)}`,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      } else {
        gsap.to(ringRef.current, {
          width: 32,
          height: 32,
          borderRadius: '50%',
          rotation: 0,
          borderColor: colorTheme === 'default' ? 'rgba(255,255,255,0.25)' : getThemeColorHex(true),
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }

    if (dotRef.current) {
      if (variant === 'hover') {
        gsap.to(dotRef.current, {
          backgroundColor: getThemeColorHex(true),
          scale: 1.4,
          duration: 0.2,
        });
      } else {
        gsap.to(dotRef.current, {
          backgroundColor: colorTheme === 'default' ? 'rgba(255,255,255,0.85)' : getThemeColorHex(true),
          scale: 1,
          duration: 0.2,
        });
      }
    }
  }, [variant, colorTheme, enabled, getThemeColorHex]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* SVGs Click waves ripples */}
      <svg ref={clickWaveRef} className="absolute inset-0 h-full w-full" />

      {/* Lag trails - Comet effect */}
      {variant === 'default' &&
        Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) trailRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              opacity: (1 - i / trailCount) * 0.35,
              scale: 1 - i / trailCount,
              backgroundColor: getThemeColorHex(true),
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}

      {/* Ring container */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 border pointer-events-none flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: '50%',
        }}
      />

      {/* Dot element */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none bg-white"
        style={{
          boxShadow: colorTheme !== 'default' ? `0 0 8px ${getThemeColorHex(true)}` : 'none',
        }}
      />

      {/* Scanner Interactive labels */}
      {variant === 'hover' && label && (
        <div
          ref={labelRef}
          className="absolute left-0 top-0 whitespace-nowrap rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white border pointer-events-none"
          style={{
            backgroundColor: 'rgba(10,10,18,0.85)',
            borderColor: getThemeColorHex(true),
            boxShadow: `0 4px 12px rgba(0,0,0,0.5), 0 0 8px ${getThemeColorHex(false)}`,
            backdropFilter: 'blur(4px)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
