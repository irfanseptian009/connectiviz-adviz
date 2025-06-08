"use client";

import React, {
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
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    persistToken(null);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) {
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
  }, [token]);

  const login = async (tok: string): Promise<void> => {
    persistToken(tok);
    setToken(tok);
  };

  const value: AuthCtx = { token, user, login, logout };

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
    const { token } = useAuth();
    const [ready, setReady] = useState(false);

    useEffect(() => setReady(true), []);

    if (!token && ready) {
      if (typeof window !== "undefined") {
        window.location.replace("/signin");
      }
      return null;
    }

    return React.createElement(Component, props);
  };
};
