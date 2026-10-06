import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider, AuthProvider, NotificationProvider, HistoryProvider } from '@/lib/context/providers';
import DynamicBackground from '@/components/layout/DynamicBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SafeGuard AI — Detect. Understand. Stay Safe.',
  description: 'AI-powered protection against phishing, fake links, malicious websites, and online scams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-50 bg-grid-pattern min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <HistoryProvider>
                <DynamicBackground />
                <div className="relative z-10 min-h-screen">
                  {children}
                </div>
              </HistoryProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
