'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavigationLoading from './NavigationLoading';

export function NavigationLoadingProvider() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Show loading when route starts to change
    setIsLoading(true);

    // Hide loading after route change is complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Slightly longer for smooth transition

    return () => clearTimeout(timer);
  }, [pathname, mounted]);

  return <NavigationLoading isLoading={isLoading} text="Navigating to page..." />;
}
