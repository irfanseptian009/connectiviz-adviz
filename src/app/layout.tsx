// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Providers } from './provider';   // ↱ 'use client' di file ini

// ─── Google font ──────────────────────────────────────────────
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit-sans',
});

// ─── Optional: SEO/default meta ───────────────────────────────
export const metadata: Metadata = {
  title: 'My App',
  description: 'Awesome app built with Next.js 14',
};

// ─── Root layout (server component) ───────────────────────────
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="dark:bg-black bg-orange-25">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
