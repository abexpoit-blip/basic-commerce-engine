import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinkShield Pro — Facebook Ads Link Shortener & Compliance Engine',
  description: 'Enterprise link shortener, bot filtering, and traffic routing platform for Facebook ads, media buyers, and landing pages.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
