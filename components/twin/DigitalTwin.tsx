'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  Armchair,
  Car,
  DoorOpen,
  Plane,
  Camera,
  Flame,
  Grid3x3,
  Eye,
  Truck,
} from 'lucide-react';
import { Reveal } from '@/components/primitives/Motion';
import { cn } from '@/lib/utils';

type Layer = 'seats' | 'parking' | 'gates' | 'drones' | 'cameras' | 'heatmap';

const LAYERS: { id: Layer; label: string; icon: typeof Eye; accent: string }[] = [
  { id: 'seats', label: 'Seat Occupancy', icon: Armchair, accent: '#5eead4' },
  { id: 'parking', label: 'Parking', icon: Car, accent: '#8b5cf6' },
  { id: 'gates', label: 'Gates', icon: DoorOpen, accent: '#ff6b2c' },
  { id: 'drones', label: 'Drones', icon: Plane, accent: '#5eead4' },
  { id: 'cameras', label: 'Cameras', icon: Camera, accent: '#e8b04b' },
  { id: 'heatmap', label: 'Heatmap', icon: Flame, accent: '#ff4d6d' },
];

function useSeats() {
  const seats = useState(() => {
    const arr: { x: number; y: number; state: 0 | 1 | 2 }[] = [];
    for (let ring = 0; ring < 5; ring++) {
      const r = 38 + ring * 7;
      const count = 60 + ring * 16;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const rnd = Math.random();
        const state: 0 | 1 | 2 = rnd > 0.82 ? 0 : rnd > 0.3 ? 2 : 1;
        arr.push({ x: 150 + Math.cos(a) * r, y: 150 + Math.sin(a) * r * 0.72, state });
      }
    }
    return arr;
  })[0];
  return seats;
}

const PARKING = Array.from({ length: 24 }).map((_, i) => ({
  x: 20 + (i % 8) * 8,
  y: 250 + Math.floor(i / 8) * 10,
  occupied: Math.random() > 0.35,
}));

const GATES = [
  { x: 150, y: 60, label: 'A', load: 0.82 },
  { x: 240, y: 150, label: 'B', load: 0.45 },
  { x: 150, y: 240, label: 'C', load: 0.91 },
  { x: 60, y: 150, label: 'D', load: 0.38 },
];

const DRONE_POS = [
  { x: 120, y: 100 },
  { x: 200, y: 110 },
  { x: 180, y: 200 },
];

const CAMERAS = [
  { x: 90, y: 120 },
  { x: 210, y: 130 },
  { x: 100, y: 190 },
  { x: 215, y: 185 },
];

