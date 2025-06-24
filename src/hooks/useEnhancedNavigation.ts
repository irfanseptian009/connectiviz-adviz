'use client';

import { useRouter } from 'next/navigation';
import { useAdaptiveLoading } from '@/context/AdaptiveLoadingContext';
import { useCallback } from 'react';

export function useEnhancedNavigation() {
  const router = useRouter();
  const { showLoading, hideLoading, networkInfo } = useAdaptiveLoading();

  // Get loading duration based on network speed
  const getLoadingDuration = useCallback(() => {
    switch (networkInfo.connectionType) {
      case 'fast': return { show: 100, hide: 300 };
      case 'slow': return { show: 200, hide: 600 };
      case 'offline': return { show: 300, hide: 800 };
      default: return { show: 150, hide: 400 };
    }
  }, [networkInfo.connectionType]);

  const navigateWithLoading = useCallback(
    (path: string, options?: { 
      loadingText?: string;
      replace?: boolean;
      immediate?: boolean;
    }) => {
      const { 
        loadingText = 'Loading page...', 
        replace = false,
        immediate = false 
      } = options || {};
      
      const duration = getLoadingDuration();
      
      if (immediate) {
        showLoading(loadingText);
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
        return;
      }

      showLoading(loadingText);
      
      setTimeout(() => {
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
        
        // Auto-hide loading after navigation starts
        setTimeout(() => {
          hideLoading();
        }, duration.hide);
      }, duration.show);
    },
    [router, showLoading, hideLoading, getLoadingDuration]
  );

  const backWithLoading = useCallback(
    (loadingText: string = 'Going back...') => {
      const duration = getLoadingDuration();
      
      showLoading(loadingText);
      
      setTimeout(() => {
        router.back();
        setTimeout(() => {
          hideLoading();
        }, duration.hide);
      }, duration.show);
    },
    [router, showLoading, hideLoading, getLoadingDuration]
  );

  const refreshWithLoading = useCallback(
    (loadingText: string = 'Refreshing...') => {
      const duration = getLoadingDuration();
      
      showLoading(loadingText);
      
      setTimeout(() => {
        router.refresh();
        setTimeout(() => {
          hideLoading();
        }, duration.hide);
      }, duration.show);
    },
    [router, showLoading, hideLoading, getLoadingDuration]
  );

  // Quick navigation shortcuts
  const quickNavigate = {
    dashboard: () => navigateWithLoading('/dashboard', { loadingText: 'Opening Dashboard...' }),
    profile: () => navigateWithLoading('/profile', { loadingText: 'Loading Profile...' }),
    settings: () => navigateWithLoading('/settings', { loadingText: 'Opening Settings...' }),
    home: () => navigateWithLoading('/', { loadingText: 'Going Home...' }),
  };

  return {
    navigateWithLoading,
    backWithLoading,
    refreshWithLoading,
    quickNavigate,
    networkInfo,
  };
}
