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

  // Keep track of mouse position for GSAP quickTo hooks
  const mousePos = useRef({ x: -100, y: -100 });

  // Array of trail dots
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

    // Create GSAP quickTo tweens for buttery smooth 120fps movements
    const ringMoveX = gsap.quickTo(ringRef.current, 'x', { duration: 0.4, ease: 'power3.out' });
    const ringMoveY = gsap.quickTo(ringRef.current, 'y', { duration: 0.4, ease: 'power3.out' });

    const dotMoveX = gsap.quickTo(dotRef.current, 'x', { duration: 0.1, ease: 'power2.out' });
    const dotMoveY = gsap.quickTo(dotRef.current, 'y', { duration: 0.1, ease: 'power2.out' });

    // Track move
    const move = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      mousePos.current = { x, y };

      ringMoveX(x);
      ringMoveY(y);
      dotMoveX(x);
      dotMoveY(y);

      // Smooth lag trails for comet effect
      trailRefs.current.forEach((t, index) => {
        if (!t) return;
        const delay = (index + 1) * 0.05;
        gsap.to(t, {
          x,
          y,
          duration: delay,
          ease: 'power2.out',
        });
      });

      // Contextual color detection based on scroll position / elements under cursor
      const element = document.elementFromPoint(x, y);
      const section = element?.closest('section');
      
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

      // Check interactive hovers
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [role="button"], [data-cursor], input, textarea, select, [data-cursor-label]'
      ) as HTMLElement | null;

      if (interactive) {
        setVariant('hover');
        setLabel(interactive.getAttribute('data-cursor-label') ?? '');
      } else {
        setVariant('default');
        setLabel('');
      }
    };

    // Click effect (Shockwave ripple)
    const down = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Pulse dot and ring
      gsap.to(dotRef.current, { scale: 0.5, duration: 0.1 });
      gsap.to(ringRef.current, { scale: 0.8, duration: 0.1 });

      // SVG Click Ripple wave
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

    const up = () => {
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
      gsap.to(ringRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [colorTheme]);

  // Handle ring morphing animations when interactive elements are hovered
  useEffect(() => {
    if (!enabled) return;

    if (variant === 'hover') {
      // Morph ring into a magnetic/scanner box
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
      gsap.to(dotRef.current, {
        backgroundColor: getThemeColorHex(true),
        scale: 1.4,
        duration: 0.2,
      });
    } else {
      // Normal circular ring
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
      gsap.to(dotRef.current, {
        backgroundColor: colorTheme === 'default' ? 'rgba(255,255,255,0.85)' : getThemeColorHex(true),
        scale: 1,
        duration: 0.2,
      });
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
            transform: `translate(${mousePos.current.x + 22}px, ${mousePos.current.y + 22}px)`,
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
