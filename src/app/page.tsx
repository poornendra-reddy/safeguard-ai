'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Menu, X, Sun, Moon, ArrowRight, Activity, Search, Mail, FileText, QrCode, Globe,
  ShieldCheck, AlertTriangle, AlertCircle, MessageSquare, CreditCard, Briefcase, Gift, ShoppingCart, Bug,
  ChevronDown, Lock, CheckCircle2, Languages, Link as LinkIcon
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default dark theme

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                  <Shield className="w-6 h-6 text-cyan-500" />
                </div>
                <span className="font-bold text-xl tracking-tight">SafeGuard AI</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-cyan-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-cyan-500 transition-colors">How It Works</a>
              <a href="#threats" className="text-sm font-medium hover:text-cyan-500 transition-colors">Threats</a>
              <a href="#faq" className="text-sm font-medium hover:text-cyan-500 transition-colors">FAQ</a>
              
              <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-gray-800 pl-4">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
                <Link 
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-gray-600 dark:text-gray-400">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-400">
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
              className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
            >
              <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Features</a>
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">How It Works</a>
                <a href="#threats" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Threats</a>
                <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">FAQ</a>
                <Link href="/login" className="block text-center px-4 py-2 mt-4 text-base font-medium text-white bg-cyan-500 rounded-lg">Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features */}
      <FeaturesSection />

      {/* AI Engine Pipeline */}
      <AIEngineSection />

      {/* Supported Threats */}
      <ThreatsSection />

      {/* Why Us */}
      <WhyUsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />

    </div>
  );
}

// ---------------- Components ---------------- //

