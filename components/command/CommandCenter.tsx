'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  Users,
  DollarSign,
  CloudSun,
  Car,
  Zap,
  Droplets,
  Siren,
  Wifi,
  Activity,
  TrendingUp,
  TrendingDown,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { Counter, Reveal } from '@/components/primitives/Motion';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

type Metric = {
  key: string;
  label: string;
  icon: typeof Users;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  unit?: string;
  delta: number;
  accent: string;
  glow: string;
};

const INITIAL_METRICS: Metric[] = [
  { key: 'att', label: 'Attendance', icon: Users, value: 78420, delta: 2.4, accent: '#ff6b2c', glow: 'rgba(255,107,44,0.4)' },
  { key: 'rev', label: 'Revenue', icon: DollarSign, value: 2.84, prefix: '$', suffix: 'M', decimals: 2, delta: 8.1, accent: '#e8b04b', glow: 'rgba(232,176,75,0.4)' },
  { key: 'wtr', label: 'Weather', icon: CloudSun, value: 24, suffix: '°C', delta: -0.6, accent: '#5eead4', glow: 'rgba(94,234,212,0.4)' },
  { key: 'prk', label: 'Parking', icon: Car, value: 92, suffix: '%', delta: 1.2, accent: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
  { key: 'enr', label: 'Energy', icon: Zap, value: 4.2, suffix: 'MW', decimals: 1, delta: -3.4, accent: '#ff6b2c', glow: 'rgba(255,107,44,0.4)' },
  { key: 'wat', label: 'Water', icon: Droplets, value: 38, suffix: 'kL', delta: 0.8, accent: '#5eead4', glow: 'rgba(94,234,212,0.4)' },
  { key: 'emg', label: 'Emergency', icon: Siren, value: 0, delta: 0, accent: '#ff4d6d', glow: 'rgba(255,77,109,0.4)' },
  { key: 'net', label: 'Internet', icon: Wifi, value: 99.8, suffix: '%', decimals: 1, delta: 0.1, accent: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
  { key: 'aih', label: 'AI Health', icon: Activity, value: 98.6, suffix: '%', decimals: 1, delta: 0.3, accent: '#5eead4', glow: 'rgba(94,234,212,0.4)' },
];

const RECS = [
  { tag: 'Crowd', text: 'Gate C density rising — reroute 12% flow to Gate A within 4 min.', accent: '#ff6b2c' },
  { tag: 'Weather', text: 'Wind shift detected. Adjust drone patrol path Sector 3 → 4.', accent: '#e8b04b' },
  { tag: 'Energy', text: 'Peak demand in 22 min. Pre-stage backup generators Block 2.', accent: '#8b5cf6' },
  { tag: 'Fan', text: 'Concession queue at Section 214 exceeds 8 min. Deploy mobile unit.', accent: '#5eead4' },
];

const TIMELINE = [
  { t: '18:30', label: 'Gates Open', state: 'done' },
  { t: '19:15', label: 'Warm-up', state: 'done' },
  { t: '20:00', label: 'Kick-off', state: 'active' },
  { t: '21:15', label: 'Half-time', state: 'pending' },
  { t: '22:00', label: 'Full-time', state: 'pending' },
  { t: '22:30', label: 'Egress', state: 'pending' },
];

function StadiumRadar() {
  const blipsRef = useRef(
    Array.from({ length: 14 }).map(() => ({
      a: Math.random() * 360,
      r: 30 + Math.random() * 55,
      d: Math.random() * 4,
      key: Math.random(),
    }))
  );

  return (
    <div className="relative aspect-square w-full max-w-[460px] flex items-center justify-center p-4">
      {/* ambient glows */}
      <div className="absolute inset-0 rounded-full bg-ares-ember/5 blur-[50px] animate-pulse" />
      <div className="absolute inset-4 rounded-full bg-ares-mint/[0.02] blur-[30px]" />

      <svg viewBox="0 0 200 200" className="relative h-full w-full">
        <defs>
          <radialGradient id="radar-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6b2c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff6b2c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0" />
            <stop offset="50%" stopColor="#5eead4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* rings */}
        {[28, 50, 72, 92].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        ))}

        {/* crosshairs */}
        <line x1="100" y1="8" x2="100" y2="192" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <line x1="8" y1="100" x2="192" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

        {/* core glow */}
        <circle cx="100" cy="100" r="22" fill="url(#radar-core)" />

        {/* stadium outline */}
        <ellipse cx="100" cy="100" rx="48" ry="38" fill="none" stroke="rgba(255,107,44,0.3)" strokeWidth="1.2" />
        <ellipse cx="100" cy="100" rx="40" ry="30" fill="rgba(255,107,44,0.02)" stroke="rgba(255,107,44,0.12)" strokeWidth="0.5" />

        {/* sweep arm with fading trail */}
        <motion.g
          style={{ transformOrigin: '100px 100px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M 100 100 L 100 8 A 92 92 0 0 1 172 48 Z" fill="url(#sweep-grad)" opacity="0.35" />
          <line x1="100" y1="100" x2="100" y2="8" stroke="#5eead4" strokeWidth="1.5" opacity="0.8" style={{ filter: 'drop-shadow(0 0 3px #5eead4)' }} />
        </motion.g>

        {/* blips with ping animations */}
        {blipsRef.current.map((b) => {
          const rad = (b.a * Math.PI) / 180;
          const cx = 100 + Math.cos(rad) * b.r;
          const cy = 100 + Math.sin(rad) * b.r;
          return (
            <g key={b.key}>
              <motion.circle
                cx={cx}
                cy={cy}
                r="1.8"
                fill="#5eead4"
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 2.5, delay: b.d, repeat: Infinity }}
              />
              <motion.circle
                cx={cx}
                cy={cy}
                r="6"
                fill="none"
                stroke="#5eead4"
                strokeWidth="0.25"
                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, delay: b.d, repeat: Infinity, ease: 'easeOut' }}
              />
            </g>
          );
        })}

        {/* central stadium core node */}
        <circle cx="100" cy="100" r="3.5" fill="#ff6b2c">
          <animate attributeName="r" values="3.5;5;3.5" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* HUD metrics labels overlays */}
      <div className="absolute left-6 top-6 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
        SECTOR 04 · ACTIVE
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[9px] uppercase tracking-[0.2em] text-ares-mint/80 font-bold">
        14 Telemetry Nodes
      </div>
    </div>
  );
}

