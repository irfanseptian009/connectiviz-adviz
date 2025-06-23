'use client';

import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AuthErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <Toaster position="top-right" />
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </AuthErrorBoundary>
    </ReduxProvider>
  );
}