function HeroSection() {
  const [analysisState, setAnalysisState] = useState(0); // 0: Idle, 1: Analyzing, 2: Threat Detected
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cycleAnimation = () => {
      setAnalysisState(0);
      setProgress(0);
      
      setTimeout(() => {
        setAnalysisState(1);
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += Math.floor(Math.random() * 15) + 5;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            setTimeout(() => setAnalysisState(2), 500);
          }
          setProgress(currentProgress);
        }, 150);
      }, 1000);
    };

    cycleAnimation();
    const mainInterval = setInterval(cycleAnimation, 8000);
    return () => clearInterval(mainInterval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              <span>Next-Gen Cybersecurity AI</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Think Before You <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Click.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              AI-powered protection against phishing, fake links, malicious websites, and online scams. Secure your digital life instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard" className="inline-flex justify-center items-center gap-2 px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105">
                Analyze Now <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" className="inline-flex justify-center items-center gap-2 px-8 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-cyan-500/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold">
                Explore Protection
              </a>
            </div>
          </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Submit Content", desc: "Paste a URL, text message, or upload a screenshot/QR code.", icon: <FileText className="w-6 h-6" /> },
    { num: "02", title: "AI Analysis", desc: "Our models extract features and cross-reference threat intelligence.", icon: <Activity className="w-6 h-6" /> },
    { num: "03", title: "Threat Detection", desc: "Instantly identify phishing, malware, or scams with high precision.", icon: <Search className="w-6 h-6" /> },
    { num: "04", title: "Safety Recommendation", desc: "Get clear advice on whether to proceed or block the content.", icon: <ShieldCheck className="w-6 h-6" /> }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white/50 dark:bg-gray-900/20 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How SafeGuard Works</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Seamless protection in milliseconds. Just input the suspicious content, and let AI do the heavy lifting.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="text-5xl font-extrabold text-gray-100 dark:text-gray-800/50 absolute top-4 right-4 z-0 pointer-events-none transition-colors group-hover:text-cyan-500/10">
                {step.num}
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "URL Scanner", desc: "Analyze links for phishing, malware distribution, and domain reputation before clicking.", icon: <Globe className="w-6 h-6" />, href: "/analyze/url" },
    { title: "Message Analyzer", desc: "Detect smishing (SMS phishing) and social engineering in text messages and DMs.", icon: <MessageSquare className="w-6 h-6" />, href: "/analyze/message" },
    { title: "Email Checker", desc: "Extract and verify email headers, sender domains, and typical phishing language.", icon: <Mail className="w-6 h-6" />, href: "/analyze/email" },
    { title: "Screenshot OCR", desc: "Extract text from screenshots of suspicious messages or emails for AI analysis.", icon: <Search className="w-6 h-6" />, href: "/analyze/screenshot" },
    { title: "QR Code Detector", desc: "Safely decode and analyze embedded URLs in QR codes without opening them.", icon: <QrCode className="w-6 h-6" />, href: "/analyze/qr" },
    { title: "Website Safety", desc: "Real-time assessment of website content and structure to detect impersonation.", icon: <Shield className="w-6 h-6" />, href: "/analyze/website" }
  ];

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Protection</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Click any tool below to launch instant AI-powered threat analysis.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Link key={idx} href={feature.href} className="block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 hover:border-cyan-500 transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] group cursor-pointer h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    {feature.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{feature.desc}</p>
                </div>
                <div className="text-xs font-semibold text-cyan-500 group-hover:text-cyan-400 flex items-center gap-1">
                  Launch Scanner <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIEngineSection() {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Inside the AI Detection Engine</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Multi-layered analysis ensures maximum accuracy and minimal false positives.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Hidden on Mobile) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-gray-300 via-cyan-500 to-gray-300 dark:from-gray-800 dark:via-cyan-500 dark:to-gray-800 transform -translate-y-1/2 z-0 opacity-50"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
            {[
              { label: 'Input', icon: <FileText className="w-5 h-5" /> },
              { label: 'Feature Extraction', icon: <Activity className="w-5 h-5" /> },
              { label: 'NLP Models', icon: <MessageSquare className="w-5 h-5" /> },
              { label: 'Threat Intel', icon: <Database className="w-5 h-5" /> },
              { label: 'Risk Scoring', icon: <Activity className="w-5 h-5" /> },
              { label: 'Verdict', icon: <ShieldCheck className="w-5 h-5" /> }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-950 border-2 border-cyan-500 flex items-center justify-center text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-3 z-10 relative">
                  {step.icon}
                  {idx < 5 && <div className="md:hidden absolute top-full h-4 w-0.5 bg-cyan-500"></div>}
                </div>
                <div className="text-center text-sm font-semibold">{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper icon component for AI engine
function Database(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  );
}

function ThreatsSection() {
  const threats = [
    { name: "Phishing URLs", icon: <Globe className="w-5 h-5" /> },
    { name: "Smishing (SMS)", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "Fake Websites", icon: <AlertTriangle className="w-5 h-5" /> },
    { name: "Banking Scams", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Job Scams", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Lottery Scams", icon: <Gift className="w-5 h-5" /> },
    { name: "Shopping Scams", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Malware Links", icon: <Bug className="w-5 h-5" /> }
  ];

  return (
    <section id="threats" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Threat Detections</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">We identify a wide array of cyber threats using continuously updated machine learning models.</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {threats.map((threat, idx) => (
            <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full shadow-sm hover:border-cyan-500 transition-colors">
              <span className="text-red-500">{threat.icon}</span>
              <span className="font-medium text-sm">{threat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



function WhyUsSection() {
  const usps = [
    { title: "AI-Powered Detection", desc: "Our machine learning models adapt to new, unseen threats in real-time, catching what traditional blacklists miss.", icon: <Activity className="w-8 h-8" /> },
    { title: "Simple Explanations", desc: "We don't just say 'malicious'. We explain exactly why a link or message is dangerous in plain language.", icon: <MessageSquare className="w-8 h-8" /> },
    { title: "Multi-Language Support", desc: "Scam detection works across regional languages, perfect for local banking and job frauds.", icon: <Languages className="w-8 h-8" /> }
  ];

  return (
    <section className="py-24 bg-white/50 dark:bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SafeGuard AI?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {usps.map((usp, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="p-4 bg-cyan-500/10 text-cyan-500 rounded-full mb-6">
                {usp.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{usp.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "How accurate is the AI detection?", a: "Our models currently operate at 98.5% accuracy, constantly learning from new threats and analyzing hundreds of data points including URL structure, domain age, and page content." },
    { q: "Is my submitted data kept private?", a: "Yes. We process data strictly for threat analysis. URLs and texts are hashed, and we do not store sensitive personal information from your submissions." },
    { q: "Can it detect zero-day phishing sites?", a: "Absolutely. Unlike traditional scanners that rely on known blacklists, our AI analyzes the actual structure and behavior of a site, allowing us to catch new phishing campaigns instantly." },
    { q: "Does it work with SMS messages?", a: "Yes, our Message Analyzer is specifically trained to detect common smishing (SMS phishing) patterns, urgent tone manipulation, and malicious shortlinks." },
    { q: "Is it free to use?", a: "We offer a robust free tier for individual users. We also have premium plans with API access and higher rate limits for businesses." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="font-semibold">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800/50 pt-4">
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

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-cyan-950"></div>
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start Protecting Yourself Today</h2>
        <p className="text-xl text-cyan-100 mb-10 opacity-90">Don't wait until you've clicked a bad link. Get real-time AI analysis for all your suspicious messages and URLs.</p>
        <Link href="/register" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105">
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="mt-8 flex items-center justify-center gap-6 text-cyan-200/60 text-sm font-medium">
          <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> No credit card required</div>
          <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Instant setup</div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-cyan-500" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">SafeGuard AI</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Detect. Understand. Stay Safe. AI-powered protection against modern digital threats.
            </p>
            <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
              Built for a safer digital India.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/dashboard" className="hover:text-cyan-500 transition-colors">URL Scanner</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-500 transition-colors">Message Scanner</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-500 transition-colors">Email Analyzer</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-500 transition-colors">QR Scanner</Link></li>
              <li><Link href="#" className="hover:text-cyan-500 transition-colors">Education Hub</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-cyan-500 transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-cyan-500 transition-colors">API Documentation</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2026 SafeGuard AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Placeholders */}
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-cyan-500 hover:text-white transition-colors">X</a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-cyan-500 hover:text-white transition-colors">in</a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-cyan-500 hover:text-white transition-colors">gh</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