function MetricCard({ m, index, valOverride }: { m: Metric; index: number; valOverride: number }) {
  const Icon = m.icon;
  const up = m.delta >= 0;

  return (
    <Reveal delay={index * 0.04} variant="scale">
      <motion.div
        whileHover={{ y: -5 }}
        className="glass-card group relative overflow-hidden rounded-2xl p-5 border-white/5 hover:border-white/15"
      >
        {/* Spotlight background accent glow */}
        <div
          className="absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-30"
          style={{ background: m.accent }}
        />

        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `${m.accent}15`,
              border: `1px solid ${m.accent}30`,
              boxShadow: `0 4px 12px -4px ${m.accent}20`
            }}
          >
            <Icon size={18} style={{ color: m.accent }} />
          </div>
          <div
            className={cn(
              'flex items-center gap-0.5 text-xs font-bold font-mono',
              up ? 'text-ares-mint' : 'text-ares-ember'
            )}
          >
            {up ? <TrendingUp size={12} className="text-ares-mint" /> : <TrendingDown size={12} className="text-ares-ember" />}
            {Math.abs(m.delta).toFixed(1)}%
          </div>
        </div>

        <div className="mt-4 font-display text-2xl font-black text-white tracking-tight">
          <Counter
            value={valOverride}
            decimals={m.decimals ?? 0}
            prefix={m.prefix ?? ''}
            suffix={m.suffix ?? ''}
          />
        </div>

        <div className="mt-1 text-xs font-semibold text-white/40 group-hover:text-white/60 transition-colors duration-300">
          {m.label}
        </div>
      </motion.div>
    </Reveal>
  );
}

import { getSocket } from '@/lib/api';