export default function DigitalTwin() {
  const [active, setActive] = useState<Layer[]>(['seats', 'gates']);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const seats = useSeats();

  const toggle = (id: Layer) =>
    setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <section id="twin" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <Reveal className="mb-14 grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-12 bg-ares-violet" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-ares-violet font-bold">
                Digital Twin
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-tight text-white">
              A living replica of
              <br />
              <span className="text-gradient-violet">the physical world.</span>
            </h2>
          </div>
          <p className="text-white/40 md:text-right font-medium leading-relaxed">
            Every seat, gate, vehicle and sensor — mirrored in real time. Toggle
            intelligence layers to inspect the stadium from any dimension.
          </p>
        </Reveal>

        {/* Viewport and controls */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          
          {/* Main Twin viewport */}
          <Reveal delay={0.1}>
            <div className="glass-card relative overflow-hidden rounded-3xl border-white/5 shadow-dramatic">
              
              {/* Toolbar header */}
              <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-4 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <Grid3x3 size={15} className="text-ares-violet" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    ARES Twin · Arena Prime
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { icon: ZoomIn, label: 'Zoom In', fn: () => setZoom((z) => Math.min(1.8, z + 0.15)) },
                    { icon: ZoomOut, label: 'Zoom Out', fn: () => setZoom((z) => Math.max(0.6, z - 0.15)) },
                    { icon: RotateCw, label: 'Rotate', fn: () => setRotate((r) => r + 45) },
                    { icon: Maximize2, label: 'Reset', fn: () => { setZoom(1); setRotate(0); } },
                  ].map((b, i) => (
                    <button
                      key={i}
                      data-cursor
                      data-cursor-label={b.label}
                      onClick={b.fn}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/50 transition-all hover:bg-white/[0.06] hover:text-white"
                    >
                      <b.icon size={14} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport content */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-ares-void">
                
                {/* grid floor layer */}
                <div className="absolute inset-0 bg-grid opacity-[0.15] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(6,6,10,0.85))]" />

                <motion.svg
                  viewBox="0 0 300 300"
                  className="absolute inset-0 h-full w-full"
                  animate={{ scale: zoom, rotate }}
                  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                  style={{ transformOrigin: 'center' }}
                >
                  <defs>
                    <radialGradient id="field-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0f3d24" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#0a1f14" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heat" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.65" />
                      <stop offset="55%" stopColor="#ff6b2c" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ff6b2c" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Pitch representation */}
                  <ellipse cx="150" cy="150" rx="32" ry="22" fill="url(#field-glow)" />
                  <ellipse cx="150" cy="150" rx="30" ry="20" fill="none" stroke="#5eead4" strokeWidth="0.5" opacity="0.5" />
                  <line x1="150" y1="130" x2="150" y2="170" stroke="#5eead4" strokeWidth="0.4" opacity="0.4" />
                  <circle cx="150" cy="150" r="5" fill="none" stroke="#5eead4" strokeWidth="0.4" opacity="0.4" />

                  {/* Arena bounds */}
                  <ellipse cx="150" cy="150" rx="74" ry="54" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="0.8" />
                  <ellipse cx="150" cy="150" rx="82" ry="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

                  {/* AnimatePresence for layering toggle states */}
                  
                  {/* Heatmap Layer */}
                  {active.includes('heatmap') && (
                    <g className="heatmap-layer">
                      <circle cx="150" cy="150" r="52" fill="url(#heat)" />
                      <circle cx="210" cy="120" r="30" fill="url(#heat)" />
                      <circle cx="95" cy="180" r="26" fill="url(#heat)" />
                    </g>
                  )}

                  {/* Seat Occupancy */}
                  {active.includes('seats') && (
                    <g className="seats-layer">
                      {seats.map((s, i) => (
                        <circle
                          key={i}
                          cx={s.x}
                          cy={s.y}
                          r="1.2"
                          fill={s.state === 2 ? '#5eead4' : s.state === 1 ? '#e8b04b' : '#ffffff10'}
                          opacity={s.state === 0 ? 0.15 : 0.9}
                        />
                      ))}
                    </g>
                  )}

                  {/* Parking Slots */}
                  {active.includes('parking') && (
                    <g className="parking-layer">
                      {PARKING.map((p, i) => (
                        <rect
                          key={i}
                          x={p.x}
                          y={p.y}
                          width="5"
                          height="7.5"
                          rx="1"
                          fill={p.occupied ? '#8b5cf6' : '#ffffff15'}
                          opacity={p.occupied ? 0.85 : 0.3}
                        />
                      ))}
                    </g>
                  )}

                  {/* Gate Checkpoints */}
                  {active.includes('gates') && (
                    <g className="gates-layer">
                      {GATES.map((g) => (
                        <g key={g.label}>
                          <circle cx={g.x} cy={g.y} r="6.5" fill="none" stroke="#ff6b2c" strokeWidth="1" />
                          <circle cx={g.x} cy={g.y} r={g.load * 6.5} fill="#ff6b2c" opacity="0.45" />
                          <text x={g.x} y={g.y + 1.8} fontSize="5.5" fill="#fff" textAnchor="middle" fontWeight="bold">
                            {g.label}
                          </text>
                          <motion.circle
                            cx={g.x}
                            cy={g.y}
                            r="11"
                            fill="none"
                            stroke="#ff6b2c"
                            strokeWidth="0.25"
                            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </g>
                      ))}
                    </g>
                  )}

                  {/* Autonomous Drones */}
                  {active.includes('drones') && (
                    <g className="drones-layer">
                      {DRONE_POS.map((d, i) => (
                        <g key={i}>
                          <motion.circle
                            cx={d.x}
                            cy={d.y}
                            r="3.5"
                            fill="#5eead4"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                          />
                          <circle cx={d.x} cy={d.y} r="7.5" fill="none" stroke="#5eead4" strokeWidth="0.4" opacity="0.3" />
                          {/* Drone path indicator traces */}
                          <line x1={d.x} y1={d.y} x2={d.x + 12} y2={d.y - 12} stroke="#5eead4" strokeWidth="0.3" strokeDasharray="1.5 1.5" opacity="0.4" />
                        </g>
                      ))}
                    </g>
                  )}

                  {/* Optical Cameras */}
                  {active.includes('cameras') && (
                    <g className="cameras-layer">
                      {CAMERAS.map((c, i) => (
                        <g key={i}>
                          <circle cx={c.x} cy={c.y} r="2.8" fill="#e8b04b" />
                          <motion.circle
                            cx={c.x}
                            cy={c.y}
                            r="9"
                            fill="none"
                            stroke="#e8b04b"
                            strokeWidth="0.3"
                            animate={{ r: [4.5, 13, 4.5], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 3.2, delay: i * 0.6, repeat: Infinity }}
                          />
                        </g>
                      ))}
                    </g>
                  )}

                  {/* Emergency Vehicle Node */}
                  <g>
                    <rect x="145" y="268" width="10" height="6.5" rx="1.2" fill="#ff4d6d" opacity="0.85" />
                    <motion.rect
                      x="141"
                      y="264"
                      width="18"
                      height="14.5"
                      rx="2.2"
                      fill="none"
                      stroke="#ff4d6d"
                      strokeWidth="0.4"
                      animate={{ opacity: [0.2, 0.8, 0.2] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  </g>
                </motion.svg>

                {/* Laser scan sweep beam overlay */}
                <motion.div
                  className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-ares-violet to-transparent blur-[1px]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                  style={{ boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}
                />

                {/* Status HUD elements */}
                <div className="absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-widest text-white/30 font-bold">
                  x: 0420 · y: 0312 · z: 1.00
                </div>
                <div className="absolute bottom-4 right-5 font-mono text-[9px] uppercase tracking-widest text-ares-mint/80 font-bold">
                  SYNC 99.2%
                </div>
              </div>
            </div>
          </Reveal>

          {/* Column 2: Layer selections and statistics panels */}
          <div className="flex flex-col gap-6">
            
            {/* Intelligence Layers choices */}
            <Reveal delay={0.15} variant="slide-left" className="glass-card rounded-3xl p-6 border-white/5">
              <h3 className="mb-5 font-display text-sm font-bold text-white/95 uppercase tracking-wider">Intelligence Layers</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {LAYERS.map((l) => {
                  const Icon = l.icon;
                  const on = active.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      data-cursor
                      data-cursor-label={on ? `Hide ${l.label}` : `Show ${l.label}`}
                      onClick={() => toggle(l.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-3 text-left transition-all active:scale-95 duration-200',
                        on 
                          ? 'bg-white/[0.06] border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                          : 'border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.03]'
                      )}
                      style={on ? { borderColor: `${l.accent}45` } : {}}
                    >
                      <Icon size={14} style={{ color: on ? l.accent : 'rgba(255,255,255,0.35)' }} className="transition-transform duration-300 group-hover:scale-105" />
                      <span className={cn('text-[11px] font-bold tracking-wide', on ? 'text-white' : 'text-white/45')}>
                        {l.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Live Stats fill indicator progress bars */}
            <Reveal delay={0.2} variant="slide-left" className="glass-card rounded-3xl p-6 border-white/5 flex-1">
              <h3 className="mb-5 font-display text-sm font-bold text-white/95 uppercase tracking-wider">Live Status</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Seats Occupied', val: '52,340', pct: 78, accent: '#5eead4', icon: Armchair },
                  { label: 'Parking Filled', val: '4,128', pct: 92, accent: '#8b5cf6', icon: Car },
                  { label: 'Gates Online', val: '4 / 4', pct: 100, accent: '#ff6b2c', icon: DoorOpen },
                  { label: 'Drones Active', val: '3', pct: 75, accent: '#5eead4', icon: Plane },
                  { label: 'Cameras Streaming', val: '4', pct: 100, accent: '#e8b04b', icon: Camera },
                  { label: 'Medical Units', val: '2', pct: 50, accent: '#ff4d6d', icon: Truck },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="group/stat">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2.5 text-xs text-white/40 font-bold group-hover/stat:text-white/60 transition-colors">
                          <Icon size={13} style={{ color: s.accent }} />
                          {s.label}
                        </span>
                        <span className="font-mono text-xs font-bold text-white/90">{s.val}</span>
                      </div>
                      
                      {/* Premium Shimmer progress bar fill */}
                      <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.03] border border-white/[0.04]">
                        <motion.div
                          className="h-full rounded-full shimmer"
                          style={{ background: s.accent }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
}
