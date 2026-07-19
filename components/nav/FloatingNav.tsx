'use client';

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { scrollToId } from '@/components/providers/SmoothScrollProvider';
import { MagneticButton } from '@/components/primitives/Motion';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Platform', id: 'features' },
  { label: 'Command', id: 'command' },
  { label: 'Digital Twin', id: 'twin' },
  { label: 'Analytics', id: 'analytics' },
  { label: 'Copilot', id: 'copilot' },
];

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 40);
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean
    ) as HTMLElement[];
    const mid = v + window.innerHeight * 0.4;
    let current = '';
    for (const s of sections) {
      if (s.offsetTop <= mid) current = s.id;
    }
    setActive(current);
  });

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-4 z-[100] w-full max-w-6xl -translate-x-1/2 px-4"
      >
        <motion.nav
          animate={{
            paddingTop: scrolled ? 10 : 16,
            paddingBottom: scrolled ? 10 : 16,
            paddingLeft: scrolled ? 16 : 28,
            paddingRight: scrolled ? 16 : 28,
            maxWidth: scrolled ? '840px' : '1100px',
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 25 }}
          className={cn(
            'glass-strong mx-auto flex items-center justify-between rounded-full border-white/5 shadow-medium transition-all duration-300'
          )}
        >
          <button
            onClick={() => scrollToId('hero')}
            data-cursor
            aria-label="Go to Home"
            className="group flex items-center gap-2.5"
          >
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/10"
            >
              <div className="h-3.5 w-3.5 rounded-[3px] bg-gradient-to-br from-ares-ember to-ares-emberDark shadow-[0_0_10px_rgba(255,107,44,0.4)]" />
            </motion.div>
            <span className="font-display text-base font-extrabold tracking-wider text-white/95 group-hover:text-white transition-colors">
              ARES<span className="text-gradient-ember font-black"> AI</span>
            </span>
          </button>

          <div className="hidden items-center gap-1.5 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-cursor
                onClick={() => scrollToId(l.id)}
                className="relative rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/45 transition-colors hover:text-white/85"
              >
                {active === l.id && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/[0.05] border border-white/5"
                    style={{
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <MagneticButton
              cursorLabel="Enter"
              onClick={() => scrollToId('command')}
              aria-label="Launch ARES Platform"
              className="hidden rounded-full bg-gradient-to-r from-ares-ember to-ares-emberDark px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white border border-ares-ember/20 shadow-[0_4px_16px_rgba(255,107,44,0.2)] md:block hover:scale-[1.03] active:scale-[0.97]"
            >
              Launch Platform
            </MagneticButton>
            <button
              data-cursor
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] text-white/60 md:hidden border border-white/[0.05]"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="fixed left-1/2 top-24 z-[100] w-[90%] max-w-sm -translate-x-1/2 md:hidden"
          >
            <div className="glass-strong rounded-3xl p-4.5 border border-white/10 shadow-dramatic">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    scrollToId(l.id);
                    setMobileOpen(false);
                  }}
                  className="block w-full rounded-2xl px-4.5 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-white/65 transition-colors hover:bg-white/[0.03] hover:text-white"
                >
                  {l.label}
                </motion.button>
              ))}
              <button
                onClick={() => {
                  scrollToId('command');
                  setMobileOpen(false);
                }}
                aria-label="Launch ARES Platform"
                className="mt-3.5 w-full rounded-2xl bg-gradient-to-r from-ares-ember to-ares-emberDark px-4.5 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white shadow-medium"
              >
                Launch Platform
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
