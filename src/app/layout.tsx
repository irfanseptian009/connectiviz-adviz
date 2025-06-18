import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Providers } from './provider'; 
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit-sans',
});

export const metadata: Metadata = {
  title: 'connectiviz',
  description: 'A tool for visualizing and analyzing connections in data',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="dark:bg-black bg-orange-25">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
