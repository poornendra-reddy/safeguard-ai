'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Search, Filter, ArrowRight, ShieldAlert, MailWarning, Lock, Smartphone, Wifi, CreditCard, Key } from 'lucide-react';
import Link from 'next/link';
import { EDUCATION_TOPICS } from '@/lib/constants';

// Map string icons to Lucide components
const iconMap: Record<string, React.ElementType> = {
  MailWarning,
  Lock,
  Smartphone,
  Wifi,
  CreditCard,
  Key,
  ShieldAlert,
};

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Basics', 'Threats', 'Privacy', 'Network'];

  const filteredTopics = EDUCATION_TOPICS.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || topic.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTopic = EDUCATION_TOPICS.find(t => t.id === 'phishing') || EDUCATION_TOPICS[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8 text-cyan-500" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Security Education Center</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Learn to protect yourself from cyber threats and stay safe online.</p>
      </div>

      {/* Featured Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-gradient-to-br from-cyan-500/10 via-emerald-500/5 to-transparent border border-cyan-500/20 rounded-2xl overflow-hidden p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium">
            <ShieldAlert className="w-4 h-4" /> Featured Topic
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{featuredTopic.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl">{featuredTopic.description}</p>
          <Link href={`/learn/${featuredTopic.id}`} className="inline-flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors">
            Start Learning <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        <div className="w-full md:w-1/3">
           <div className="aspect-square bg-gray-900/40 rounded-2xl border border-gray-800/50 backdrop-blur-xl flex items-center justify-center p-8">
              {React.createElement(iconMap[featuredTopic.icon] || ShieldAlert, { className: "w-32 h-32 text-cyan-500/50" })}
           </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-900 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic, i) => {
          const Icon = iconMap[topic.icon] || ShieldAlert;
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/learn/${topic.id}`} className="block h-full group">
                <div className="h-full bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 group-hover:bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{topic.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-3">{topic.description}</p>
                  
                  <div className="mt-auto flex items-center text-cyan-500 font-medium text-sm group-hover:text-cyan-400">
                    Learn More <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No topics found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
