'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<
    { x: number; y: number; s: number; d: number; delay: number }[]
  >([]);

  useEffect(() => {
    const n = 15;
    const arr = Array.from({ length: n }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2 + 0.5,
      d: Math.random() * 25 + 15,
      delay: Math.random() * -10, // Start negative to prevent pop-in
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ares-void">
      {/* Base premium deep space gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(18,18,36,0.8),#06060a_70%)]" />

      {/* Perspective grids for Awwwards digital OS look */}
      <div className="absolute inset-0 bg-grid opacity-10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-grid-fine opacity-[0.05]" />

      {/* Cinematic perspective floor lines grid */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[40vh] opacity-25"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(75deg) translateZ(0)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Subtle floating digital matrices (lines) */}
      <div className="absolute inset-y-0 left-1/4 w-[1px] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      <div className="absolute inset-y-0 left-2/3 w-[1px] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      <div className="absolute inset-x-0 top-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* Organic morphing aurora blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1.1, 1],
          x: [0, 30, -20, 40, 0],
          y: [0, -40, 20, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -left-[10%] top-[5%] h-[55vh] w-[55vh] rounded-full bg-ares-ember/10 blur-[130px] mix-blend-screen"
      />
      
      <motion.div
        animate={{
          scale: [1, 0.9, 1.1, 0.95, 1],
          x: [0, -40, 30, -20, 0],
          y: [0, 30, -50, 40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute right-[-8%] top-[15%] h-[60vh] w-[60vh] rounded-full bg-ares-violet/8 blur-[160px] mix-blend-screen"
      />

      <motion.div
        animate={{
          scale: [1, 1.12, 0.88, 1.05, 1],
          x: [0, 20, -30, 10, 0],
          y: [0, 40, 30, -20, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
        className="absolute left-[20%] bottom-[-5%] h-[50vh] w-[50vh] rounded-full bg-ares-mint/6 blur-[140px] mix-blend-screen"
      />

      {/* Depth fog layers */}
      <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-[#06060a]/95 via-[#06060a]/75 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[25vh] bg-gradient-to-b from-[#06060a]/90 via-[#06060a]/50 to-transparent pointer-events-none" />

      {/* Fading space particles */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            boxShadow: p.s > 1.5 ? '0 0 8px rgba(255, 255, 255, 0.4)' : 'none',
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.5, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.d,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Noise filter */}
      <div className="noise-overlay" />
    </div>
  );
}
