"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, setToken as persistToken } from "@/lib/token";
import { User } from "@/types/employee";  

interface AuthCtx {
  token: string | null;
  user: User | null;
  login: (tok: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isInitialized: boolean;
  // Role-based helper functions
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isEmployee: () => boolean;
  hasRole: (roles: string[]) => boolean;
  canAccess: (requiredRoles: string[]) => boolean;
}

export const AuthContext = createContext<AuthCtx | null>(null);

export const useAuth = (): AuthCtx => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize token after component mounts to avoid hydration mismatch
  useEffect(() => {
    const storedToken = getToken();
    setToken(storedToken);
    setIsInitialized(true);
  }, []);

  const logout = () => {
    persistToken(null);
    setToken(null);
    setUser(null);
  };  useEffect(() => {
    if (!token || !isInitialized) {
      setUser(null);
      return;
    }

    console.log("Fetching user profile with token:", token);
    console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

    (async () => {
      try {
        const { data } = await api.get<User>("/users/me"); 
        console.log("User profile fetched successfully:", data);
        setUser(data);      } catch (err) {
        console.error("Gagal ambil profil, logout …", err);
        const error = err as Error & { response?: { data: unknown; status: number } };
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Full error object:", err);
        
        // Sekarang logout karena kemungkinan token sudah tidak valid
        logout();
      }
    })();
  }, [token, isInitialized]);  const login = async (tok: string): Promise<void> => {
    console.log("AuthContext login called with token:", tok);
    persistToken(tok);
    setToken(tok);
    console.log("Token persisted and state updated");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Role-based helper functions
  const isSuperAdmin = (): boolean => {
    return user?.role === 'SUPER_ADMIN';
  };

  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN';
  };

  const isEmployee = (): boolean => {
    return user?.role === 'EMPLOYEE';
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  };

  const canAccess = (requiredRoles: string[]): boolean => {
    if (!user?.role) return false;
    // Super admin can access everything
    if (user.role === 'SUPER_ADMIN') return true;
    // Check if user has any of the required roles
    return requiredRoles.includes(user.role);
  };

  const value: AuthCtx = { 
    token, 
    user, 
    login, 
    logout, 
    updateUser, 
    isInitialized,
    isSuperAdmin,
    isAdmin,
    isEmployee,
    hasRole,
    canAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function ProtectedPage(props: P) {
    const { token, user, isInitialized } = useAuth();
    const router = useRouter();

    console.log("withAuth - isInitialized:", isInitialized);
    console.log("withAuth - token:", token);
    console.log("withAuth - user:", user);

    // Handle redirect when no token
    useEffect(() => {
      if (isInitialized && !token) {
        console.log("withAuth - no token, redirecting to signin...");
        router.replace('/signin');
      }
    }, [isInitialized, token, router]);

    // Show loading until auth is initialized
    if (!isInitialized) {
      console.log("withAuth - showing loading...");
      return <div>Loading...</div>;
    }

    if (!token) {
      console.log("withAuth - no token, showing loading while redirecting...");
      return <div>Redirecting to login...</div>;
    }

    console.log("withAuth - rendering protected component");
    return <Component {...props} />;
  };
};
