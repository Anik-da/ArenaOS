'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Counter, Reveal } from '@/components/primitives/Motion';
import { cn } from '@/lib/utils';

const ATTENDANCE = [
  { t: '12:00', v: 12000 }, { t: '13:00', v: 24000 },
  { t: '14:00', v: 38000 }, { t: '15:00', v: 52000 },
  { t: '16:00', v: 61000 }, { t: '17:00', v: 70000 },
  { t: '18:00', v: 76400 }, { t: '19:00', v: 78420 },
  { t: '20:00', v: 79000 }, { t: '21:00', v: 78800 },
  { t: '22:00', v: 72000 }, { t: '23:00', v: 48000 },
];

const REVENUE = [
  { t: 'Mon', v: 1.8 }, { t: 'Tue', v: 2.1 },
  { t: 'Wed', v: 2.6 }, { t: 'Thu', v: 2.3 },
  { t: 'Fri', v: 3.1 }, { t: 'Sat', v: 2.84 },
  { t: 'Sun', v: 2.5 },
];

const SOURCES = [
  { name: 'Ticketing', value: 42, color: '#ff6b2c' },
  { name: 'Concessions', value: 26, color: '#e8b04b' },
  { name: 'Merch', value: 18, color: '#8b5cf6' },
  { name: 'Parking', value: 14, color: '#5eead4' },
];

const RINGS = [
  { label: 'Fan Satisfaction', value: 94, color: '#5eead4' },
  { label: 'Safety Index', value: 98, color: '#ff6b2c' },
  { label: 'Energy Eff.', value: 81, color: '#e8b04b' },
  { label: 'AI Accuracy', value: 96, color: '#8b5cf6' },
];

const HEAT: number[][] = Array.from({ length: 7 }).map((_, d) =>
  Array.from({ length: 24 }).map((_, h) => {
    const base = Math.sin((h - 14) / 24 * Math.PI) * 0.6 + 0.4;
    const dayBoost = d >= 5 ? 0.25 : 0;
    return Math.max(0, Math.min(1, base + dayBoost + (Math.random() - 0.5) * 0.2));
  })
);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-2xl px-4 py-2.5 text-xs border-white/10 shadow-dramatic backdrop-blur-md">
      <div className="font-mono text-white/40 font-bold uppercase tracking-wider mb-1">{label}</div>
      <div className="font-bold text-white text-sm">
        {payload[0].value.toLocaleString()}
      </div>
    </div>
  );
}

function Ring({ value, color, label, delay }: { value: number; color: string; label: string; delay: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center group/ring">
      <div className="relative h-24 w-24 transition-transform duration-300 group-hover/ring:scale-105">
        <svg role="img" aria-label={`Performance circular indicator for ${label} showing ${value}%`} viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
          <motion.circle
            cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5.5" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ - (value / 100) * circ }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 5px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl font-black text-white tracking-tight">
            <Counter value={value} suffix="%" />
          </span>
        </div>
      </div>
      <span className="mt-3.5 text-[11px] font-bold text-white/40 group-hover/ring:text-white/60 transition-colors uppercase tracking-widest font-mono">{label}</span>
    </div>
  );
}

