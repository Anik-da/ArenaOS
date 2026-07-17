'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const MESSAGES = [
  'Initializing Neural Engine...',
  'Synchronizing Digital Twin...',
  'Connecting AI Intelligence...',
  'Loading Stadium Network...',
  'Preparing Experience...',
];

export default function BootLoader() {
  const [visible, setVisible] = useState(true);
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('ARES AI');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<SVGSVGElement>(null);

  // Glitch effect on title
  useEffect(() => {
    if (!visible) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*';
    const original = 'ARES AI';
    
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        setGlitchText(
          original
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (Math.random() > 0.8) return chars[Math.floor(Math.random() * chars.length)];
              return char;
            })
            .join('')
        );
      } else {
        setGlitchText(original);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [visible]);

  // Main progress simulation
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setVisible(false);
      return;
    }

    let p = 0;
    const interval = setInterval(() => {
      p = Math.min(100, p + Math.random() * 14 + 6);
      setProgress(p);
      setMsgIdx(Math.min(MESSAGES.length - 1, Math.floor((p / 100) * MESSAGES.length)));
      
      if (p >= 100) {
        clearInterval(interval);
        
        // Trigger completion particle burst & split curtain reveal using GSAP
        setTimeout(() => {
          triggerCompletionSequence();
        }, 500);
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const triggerCompletionSequence = () => {
    if (!containerRef.current || !leftPanelRef.current || !rightPanelRef.current || !contentRef.current) return;

    // Create particle burst
    if (particlesRef.current) {
      const svg = particlesRef.current;
      const count = 35;
      const colors = ['#ff6b2c', '#ff8a4c', '#8b5cf6', '#5eead4'];
      
      for (let i = 0; i < count; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 120 + 60;
        const r = Math.random() * 4 + 1.5;
        
        circle.setAttribute('cx', '150');
        circle.setAttribute('cy', '150');
        circle.setAttribute('r', r.toString());
        circle.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
        circle.setAttribute('opacity', '0.9');
        svg.appendChild(circle);
        
        gsap.to(circle, {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
          opacity: 0,
          scale: 0.2,
          duration: 1.2,
          ease: 'power3.out',
          onComplete: () => circle.remove(),
        });
      }
    }

    // Split curtain animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
      }
    });

    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.85,
      filter: 'blur(12px)',
      y: -40,
      duration: 0.6,
      ease: 'power3.inOut'
    })
    .to(leftPanelRef.current, {
      xPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    }, '-=0.2')
    .to(rightPanelRef.current, {
      xPercent: 100,
      duration: 0.9,
      ease: 'power4.inOut',
    }, '<')
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'none'
    }, '-=0.4');
  };

  return (
    <AnimatePresence>
      {visible && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[10000] flex overflow-hidden bg-transparent"
        >
          {/* Split curtains */}
          <div
            ref={leftPanelRef}
            className="absolute inset-y-0 left-0 w-1/2 bg-ares-void border-r border-white/5"
          />
          <div
            ref={rightPanelRef}
            className="absolute inset-y-0 right-0 w-1/2 bg-ares-void border-l border-white/5"
          />

          {/* Depth glow */}
          <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ares-ember/10 blur-[130px] pointer-events-none" />

          {/* Loader content container */}
          <div
            ref={contentRef}
            className="relative z-10 m-auto flex flex-col items-center justify-center p-6 text-center"
          >
            {/* SVG particle container for burst */}
            <svg
              ref={particlesRef}
              viewBox="0 0 300 300"
              className="absolute pointer-events-none h-[300px] w-[300px]"
              style={{ top: 'calc(50% - 150px - 110px)', left: 'calc(50% - 150px)' }}
            />

            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-10 flex h-28 w-28 items-center justify-center"
            >
              {/* Rotating outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-ares-ember/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              {/* Counter-rotating inner ring */}
              <motion.div
                className="absolute inset-4 rounded-full border border-double border-ares-violet/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />
              {/* Glow Core */}
              <motion.div
                className="h-10 w-10 rounded-full bg-gradient-to-br from-ares-ember to-ares-emberDark"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 30px rgba(255,107,44,0.5)' }}
              />
            </motion.div>

            <div className="mb-8 text-center min-h-[70px]">
              <h1 className="font-display text-3xl font-extrabold tracking-[0.25em] text-white/95">
                {glitchText.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? 'text-gradient-ember' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="mt-2 text-[10px] uppercase tracking-[0.5em] text-white/30 font-mono">
                Sports Intelligence OS
              </p>
            </div>

            {/* Custom Premium progress bar */}
            <div className="relative w-64 h-[4px] rounded-full bg-white/[0.04] overflow-hidden">
              {/* Progress fill */}
              <div
                className="h-full bg-gradient-to-r from-ares-ember via-ares-violet to-ares-mint rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
              {/* Shimmer light element */}
              <div className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-aurora-drift" style={{ left: `${progress - 30}%` }} />
            </div>

            <div className="mt-6 h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIdx}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="font-mono text-xs tracking-widest text-white/40"
                >
                  {MESSAGES[msgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="mt-3 font-mono text-xs tabular-nums text-ares-ember font-bold">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
