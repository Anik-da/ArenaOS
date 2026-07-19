'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, ChevronDown, Cpu, Activity, Shield } from 'lucide-react';
import { MagneticButton, Reveal, AnimatedText, ParallaxLayer } from '@/components/primitives/Motion';
import { scrollToId } from '@/components/providers/SmoothScrollProvider';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* 3D scene */}
      <motion.div className="absolute inset-0" style={{ opacity }}>
        <HeroScene />
      </motion.div>

      {/* Readability gradient system */}
      <div className="absolute inset-0 bg-gradient-to-b from-ares-void/40 via-transparent to-ares-void" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,6,10,0.65)_100%)]" />

      {/* Parallax Floating HUD Elements - Awwwards style */}
      <ParallaxLayer speed={0.15} className="absolute left-[8%] top-[25%] hidden lg:block z-10 pointer-events-none">
        <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md border-white/5 animate-float-y">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ares-mint/15 border border-ares-mint/30">
            <Activity size={18} className="text-ares-mint" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">AI Neural Engine</div>
            <div className="text-sm font-bold text-white">98.6% Sync Rate</div>
          </div>
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={-0.12} className="absolute right-[8%] top-[20%] hidden lg:block z-10 pointer-events-none">
        <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md border-white/5 animate-float-y" style={{ animationDelay: '2.5s' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ares-ember/15 border border-ares-ember/30">
            <Cpu size={18} className="text-ares-ember" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">System Status</div>
            <div className="text-sm font-bold text-white">11 Systems Linked</div>
          </div>
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.08} className="absolute right-[12%] bottom-[25%] hidden lg:block z-10 pointer-events-none">
        <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md border-white/5 animate-float-y" style={{ animationDelay: '4.8s' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ares-violet/15 border border-ares-violet/30">
            <Shield size={18} className="text-ares-violet" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">Security Protocol</div>
            <div className="text-sm font-bold text-white">Threat Level: 0.00</div>
          </div>
        </div>
      </ParallaxLayer>

      {/* Main Content */}
      <motion.div
        style={{ y: yText }}
        className="relative z-10 flex flex-col items-center px-6 text-center max-w-5xl"
      >
        {/* Badge */}
        <Reveal delay={0.25} variant="fade-up" className="mb-8">
          <div className="glass flex items-center gap-2.5 rounded-full px-5 py-2 border-white/5">
            <span className="flex h-2 w-2 rounded-full bg-ares-mint animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55 font-mono">
              Autonomous Sports Intelligence · v3.0
            </span>
          </div>
        </Reveal>

        {/* Character/Word Reveal Headline */}
        <AnimatedText
          as="span"
          text="The Future of"
          className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[0.9] tracking-tight text-white/95"
          delay={0.4}
        />
        <motion.h1
          initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[0.9] tracking-tight text-white mt-1"
        >
          <span className="text-gradient-aurora">Sports Intelligence</span>
        </motion.h1>

        {/* Subtitle */}
        <Reveal delay={0.9} variant="fade-up">
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/45 sm:text-lg font-medium">
            An AI-powered operating system for intelligent tournament operations,
            crowd management, digital twins, predictive analytics and fan experiences.
          </p>
        </Reveal>

        {/* Action CTAs */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 z-20">
          <Reveal delay={1.1} variant="scale">
            <MagneticButton
              cursorLabel="Launch"
              onClick={() => scrollToId('command')}
              className="gradient-border-animated group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-ares-ember to-ares-emberDark px-9 py-4.5 text-sm font-bold text-white transition-all shadow-[0_8px_32px_rgba(255,107,44,0.3)] hover:shadow-[0_12px_40px_rgba(255,107,44,0.5)] hover:scale-[1.03] active:scale-[0.98]"
            >
              Launch Experience
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
            </MagneticButton>
          </Reveal>

          <Reveal delay={1.2} variant="scale">
            <MagneticButton
              cursorLabel="Explore"
              onClick={() => scrollToId('features')}
              className="glass flex items-center gap-2 rounded-full px-9 py-4.5 text-sm font-semibold text-white/80 border-white/5 hover:border-white/20 transition-all hover:bg-white/5"
            >
              Explore Platform
            </MagneticButton>
          </Reveal>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => scrollToId('features')}
        data-cursor
        data-cursor-label="Scroll"
        style={{ opacity }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/30 transition-colors hover:text-white/60"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-9 rounded-full border border-white/25 flex justify-center p-1.5"
        >
          <motion.div className="w-1 h-2 rounded-full bg-ares-ember" />
        </motion.div>
      </motion.button>
    </section>
  );
}
