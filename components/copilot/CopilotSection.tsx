'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Send, X, Sparkles, Mic } from 'lucide-react';
import { MagneticButton, Reveal } from '@/components/primitives/Motion';
import { cn } from '@/lib/utils';

type Msg = { role: 'ai' | 'user'; text: string };

const SUGGESTIONS = [
  'What is current crowd density at Gate C?',
  'Show energy consumption forecast',
  'Any anomalies in the last 10 minutes?',
  'Optimize parking allocation',
];

const SCRIPTED: Record<string, string> = {
  'What is current crowd density at Gate C?': 'Gate C is at 91% capacity and trending up. I recommend rerouting 12% of inbound flow to Gate A within the next 4 minutes to prevent congestion.',
  'Show energy consumption forecast': 'Current draw is 4.2 MW. Peak demand is projected in 22 minutes at 5.1 MW. I have pre-staged backup generators in Block 2 and can activate them on your command.',
  'Any anomalies in the last 10 minutes?': 'Two minor anomalies detected: a brief network latency spike at Section 214 (resolved) and an unauthorized drone signature near Sector 3 — currently being intercepted by patrol unit 02.',
  'Optimize parking allocation': 'Optimization model converged. Executing dynamic pricing for Lot B and opening Lot D overflow. Estimated reduction in entry queue time: 34%.',
};