export default function CommandCenter() {
  const [clock, setClock] = useState('');
  const [liveMetricsVals, setLiveMetricsVals] = useState<Record<string, number>>({});
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Initialize and run live telemetry updates every 3 seconds
  useEffect(() => {
    // Initial values
    const initVals: Record<string, number> = {};
    INITIAL_METRICS.forEach(m => {
      initVals[m.key] = m.value;
    });
    setLiveMetricsVals(initVals);

    // Set up local simulated fallback timer
    const telemetryTimer = setInterval(() => {
      // Only apply simulated updates if backend is not currently pushing updates
      if (isBackendConnected) return;

      setLiveMetricsVals(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const original = INITIAL_METRICS.find(m => m.key === key);
          if (!original) return;

          // Introduce minor fluctuations
          if (key === 'att') {
            next[key] = Math.max(78000, Math.min(79000, next[key] + Math.floor(Math.random() * 21 - 10)));
          } else if (key === 'rev') {
            next[key] = parseFloat(Math.max(2.5, Math.min(3.2, next[key] + (Math.random() * 0.04 - 0.02))).toFixed(2));
          } else if (key === 'wtr') {
            next[key] = Math.max(20, Math.min(28, next[key] + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
          } else if (key === 'prk') {
            next[key] = Math.max(85, Math.min(99, next[key] + Math.floor(Math.random() * 3 - 1)));
          } else if (key === 'enr') {
            next[key] = parseFloat(Math.max(3.8, Math.min(4.8, next[key] + (Math.random() * 0.2 - 0.1))).toFixed(1));
          } else if (key === 'wat') {
            next[key] = Math.max(30, Math.min(45, next[key] + Math.floor(Math.random() * 3 - 1)));
          } else if (key === 'net') {
            next[key] = parseFloat(Math.max(99.0, Math.min(100.0, next[key] + (Math.random() * 0.2 - 0.1))).toFixed(1));
          } else if (key === 'aih') {
            next[key] = parseFloat(Math.max(97.5, Math.min(99.8, next[key] + (Math.random() * 0.2 - 0.1))).toFixed(1));
          }
        });
        return next;
      });
    }, 3000);

    const clockTimer = setInterval(() => {
      setClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    // Socket.IO Integration
    const socket = getSocket();

    const onConnect = () => {
      setIsBackendConnected(true);
      socket.emit('join:room', 'stadium:utilities');
      socket.emit('join:room', 'stadium:crowd');
      socket.emit('join:room', 'stadium:live');
    };

    const onDisconnect = () => {
      setIsBackendConnected(false);
    };

    const onUtilitiesTelemetry = (data: any) => {
      setIsBackendConnected(true);
      setLiveMetricsVals(prev => ({
        ...prev,
        enr: parseFloat((data.energy / 1000).toFixed(1)), // KW to MW
        wat: Math.round(data.waterLitersSec / 100), // Liters to kL
        emg: data.leakDetected ? 1 : prev.emg || 0,
      }));
    };

    const onCrowdTelemetry = (data: any) => {
      setIsBackendConnected(true);
      if (data.zones && data.zones.length > 0) {
        const avgDensity = data.zones.reduce((sum: number, z: any) => sum + z.density, 0) / data.zones.length;
        setLiveMetricsVals(prev => ({
          ...prev,
          att: Math.round(70000 + (avgDensity / 100) * 9000), // scale dynamically with density
        }));
      }
    };

    const onWeatherTelemetry = (data: any) => {
      setIsBackendConnected(true);
      if (data.temp) {
        setLiveMetricsVals(prev => ({
          ...prev,
          wtr: Math.round(data.temp),
        }));
      }
    };

    // Attach listeners
    if (socket.connected) {
      onConnect();
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('telemetry:utilities', onUtilitiesTelemetry);
    socket.on('telemetry:crowd', onCrowdTelemetry);
    socket.on('telemetry:weather', onWeatherTelemetry);

    return () => {
      clearInterval(telemetryTimer);
      clearInterval(clockTimer);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('telemetry:utilities', onUtilitiesTelemetry);
      socket.off('telemetry:crowd', onCrowdTelemetry);
      socket.off('telemetry:weather', onWeatherTelemetry);
    };
  }, [isBackendConnected]);

  return (
    <section id="command" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <Reveal className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-12 bg-ares-mint" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-ares-mint/80 font-bold">
                Mission Control
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-tight text-white">
              ARES Command Center
            </h2>
            <p className="mt-3.5 max-w-xl text-white/40 font-medium">
              Every signal from the stadium, fused and interpreted in real time.
            </p>
          </div>

          <div className="glass flex items-center gap-3 rounded-full px-5 py-3 border-white/5 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
            <span className="flex h-2 w-2 rounded-full bg-ares-mint animate-pulse" />
            <span className="font-mono text-sm font-bold tabular-nums text-white/90">{clock || '--:--:--'}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold">UTC+1 · LIVE</span>
          </div>
        </Reveal>

        {/* Dynamic Grid layout */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr_1fr]">

          {/* Column 1: Live Telemetry Cards */}
          <div className="grid grid-cols-2 gap-4 content-start">
            {INITIAL_METRICS.slice(0, 6).map((m, i) => (
              <MetricCard
                key={m.key}
                m={m}
                index={i}
                valOverride={liveMetricsVals[m.key] !== undefined ? liveMetricsVals[m.key] : m.value}
              />
            ))}
          </div>

          {/* Column 2: Center Radar visualization */}
          <Reveal delay={0.1} variant="scale" className="glass-card relative flex flex-col items-center justify-between rounded-3xl p-6 border-white/5">
            <div className="flex w-full items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/45 font-bold">Stadium Active Telemetry</span>
              <span className="flex items-center gap-1.5 text-[10px] text-ares-mint/85 font-mono font-bold">
                <Cpu size={12} className="animate-spin-slow text-ares-mint" /> Neural sync 98.6%
              </span>
            </div>

            <StadiumRadar />

            <div className="grid w-full grid-cols-3 gap-3">
              {INITIAL_METRICS.slice(6).map((m) => {
                const Icon = m.icon;
                const dynamicVal = liveMetricsVals[m.key] !== undefined ? liveMetricsVals[m.key] : m.value;
                return (
                  <div key={m.key} className="rounded-2xl bg-white/[0.02] p-4 text-center border border-white/[0.03] transition-all hover:bg-white/[0.04]">
                    <Icon size={16} className="mx-auto mb-2" style={{ color: m.accent }} />
                    <div className="font-display text-lg font-bold text-white tracking-tight">
                      <Counter value={dynamicVal} decimals={m.decimals ?? 0} suffix={m.suffix ?? ''} />
                    </div>
                    <div className="text-[10px] font-semibold text-white/35 mt-0.5">{m.label}</div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Column 3: Recommendations + Timeline actions */}
          <div className="flex flex-col gap-6">

            {/* AI Recommendations */}
            <Reveal delay={0.15} variant="slide-left" className="glass-card rounded-3xl p-6 border-white/5">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ares-ember/15 border border-ares-ember/30">
                  <ArrowUpRight size={16} className="text-ares-ember" />
                </div>
                <h3 className="font-display text-sm font-bold text-white/95 uppercase tracking-wider">AI Recommendations</h3>
              </div>

              <div className="space-y-3.5">
                {RECS.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 100 }}
                    className="group flex gap-3.5 rounded-2xl bg-white/[0.02] p-4 border border-white/[0.03] transition-all hover:bg-white/[0.04] hover:border-white/5"
                  >
                    <span
                      className="mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-mono"
                      style={{ background: `${r.accent}20`, color: r.accent }}
                    >
                      {r.tag}
                    </span>
                    <p className="text-xs leading-relaxed text-white/50 group-hover:text-white/70 transition-colors duration-300">{r.text}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Event Timeline progress */}
            <Reveal delay={0.2} variant="slide-left" className="glass-card rounded-3xl p-6 border-white/5 flex-1">
              <h3 className="mb-5 font-display text-sm font-bold text-white/95 uppercase tracking-wider">Event Timeline</h3>

              <div className="space-y-0.5">
                {TIMELINE.map((ev, i) => (
                  <div key={i} className="flex items-center gap-4 py-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'h-3.5 w-3.5 rounded-full flex items-center justify-center transition-all duration-300',
                          ev.state === 'done' && 'bg-ares-mint/20 border border-ares-mint/40',
                          ev.state === 'active' && 'bg-ares-ember/30 border border-ares-ember shadow-[0_0_12px_#ff6b2c]',
                          ev.state === 'pending' && 'border border-white/10 bg-transparent'
                        )}
                      >
                        {ev.state === 'done' && (
                          <div className="h-1.5 w-1.5 rounded-full bg-ares-mint" />
                        )}
                        {ev.state === 'active' && (
                          <motion.div
                            className="h-1.5 w-1.5 rounded-full bg-ares-ember"
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div className={cn('h-9 w-0.5 mt-1 rounded-full', ev.state === 'done' ? 'bg-ares-mint/40' : 'bg-white/5')} />
                      )}
                    </div>

                    <div className="flex flex-1 items-center justify-between pb-1 border-b border-white/[0.02] mt-[-6px]">
                      <span className={cn(
                        'text-xs font-semibold tracking-wide',
                        ev.state === 'pending' ? 'text-white/30' : ev.state === 'active' ? 'text-white font-bold' : 'text-white/70'
                      )}>
                        {ev.label}
                      </span>
                      <span className={cn(
                        'font-mono text-[10px]',
                        ev.state === 'active' ? 'text-ares-ember font-bold' : 'text-white/35'
                      )}>{ev.t}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
}
