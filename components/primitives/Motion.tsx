'use client';

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = true,
  once = true,
  variant = 'fade-up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  variant?: 'fade-up' | 'scale' | 'slide-left' | 'slide-right' | 'clip-reveal';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-8% 0px -8% 0px' });

  const getVariants = () => {
    switch (variant) {
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9, filter: blur ? 'blur(8px)' : 'blur(0px)' },
          animate: inView
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, scale: 0.9, filter: blur ? 'blur(8px)' : 'blur(0px)' },
        };
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 40, filter: blur ? 'blur(8px)' : 'blur(0px)' },
          animate: inView
            ? { opacity: 1, x: 0, filter: 'blur(0px)' }
            : { opacity: 0, x: 40, filter: blur ? 'blur(8px)' : 'blur(0px)' },
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -40, filter: blur ? 'blur(8px)' : 'blur(0px)' },
          animate: inView
            ? { opacity: 1, x: 0, filter: 'blur(0px)' }
            : { opacity: 0, x: -40, filter: blur ? 'blur(8px)' : 'blur(0px)' },
        };
      case 'clip-reveal':
        return {
          initial: { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 30 },
          animate: inView
            ? { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)', y: 0 }
            : { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 30 },
        };
      case 'fade-up':
      default:
        return {
          initial: { opacity: 0, y, filter: blur ? 'blur(6px)' : 'blur(0px)' },
          animate: inView
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y, filter: blur ? 'blur(6px)' : 'blur(0px)' },
        };
    }
  };

  const anim = getVariants();

  return (
    <motion.div
      ref={ref}
      initial={anim.initial}
      animate={anim.animate}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 2,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 4); // Quartic ease out
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {display.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function MagneticButton({
  children,
  className,
  onClick,
  strength = 0.3,
  cursorLabel,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  cursorLabel?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.6 });

  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      data-cursor
      data-cursor-label={cursorLabel}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={cn('relative active:scale-95 transition-transform duration-100', className)}
    >
      {children}
    </motion.button>
  );
}

export function TiltCard({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  
  // Interactive shine card
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(50);
  const sShineX = useSpring(shineX, { stiffness: 120, damping: 18 });
  const sShineY = useSpring(shineY, { stiffness: 120, damping: 18 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);

    shineX.set(((e.clientX - r.left) / r.width) * 100);
    shineY.set(((e.clientY - r.top) / r.height) * 100);
  }
  
  function onLeave() {
    rx.set(0);
    ry.set(0);
    shineX.set(50);
    shineY.set(50);
  }

  const shineBg = useTransform(
    [sShineX, sShineY],
    ([cx, cy]) => `radial-gradient(250px circle at ${cx}% ${cy}%, rgba(255, 255, 255, 0.08), transparent 70%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      className={cn('relative preserve-3d group', className)}
    >
      <motion.div 
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: shineBg }}
      />
      {children}
    </motion.div>
  );
}

export function useMouseLight() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 100);
    y.set(((e.clientY - r.top) / r.height) * 100);
  }
  return { ref, x, y, onMove };
}

/* ═══════════════════════════════════════════════════
   NEW PREMUM PRIMITIVES
   ═══════════════════════════════════════════════════ */

export function AnimatedText({
  text,
  className,
  delay = 0,
  once = true,
  as = 'h2',
}: {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(containerRef, { once, margin: '-10% 0px' });

  // Word-by-word reveal using Framer Motion with character-level staggered animations
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const MotionComponent = motion[as] as any;

  return (
    <MotionComponent
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={cn('flex flex-wrap items-center justify-center gap-x-[0.25em] gap-y-[0.1em]', className)}
    >
      {words.map((word, idx) => (
        <span key={idx} className="relative inline-block overflow-hidden py-1">
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.1,
}: {
  children: ReactNode;
  className?: string;
  speed?: number; // negative moves slower than scroll, positive moves faster
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate how far the element is from the center of the viewport
      const distance = (scrollY + windowHeight / 2) - (elementTop + rect.height / 2);
      setOffsetY(distance * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ transform: `translateY(${offsetY}px)` }}>
      {children}
    </div>
  );
}

export function GlowButton({
  children,
  className,
  onClick,
  glowColor = 'rgba(255, 107, 44, 0.4)',
  cursorLabel,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
  cursorLabel?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MagneticButton
      onClick={onClick}
      cursorLabel={cursorLabel}
      className={cn(
        'relative group overflow-hidden rounded-full border border-white/10 px-8 py-4 font-semibold text-white transition-all duration-300',
        className
      )}
    >
      <div 
        className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(100px circle at 50% 50%, ${glowColor}, transparent 80%)`,
        }}
      />
      {/* Dynamic border gradient shine */}
      <span className="absolute inset-0 rounded-full border border-transparent bg-gradient-to-r from-ares-ember to-ares-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300 [mask-image:linear-gradient(white,white)] [-webkit-mask-composite:destination-out]" style={{ padding: '1px' }} />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </MagneticButton>
  );
}