export default function Analytics() {
  const [hoveredCell, setHoveredCell] = useState<{ d: number; h: number; val: number } | null>(null);

  return (
    <section id="analytics" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <Reveal className="mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-12 bg-ares-gold" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-ares-gold font-bold">
              Analytics
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-tight text-white">
              Intelligence, made
              <span className="text-gradient-gold"> visible.</span>
            </h2>
            <p className="text-white/40 md:text-right font-medium leading-relaxed font-sans">
              Cross-domain data fused into living visualizations — every chart
              reflects the stadium&apos;s real pulse.
            </p>
          </div>
        </Reveal>

        {/* Row 1: Area + Donut */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          
          {/* Influx area chart */}
          <Reveal variant="fade-up">
            <div className="glass-card rounded-3xl p-6 border-white/5 h-full flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white/90">Live Attendance Flow</h3>
                  <p className="text-[11px] text-white/45 font-medium mt-0.5">Influx & egress across the event window</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-black text-ares-ember tracking-tight">
                    <Counter value={78420} />
                  </div>
                  <div className="text-[10px] text-ares-mint font-bold font-mono mt-0.5">+2.4% vs forecast</div>
                </div>
              </div>
              
              <div className="w-full h-[220px]" role="img" aria-label="Area chart showing live attendance flow over the event day">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ATTENDANCE} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff6b2c" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ff6b2c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)' }} />
                    <Area
                      type="monotone" dataKey="v" stroke="#ff6b2c" strokeWidth={3}
                      fill="url(#areaGrad)" dot={false}
                      isAnimationActive animationDuration={1800}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Reveal>

          {/* Revenue distribution donut */}
          <Reveal delay={0.1} variant="fade-up">
            <div className="glass-card rounded-3xl p-6 border-white/5 h-full flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <h3 className="mb-6 font-display text-base font-bold text-white/90">Revenue Sources</h3>
              
              <div className="relative flex justify-center py-2">
                <div className="w-full h-[200px]" role="img" aria-label="Pie chart showing revenue distribution by source">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SOURCES} dataKey="value" nameKey="name"
                        innerRadius={62} outerRadius={92} paddingAngle={4}
                        isAnimationActive animationDuration={1600}
                      >
                        {SOURCES.map((s) => (
                          <Cell key={s.name} stroke="none" fill={s.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
                  <span className="font-display text-2xl font-black text-white tracking-tight">
                    <Counter value={2.84} decimals={2} prefix="$" suffix="M" />
                  </span>
                  <span className="text-[10px] text-white/45 uppercase tracking-widest font-mono font-bold">Today</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                {SOURCES.map((s) => (
                  <div key={s.name} className="flex items-center gap-2.5 py-1 px-2 rounded-xl bg-white/[0.01] border border-white/[0.02]">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: s.color }} />
                    <span className="text-[11px] font-semibold text-white/40">{s.name}</span>
                    <span className="ml-auto font-mono text-[11px] font-bold text-white/85">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Row 2: Bar + Rings */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          
          {/* Revenue bar chart */}
          <Reveal variant="fade-up">
            <div className="glass-card rounded-3xl p-6 border-white/5 hover:border-white/10 transition-all duration-300">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white/90">Weekly Revenue</h3>
                <span className="text-[10px] text-ares-mint font-bold font-mono uppercase tracking-wider">Trend +8.1%</span>
              </div>
              
              <div className="w-full h-[200px]" role="img" aria-label="Bar chart showing weekly revenue trend">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e8b04b" />
                        <stop offset="100%" stopColor="#c44a16" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="v" fill="url(#barGrad)" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={1600} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Reveal>

          {/* Performance Rings */}
          <Reveal delay={0.1} variant="fade-up">
            <div className="glass-card rounded-3xl p-6 border-white/5 h-full flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <h3 className="mb-6 font-display text-base font-bold text-white/90">Performance Rings</h3>
              <div className="grid grid-cols-2 gap-6 my-auto">
                {RINGS.map((r, i) => (
                  <Ring key={r.label} value={r.value} color={r.color} label={r.label} delay={i * 0.15} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Row 3: Heatmap + KPI Strip */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          
          {/* Heatmap Grid */}
          <Reveal variant="fade-up">
            <div className="glass-card rounded-3xl p-6 border-white/5 hover:border-white/10 transition-all duration-300">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white/90">Crowd Density Heatmap</h3>
                  <p className="text-[11px] text-white/45 font-medium mt-0.5">7 days · 24 hours</p>
                </div>
                {hoveredCell && (
                  <div className="text-right font-mono text-[10px] text-ares-ember font-bold bg-ares-ember/10 border border-ares-ember/20 px-2 py-0.5 rounded-md">
                    {DAYS[hoveredCell.d]} @ {hoveredCell.h}:00 · {(hoveredCell.val * 100).toFixed(0)}% load
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {/* day labels */}
                <div className="flex flex-col justify-between py-1 text-[9px] font-bold text-white/30 font-mono">
                  {DAYS.map((d) => (
                    <span key={d} className="h-5 leading-5">{d}</span>
                  ))}
                </div>
                
                {/* cells grid */}
                <div className="flex-1">
                  <div className="flex flex-col gap-1.5">
                    {HEAT.map((row, d) => (
                      <div key={d} className="flex gap-1.5">
                        {row.map((v, h) => (
                          <motion.div
                            key={h}
                            onMouseEnter={() => setHoveredCell({ d, h, val: v })}
                            onMouseLeave={() => setHoveredCell(null)}
                            className="h-5 flex-1 rounded-[3px] cursor-crosshair relative group/cell"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: (d * 24 + h) * 0.0012 }}
                            style={{
                              background: `rgba(255, ${107 + v * 100}, ${44 + v * 60}, ${0.15 + v * 0.75})`,
                              boxShadow: v > 0.78 ? '0 0 6px rgba(255,107,44,0.35)' : 'none',
                            }}
                          >
                            <div className="absolute inset-0 border border-white/20 opacity-0 group-hover/cell:opacity-100 rounded-[3px]" />
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2.5 flex justify-between text-[9px] font-bold text-white/30 font-mono">
                    <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex items-center gap-3 text-[10px] font-bold font-mono text-white/30">
                <span>Low density</span>
                <div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-ares-ember/15 to-ares-ember" />
                <span>Peak load</span>
              </div>
            </div>
          </Reveal>

          {/* KPI indicators strip */}
          <Reveal delay={0.1} variant="fade-up">
            <div className="glass-card flex h-full flex-col rounded-3xl p-6 border-white/5 hover:border-white/10 transition-all duration-300">
              <h3 className="mb-5 font-display text-base font-bold text-white/90">Key Indicators</h3>
              <div className="flex flex-1 flex-col justify-between gap-3.5">
                {[
                  { label: 'Avg. Dwell Time', value: '47 min', delta: '-6 min', accent: '#5eead4' },
                  { label: 'Concession Sales', value: '$612k', delta: '+12%', accent: '#e8b04b' },
                  { label: 'Incidents Resolved', value: '23 / 23', delta: '100%', accent: '#ff6b2c' },
                  { label: 'Network Uptime', value: '99.8%', delta: '+0.1%', accent: '#8b5cf6' },
                  { label: 'Carbon Offset', value: '8.4 t', delta: '+1.2 t', accent: '#5eead4' },
                ].map((k, i) => (
                  <motion.div
                    key={k.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: 'spring' }}
                    className="flex items-center justify-between border-b border-white/[0.03] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-8.5 w-1 rounded-full" style={{ background: k.accent }} />
                      <span className="text-xs text-white/40 font-bold tracking-wide">{k.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-sm font-bold text-white/95">{k.value}</div>
                      <div className="text-[10px] font-bold font-mono" style={{ color: k.accent }}>{k.delta}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
