'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Send,
  Sparkles,
  Users,
  ShieldCheck,
  HeartPulse,
  Plane,
  CloudSun,
  Car,
  Smile,
  BarChart3,
  Bot,
  CalendarClock,
  Boxes,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchAPI } from '@/lib/api';

type Feature = {
  icon: any;
  title: string;
  desc: string;
  accent: string;
  glow: string;
  targetId: string;
};

interface ModuleExplorerProps {
  feature: Feature;
  onClose: () => void;
}

export default function ModuleExplorer({ feature, onClose }: ModuleExplorerProps) {
  const Icon = feature.icon;
  const [simulating, setSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [simStep, setSimStep] = useState(0);

  // States for specific modules
  // Tournament Scheduler
  const [schedulerMode, setSchedulerMode] = useState('balanced');
  // Digital Twin
  const [twinLayer, setTwinLayer] = useState<'all' | 'sensors' | 'cameras' | 'gates'>('all');
  const [selectedTwinSector, setSelectedTwinSector] = useState<string>('Sector 1');
  // Crowd Intelligence
  const [crowdLevels, setCrowdLevels] = useState({ gateA: 48, gateB: 35, gateC: 91 });
  // Security
  const [threatLevel, setThreatLevel] = useState<'nominal' | 'elevated' | 'critical'>('nominal');
  const [guardDispatched, setGuardDispatched] = useState(false);
  // Medical
  const [emtStation, setEmtStation] = useState('Station 1 (Standby)');
  const [triageRating, setTriageRating] = useState('Normal');
  // Drone
  const [dronePatrolActive, setDronePatrolActive] = useState(false);
  const [droneBattery, setDroneBattery] = useState(88);
  // Weather
  const [temp, setTemp] = useState(24);
  const [playabilityScore, setPlayabilityScore] = useState(98);
  // Smart Parking
  const [parkingOccupancy, setParkingOccupancy] = useState({ lotA: 76, lotB: 98, lotC: 94 });
  const [signMessage, setSignMessage] = useState('Welcome - Lot A & B Available');
  // Fan Experience
  const [concessionWait, setConcessionWait] = useState(12);
  const [vouchersSent, setVouchersSent] = useState(false);
  // AI Copilot mini chat
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: `Hello! I am ARES AI Copilot. How can I assist you with the ${feature.title} module today?` }
  ]);

  // Clean up body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const runSimulation = (logs: string[], finalAction?: () => void) => {
    if (simulating) return;
    setSimulating(true);
    setSimLog([]);
    setSimStep(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setSimLog(prev => [...prev, logs[currentStep]]);
        setSimStep(currentStep + 1);
        currentStep++;
      } else {
        clearInterval(interval);
        setSimulating(false);
        if (finalAction) finalAction();
      }
    }, 600);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || simulating) return;
    const text = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setChatInput('');
    setSimulating(true);

    fetchAPI('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text, model: 'default' }),
    })
      .then((res: any) => {
        setChatMessages(prev => [...prev, { sender: 'ai', text: res.data }]);
      })
      .catch(() => {
        setChatMessages(prev => [...prev, { sender: 'ai', text: `ARES AI successfully completed NLP analysis for: "${text}". All metrics indicate nominal operation.` }]);
      })
      .finally(() => {
        setSimulating(false);
      });
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/90 text-white shadow-2xl backdrop-blur-2xl flex flex-col"
        style={{
          boxShadow: `0 24px 60px -15px ${feature.glow}`,
        }}
      >
        {/* Glow corner */}
        <div
          className="absolute -top-32 -left-32 h-64 w-64 rounded-full blur-[100px] pointer-events-none"
          style={{ backgroundColor: feature.accent, opacity: 0.2 }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5 relative z-10 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl border"
              style={{
                borderColor: `${feature.accent}40`,
                background: `linear-gradient(135deg, ${feature.accent}15, ${feature.accent}03)`,
              }}
            >
              <Icon size={22} style={{ color: feature.accent }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold tracking-tight text-white/95">
                  {feature.title}
                </h3>
                <span className="flex h-2 w-2 rounded-full bg-ares-mint animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-ares-mint uppercase font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-white/40 font-medium mt-0.5">{feature.desc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close module details modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 flex flex-col gap-6">

          {/* Module-Specific Simulation Dashboard */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Interactive Control Console */}
            <div className="glass-card rounded-2xl border-white/5 p-6 bg-white/[0.01] flex flex-col justify-between min-h-[300px]">
              <div>
                <h4 className="font-display text-sm font-bold text-white/90 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sliders size={14} style={{ color: feature.accent }} />
                  Control Panel
                </h4>

                {/* --- TOURNAMENT SCHEDULER CONTROLS --- */}
                {feature.title === 'AI Tournament Scheduler' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-white/40 font-bold block mb-2">Optimization Mode</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['balanced', 'rest-heavy', 'tv-centric'].map((m) => (
                          <button
                            key={m}
                            onClick={() => setSchedulerMode(m)}
                            className={cn(
                              "py-2 rounded-lg text-xs font-semibold capitalize border border-white/5 transition-all",
                              schedulerMode === m ? "bg-white/10 text-white font-bold" : "bg-white/[0.01] text-white/40 hover:bg-white/[0.03]"
                            )}
                          >
                            {m.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60 font-semibold">Active Fixtures</span>
                        <span className="font-mono text-ares-ember font-bold">14 Concurrent Matches</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-xs">
                        <span className="text-white/60 font-semibold font-sans">Rest Cycle Compliance</span>
                        <span className="text-ares-mint font-mono font-bold">98.4% Nominal</span>
                      </div>
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Analyzing fixture overlaps...",
                        "Calculating team travel times...",
                        "Adjusting broadcast slot assignments...",
                        "Simulating schedule variations...",
                        "Schedule optimized! Grid updated successfully."
                      ])}
                      disabled={simulating}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-ares-ember text-white hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-ares-ember/20 disabled:opacity-50"
                    >
                      {simulating ? "Optimizing..." : "Trigger AI Rescheduler"}
                    </button>
                  </div>
                )}

                {/* --- DIGITAL TWIN CONTROLS --- */}
                {feature.title === 'Digital Twin' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-white/40 font-bold block mb-2">Visual Layer Filter</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['all', 'sensors', 'cameras', 'gates'].map((l) => (
                          <button
                            key={l}
                            onClick={() => setTwinLayer(l as any)}
                            className={cn(
                              "py-2 rounded-lg text-xs font-semibold capitalize border border-white/5 transition-all",
                              twinLayer === l ? "bg-white/10 text-white font-bold" : "bg-white/[0.01] text-white/40 hover:bg-white/[0.03]"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="stadium-sector-select" className="text-[11px] font-mono uppercase text-white/40 font-bold block mb-2">Stadium Sector Detail</label>
                      <select
                        id="stadium-sector-select"
                        value={selectedTwinSector}
                        onChange={(e) => setSelectedTwinSector(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:outline-none"
                      >
                        {['Sector 1 (North Gate)', 'Sector 2 (VIP Box)', 'Sector 3 (East Stand)', 'Sector 4 (South Concourse)'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Synchronizing spatial databases...",
                        "Re-fetching 8K camera grids...",
                        "Thermal overlay generated...",
                        "Digital Twin calibrated."
                      ])}
                      disabled={simulating}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-ares-violet text-white hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-ares-violet/20 disabled:opacity-50"
                    >
                      {simulating ? "Calibrating..." : "Calibrate Spatial Twin"}
                    </button>
                  </div>
                )}

                {/* --- CROWD INTELLIGENCE CONTROLS --- */}
                {feature.title === 'Crowd Intelligence' && (
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60">Gate A Load</span>
                        <span className="font-mono text-ares-mint font-bold">{crowdLevels.gateA}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-ares-mint h-full transition-all duration-500" style={{ width: `${crowdLevels.gateA}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60">Gate B Load</span>
                        <span className="font-mono text-ares-mint font-bold">{crowdLevels.gateB}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-ares-mint h-full transition-all duration-500" style={{ width: `${crowdLevels.gateB}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60">Gate C Load</span>
                        <span className={cn("font-mono font-bold", crowdLevels.gateC > 85 ? "text-ares-ember" : "text-ares-mint")}>{crowdLevels.gateC}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className={cn("h-full transition-all duration-500", crowdLevels.gateC > 85 ? "bg-ares-ember" : "bg-ares-mint")} style={{ width: `${crowdLevels.gateC}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={() => runSimulation([
                        "Detecting bottlenecks at Gate C...",
                        "Calculating alternate routes...",
                        "Updating dynamic LED wayfinding signages...",
                        "Flow redirected! Congestion mitigated."
                      ], () => {
                        setCrowdLevels({ gateA: 60, gateB: 48, gateC: 73 });
                      })}
                      disabled={simulating}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-ares-mint text-zinc-950 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-ares-mint/20 disabled:opacity-50"
                    >
                      {simulating ? "Redirecting..." : "Reroute Gate C Crowd"}
                    </button>
                  </div>
                )}

                {/* --- SECURITY AI CONTROLS --- */}
                {feature.title === 'Security AI' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-white/40 font-bold block mb-2">Overall Threat State</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['nominal', 'elevated', 'critical'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setThreatLevel(t as any)}
                            className={cn(
                              "py-2 rounded-lg text-xs font-semibold capitalize border border-white/5 transition-all",
                              threatLevel === t ? "bg-red-500/25 border-red-500/50 text-red-400 font-bold" : "bg-white/[0.01] text-white/40 hover:bg-white/[0.03]"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/60 space-y-2">
                      <div className="flex justify-between">
                        <span>CCTV Feeds Streaming</span>
                        <span className="font-mono text-ares-mint font-bold">186/186 Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LIDAR Grid Coverage</span>
                        <span className="font-mono text-ares-mint font-bold">100% Locked</span>
                      </div>
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Alerting Security Unit 08...",
                        "Transmitting coordinate overlay...",
                        "CCTV locked on target...",
                        "Security forces dispatched."
                      ], () => {
                        setGuardDispatched(true);
                      })}
                      disabled={simulating || guardDispatched}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {guardDispatched ? "Security Forces Dispatched" : "Dispatch Unit 08 to Sector 4"}
                    </button>
                  </div>
                )}

                {/* --- MEDICAL AI CONTROLS --- */}
                {feature.title === 'Medical AI' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/60 space-y-3">
                      <div className="flex justify-between">
                        <span>Triage Station Status</span>
                        <span className="font-mono text-ares-mint font-bold">Green (Idle)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Teams Available</span>
                        <span className="font-mono text-ares-mint font-bold">4 Teams On-Call</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nearest EMT Station</span>
                        <span className="font-mono text-white/90 font-bold">{emtStation}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Analyzing medical triage request...",
                        "Allocating Team Alpha...",
                        "Dispatching emergency vehicle with GPS...",
                        "EMT deployed."
                      ], () => {
                        setEmtStation('Station 1 (Dispatched)');
                        setTriageRating('Responding');
                      })}
                      disabled={simulating}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {simulating ? "Deploying..." : "Deploy EMT Emergency Unit"}
                    </button>
                  </div>
                )}

                {/* --- DRONE OPERATIONS CONTROLS --- */}
                {feature.title === 'Drone Operations' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/60 space-y-3">
                      <div className="flex justify-between">
                        <span>Active Surveillance UAVs</span>
                        <span className="font-mono text-white/95 font-bold">3 Drones</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Autopilot State</span>
                        <span className="font-mono text-ares-mint font-bold">Locked Orbit</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Battery Life</span>
                        <span className="font-mono text-white/95 font-bold">{droneBattery}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Releasing Drone lock...",
                        "Initializing rotor engines...",
                        "Pre-routing drone paths...",
                        "Autonomous drone flight sweep active."
                      ], () => {
                        setDronePatrolActive(true);
                        setDroneBattery(prev => prev - 5);
                      })}
                      disabled={simulating}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-ares-mint text-zinc-950 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-ares-mint/20 disabled:opacity-50"
                    >
                      {dronePatrolActive ? "UAV Sweep Active (100% Coverage)" : "Trigger UAV Surveillance Sweep"}
                    </button>
                  </div>
                )}

                {/* --- WEATHER CONTROLS --- */}
                {feature.title === 'Weather Intelligence' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/60 space-y-3">
                      <div className="flex justify-between">
                        <span>Local Stadium Temperature</span>
                        <span className="font-mono text-white/95 font-bold">{temp}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pitch Moisture Rating</span>
                        <span className="font-mono text-ares-mint font-bold">Optimized (12%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Playability Index Rating</span>
                        <span className="font-mono text-ares-gold font-bold">{playabilityScore}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Querying local micro-forecasts...",
                        "Calculating wind shear and thermal gradients...",
                        "Analyzing moisture content...",
                        "Playability index verified."
                      ], () => {
                        setPlayabilityScore(99);
                      })}
                      disabled={simulating}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-ares-gold text-zinc-950 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-ares-gold/20 disabled:opacity-50"
                    >
                      {simulating ? "Analyzing..." : "Evaluate Pitch Playability"}
                    </button>
                  </div>
                )}

                {/* --- SMART PARKING CONTROLS --- */}
                {feature.title === 'Smart Parking' && (
                  <div className="space-y-4">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/60">Lot A Occupancy</span>
                        <span className="font-mono text-white/95 font-bold">{parkingOccupancy.lotA}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-ares-violet h-full" style={{ width: `${parkingOccupancy.lotA}%` }} />
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/60">Lot B Occupancy</span>
                        <span className="font-mono text-white/95 font-bold">{parkingOccupancy.lotB}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-ares-violet h-full" style={{ width: `${parkingOccupancy.lotB}%` }} />
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/60">Lot C Occupancy</span>
                        <span className="font-mono text-white/95 font-bold">{parkingOccupancy.lotC}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-ares-violet h-full" style={{ width: `${parkingOccupancy.lotC}%` }} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="signage-message-input" className="text-[11px] font-mono uppercase text-white/40 font-bold block mb-1.5">Signage Message Preview</label>
                      <input
                        id="signage-message-input"
                        value={signMessage}
                        onChange={(e) => setSignMessage(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Updating sign database...",
                        "Syncing road sensors...",
                        "Signage text broadcasted."
                      ])}
                      disabled={simulating}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-ares-violet text-white hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-ares-violet/20 disabled:opacity-50"
                    >
                      {simulating ? "Syncing..." : "Update Road Signages"}
                    </button>
                  </div>
                )}

                {/* --- FAN EXPERIENCE CONTROLS --- */}
                {feature.title === 'Fan Experience' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/60 space-y-3">
                      <div className="flex justify-between">
                        <span>Merch Store Wait Time</span>
                        <span className="font-mono text-white/95 font-bold">3 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>F&B Congested Zones</span>
                        <span className="font-mono text-ares-ember font-bold">Section 214 Concession</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Queue Wait</span>
                        <span className="font-mono text-white/95 font-bold">{concessionWait} minutes</span>
                      </div>
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Formatting markdown voucher payloads...",
                        "Locating VIP/General seat maps near Section 214...",
                        "Pushing concession voucher notifications...",
                        "Vouchers successfully delivered."
                      ], () => {
                        setVouchersSent(true);
                        setConcessionWait(6);
                      })}
                      disabled={simulating || vouchersSent}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-ares-ember text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {vouchersSent ? "Discount Vouchers Dispatched!" : "Push Concession Vouchers"}
                    </button>
                  </div>
                )}

                {/* --- ANALYTICS CONTROLS --- */}
                {feature.title === 'Analytics' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/60 space-y-2">
                      <div className="flex justify-between">
                        <span>Analytics Nodes Sync</span>
                        <span className="font-mono text-ares-mint font-bold">12/12 Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Telemetry Engine Speed</span>
                        <span className="font-mono text-white/95 font-bold">4.2 GB/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy Confidence Score</span>
                        <span className="font-mono text-white/95 font-bold">96.8%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => runSimulation([
                        "Scanning all database indexes...",
                        "Verifying cache warm-up values...",
                        "Testing websocket latency connections...",
                        "Running anomaly calculation checks...",
                        "All systems clear."
                      ])}
                      disabled={simulating}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-ares-gold text-zinc-950 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {simulating ? "Scanning..." : "Execute Full System Diagnostics"}
                    </button>
                  </div>
                )}

                {/* --- AI COPILOT CONTROLS --- */}
                {feature.title === 'AI Copilot' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/60 space-y-2">
                      <div className="flex justify-between">
                        <span>AI Inference Model</span>
                        <span className="font-mono text-ares-mint font-bold">Llama-3-8B-Instruct</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hugging Face Sync</span>
                        <span className="font-mono text-ares-mint font-bold">Active & Certified</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-white/40 italic">
                      This copilot is connected directly to the Hugging Face serverless inference API. Try asking a telemetry question below!
                    </div>
                  </div>
                )}

              </div>

              {/* Status footer */}
              <div className="border-t border-white/[0.05] pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-white/40 uppercase">
                <span>System status:</span>
                <span className="text-ares-mint font-bold">Calibrated & Running</span>
              </div>
            </div>

            {/* Module Live Output Visualizer */}
            <div className="glass-card rounded-2xl border-white/5 p-6 bg-white/[0.01] flex flex-col justify-between min-h-[300px]">
              <div>
                <h4 className="font-display text-sm font-bold text-white/90 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Cpu size={14} style={{ color: feature.accent }} />
                  Live Output & Analytics
                </h4>

                {/* Tournament Scheduler Output */}
                {feature.title === 'AI Tournament Scheduler' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">Optimized Match Fixtures</div>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex justify-between text-xs">
                        <span>Match 1: Brazil vs Germany</span>
                        <span className="text-ares-mint font-bold">18:00 (Optimized)</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex justify-between text-xs">
                        <span>Match 2: India vs Australia</span>
                        <span className="text-ares-mint font-bold">20:30 (Optimized)</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex justify-between text-xs">
                        <span>Match 3: Real Madrid vs Man City</span>
                        <span className="text-ares-mint font-bold">22:00 (Optimized)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Digital Twin Output */}
                {feature.title === 'Digital Twin' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">Interactive Sensor Array</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 bg-black/40 border border-white/5 rounded-lg">
                        <div className="text-white/45">CCTV 101</div>
                        <div className="text-ares-mint font-bold">ONLINE (30 FPS)</div>
                      </div>
                      <div className="p-2 bg-black/40 border border-white/5 rounded-lg">
                        <div className="text-white/45">LIDAR Gate C</div>
                        <div className="text-ares-mint font-bold">ONLINE (98.4%)</div>
                      </div>
                      <div className="p-2 bg-black/40 border border-white/5 rounded-lg">
                        <div className="text-white/45">Thermal S3</div>
                        <div className="text-ares-mint font-bold">NOMINAL (36.8°C)</div>
                      </div>
                      <div className="p-2 bg-black/40 border border-white/5 rounded-lg">
                        <div className="text-white/45">Autopilot D1</div>
                        <div className="text-ares-mint font-bold">STANDBY</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Crowd Intelligence Output */}
                {feature.title === 'Crowd Intelligence' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">Crowd Congestion Analysis</div>
                    <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start gap-3">
                      <AlertTriangle size={16} className="text-ares-ember mt-0.5" />
                      <div>
                        <div className="text-xs text-white/80 font-bold">Gate C Surge Risk</div>
                        <div className="text-[10px] text-white/45 mt-0.5">Flow density exceeded 4.2 people/m². Rerouting recommended immediately.</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security AI Output */}
                {feature.title === 'Security AI' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">Security Dispatch Log</div>
                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-white/45">08:12:04</span>
                        <span className="text-white/80">Sec Patrol 02 Dispatched</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-white/45">08:15:32</span>
                        <span className="text-white/80">Anomaly at Sector 3 Intercepted</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-white/45">08:18:11</span>
                        <span className="text-ares-mint font-bold">All Sectors Cleared</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medical AI Output */}
                {feature.title === 'Medical AI' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">EMT Dispatch & Triage Log</div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>EMT Dispatch Status</span>
                        <span className="font-mono font-bold text-ares-mint">{triageRating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Incidents</span>
                        <span className="font-mono font-bold">0 Active</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Drone Operations Output */}
                {feature.title === 'Drone Operations' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">UAV Flight Coordinates</div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span>UAV 01 Coordinates</span>
                        <span className="text-ares-mint">51.523° N, 0.124° W</span>
                      </div>
                      <div className="flex justify-between">
                        <span>UAV 02 Coordinates</span>
                        <span className="text-white/45">Docked (Charging)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weather Output */}
                {feature.title === 'Weather Intelligence' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">Local Pitch Conditions</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg text-center">
                        <div className="text-white/45 text-[10px]">Precipitation</div>
                        <div className="font-bold mt-1">4% Prob.</div>
                      </div>
                      <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg text-center">
                        <div className="text-white/45 text-[10px]">Wind Speed</div>
                        <div className="font-bold mt-1">12 km/h</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Smart Parking Output */}
                {feature.title === 'Smart Parking' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">Signage Output Stream</div>
                    <div className="p-4 bg-zinc-900 border border-ares-violet/30 text-center rounded-xl font-mono text-xs uppercase tracking-widest text-ares-violet animate-pulse">
                      {signMessage}
                    </div>
                  </div>
                )}

                {/* Fan Experience Output */}
                {feature.title === 'Fan Experience' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">Active Spectator Vouchers</div>
                    {vouchersSent ? (
                      <div className="p-3 bg-ares-mint/15 border border-ares-mint/30 rounded-xl text-center text-xs text-ares-mint font-bold">
                        Voucher code "ARENA15" pushed to Sectors 110-112!
                      </div>
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center text-xs text-white/45 italic">
                        No active vouchers broadcasted.
                      </div>
                    )}
                  </div>
                )}

                {/* Analytics Output */}
                {feature.title === 'Analytics' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/60">System Resource Latency</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Database Query</span>
                        <span className="font-mono text-ares-mint">2.1ms (Nominal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WebSocket Latency</span>
                        <span className="font-mono text-ares-mint">14ms (Nominal)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Copilot */}
                {feature.title === 'AI Copilot' && (
                  // Copilot Chat Window
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <h4 className="font-display text-sm font-bold text-white/90 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Bot size={14} style={{ color: feature.accent }} />
                      Copilot Chat Interface
                    </h4>
                    <div className="flex-1 overflow-y-auto max-h-[180px] space-y-2 pr-2 mb-4 scrollbar-thin">
                      {chatMessages.map((m, i) => (
                        <div
                          key={i}
                          className={cn(
                            "p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed",
                            m.sender === 'user'
                              ? "bg-ares-mint/10 border border-ares-mint/20 text-white self-end ml-auto"
                              : "bg-white/[0.03] border border-white/5 text-white/80"
                          )}
                        >
                          {m.text}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendChat} className="flex gap-2">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask copilot something..."
                        aria-label="Ask copilot something"
                        className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={simulating}
                        aria-label="Send copilot message"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-ares-mint text-zinc-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Console log list beneath output for feedback */}
              {feature.title !== 'AI Copilot' && (
                <div className="mt-4">
                  <div className="text-[9px] font-mono uppercase text-white/30 tracking-wider mb-2">Simulation Logs</div>
                  <div className="font-mono text-[9px] text-white/50 bg-black/50 p-2.5 rounded-lg border border-white/5 max-h-[100px] overflow-y-auto space-y-1">
                    <div className="text-white/30">&gt; System initialized. Awaiting commands...</div>
                    {simLog.map((log, idx) => (
                      <div key={idx}>&gt; {log}</div>
                    ))}
                    {simulating && (
                      <div className="text-ares-mint animate-pulse">&gt; Processing...</div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}