function AssistantOrb() {
  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);

  return (
    <>
      <motion.button
        data-cursor
        data-cursor-label="Ask ARES"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="fixed bottom-6 right-6 z-[200] flex h-16 w-16 items-center justify-center"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open ARES Assistant"
      >
        {/* Radar wave background pulses */}
        <AnimatePresence>
          {hovering && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border border-ares-ember/30"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border border-ares-ember/20"
              />
            </>
          )}
        </AnimatePresence>

        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_24px_rgba(255,107,44,0.35)]"
          animate={{ scale: hovering ? 1.05 : 1 }}
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ff8a4c, #ff6b2c 60%, #e85d1a 100%)',
          }}
        >
          <Sparkles size={20} className="relative text-white/95" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5" style={{ display: open ? 'none' : 'flex' }}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ares-mint opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-ares-mint"></span>
          </span>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && <AssistantPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function AssistantPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: 'ARES Copilot online. I am connected to all stadium subsystems. How can I assist your operation?' },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  function send(text: string) {
    const q = text.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const reply = SCRIPTED[q] ?? 'I have analyzed the request across all connected subsystems. Detailed telemetry is available in the Command Center. Would you like me to initiate a recommended action?';
      setMessages((m) => [...m, { role: 'ai', text: reply }]);
      setThinking(false);
    }, 1600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.93, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 30, scale: 0.93, filter: 'blur(6px)' }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="glass-strong fixed bottom-24 right-6 z-[200] flex h-[550px] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl shadow-dramatic border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-4.5 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ares-ember to-ares-emberDark border border-ares-ember/30">
            <Sparkles size={15} className="text-white/95" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-white/95">ARES Copilot</div>
            <div className="flex items-center gap-1.5 text-[10px] text-ares-mint/80 font-bold font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-ares-mint animate-pulse" /> 11 systems synced
            </div>
          </div>
        </div>
        <button 
          data-cursor 
          onClick={onClose} 
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-none px-5 py-5 bg-ares-void/[0.25]">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, rotate: m.role === 'user' ? 0.8 : -0.8 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed border shadow-subtle',
                m.role === 'user'
                  ? 'bg-gradient-to-br from-ares-ember to-ares-emberDark text-white/95 rounded-br-sm border-ares-ember/30'
                  : 'bg-white/[0.03] text-white/75 rounded-bl-sm border-white/[0.04] backdrop-blur-md'
              )}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        {thinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex items-center gap-2.5 rounded-2xl rounded-bl-sm border border-white/[0.04] bg-white/[0.02] px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-ares-ember"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-white/35 font-bold">reasoning telemetry…</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-4 bg-ares-void/[0.25]">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              data-cursor
              onClick={() => send(s)}
              className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-3.5 py-2 text-[10px] text-white/50 font-bold transition-all hover:border-ares-ember/35 hover:text-white/85 hover:bg-white/[0.04] active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input panel with dynamic waveform */}
      <div className="border-t border-white/[0.04] p-3.5 bg-white/[0.01]">
        <div className="mb-2.5 flex items-center gap-2 px-1 justify-between">
          <div className="flex items-center gap-1.5">
            <Mic size={13} className="text-ares-mint/80" />
            <span className="text-[9px] font-mono text-white/35 font-bold uppercase tracking-wider">Voice feedback</span>
          </div>
          <div className="flex h-3 items-end gap-0.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-[1.5px] rounded-full bg-ares-mint/35"
                animate={{ height: [2, Math.random() * 8 + 2, 2] }}
                transition={{ duration: 0.6, delay: i * 0.05, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ARES anything…"
            className="flex-1 rounded-xl bg-white/[0.02] px-4 py-3 text-sm text-white/95 placeholder:text-white/20 outline-none ring-1 ring-white/[0.04] focus:ring-ares-ember/40 focus:bg-white/[0.04] transition-all"
          />
          <button
            type="submit"
            data-cursor
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-ares-ember to-ares-emberDark text-white/95 border border-ares-ember/20 shadow-[0_4px_12px_rgba(255,107,44,0.2)] hover:shadow-[0_4px_16px_rgba(255,107,44,0.35)] transition-all hover:scale-105 active:scale-95"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default function CopilotSection() {
  return (
    <section id="copilot" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* Text details */}
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-12 bg-ares-mint" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-ares-mint/80 font-bold">
                AI Copilot
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-tight text-white">
              Talk to the
              <br />
              <span className="text-gradient-mint">entire stadium.</span>
            </h2>
            <p className="mt-6 max-w-lg text-white/40 leading-relaxed font-medium">
              The ARES Copilot is not a chatbot. It is a reasoning engine wired
              into every subsystem — weather, crowd, security, energy, medical.
              Ask in natural language and it orchestrates the response.
            </p>
            
            <ul className="mt-8 space-y-4">
              {[
                'Cross-system reasoning across 11 connected modules',
                'Voice + text input with live waveform feedback',
                'Proactive recommendations, not just answers',
                'One-tap execution of recommended actions',
              ].map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="flex items-center gap-3.5 text-sm text-white/55 font-semibold"
                >
                  <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-ares-mint/10 border border-ares-mint/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-ares-mint animate-pulse" />
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>
            
            <MagneticButton
              cursorLabel="Try it"
              className="mt-10 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-ares-mint to-ares-mint/80 px-8 py-4.5 text-xs font-bold uppercase tracking-wider text-ares-void shadow-[0_4px_20px_rgba(94,234,212,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles size={14} /> Open Copilot — bottom right
            </MagneticButton>
          </Reveal>

          {/* Visual Orbit Element */}
          <Reveal delay={0.15}>
            <div className="glass-card relative flex aspect-square max-w-[440px] items-center justify-center overflow-hidden rounded-[2.5rem] mx-auto border-white/5 shadow-dramatic">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,234,212,0.06),transparent_60%)]" />
              
              {/* expanding concentric rings - sonar simulation */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-ares-mint/10"
                  initial={{ width: '30%', height: '30%', opacity: 0.5 }}
                  animate={{ 
                    width: ['30%', '95%'], 
                    height: ['30%', '95%'], 
                    opacity: [0.65, 0] 
                  }}
                  transition={{ 
                    duration: 4.8, 
                    delay: i * 1.2, 
                    repeat: Infinity, 
                    ease: 'linear' 
                  }}
                />
              ))}

              {/* central breathing orb */}
              <motion.div
                className="relative flex h-32 w-32 items-center justify-center rounded-full"
                animate={{ 
                  scale: [1, 1.06, 0.94, 1.06, 1],
                  rotate: [0, 45, -45, 90, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #99f6e4, #5eead4 55%, #14b8a6 100%)',
                  boxShadow: '0 0 45px rgba(94,234,212,0.35), inset 0 2px 10px rgba(255,255,255,0.2)',
                }}
              >
                <Sparkles size={34} className="relative text-ares-void" />
              </motion.div>

              {/* waveform feedback */}
              <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-end gap-0.5">
                {Array.from({ length: 22 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 rounded-full bg-ares-mint/35"
                    animate={{ height: [3, Math.random() * 18 + 4, 3] }}
                    transition={{ duration: 0.75, delay: i * 0.04, repeat: Infinity }}
                  />
                ))}
              </div>

              <div className="absolute left-6 top-6 font-mono text-[9px] uppercase tracking-[0.25em] text-white/20 font-bold">
                NEURAL CORE · LISTENING
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      <AssistantOrb />
    </section>
  );
}
