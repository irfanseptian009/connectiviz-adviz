"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import api from "@/lib/api";
import { getToken, setToken as persistToken } from "@/lib/token";
import { Props as User } from "@/types/props";  

interface AuthCtx {
  token: string | null;
  user: User | null;
  login: (tok: string) => Promise<void>;
  logout: () => void;
  isInitialized: boolean;
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
  };
  useEffect(() => {
    if (!token || !isInitialized) {
      setUser(null);
      return;
    }

    (async () => {
      try {
        const { data } = await api.get<User>("/users"); 
        setUser(data);
      } catch (err) {
        console.error("Gagal ambil profil, logout …", err);
        logout();
      }
    })();
  }, [token, isInitialized]);

  const login = async (tok: string): Promise<void> => {
    persistToken(tok);
    setToken(tok);
  };

  const value: AuthCtx = { token, user, login, logout, isInitialized };

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
    const { token, isInitialized } = useAuth();

    // Show loading until auth is initialized
    if (!isInitialized) {
      return <div>Loading...</div>;
    }

    if (!token) {
      if (typeof window !== "undefined") {
        window.location.replace("/signin");
      }
      return null;
    }

    return <Component {...props} />;
  };
};
