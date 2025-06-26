'use client';

import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { AuthProvider } from '@/context/AuthContext';
import { SSOProvider } from '@/context/SSOContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { AdaptiveLoadingProvider } from '@/context/AdaptiveLoadingContext';
import { Toaster } from 'react-hot-toast';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';
import GlobalLoading from '@/components/common/GlobalLoading';
import { NavigationLoadingProvider } from '@/components/common/NavigationLoadingProvider';
import NetworkStatusIndicator from '@/components/common/NetworkStatusIndicator';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AuthErrorBoundary>
        <AuthProvider>
          <SSOProvider>
            <ThemeProvider>
              <LoadingProvider>
                <AdaptiveLoadingProvider>
                  <NavigationLoadingProvider />
                  <Toaster position="top-right" />
                  <GlobalLoading />
                  <NetworkStatusIndicator />
                  <SidebarProvider>{children}</SidebarProvider>
                </AdaptiveLoadingProvider>
              </LoadingProvider>
            </ThemeProvider>
          </SSOProvider>
        </AuthProvider>
      </AuthErrorBoundary>
    </ReduxProvider>
  );
}
