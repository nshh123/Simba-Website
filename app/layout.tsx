import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { AIChat } from '@/components/AIChat';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Simba Supermarket 2.0',
  description: 'A modern e-commerce rebuild of a Rwandan supermarket',
  icons: {
    icon: '/favicon.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground pb-20 md:pb-0 overflow-x-hidden`}>
          <Providers>
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 md:pb-8">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <AIChat />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
