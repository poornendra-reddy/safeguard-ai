'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Shield, EyeOff, Server, 
  Key, Activity, AlertTriangle, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Server,
      title: 'Secure Data Handling',
      description: 'Your data is processed in secure, isolated environments. We employ strict access controls and regular audits to ensure your information remains confidential and protected against unauthorized access.'
    },
    {
      icon: EyeOff,
      title: 'Minimal Data Collection',
      description: 'We believe in data minimization. SafeGuard AI only collects the essential information required to analyze threats and provide you with actionable security insights.'
    },
    {
      icon: Lock,
      title: 'Encryption in Transit',
      description: 'All communications between your device and our servers are encrypted using industry-standard TLS protocols, ensuring your data is protected from interception.'
    },
    {
      icon: Key,
      title: 'Authentication',
      description: 'We utilize robust JWT-based authentication mechanisms to verify user identities securely, preventing unauthorized account access and maintaining session integrity.'
    },
    {
      icon: Activity,
      title: 'API Security',
      description: 'Our APIs are fortified with rate limiting, strict input validation, and continuous monitoring to thwart malicious activities and ensure consistent service availability.'
    },
    {
      icon: Shield,
      title: 'Your Privacy Controls',
      description: 'You are in control. Manage your data sharing preferences, view your analysis history, or delete your account entirely from the settings dashboard.',
      link: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 pt-8 pb-4">
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-2">
            <Lock className="w-10 h-10 text-cyan-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Privacy & Security</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            At SafeGuard AI, protecting your digital assets is our core mission. 
            Learn how we secure your data and respect your privacy.
          </p>
        </div>

        {/* Disclaimer Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 flex items-start space-x-4 shadow-sm"
        >
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-500 mb-2">Important Disclaimer</h3>
            <p className="text-amber-700 dark:text-amber-400/90 leading-relaxed">
              AI analysis provides risk indicators and should not be considered an absolute guarantee that content is safe or malicious. Always exercise personal judgment and follow official cybersecurity guidelines. SafeGuard AI is a tool to assist, not a replacement for comprehensive security practices.
            </p>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-500">
                <section.icon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-cyan-500 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {section.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                {section.description}
              </p>
              
              {section.link && (
                <Link href={section.link} className="mt-6 flex items-center text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Manage Controls <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer info */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: October 2023 • Have questions? Contact our <a href="#" className="text-cyan-500 hover:underline">security team</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
