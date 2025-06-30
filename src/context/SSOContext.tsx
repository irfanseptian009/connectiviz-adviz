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
  canAccessApplication: (application: Application) => boolean;
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
    console.log('🚀 [ConnectiViz] Opening application:', {
      id: application.id,
      name: application.name,
      requiresAuth: application.requiresAuth,
      url: application.url,
      hasToken: !!token,
      userRole: user?.role
    });

    // Check if user has permission to access this application
    if (!canAccessApplication(application)) {
      console.warn('Access denied: User does not have permission to access this application');
      alert('Anda tidak memiliki akses untuk membuka aplikasi ini. Hanya Super Admin yang dapat mengakses semua aplikasi.');
      return;
    }

    try {
      if (application.requiresAuth !== false && token) {
        console.log('🔑 [ConnectiViz] Getting application-specific token for:', application.id);
        // Get application-specific token for authenticated apps
        const appTokenResponse = await ssoService.getApplicationToken(application.id);
        console.log('✅ [ConnectiViz] Got app token:', { 
          hasAccessToken: !!appTokenResponse.accessToken,
          tokenLength: appTokenResponse.accessToken?.length
        });
        
        const finalUrl = `${application.url}?ssoToken=${appTokenResponse.accessToken}`;
        console.log('🌐 [ConnectiViz] Opening URL with SSO token:', finalUrl);
        ssoService.openApplication(application, appTokenResponse.accessToken);
      } else {
        console.log('🌐 [ConnectiViz] Direct access (no auth required)');
        // Direct access for non-authenticated apps like Naruku
        ssoService.openApplication(application);
      }
    } catch (error: any) {
      console.error('❌ [ConnectiViz] Failed to open application:', error);
      console.error('❌ [ConnectiViz] Error details:', {
        message: error?.message,
        stack: error?.stack,
        application: application.id
      });
      // Fallback to direct access only if user has permission
      if (canAccessApplication(application)) {
        console.log('🔄 [ConnectiViz] Fallback to direct access');
        ssoService.openApplication(application);
      }
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

  // Helper function to check if user can access an application based on role
  const checkApplicationAccess = (currentUser: SSOUser | null, application: Application): boolean => {
    if (!currentUser) return false;
    
    // Super admin can access all applications
    if (currentUser.role.toLowerCase() === 'superadmin' || currentUser.role.toLowerCase() === 'super_admin') {
      return true;
    }
    
    // Admin and employee can only access Naruku or non-auth applications
    if (currentUser.role.toLowerCase() === 'admin' || currentUser.role.toLowerCase() === 'employee') {
      // Allow access to Naruku (assuming it's identified by name or requiresAuth: false)
      return application.name.toLowerCase() === 'naruku' || 
             application.id.toLowerCase() === 'naruku' ||
             application.requiresAuth === false;
    }
    
    // Default: deny access for other roles
    return false;
  };

  const canAccessApplication = (application: Application): boolean => {
    return checkApplicationAccess(user, application);
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
    canAccessApplication,
  };

  return <SSOContext.Provider value={value}>{children}</SSOContext.Provider>;
};
