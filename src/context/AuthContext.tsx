"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetchUser } from "@/hooks/queries/use-fetch-user";
import { useLogoutUser } from "@/hooks/mutations/use-logout-user";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: currentUser, isLoading } = useFetchUser();
  const logoutMutation = useLogoutUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else if (!isLoading) {
      setUser(null);
    }
  }, [currentUser, isLoading]);

  const signOut = () => {
    logoutMutation.mutate();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}