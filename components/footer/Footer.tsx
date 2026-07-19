'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react';
import { MagneticButton, Reveal, TiltCard } from '@/components/primitives/Motion';
import { scrollToId } from '@/components/providers/SmoothScrollProvider';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden py-24 bg-ares-void">
      {/* Top Animated Section Divider */}
      <div className="section-divider absolute top-0 inset-x-0" />

      {/* Ambient background glow */}
      <div className="absolute left-1/2 top-0 h-[25vh] w-[50vw] -translate-x-1/2 rounded-full bg-ares-ember/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        
        {/* Call to Action card using TiltCard */}
        <Reveal className="mb-24">
          <TiltCard max={3.5}>
            <div className="glass-card relative overflow-hidden rounded-[2.5rem] p-12 text-center md:p-20 border-white/5 shadow-dramatic">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,44,0.06),transparent_70%)] animate-pulse" />
              
              <div className="relative z-10">
                <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-tight text-white">
                  Ready to operate the
                  <br />
                  <span className="text-gradient-aurora"> future of sport?</span>
                </h2>
                
                <p className="mx-auto mt-6 max-w-lg text-white/40 leading-relaxed font-medium">
                  Deploy ARES across your venues, tournaments and fan journeys.
                  Intelligence at the speed of the game.
                </p>
                
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <MagneticButton
                    cursorLabel="Launch"
                    onClick={() => scrollToId('command')}
                    className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-ares-ember to-ares-emberDark px-8 py-4.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(255,107,44,0.3)] hover:scale-105 active:scale-95 transition-all"
                  >
                    Launch Platform <ArrowUpRight size={14} />
                  </MagneticButton>
                  
                  <MagneticButton
                    cursorLabel="Contact"
                    className="glass flex items-center gap-2 rounded-full px-8 py-4.5 text-xs font-bold uppercase tracking-wider text-white/80 border-white/5 hover:border-white/20 transition-all hover:bg-white/5"
                  >
                    Request Access
                  </MagneticButton>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Footer directories links */}
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/10">
                <div className="h-3.5 w-3.5 rounded-[3px] bg-gradient-to-br from-ares-ember to-ares-emberDark" />
              </div>
              <span className="font-display text-base font-extrabold tracking-wider text-white/95">
                ARES<span className="text-gradient-ember font-black"> AI</span>
              </span>
            </div>
            
            <p className="max-w-xs text-xs leading-relaxed text-white/35 font-medium">
              Autonomous Recreation & Event Sports Intelligence. The operating
              system for the world&apos;s most advanced sporting events.
            </p>
            
            <div className="mt-6 flex gap-3">
              {[
                { icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
                { icon: Github, label: 'Github', color: '#ffffff' },
                { icon: Linkedin, label: 'Linkedin', color: '#0A66C2' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={i}
                    data-cursor
                    data-cursor-label={s.label}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.04] bg-white/[0.01] text-white/40 transition-all duration-300 hover:text-white"
                    style={{
                      contentVisibility: 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = s.color;
                      e.currentTarget.style.boxShadow = `0 0 10px ${s.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>
          </div>

          {[
            { title: 'Platform', links: ['Tournament Scheduler', 'Digital Twin', 'Crowd Intelligence', 'AI Copilot'] },
            { title: 'Solutions', links: ['Smart Stadiums', 'Tournament Ops', 'Fan Experience', 'Security'] },
            { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-display text-xs font-bold uppercase tracking-wider text-white/80">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <button 
                      data-cursor 
                      className="text-xs font-semibold text-white/35 transition-colors hover:text-ares-ember"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer bottom legal info */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 text-[11px] font-semibold text-white/25 md:flex-row">
          <span>© 2026 ARES AI. All rights reserved.</span>
          <div className="flex gap-6">
            <button data-cursor className="transition-colors hover:text-white/50">Privacy</button>
            <button data-cursor className="transition-colors hover:text-white/50">Terms</button>
            <button data-cursor className="transition-colors hover:text-white/50">Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
