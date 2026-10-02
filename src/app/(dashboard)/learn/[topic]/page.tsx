'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  MailWarning,
  Lock,
  Smartphone,
  Wifi,
  CreditCard,
  Key,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { EDUCATION_TOPICS } from '@/lib/constants';

const iconMap: Record<string, React.ElementType> = {
  MailWarning,
  Lock,
  Smartphone,
  Wifi,
  CreditCard,
  Key,
  ShieldAlert,
};

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = EDUCATION_TOPICS.find(t => t.id === params.topic);

  if (!topic) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Topic Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The education module you are looking for does not exist.</p>
        <Link href="/learn" className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Education Center
        </Link>
      </div>
    );
  }

  const Icon = iconMap[topic.icon] || ShieldAlert;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20">
      <Link href="/learn" className="inline-flex items-center text-gray-500 hover:text-cyan-500 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Learning Center
      </Link>

      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center shrink-0">
          <Icon className="w-8 h-8 text-cyan-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{topic.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{topic.description}</p>
        </div>
      </div>

      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What is {topic.title}?</h2>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            {topic.content?.explanation || `Learn the essential concepts and mechanisms behind ${topic.title}. Understanding this threat is the first step in protecting yourself and your organization.`}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Real-World Example
          </h2>
          <p className="text-amber-800 dark:text-amber-200/80 leading-relaxed">
            {topic.content?.realWorldExample || "A user receives an urgent email claiming their account will be suspended unless they verify their details immediately. The link goes to a fake login page that steals their credentials."}
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Warning Signs</h2>
          <ul className="space-y-3">
            {(topic.content?.warningSigns || ['Sense of urgency', 'Unfamiliar sender', 'Requests for sensitive info', 'Poor grammar or spelling']).map((sign: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.section initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-emerald-900 dark:text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> What You Should Do
            </h2>
            <ul className="space-y-3">
              {(topic.content?.doList || topic.content?.dos || ['Verify the source independently', 'Use 2FA', 'Keep software updated']).map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-emerald-800 dark:text-emerald-200/80">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-400 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> What You Should NOT Do
            </h2>
            <ul className="space-y-3">
              {(topic.content?.dontList || topic.content?.donts || ['Click unknown links', 'Download suspicious attachments', 'Share passwords']).map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-red-800 dark:text-red-200/80">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/learn" className="px-6 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors w-full sm:w-auto text-center">
          Back to Education Center
        </Link>
        <Link href="/quiz" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2">
          <GraduationCap className="w-5 h-5" /> Test Your Knowledge
        </Link>
      </div>
    </div>
  );
}
