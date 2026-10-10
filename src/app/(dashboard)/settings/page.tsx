'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme, useAuth } from '@/lib/context/providers';
import { 
  Settings, User, Shield, Bell, Globe, Palette, 
  Lock, AlertTriangle, Smartphone, Download, 
  Trash2, Monitor, CheckCircle, Save
} from 'lucide-react';


const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'account', label: 'Account', icon: Settings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'SOC Operator');
  const [bio, setBio] = useState(user?.bio || 'Cybersecurity enthusiast & digital citizen');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    threat: true,
    weekly: true,
    tips: false
  });

  const [privacy, setPrivacy] = useState({
    shareData: false,
    showAnalysis: true
  });

  const handleSaveProfile = () => {
    updateUser({ name, bio });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownloadData = () => {
    const exportPayload = {
      user: {
        ...user,
        name,
        bio
      },
      exportTimestamp: new Date().toISOString(),
      platform: 'SAFEGUARD AI',
      privacyPreferences: privacy,
      notificationPreferences: notifications
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safeguard-ai-data-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-2xl font-bold border border-cyan-500/30">
                {name?.substring(0, 2)?.toUpperCase() || 'SG'}
              </div>
              <button 
                onClick={() => alert('Avatar upload: Custom profile picture support enabled.')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Change Avatar
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input type="email" defaultValue={user?.email || 'operator@safeguard.ai'} readOnly className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea 
                  rows={3} 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white" 
                />
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                {saveSuccess && (
                  <span className="text-sm text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Profile saved successfully!
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      
      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white" />
                </div>
                <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  Update Password
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Two-Factor Authentication (2FA)</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-start space-x-3">
                  <Smartphone className="w-5 h-5 text-cyan-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Authenticator App</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform" />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Sessions</h2>
              <div className="flex items-center justify-between p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-200 dark:border-cyan-800/50">
                <div className="flex items-start space-x-3">
                  <Monitor className="w-5 h-5 text-cyan-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Windows 11 • Chrome</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hyderabad, India • Current device</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" /> Active
                </span>
              </div>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white capitalize">{key} Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates and alerts via {key}.</p>
                  </div>
                  <button 
                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${value ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'language':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Language Settings</h2>
            <div className="space-y-3">
              {['English', 'తెలుగు (Telugu)', 'हिंदी (Hindi)'].map((lang, idx) => (
                <label key={lang} className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-cyan-500/50 transition-colors">
                  <input type="radio" name="language" defaultChecked={idx === 0} className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 border-gray-300" />
                  <span className="ml-3 font-medium text-gray-900 dark:text-white">{lang}</span>
                </label>
              ))}
            </div>
          </motion.div>
        );

      case 'theme':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`p-6 rounded-xl border-2 text-left transition-all ${theme === 'light' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-cyan-500/50'}`}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Light Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Clean and bright interface.</p>
              </button>
              
              <button 
                onClick={() => setTheme('dark')}
                className={`p-6 rounded-xl border-2 text-left transition-all ${theme === 'dark' ? 'border-cyan-500 bg-cyan-900/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-cyan-500/50'}`}
              >
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Easier on the eyes, sleek look.</p>
              </button>
            </div>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Preferences</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Share Anonymous Data</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve SafeGuard AI by sharing anonymous usage data.</p>
                </div>
                <button 
                  onClick={() => setPrivacy({ ...privacy, shareData: !privacy.shareData })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${privacy.shareData ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${privacy.shareData ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Show Analysis in History</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Keep a record of your past threat analyses.</p>
                </div>
                <button 
                  onClick={() => setPrivacy({ ...privacy, showAnalysis: !privacy.showAnalysis })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${privacy.showAnalysis ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${privacy.showAnalysis ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleDownloadData}
                  className="flex items-center justify-center space-x-2 px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download My Data (JSON)</span>
                </button>
                <button 
                  onClick={() => confirm('Are you sure you want to delete all your data? This action cannot be undone.')}
                  className="flex items-center justify-center space-x-2 px-6 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors border border-red-200 dark:border-red-800/50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Data</span>
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'account':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Details</h2>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Account ID</span>
                    <span className="font-mono text-gray-900 dark:text-white">USR-8X9Y-2A4B</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Member Since</span>
                    <span className="text-gray-900 dark:text-white">October 12, 2023</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Subscription Plan</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 mt-1">
                      Pro Member
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-500">Danger Zone</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors border border-gray-200 dark:border-gray-700">
                  Export Personal Data
                </button>
                <button 
                  className="flex items-center justify-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <Settings className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your account preferences and configurations.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white dark:bg-gray-900 text-cyan-500 shadow-sm border border-gray-200 dark:border-gray-800' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-500' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 md:p-8 min-h-[600px] shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
