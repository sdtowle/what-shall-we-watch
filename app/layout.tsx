import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'What Shall We Watch?',
  description: 'Help choose what TV show to watch tonight',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'What Shall We Watch?',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192x192.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0d1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased bg-background text-text-main">
        <ToastProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
