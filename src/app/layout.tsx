import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider, AuthProvider, NotificationProvider, HistoryProvider } from '@/lib/context/providers';
import DynamicBackground from '@/components/layout/DynamicBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SafeGuard AI — Phishing, Fraud & Cyber Threat Detection Platform',
  description: 'AI-Powered Cyber Security Platform & Real-Time Threat Intelligence Command Center.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#070D12] text-slate-100 min-h-screen antialiased`}>
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
