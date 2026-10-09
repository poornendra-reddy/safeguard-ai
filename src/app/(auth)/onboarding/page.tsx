'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, ArrowLeft, Check, Globe, Link as LinkIcon, Languages, ShieldAlert } from 'lucide-react';

const steps = [
  { id: 1, title: 'Usage', icon: <Globe className="w-5 h-5" /> },
  { id: 2, title: 'Exposure', icon: <LinkIcon className="w-5 h-5" /> },
  { id: 3, title: 'Language', icon: <Languages className="w-5 h-5" /> },
  { id: 4, title: 'Awareness', icon: <ShieldAlert className="w-5 h-5" /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    primaryUse: '',
    linkFrequency: '',
    language: '',
    awarenessLevel: ''
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete setup
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // Step Content Components
  const Step1 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">What do you primarily use the internet for?</h2>
      {['Social Media', 'Online Banking', 'Shopping', 'Work/Business', 'Education', 'All of the above'].map((option) => (
        <label key={option} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.primaryUse === option ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700'}`}>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${formData.primaryUse === option ? 'border-cyan-500' : 'border-gray-400'}`}>
            {formData.primaryUse === option && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />}
          </div>
          <span className="font-medium">{option}</span>
        </label>
      ))}
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Do you frequently receive unknown links?</h2>
      {['Very Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
        <label key={option} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.linkFrequency === option ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700'}`}>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${formData.linkFrequency === option ? 'border-cyan-500' : 'border-gray-400'}`}>
            {formData.linkFrequency === option && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />}
          </div>
          <span className="font-medium">{option}</span>
        </label>
      ))}
    </div>
  );

  const Step3 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Preferred Language</h2>
      {['English', 'తెలుగు', 'हिंदी'].map((option) => (
        <label key={option} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.language === option ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700'}`}>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${formData.language === option ? 'border-cyan-500' : 'border-gray-400'}`}>
            {formData.language === option && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />}
          </div>
          <span className="font-medium text-lg">{option}</span>
        </label>
      ))}
    </div>
  );

  const Step4 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your security awareness level</h2>
      {[
        { value: 'Beginner', desc: 'I want everything automated for me.' },
        { value: 'Intermediate', desc: 'I know basics but need advanced protection.' },
        { value: 'Advanced', desc: 'I want fine-grained control over security.' }
      ].map((option) => (
        <label key={option.value} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${formData.awarenessLevel === option.value ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700'}`}>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${formData.awarenessLevel === option.value ? 'border-cyan-500' : 'border-gray-400'}`}>
            {formData.awarenessLevel === option.value && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />}
          </div>
          <div>
            <span className="font-bold block mb-1">{option.value}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{option.desc}</span>
          </div>
        </label>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-10">
          <Shield className="w-10 h-10 text-cyan-500" />
          <span className="text-3xl font-bold">TrustNetra</span>
        </div>

        {/* Progress Tracker */}
        <div className="w-full mb-12">
          <div className="flex justify-between items-center mb-4 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10" />
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    step.id < currentStep 
                      ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                      : step.id === currentStep 
                        ? 'bg-cyan-600 text-white ring-4 ring-cyan-500/30'
                        : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400'
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                <span className={`text-xs font-medium ${step.id <= currentStep ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <motion.div 
          layout
          className="w-full bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl min-h-[400px] flex flex-col"
        >
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
                {currentStep === 4 && <Step4 />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed opacity-50' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] ${
                !isStepValid()
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed shadow-none hover:shadow-none'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
            >
              {currentStep === 4 ? 'Complete Setup' : 'Continue'}
              {currentStep !== 4 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
