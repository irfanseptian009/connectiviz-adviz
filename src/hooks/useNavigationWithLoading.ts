'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';
import { useCallback } from 'react';

export function useNavigationWithLoading() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const navigateWithLoading = useCallback(
    (path: string, loadingText: string = 'Loading page...') => {
      showLoading(loadingText);
      
      // Add a small delay to ensure loading is visible
      setTimeout(() => {
        router.push(path);
        // Hide loading after a short delay to allow page to start loading
        setTimeout(() => {
          hideLoading();
        }, 500);
      }, 200);
    },
    [router, showLoading, hideLoading]
  );

  const replaceWithLoading = useCallback(
    (path: string, loadingText: string = 'Loading page...') => {
      showLoading(loadingText);
      
      setTimeout(() => {
        router.replace(path);
        setTimeout(() => {
          hideLoading();
        }, 500);
      }, 200);
    },
    [router, showLoading, hideLoading]
  );

  const backWithLoading = useCallback(
    (loadingText: string = 'Going back...') => {
      showLoading(loadingText);
      
      setTimeout(() => {
        router.back();
        setTimeout(() => {
          hideLoading();
        }, 300);
      }, 200);
    },
    [router, showLoading, hideLoading]
  );

  return {
    navigateWithLoading,
    replaceWithLoading,
    backWithLoading,
  };
}
