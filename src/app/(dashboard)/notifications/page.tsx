'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle, Check, Trash2, BellOff } from 'lucide-react';
// Assuming a NotificationContext exists, falling back to local state if needed.
// import { useNotifications } from '@/lib/context/NotificationContext';

// Mock data for the notification list
const INITIAL_NOTIFICATIONS = [
  { id: '1', type: 'warning', title: 'Suspicious Login Attempt', message: 'A login attempt was blocked from an unrecognized device in Moscow, Russia.', timestamp: '10 mins ago', read: false, group: 'Today' },
  { id: '2', type: 'danger', title: 'Malicious URL Detected', message: 'A link in your recent SMS matches our database of known phishing sites.', timestamp: '2 hours ago', read: false, group: 'Today' },
  { id: '3', type: 'success', title: 'Weekly Scan Complete', message: 'Your weekly security scan found no new vulnerabilities.', timestamp: 'Yesterday', read: true, group: 'Yesterday' },
  { id: '4', type: 'info', title: 'New Quiz Available', message: 'Test your knowledge on social engineering attacks in the new Advanced quiz.', timestamp: '2 days ago', read: true, group: 'Earlier' },
  { id: '5', type: 'info', title: 'App Update', message: 'TrustNetra has been updated to version 2.1.0 with new threat intelligence feeds.', timestamp: '1 week ago', read: true, group: 'Earlier' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const groups = ['Today', 'Yesterday', 'Earlier'];

  const getIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'danger': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'info': return 'bg-blue-500/10';
      case 'warning': return 'bg-amber-500/10';
      case 'success': return 'bg-emerald-500/10';
      case 'danger': return 'bg-red-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Bell className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated on alerts and system activity</p>
          </div>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={markAllRead}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark All Read
            </button>
            <button 
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-16 text-center backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BellOff className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No notifications</h2>
          <p className="text-gray-500 dark:text-gray-400">You're all caught up! There are no new alerts at this time.</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {groups.map(group => {
            const groupNotifs = notifications.filter(n => n.group === group);
            if (groupNotifs.length === 0) return null;

            return (
              <div key={group} className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">{group}</h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {groupNotifs.map(notification => (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className={`group relative overflow-hidden bg-white dark:bg-gray-900/50 rounded-xl border p-4 sm:p-5 backdrop-blur-xl transition-all hover:shadow-md
                          ${notification.read ? 'border-gray-200 dark:border-gray-800/50 opacity-80 hover:opacity-100' : 'border-cyan-500/30 dark:border-cyan-500/30 bg-cyan-50/30 dark:bg-cyan-500/5'}
                        `}
                      >
                        <div className="flex gap-4">
                          <div className={`mt-1 flex-shrink-0 p-2.5 rounded-full ${getBgColor(notification.type)}`}>
                            {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0 pr-16">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-base truncate ${notification.read ? 'font-medium text-gray-700 dark:text-gray-200' : 'font-bold text-gray-900 dark:text-white'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap">{notification.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </div>

                        {!notification.read && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full" />
                        )}

                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 tooltip"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => removeNotification(notification.id)}
                            className="p-2 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-500/10 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-500/30 rounded-lg text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 tooltip"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
