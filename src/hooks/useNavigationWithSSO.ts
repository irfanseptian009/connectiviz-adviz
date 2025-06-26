"use client";

import { useState } from "react";
import { useSSO } from "@/context/SSOContext";

export const useNavigationWithSSO = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const { applications, openApplication, isAuthenticated } = useSSO();

  const navigateToNaruku = async (customMessage?: string) => {
    try {
      setIsNavigating(true);
      setLoadingMessage(customMessage || 'Loading Naruku...');

      // Find Naruku application
      const narukyApp = applications.find(app => app.id === 'naruku');
      
      if (narukyApp) {
        await openApplication(narukyApp);
      } else {
        // Fallback: direct navigation to Naruku
        const narukyUrl = process.env.NEXT_PUBLIC_NARUKU_URL || 'http://localhost:3002';
        window.open(narukyUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to navigate to Naruku:', error);
      // Fallback navigation
      const narukyUrl = process.env.NEXT_PUBLIC_NARUKU_URL || 'http://localhost:3002';
      window.open(narukyUrl, '_blank');
    } finally {
      setIsNavigating(false);
      setLoadingMessage('');
    }
  };

  const navigateToApplication = async (applicationId: string, customMessage?: string) => {
    try {
      setIsNavigating(true);
      setLoadingMessage(customMessage || `Loading ${applicationId}...`);

      const app = applications.find(app => app.id === applicationId);
      
      if (app) {
        await openApplication(app);
      } else {
        throw new Error(`Application ${applicationId} not found`);
      }
    } catch (error) {
      console.error(`Failed to navigate to ${applicationId}:`, error);
      throw error;
    } finally {
      setIsNavigating(false);
      setLoadingMessage('');
    }
  };

  const navigateWithSSO = async (url: string, message?: string) => {
    try {
      setIsNavigating(true);
      setLoadingMessage(message || 'Loading...');

      // Check if URL is for Naruku
      if (url.includes('localhost:3002') || url.includes('naruku')) {
        await navigateToNaruku(message);
        return;
      }

      // For other URLs, try to find matching application
      const app = applications.find(app => app.url === url);
      if (app) {
        await openApplication(app);
      } else {
        // Direct navigation for unknown URLs
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback to direct navigation
      window.open(url, '_blank');
    } finally {
      setIsNavigating(false);
      setLoadingMessage('');
    }
  };

  return {
    navigateToNaruku,
    navigateToApplication,
    navigateWithSSO,
    isNavigating,
    loadingMessage,
    isAuthenticated,
    applications,
  };
};
