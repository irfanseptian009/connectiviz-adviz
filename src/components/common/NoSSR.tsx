"use client";

import { ReactNode } from 'react';
import { useHasMounted } from '@/hooks/useClientOnly';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to prevent SSR rendering of children to avoid hydration mismatches
 * Useful for components that depend on browser-only APIs or dynamic content
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default NoSSR;
