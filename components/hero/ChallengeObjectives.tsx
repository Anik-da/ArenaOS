'use client';

import { motion } from 'framer-motion';
import { Target, Trophy, Landmark, BrainCircuit } from 'lucide-react';
import { Reveal, TiltCard } from '@/components/primitives/Motion';

const OBJECTIVES = [
  {
    icon: Trophy,
    title: 'Tournament Operations',
    desc: 'Unifying multi-venue scheduling, fixture generator loops, and broadcaster window restrictions to optimize resting cycles.',
    accent: 'var(--ares-ember)',
    bg: 'rgba(255, 107, 44, 0.03)',
    border: 'rgba(255, 107, 44, 0.15)',
  },
  {
    icon: Landmark,
    title: 'Smart Stadium Operations',
    desc: 'Synthesizing live Digital Twin layers—gates, seats, cameras, and drones—into real-time CCTV incident tracking and dispatcher loops.',
    accent: 'var(--ares-violet)',
    bg: 'rgba(139, 92, 246, 0.03)',
    border: 'rgba(139, 92, 246, 0.15)',
  },
  {
    icon: BrainCircuit,
    title: 'Cognitive AI Diagnostics',
    desc: 'Powering context-aware Llama Copilot conversations driven directly by active telemetry event streams and threshold checks.',
    accent: 'var(--ares-mint)',
    bg: 'rgba(94, 234, 212, 0.03)',
    border: 'rgba(94, 234, 212, 0.15)',
  },
];

export default function ChallengeObjectives() {
  return (
    <section id="objectives" className="relative py-20 bg-ares-void/20">
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-ares-ember/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-ares-mint/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Title */}
        <Reveal className="mb-14 text-center">
          <div className="mb-3.5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-ares-gold/60" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-ares-gold font-bold">
              Challenge Objectives
            </span>
            <span className="h-px w-10 bg-ares-gold/60" />
          </div>
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.2rem)] font-extrabold leading-tight text-white">
            Operational Integration <span className="text-gradient-gold">Requirements</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/40 font-medium">
            Deploying a conscious intelligence layer across modern stadiums to synchronize 
            sports scheduling, telemetry monitoring, and safety response protocols.
          </p>
        </Reveal>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {OBJECTIVES.map((obj, i) => {
            const Icon = obj.icon;
            return (
              <Reveal key={obj.title} delay={i * 0.15} variant="fade-up">
                <TiltCard max={4} className="h-full">
                  <div
                    className="glass-card relative h-full rounded-2.5xl p-8 border hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
                    style={{
                      backgroundColor: obj.bg,
                      borderColor: obj.border,
                    }}
                  >
                    <div>
                      {/* Icon Container */}
                      <div
                        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border"
                        style={{
                          backgroundColor: `${obj.accent}10`,
                          borderColor: `${obj.accent}30`,
                        }}
                      >
                        <Icon size={20} style={{ color: obj.accent }} />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white/95">
                        {obj.title}
                      </h3>
                      <p className="mt-3 text-xs leading-relaxed text-white/40 font-medium">
                        {obj.desc}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/30 font-mono">
                      <Target size={10} style={{ color: obj.accent }} />
                      <span>Validated Module</span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
