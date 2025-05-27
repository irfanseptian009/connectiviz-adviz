"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

/* -------------------------------------------------------------------------- */
/*  CONTEXT & HOOK                                                            */
/* -------------------------------------------------------------------------- */

interface AuthContextType {
  token: string | null;
  user: any;
  login: (tok: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

/* -------------------------------------------------------------------------- */
/*  helper util : getToken (dipakai interceptor axios, dll.)                  */
/* -------------------------------------------------------------------------- */

// NEW: util mandiri yang bisa di-import dari mana saja
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null; // SSR safety
  return localStorage.getItem("token");
};

/* -------------------------------------------------------------------------- */
/*  PROVIDER                                                                  */
/* -------------------------------------------------------------------------- */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<any>(null);

  // ambil profil saat token tersedia
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:4000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [token]);

  const login = (tok: string) => {
    setToken(tok);
    localStorage.setItem("token", tok);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const value: AuthContextType = { token, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* -------------------------------------------------------------------------- */
/*  HOC proteksi halaman                                                      */
/* -------------------------------------------------------------------------- */

export const withAuth = (Component: any) => {
  return function ProtectedPage(props: any) {
    const auth = useAuth();
    const [ready, setReady] = useState(false);

    useEffect(() => {
      setReady(true);
    }, []);

    if ((!auth || !auth.token) && ready) {
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      return null;
    }

    return <Component {...props} />;
  };
};
