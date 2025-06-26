"use client";

import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { ssoService, SSOUser, Application } from "@/services/sso.service";

interface SSOContextType {
  user: SSOUser | null;
  token: string | null;
  applications: Application[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  openApplication: (application: Application) => Promise<void>;
  refreshApplications: () => Promise<void>;
}

const SSOContext = createContext<SSOContextType | null>(null);

export const useSSO = (): SSOContextType => {
  const context = useContext(SSOContext);
  if (!context) {
    throw new Error("useSSO must be used within SSOProvider");
  }
  return context;
};

export const SSOProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<SSOUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    initializeSSO();
  }, []);

  const initializeSSO = async () => {
    try {
      const storedToken = ssoService.getStoredToken();
      if (storedToken) {
        const validation = await ssoService.validateToken(storedToken);
        if (validation.valid) {
          setToken(storedToken);
          setUser(validation.user);
        } else {
          ssoService.removeToken();
        }
      }
    } catch (error) {
      console.error('SSO initialization failed:', error);
      ssoService.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await ssoService.login(email, password);
      
      setToken(response.accessToken);
      setUser(response.user);
      ssoService.storeToken(response.accessToken);
      
      // Load applications after successful login
      await refreshApplications();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setApplications([]);
    ssoService.removeToken();
  };

  const openApplication = async (application: Application) => {
    try {
      if (application.requiresAuth !== false && token) {
        // Get application-specific token for authenticated apps
        const appTokenResponse = await ssoService.getApplicationToken(application.id);
        ssoService.openApplication(application, appTokenResponse.accessToken);
      } else {
        // Direct access for non-authenticated apps like Naruku
        ssoService.openApplication(application);
      }
    } catch (error) {
      console.error('Failed to open application:', error);
      // Fallback to direct access
      ssoService.openApplication(application);
    }
  };

  const refreshApplications = async () => {
    try {
      const apps = await ssoService.getAvailableApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const value: SSOContextType = {
    user,
    token,
    applications,
    isLoading,
    isAuthenticated,
    login,
    logout,
    openApplication,
    refreshApplications,
  };

  return <SSOContext.Provider value={value}>{children}</SSOContext.Provider>;
};
