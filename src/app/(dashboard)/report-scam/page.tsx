'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReportScamPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reference, setReference] = useState('');

  const [formData, setFormData] = useState({
    type: '',
    description: '',
    evidenceUrl: '',
    contact: ''
  });

  const [errors, setErrors] = useState({
    type: false,
    description: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {
      type: !formData.type,
      description: !formData.description.trim()
    };
    
    setErrors(newErrors);
    
    if (newErrors.type || newErrors.description) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setReference(`RPT-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({ type: '', description: '', evidenceUrl: '', contact: '' });
    setIsSuccess(false);
    setReference('');
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-10 text-center backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Thank you for your report</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Your report helps improve our threat intelligence and protects other users from similar attacks.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8 max-w-sm mx-auto border border-gray-100 dark:border-gray-700">
            <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Report Reference Number</span>
            <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">{reference}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Submit Another Report
            </button>
            <Link 
              href="/"
              className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors shadow-lg shadow-cyan-500/20"
            >
              Return to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/20 rounded-xl">
          <Flag className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Report a Scam</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Help improve threat intelligence by reporting suspicious content</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-gray-200/20 dark:shadow-black/20"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Type <span className="text-red-500">*</span>
            </label>
            <select 
              value={formData.type}
              onChange={(e) => {
                setFormData({...formData, type: e.target.value});
                if (errors.type) setErrors({...errors, type: false});
              }}
              className={`w-full bg-gray-50 dark:bg-gray-800 border ${errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-cyan-500'} rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2`}
            >
              <option value="">Select the type of threat...</option>
              <option value="URL">Suspicious URL / Website</option>
              <option value="PHONE">Phone Number (Call/SMS)</option>
              <option value="EMAIL">Email Address</option>
              <option value="MESSAGE">Direct Message / Chat</option>
              <option value="SOCIAL">Social Media Account</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Report type is required</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => {
                setFormData({...formData, description: e.target.value});
                if (errors.description) setErrors({...errors, description: false});
              }}
              rows={4}
              placeholder="Please provide details about the suspicious activity..."
              className={`w-full bg-gray-50 dark:bg-gray-800 border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-cyan-500'} rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 resize-none`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Description is required</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Evidence URL <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input 
              type="url"
              value={formData.evidenceUrl}
              onChange={(e) => setFormData({...formData, evidenceUrl: e.target.value})}
              placeholder="https://..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Evidence <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-500 mx-auto mb-3 transition-colors" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="text-cyan-500 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
              <input type="file" className="hidden" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Information <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input 
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
              placeholder="Email or phone number if we need to follow up"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting Report...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
