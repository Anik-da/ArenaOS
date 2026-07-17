'use client';

import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import CustomCursor from '@/components/cursor/CustomCursor';
import AnimatedBackground from '@/components/background/AnimatedBackground';
import BootLoader from '@/components/loader/BootLoader';
import FloatingNav from '@/components/nav/FloatingNav';
import Hero from '@/components/hero/Hero';
import Features from '@/components/features/Features';
import CommandCenter from '@/components/command/CommandCenter';
import DigitalTwin from '@/components/twin/DigitalTwin';
import Analytics from '@/components/analytics/Analytics';
import CopilotSection from '@/components/copilot/CopilotSection';
import Footer from '@/components/footer/Footer';
import SectionTransition from '@/components/primitives/SectionTransition';

export default function Home() {
  return (
    <SmoothScrollProvider>
      <BootLoader />
      <AnimatedBackground />
      <CustomCursor />
      <FloatingNav />

      <main className="relative">
        <Hero />
        
        <div className="section-divider" />
        <SectionTransition preset="fade-scale">
          <Features />
        </SectionTransition>
        
        <div className="section-divider" />
        <SectionTransition preset="curtain-reveal">
          <CommandCenter />
        </SectionTransition>
        
        <div className="section-divider" />
        <SectionTransition preset="fade-scale">
          <DigitalTwin />
        </SectionTransition>
        
        <div className="section-divider" />
        <SectionTransition preset="curtain-reveal">
          <Analytics />
        </SectionTransition>
        
        <div className="section-divider" />
        <SectionTransition preset="fade-scale">
          <CopilotSection />
        </SectionTransition>
        
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
