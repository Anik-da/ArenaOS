'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  CalendarClock,
  Boxes,
  Users,
  ShieldCheck,
  HeartPulse,
  Plane,
  CloudSun,
  Car,
  Smile,
  BarChart3,
  Bot,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Reveal, TiltCard, useMouseLight } from '@/components/primitives/Motion';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  accent: string;
  glow: string;
  span?: 'wide' | 'tall' | 'normal';
};

const FEATURES: Feature[] = [
  {
    icon: CalendarClock,
    title: 'AI Tournament Scheduler',
    desc: 'Generates optimal fixtures, manages venues, balances rest cycles and broadcast windows across concurrent events.',
    accent: '#ff6b2c',
    glow: 'rgba(255,107,44,0.15)',
    span: 'wide',
  },
  {
    icon: Boxes,
    title: 'Digital Twin',
    desc: 'A live 1:1 virtual replica of every stadium — seats, gates, energy, traffic.',
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.15)',
    span: 'tall',
  },
  {
    icon: Users,
    title: 'Crowd Intelligence',
    desc: 'Real-time density, flow prediction and surge alerts across every gate.',
    accent: '#5eead4',
    glow: 'rgba(94,234,212,0.15)',
  },
  {
    icon: ShieldCheck,
    title: 'Security AI',
    desc: 'Threat detection, anomaly scoring and coordinated response orchestration.',
    accent: '#ff6b2c',
    glow: 'rgba(255,107,44,0.15)',
  },
  {
    icon: HeartPulse,
    title: 'Medical AI',
    desc: 'Predicts medical demand, pre-positions teams, triggers rapid response.',
    accent: '#ff4d6d',
    glow: 'rgba(255,77,109,0.15)',
  },
  {
    icon: Plane,
    title: 'Drone Operations',
    desc: 'Autonomous surveillance drones with live feed routing and geofencing.',
    accent: '#5eead4',
    glow: 'rgba(94,234,212,0.15)',
  },
  {
    icon: CloudSun,
    title: 'Weather Intelligence',
    desc: 'Hyper-local forecasting and play-impact modeling down to the pitch.',
    accent: '#e8b04b',
    glow: 'rgba(232,176,75,0.15)',
  },
  {
    icon: Car,
    title: 'Smart Parking',
    desc: 'Predictive bay allocation, dynamic pricing and live wayfinding.',
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    icon: Smile,
    title: 'Fan Experience',
    desc: 'Personalized journeys — from entry to seat, concessions to replay.',
    accent: '#ff6b2c',
    glow: 'rgba(255,107,44,0.15)',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'Cross-domain intelligence fused into a single decision surface.',
    accent: '#e8b04b',
    glow: 'rgba(232,176,75,0.15)',
  },
  {
    icon: Bot,
    title: 'AI Copilot',
    desc: 'A conversational operator that reasons across every connected subsystem.',
    accent: '#5eead4',
    glow: 'rgba(94,234,212,0.15)',
    span: 'wide',
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const { ref, x, y, onMove } = useMouseLight();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const spanClass =
    feature.span === 'wide'
      ? 'md:col-span-2'
      : feature.span === 'tall'
        ? 'md:row-span-2'
        : '';

  return (
    <div ref={cardRef} className={cn('feature-card opacity-0 y-12', spanClass)}>
      <TiltCard max={5} className="h-full">
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="glass-card relative h-full overflow-hidden rounded-3xl p-8 flex flex-col justify-between group/card border-white/5 hover:border-white/10"
        >
          {/* Animated spot mouse follow light */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{
              background: `radial-gradient(280px circle at ${x.get()}% ${y.get()}%, ${feature.glow}, transparent 55%)`,
            }}
          />

          <div>
            {/* Index number */}
            <span className="absolute right-8 top-8 font-mono text-xs font-bold tracking-widest text-white/5 group-hover/card:text-white/15 transition-colors duration-300">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Icon box - pulse and rotate on hover */}
            <div
              className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-6"
              style={{
                background: `linear-gradient(135deg, ${feature.accent}20, ${feature.accent}05)`,
                border: `1px solid ${feature.accent}40`,
                boxShadow: `0 8px 24px -8px ${feature.accent}25`,
              }}
            >
              <Icon size={24} style={{ color: feature.accent }} className="transition-transform duration-300 group-hover/card:scale-95" />
            </div>

            <h3 className="font-display text-xl font-bold text-white/95 group-hover/card:text-white transition-colors duration-300">
              {feature.title}
            </h3>
            
            <p className="mt-3.5 text-sm leading-relaxed text-white/40 group-hover/card:text-white/55 transition-colors duration-300">
              {feature.desc}
            </p>
          </div>

          {/* Action Explore Indicator - draws longer line on hover */}
          <div
            className="mt-8 flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300"
            style={{ color: feature.accent }}
          >
            <span>Explore module</span>
            <ArrowRight size={12} className="transition-transform duration-300 group-hover/card:translate-x-1" />
          </div>

          {/* Animated border lighting overlay */}
          <div className="absolute inset-0 rounded-[inherit] border border-transparent group-hover/card:border-white/10 pointer-events-none transition-colors duration-500" />
        </motion.div>
      </TiltCard>
    </div>
  );
}

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Staggered reveal of features grid cards using GSAP ScrollTrigger
    const cards = gsap.utils.toArray('.feature-card');
    
    let ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Draw horizontal divider rule on scroll
      gsap.fromTo(
        lineRef.current,
        { width: 0 },
        {
          width: '48px',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" className="relative py-32 md:py-48" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-[1.25fr_1fr] md:items-end">
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <div ref={lineRef} className="h-px bg-ares-ember/60" style={{ width: 0 }} />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-ares-ember/80 font-bold">
                The Platform
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.05] tracking-tight text-white">
              Eleven intelligent systems.
              <br />
              <span className="text-gradient-ember">One operating system.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base leading-relaxed text-white/40 md:text-right font-medium">
              ARES unifies the full operational stack of modern sport — from
              tournament logic to the physical stadium — into a single, conscious
              intelligence layer.
            </p>
          </Reveal>
        </div>

        {/* Feature Grid cards container */}
        <div className="mt-20 grid auto-rows-[1fr] gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
