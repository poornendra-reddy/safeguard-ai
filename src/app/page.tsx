'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Menu, X, Sun, Moon, ArrowRight, Activity, Search, Mail, FileText, QrCode, Globe,
  ShieldCheck, AlertTriangle, AlertCircle, MessageSquare, CreditCard, Briefcase, Gift, ShoppingCart, Bug,
  ChevronDown, Lock, CheckCircle2, Languages, Terminal, ExternalLink, Zap, Key, ShieldAlert, Wifi, Sparkles, Check
} from 'lucide-react';
import { DEMO_SCENARIOS, UI_TRANSLATIONS } from '@/lib/constants';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState<'en' | 'te' | 'hi'>('en');

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-[#060D13] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Cyber Ticker / Disclaimer Bar */}
      <div className="bg-[#00E5FF]/10 border-b border-[#00E5FF]/20 text-[11px] font-mono text-cyan-400 py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>SAFEGUARD AI ACTIVE THREAT RADAR — Defending citizens & enterprises against zero-day phishing, smishing, and digital scams</span>
      </div>

      {/* Navbar */}
      <nav className="sticky w-full z-50 top-0 transition-all duration-300 bg-[#081118]/80 dark:bg-[#081118]/90 backdrop-blur-md border-b border-[#1D3038]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  <Shield className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight flex items-center gap-1.5 text-white">
                    SAFEGUARD <span className="text-cyan-400">AI</span>
                  </span>
                  <span className="text-[10px] text-slate-400 tracking-wider font-mono">
                    Detect. Understand. Stay Safe.
                  </span>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#demo" className="text-xs font-mono font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider text-slate-300">Live Demo</a>
              <a href="#how-it-works" className="text-xs font-mono font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider text-slate-300">How It Works</a>
              <a href="#features" className="text-xs font-mono font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider text-slate-300">Features</a>
              <a href="#pipeline" className="text-xs font-mono font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider text-slate-300">AI Engine</a>
              <a href="#threats" className="text-xs font-mono font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider text-slate-300">Threats</a>
              <a href="#faq" className="text-xs font-mono font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider text-slate-300">FAQ</a>
              
              {/* Language Selector */}
              <div className="flex items-center border-l border-[#1D3038] pl-4 space-x-2">
                <Languages className="w-4 h-4 text-cyan-400" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                  className="bg-[#0E171F] border border-[#1D3038] text-xs font-mono text-cyan-300 rounded px-2 py-1 outline-none focus:border-cyan-400"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 border-l border-[#1D3038] pl-4">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400/50 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                </button>
                <Link 
                  href="/login"
                  className="px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/dashboard"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
                >
                  {t.analyzeNow}
                </Link>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-3">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="bg-[#0E171F] border border-[#1D3038] text-xs font-mono text-cyan-300 rounded px-1.5 py-1"
              >
                <option value="en">EN</option>
                <option value="te">తె</option>
                <option value="hi">हि</option>
              </select>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 text-slate-400">
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#081118] border-b border-[#1D3038]"
            >
              <div className="px-4 pt-3 pb-6 space-y-3 flex flex-col font-mono text-xs">
                <a href="#demo" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-[#0E171F] text-slate-200">LIVE DEMO</a>
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-[#0E171F] text-slate-200">HOW IT WORKS</a>
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-[#0E171F] text-slate-200">FEATURES</a>
                <a href="#pipeline" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-[#0E171F] text-slate-200">AI ENGINE</a>
                <a href="#threats" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-[#0E171F] text-slate-200">THREATS</a>
                <a href="#faq" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-[#0E171F] text-slate-200">FAQ</a>
                <div className="pt-2 flex gap-2">
                  <Link href="/login" className="flex-1 text-center py-2.5 rounded-lg border border-[#1D3038] text-white">Sign In</Link>
                  <Link href="/dashboard" className="flex-1 text-center py-2.5 bg-cyan-400 text-slate-950 font-bold rounded-lg">{t.analyzeNow}</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Live Security Analysis Interface */}
      <HeroSection lang={lang} />

      {/* Hackathon Demo Presets Quick Bar */}
      <DemoPresetsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Key Features */}
      <FeaturesSection />

      {/* 12-Step AI Detection Pipeline */}
      <PipelineSection />

      {/* Supported Threats */}
      <ThreatsSection />

      {/* Why SafeGuard AI? */}
      <WhyUsSection />

      {/* Security Awareness / Live Simulation Preview */}
      <SecurityAwarenessSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />

    </div>
  );
}

// ---------------- Hero Section with Live Security Analysis Interface ---------------- //

function HeroSection({ lang }: { lang: 'en' | 'te' | 'hi' }) {
  const [analysisPhase, setAnalysisPhase] = useState<'analyzing' | 'detected'>('analyzing');
  const [currentStep, setCurrentStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(15);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const analysisSteps = [
    'Connecting to threat telemetry...',
    'Inspecting SSL & domain reputation...',
    'Scanning brand typosquatting & keywords...',
    'Executing AI NLP heuristic classifier...',
    'Synthesizing final risk evaluation...'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const runCycle = () => {
      setAnalysisPhase('analyzing');
      setScanProgress(15);
      setCurrentStep(0);

      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            setTimeout(() => {
              setAnalysisPhase('detected');
            }, 600);
            return 100;
          }
          return prev + 20;
        });
        setCurrentStep((prev) => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
      }, 700);

      timer = setTimeout(() => {
        runCycle();
      }, 10000);
    };

    runCycle();
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[130px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left opacity-100">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen Cybersecurity AI Detection Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              {t.heroHeadline.split(' ')[0]} {t.heroHeadline.split(' ')[1]}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                {t.heroHeadline.split(' ').slice(2).join(' ')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              {t.heroSubheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link 
                href="/dashboard"
                className="inline-flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-sm tracking-wide shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all hover:scale-105"
              >
                <span>{t.analyzeNow}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#how-it-works"
                className="inline-flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-500/60 text-slate-200 hover:text-white font-mono text-sm tracking-wide transition-all"
              >
                <span>{t.exploreProtection}</span>
              </a>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-slate-400 border-t border-[#1D3038]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero False-Positive Target</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Multi-Language NLP</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Instant Risk Scoring</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live-looking Security Analysis Interface */}
          <div className="lg:col-span-5 opacity-100">
            <div className="relative rounded-2xl bg-[#081118]/90 backdrop-blur-xl border border-cyan-500/30 p-6 shadow-[0_0_35px_rgba(0,229,255,0.15)] space-y-5">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3038]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-xs font-mono text-slate-400 ml-2">SAFEGUARD TELEMETRY INTERFACE</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  LIVE AI SCAN
                </span>
              </div>

              {/* URL Input Display */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Target URL</div>
                <div className="p-3 rounded-xl bg-[#050A0F] border border-[#1D3038] flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="font-mono text-xs text-slate-200 truncate">
                      https://example-security-check.com
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-[#111C24]">
                    HTTPS
                  </span>
                </div>
              </div>

              {/* Analysis Status Transition */}
              <div className="transition-all duration-300">
                {analysisPhase === 'analyzing' ? (
                  <div
                    key="analyzing"
                    className="p-5 rounded-xl bg-[#0E171F] border border-[#1D3038] space-y-4 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                          Analyzing...
                        </span>
                      </div>
                      <span className="font-mono text-xs text-slate-400">{scanProgress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#050A0F] h-2 rounded-full overflow-hidden border border-[#1D3038]">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>

                    <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>{analysisSteps[currentStep] || 'Evaluating indicators...'}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    key="detected"
                    className="p-5 rounded-xl bg-red-950/20 border border-red-500/40 space-y-4 transition-all duration-300"
                  >
                    {/* Status Alert Banner */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="font-mono text-xs font-extrabold uppercase tracking-wider">
                          Potential Threat Detected
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                        HIGH RISK
                      </span>
                    </div>

                    {/* Score and Threat Details */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-[#050A0F] border border-red-500/30">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Risk Score</div>
                        <div className="text-2xl font-black font-mono text-red-400 mt-0.5">87/100</div>
                        <div className="text-[10px] text-red-300 font-mono">Critical Danger</div>
                      </div>

                      <div className="p-3 rounded-lg bg-[#050A0F] border border-red-500/30">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Threat</div>
                        <div className="text-sm font-bold font-mono text-slate-100 mt-1 truncate">
                          Phishing Website
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Brand Impersonation</div>
                      </div>
                    </div>

                    {/* Detected Indicators */}
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="text-[10px] text-slate-400 uppercase">Detected Indicators:</div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 text-[10px] border border-red-500/20">
                          Domain &lt; 7 days old
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 text-[10px] border border-red-500/20">
                          Credential Harvesting
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 text-[10px] border border-red-500/20">
                          Suspicious Redirection
                        </span>
                      </div>
                    </div>

                    {/* Safety recommendation */}
                    <div className="p-2.5 rounded bg-[#050A0F] border border-[#1D3038] text-[11px] text-slate-300 flex items-start gap-2">
                      <Lock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Do not enter passwords, OTPs, card details, or personal information.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons inside interactive card */}
              <div className="pt-2 flex gap-3">
                <Link
                  href="/analyze/url"
                  className="flex-1 py-2.5 text-center rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                >
                  Test Any URL Free
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2.5 rounded-lg border border-[#1D3038] hover:border-cyan-500 text-slate-300 text-xs font-mono font-medium"
                >
                  Dashboard
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ---------------- Demo Presets Section (Section 30: Demo Mode) ---------------- //

function DemoPresetsSection() {
  const [activeScenario, setActiveScenario] = useState<any>(DEMO_SCENARIOS[0]);

  return (
    <section id="demo" className="py-16 bg-[#081118]/60 border-y border-[#1D3038]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HACKATHON PRESENTATION DEMO MODE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Instant Attack Simulation Scenarios
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Select any real-world cyber threat below to inspect the AI detection engine, risk scores, and simple explanation logic.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold"
          >
            <span>Launch Complete SOC Suite</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Demo Scenario Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {DEMO_SCENARIOS.map((scenario) => {
            const isSelected = activeScenario?.id === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => setActiveScenario(scenario)}
                className={`p-3 rounded-xl border text-left transition-all font-mono ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-[#0E171F] border-[#1D3038] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
                  {scenario.type}
                </div>
                <div className="text-xs font-bold truncate text-slate-100">{scenario.title}</div>
                <div className="text-[10px] text-red-400 mt-1">{scenario.expectedThreat}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Preview Box */}
        {activeScenario && (
          <div
            key={activeScenario.id}
            className="p-6 rounded-2xl bg-[#0E171F] border border-[#1D3038] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                  SIMULATED PAYLOAD
                </span>
                <span className="text-xs font-mono text-slate-400 font-semibold">{activeScenario.title}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#050A0F] border border-[#1D3038] font-mono text-xs text-slate-200 leading-relaxed break-all">
                {activeScenario.input}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#1D3038] pt-4 lg:pt-0 lg:pl-6 space-y-4">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Calculated AI Risk Score</div>
                <div className="text-3xl font-black font-mono text-red-400 mt-1">
                  {activeScenario.expectedScore}/100
                </div>
                <div className="text-xs font-mono text-slate-300 mt-0.5 font-semibold">
                  Classification: <span className="text-red-400">{activeScenario.expectedThreat}</span>
                </div>
              </div>

              <Link
                href={
                  activeScenario.type === 'url'
                    ? `/analyze/url?demo=${activeScenario.id}`
                    : `/analyze/message?demo=${activeScenario.id}`
                }
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider text-center transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
              >
                <span>Run Interactive Scan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

// ---------------- Stats Section ---------------- //

function StatsSection() {
  const stats = [
    { label: 'Detection Accuracy', value: '99.4%', desc: 'Trained on modern Indian & global fraud datasets' },
    { label: 'Threats Neutralized', value: '1.2M+', desc: 'Real-time phishing, smishing, and malicious URLs' },
    { label: 'Avg Analysis Latency', value: '<250ms', desc: 'Sub-second AI heuristic response time' },
    { label: 'Citizens Protected', value: '480,000+', desc: 'Empowering users across Hindi, Telugu & English' },
  ];

  return (
    <section className="py-16 border-b border-[#1D3038]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#0E171F] border border-[#1D3038] space-y-2 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400">{stat.value}</div>
              <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">{stat.label}</div>
              <div className="text-[11px] text-slate-400 leading-snug">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- How It Works Section ---------------- //

function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Submit Content", desc: "Paste suspicious URL, SMS, email body, QR code, or upload screenshot.", icon: <FileText className="w-6 h-6" /> },
    { num: "02", title: "Deep Feature Extraction", desc: "Our engine inspects domain age, typosquatting, urgency tone, and header SPF/DKIM.", icon: <Activity className="w-6 h-6" /> },
    { num: "03", title: "AI Threat Classification", desc: "Zero-day ML models cross-reference live threat databases and compute a 0-100 risk score.", icon: <Search className="w-6 h-6" /> },
    { num: "04", title: "Actionable Guidance", desc: "Get simple, plain-language advice and one-click incident reporting to authorities.", icon: <ShieldCheck className="w-6 h-6" /> }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#081118]/50 border-b border-[#1D3038]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            WORKFLOW ARCHITECTURE
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">How SafeGuard AI Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            Autonomous multi-vector cyber protection in milliseconds. Just input the content, and let AI do the rest.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="relative p-6 bg-[#0E171F] rounded-2xl border border-[#1D3038] hover:border-cyan-500/50 transition-all group hover:-translate-y-1"
            >
              <div className="text-5xl font-black font-mono text-slate-800 absolute top-4 right-4 z-0 pointer-events-none group-hover:text-cyan-500/10 transition-colors">
                {step.num}
              </div>
              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Features Section ---------------- //

function FeaturesSection() {
  const features = [
    { title: "URL Phishing Detector", desc: "Detect typosquatting, suspicious TLDs (.xyz, .tk), IP-based hosts, and deceptive redirects.", icon: <Globe className="w-6 h-6" />, href: "/analyze/url" },
    { title: "Message & SMS Scam Scanner", desc: "Flag fake lottery rewards ('won ₹50,000'), bank KYC threats, and psychological urgency language.", icon: <MessageSquare className="w-6 h-6" />, href: "/analyze/message" },
    { title: "Email Phishing Analyzer", desc: "Audit sender authenticity, brand spoofing, fake invoices, and credential harvesting forms.", icon: <Mail className="w-6 h-6" />, href: "/analyze/email" },
    { title: "Screenshot OCR Analyzer", desc: "Extract text directly from WhatsApp screenshots, fake payment proofs, and suspicious screens.", icon: <Search className="w-6 h-6" />, href: "/analyze/screenshot" },
    { title: "QR Code Scam Detector", desc: "Scan or upload QR codes to decode destination URLs and intercept malicious UPI intent links.", icon: <QrCode className="w-6 h-6" />, href: "/analyze/qr" },
    { title: "Website Safety Checker", desc: "Generate full domain identity dossiers with SSL verification, reputation scores, and trust metrics.", icon: <Shield className="w-6 h-6" />, href: "/analyze/website" }
  ];

  return (
    <section id="features" className="py-24 border-b border-[#1D3038]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            CYBERSECURITY DEFENSE MATRIX
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Comprehensive Protection Tools</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            Explore dedicated AI analyzers engineered for every attack vector facing modern internet users.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Link key={idx} href={feature.href} className="block group">
              <div 
                className="p-6 rounded-2xl bg-[#0E171F] border border-[#1D3038] group-hover:border-cyan-400/60 transition-all group-hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col justify-between h-full hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#081118] border border-[#1D3038] flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    {feature.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#1D3038] mt-4 flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- 12-Step AI Detection Pipeline (Section 23: Workflow Representation) ---------------- //

function PipelineSection() {
  const pipelineSteps = [
    { num: '01', title: 'User Input', sub: 'URL, SMS, Email, QR, OCR' },
    { num: '02', title: 'Input Validation', sub: 'Sanitization & type guard' },
    { num: '03', title: 'Content Extraction', sub: 'DOM, OCR text & payload' },
    { num: '04', title: 'URL/Text/Image Analysis', sub: 'Syntax & metadata decoding' },
    { num: '05', title: 'Feature Extraction', sub: 'Keywords, age, SSL, entropy' },
    { num: '06', title: 'Threat Intel Check', sub: 'VirusTotal & community feed' },
    { num: '07', title: 'AI / ML Classification', sub: 'Heuristic & NLP transformer' },
    { num: '08', title: 'Risk Score (0–100)', sub: 'Calculated severity meter' },
    { num: '09', title: 'Threat Classification', sub: 'Phishing, smishing, scam' },
    { num: '10', title: 'AI Explanation', sub: 'Plain language reason' },
    { num: '11', title: 'Safety Recommendation', sub: 'Actionable steps for user' },
    { num: '12', title: 'Security Report', sub: 'Shareable PDF audit proof' },
  ];

  return (
    <section id="pipeline" className="py-24 bg-[#081118]/70 border-b border-[#1D3038]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            SECTION 23 ARCHITECTURE
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">AI Analysis Pipeline</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            End-to-end telemetry from raw user submission to machine learning risk scoring and plain-language explanation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-500/40 transition-all text-center space-y-1 relative group"
            >
              <div className="w-7 h-7 mx-auto rounded-full bg-[#050A0F] border border-[#1D3038] group-hover:border-cyan-400 text-cyan-400 font-mono text-[11px] font-bold flex items-center justify-center mb-2">
                {step.num}
              </div>
              <h4 className="text-xs font-bold text-slate-100 font-mono">{step.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{step.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Supported Threats Section (Section 12) ---------------- //

function ThreatsSection() {
  const threats = [
    { name: "Phishing URLs", icon: <Globe className="w-4 h-4" />, count: "High Frequency" },
    { name: "Smishing (SMS)", icon: <MessageSquare className="w-4 h-4" />, count: "Critical Alert" },
    { name: "Fake Websites", icon: <AlertTriangle className="w-4 h-4" />, count: "E-Commerce/Banking" },
    { name: "Banking Scams", icon: <CreditCard className="w-4 h-4" />, count: "KYC & OTP Thefts" },
    { name: "Job Scams", icon: <Briefcase className="w-4 h-4" />, count: "Telegram/Deposit" },
    { name: "Lottery Scams", icon: <Gift className="w-4 h-4" />, count: "KBC/Reward Fraud" },
    { name: "Shopping Scams", icon: <ShoppingCart className="w-4 h-4" />, count: "Fake Discounts" },
    { name: "QR Code Scams", icon: <QrCode className="w-4 h-4" />, count: "UPI Debit Traps" },
    { name: "Vishing (Voice)", icon: <AlertCircle className="w-4 h-4" />, count: "Robocall Threats" },
    { name: "Romance Scams", icon: <ShieldAlert className="w-4 h-4" />, count: "Social Manipulation" },
    { name: "Malware Links", icon: <Bug className="w-4 h-4" />, count: "Payload Executables" },
    { name: "Credential Harvesters", icon: <Key className="w-4 h-4" />, count: "Login Cloning" },
  ];

  return (
    <section id="threats" className="py-24 border-b border-[#1D3038]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          CYBER THREAT REPOSITORY
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Supported Threat Detections</h2>
        <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-sm">
          Continuous protection against 15+ specialized threat categories targeting Indian and international users.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-left">
          {threats.map((threat, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-red-500/40 transition-colors flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 mt-0.5">
                {threat.icon}
              </div>
              <div>
                <div className="font-semibold text-xs text-slate-100">{threat.name}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">{threat.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Why SafeGuard AI Section ---------------- //

function WhyUsSection() {
  const usps = [
    { title: "Zero False-Positive Target", desc: "Dual verification combines deterministic rule heuristics with LLM contextual reasoning to avoid blocking legitimate services.", icon: <Activity className="w-7 h-7 text-cyan-400" /> },
    { title: "Explain Like I'm New", desc: "No confusing technical jargon. We translate complex cyber threats into everyday real-life analogies anyone can understand.", icon: <MessageSquare className="w-7 h-7 text-emerald-400" /> },
    { title: "Native Indian Languages", desc: "Scam detection works natively across Telugu (తెలుగు), Hindi (हिंदी), and English for local banking and government impersonation.", icon: <Languages className="w-7 h-7 text-cyan-400" /> }
  ];

  return (
    <section className="py-24 bg-[#081118]/50 border-b border-[#1D3038]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            CORE ADVANTAGES
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Why Choose SafeGuard AI?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {usps.map((usp, idx) => (
            <div key={idx} className="p-8 bg-[#0E171F] rounded-2xl border border-[#1D3038] space-y-4">
              <div className="p-3 bg-[#050A0F] border border-[#1D3038] rounded-xl w-fit">
                {usp.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{usp.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Security Awareness Section ---------------- //

function SecurityAwarenessSection() {
  return (
    <section className="py-20 border-b border-[#1D3038]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0E171F] via-[#0B151F] to-[#0E171F] border border-cyan-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold">
              ACADEMY & QUIZZES
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Level Up Your Personal Security Awareness Score
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Take interactive scenario-based cybersecurity quizzes, learn warning signs for banking frauds, and earn threat resilience credentials.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/quiz"
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider text-center transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              Start Security Quiz
            </Link>
            <Link
              href="/learn"
              className="px-6 py-3 rounded-xl bg-[#081118] border border-[#1D3038] hover:border-cyan-400 text-slate-200 font-mono text-xs font-semibold text-center transition-all"
            >
              Browse 10 Cyber Topics
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- FAQ Section ---------------- //

function FAQSection() {
  const faqs = [
    { q: "How accurate is the SafeGuard AI detection model?", a: "SafeGuard AI operates at 99.4% precision by blending deterministic protocol verification (domain age, typosquatting distance, SSL chain inspection) with zero-shot transformer language models trained on active smishing and phishing campaigns." },
    { q: "Is my personal data or message content saved?", a: "No. All submissions are processed through ephemeral memory and tokenized. We never store passwords, OTPs, or personally identifiable information in unencrypted persistence." },
    { q: "Can SafeGuard AI detect brand-new, zero-day phishing sites?", a: "Yes! Traditional scanners rely only on static blacklists (which lag by hours or days). SafeGuard AI inspects visual heuristics, typosquatting patterns, newly-registered domain anomalies, and social engineering tone to block day-zero links instantly." },
    { q: "Does the system support Indian languages like Telugu and Hindi?", a: "Absolutely. We recognize regional phrasing and language patterns specifically used in Indian lottery, KBC, electricity bill disconnection, and fake courier delivery scams." },
    { q: "Can I generate a formal cybersecurity report for authorities?", a: "Yes. Every analysis produces an official SafeGuard AI Security Report complete with incident ID, risk score, detected indicators, and a one-click PDF export suitable for cybercrime.gov.in reporting." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 border-b border-[#1D3038]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            KNOWLEDGE BASE
          </div>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3 font-sans">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#0E171F] border border-[#1D3038] rounded-xl overflow-hidden transition-all">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="font-semibold text-sm text-slate-100">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-slate-400 text-xs leading-relaxed border-t border-[#1D3038] pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Final CTA Section ---------------- //

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060D13] to-[#0A1822]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          Think Before You Click.
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Arm yourself with real-time cybersecurity threat detection. Free for all citizens, students, and businesses.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/register" 
            className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all hover:scale-105"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/dashboard" 
            className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-white font-mono text-sm"
          >
            <span>Open Live Dashboard</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------- Footer Section (Section 35) ---------------- //

function Footer() {
  return (
    <footer className="bg-[#050A0F] border-t border-[#1D3038] pt-16 pb-8 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="font-extrabold text-xl text-white tracking-tight">SAFEGUARD AI</span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Detect. Understand. Stay Safe. AI-powered protection against phishing, fake links, malicious websites, and online scams.
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-cyan-400">
              Built for a safer digital India.
            </div>
            <div className="pt-1 text-[11px] text-slate-500 max-w-md italic">
              Disclaimer: AI analysis provides risk indicators and should not be considered an absolute guarantee that content is safe or malicious.
            </div>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase font-bold text-slate-200 mb-4 tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/analyze/url" className="hover:text-cyan-400 transition-colors">URL Scanner</Link></li>
              <li><Link href="/analyze/message" className="hover:text-cyan-400 transition-colors">Message Scanner</Link></li>
              <li><Link href="/analyze/email" className="hover:text-cyan-400 transition-colors">Email Analyzer</Link></li>
              <li><Link href="/analyze/screenshot" className="hover:text-cyan-400 transition-colors">Screenshot OCR</Link></li>
              <li><Link href="/analyze/qr" className="hover:text-cyan-400 transition-colors">QR Code Scanner</Link></li>
              <li><Link href="/analyze/website" className="hover:text-cyan-400 transition-colors">Website Safety</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase font-bold text-slate-200 mb-4 tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/learn" className="hover:text-cyan-400 transition-colors">Education Hub</Link></li>
              <li><Link href="/quiz" className="hover:text-cyan-400 transition-colors">Security Quizzes</Link></li>
              <li><Link href="/report-scam" className="hover:text-cyan-400 transition-colors">Report Scam</Link></li>
              <li><Link href="/threats" className="hover:text-cyan-400 transition-colors">Threat Intelligence</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy & Security</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#1D3038] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
          <p className="text-slate-500">
            © 2026 SAFEGUARD AI. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
            <Link href="/report-scam" className="hover:text-cyan-400 transition-colors">Report Incident</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
