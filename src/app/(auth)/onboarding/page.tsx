'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, ArrowLeft, Check, Globe, Link as LinkIcon, Languages, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/context/providers';

const steps = [
  { id: 1, title: 'Usage', icon: <Globe className="w-4 h-4" /> },
  { id: 2, title: 'Exposure', icon: <LinkIcon className="w-4 h-4" /> },
  { id: 3, title: 'Language', icon: <Languages className="w-4 h-4" /> },
  { id: 4, title: 'Awareness', icon: <ShieldAlert className="w-4 h-4" /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    primaryUse: 'Online Banking & Payments',
    linkFrequency: 'Sometimes',
    language: 'English',
    awarenessLevel: 'Intermediate'
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save user profile setup
      const langCode = formData.language === 'తెలుగు' ? 'te' : formData.language === 'हिंदी' ? 'hi' : 'en';
      const awareness = (formData.awarenessLevel.toLowerCase() as any) || 'intermediate';
      updateUser({
        language: langCode,
        awarenessLevel: awareness,
        securityScore: awareness === 'advanced' ? 85 : awareness === 'intermediate' ? 70 : 55
      });
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.primaryUse !== '';
      case 2: return formData.linkFrequency !== '';
      case 3: return formData.language !== '';
      case 4: return formData.awarenessLevel !== '';
      default: return false;
    }
  };

  // Step 1: Internet Primary Use
  const Step1 = () => (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-mono uppercase text-cyan-400">Step 1 of 4</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">What do you primarily use the internet for?</h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">Helps SafeGuard AI calibrate your threat vulnerability model.</p>
      </div>

      <div className="space-y-2.5 pt-2">
        {[
          { title: 'Online Banking & UPI Payments', desc: 'NetBanking, Google Pay, PhonePe, Paytm, Cards' },
          { title: 'Online Shopping & E-Commerce', desc: 'Amazon, Flipkart, specialized shopping platforms' },
          { title: 'Work, Freelance & Business Operations', desc: 'Corporate emails, cloud drives, invoices, invoices' },
          { title: 'Social Media & Daily Messaging', desc: 'WhatsApp, Telegram, Instagram, X (Twitter)' },
          { title: 'Education & General Browsing', desc: 'Research, university portals, job searches' }
        ].map((option) => (
          <label 
            key={option.title} 
            onClick={() => setFormData(prev => ({ ...prev, primaryUse: option.title }))}
            className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
              formData.primaryUse === option.title 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                : 'border-[#1D3038] bg-[#050A0F] hover:border-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
              formData.primaryUse === option.title ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
            }`}>
              {formData.primaryUse === option.title && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-100 block">{option.title}</span>
              <span className="text-[11px] text-slate-400 font-mono">{option.desc}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  // Step 2: Exposure to Unknown Links
  const Step2 = () => (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-mono uppercase text-cyan-400">Step 2 of 4</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Do you frequently receive unknown links?</h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">Assesses exposure rate to smishing, fake lottery SMS, and courier alerts.</p>
      </div>

      <div className="space-y-2.5 pt-2">
        {[
          { val: 'Very Often', desc: 'Daily or multiple times a week via SMS, WhatsApp groups, or unknown emails' },
          { val: 'Sometimes', desc: 'A few times a month, mostly courier updates or bank KYC messages' },
          { val: 'Rarely', desc: 'Occasional spam that is caught by default filters' },
          { val: 'Never / Not Sure', desc: 'I strictly avoid clicking or do not monitor incoming unknown links' }
        ].map((option) => (
          <label 
            key={option.val}
            onClick={() => setFormData(prev => ({ ...prev, linkFrequency: option.val }))}
            className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
              formData.linkFrequency === option.val 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                : 'border-[#1D3038] bg-[#050A0F] hover:border-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
              formData.linkFrequency === option.val ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
            }`}>
              {formData.linkFrequency === option.val && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-100 block">{option.val}</span>
              <span className="text-[11px] text-slate-400 font-mono">{option.desc}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  // Step 3: Preferred Language
  const Step3 = () => (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-mono uppercase text-cyan-400">Step 3 of 4</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Preferred Language</h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">SafeGuard AI provides native plain-language explanations in your language.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
        {[
          { name: 'English', sub: 'English Language', badge: 'Default' },
          { name: 'తెలుగు', sub: 'Telugu Language', badge: 'దక్షిణ భారతం' },
          { name: 'हिंदी', sub: 'Hindi Language', badge: 'उत्तर भारत' }
        ].map((option) => (
          <label 
            key={option.name}
            onClick={() => setFormData(prev => ({ ...prev, language: option.name }))}
            className={`flex flex-col justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
              formData.language === option.name 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                : 'border-[#1D3038] bg-[#050A0F] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0E171F] text-cyan-400 border border-[#1D3038]">
                {option.badge}
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                formData.language === option.name ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
              }`}>
                {formData.language === option.name && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">{option.name}</span>
              <span className="text-xs text-slate-400 font-mono mt-1 block">{option.sub}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  // Step 4: Security Awareness Level
  const Step4 = () => (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-mono uppercase text-cyan-400">Step 4 of 4</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Your Security Awareness Level</h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">Determines the depth of technical breakdowns vs. simplified analogies.</p>
      </div>

      <div className="space-y-3 pt-2">
        {[
          { value: 'Beginner', desc: 'I am new to cybersecurity. Explain threats in simple terms with everyday analogies.', score: 'Initial Score: 55/100' },
          { value: 'Intermediate', desc: 'I understand common phishing tactics but want AI validation and risk breakdown.', score: 'Initial Score: 70/100' },
          { value: 'Advanced', desc: 'Technical user/SOC operator. Show DNS, header analysis, SSL certs, and entropy.', score: 'Initial Score: 85/100' }
        ].map((option) => (
          <label 
            key={option.value}
            onClick={() => setFormData(prev => ({ ...prev, awarenessLevel: option.value }))}
            className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
              formData.awarenessLevel === option.value 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                : 'border-[#1D3038] bg-[#050A0F] hover:border-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 mt-1 flex-shrink-0 ${
              formData.awarenessLevel === option.value ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
            }`}>
              {formData.awarenessLevel === option.value && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100">{option.value}</span>
                <span className="text-[10px] font-mono text-cyan-400">{option.score}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{option.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-[#060D13] text-slate-100 relative font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <Shield className="w-7 h-7 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-white">SAFEGUARD AI</span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">Operator Profile Setup</span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#1D3038] -z-10" />
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center bg-[#060D13] px-2">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    step.id < currentStep 
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]' 
                      : step.id === currentStep 
                        ? 'bg-[#0E171F] text-cyan-400 border-2 border-cyan-400 ring-4 ring-cyan-400/20'
                        : 'bg-[#0E171F] border border-[#1D3038] text-slate-500'
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : step.icon}
                </div>
                <span className={`text-[10px] font-mono mt-1 font-semibold ${
                  step.id <= currentStep ? 'text-cyan-400' : 'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <motion.div 
          layout
          className="w-full bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl min-h-[420px] flex flex-col justify-between"
        >
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
                {currentStep === 4 && <Step4 />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1D3038]">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                currentStep === 1 
                  ? 'text-slate-600 cursor-not-allowed opacity-40' 
                  : 'text-slate-300 hover:text-white hover:bg-[#111C24] border border-[#1D3038]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-40"
            >
              <span>{currentStep === 4 ? 'Launch SafeGuard Dashboard' : 'Continue'}</span>
              {currentStep === 4 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
