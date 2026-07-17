'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type TransitionPreset = 'fade-scale' | 'slide-up' | 'curtain-reveal' | 'none';

export default function SectionTransition({
  children,
  className,
  id,
  preset = 'fade-scale',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  preset?: TransitionPreset;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || preset === 'none') return;

    const el = containerRef.current;
    if (!el) return;

    let ctx = gsap.context(() => {
      if (preset === 'fade-scale') {
        gsap.fromTo(
          el,
          { opacity: 0.1, scale: 0.94, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'top 45%',
              scrub: 1,
              toggleActions: 'play none none reverse',
            },
          }
        );
      } else if (preset === 'slide-up') {
        gsap.fromTo(
          el,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      } else if (preset === 'curtain-reveal') {
        gsap.fromTo(
          el,
          { clipPath: 'polygon(0% 15%, 100% 15%, 100% 100%, 0% 100%)', opacity: 0.3 },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1.5,
            },
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [preset]);

  return (
    <div ref={containerRef} id={id} className={className}>
      {children}
    </div>
  );
}
