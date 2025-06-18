import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Session = {
  id: string;
  participant: string;
  time: string;
  purpose?: string;
  summary?: string;
  duration?: string;
};

type SessionContextType = {
  sessions: Session[];
  addSession: (session: Session) => void;
  clearSessions: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessions = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessions must be used within a SessionProvider");
  return ctx;
};

const STORAGE_KEY = "textcall_sessions";

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSessions(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session: Session) => {
    setSessions((prev) => [session, ...prev]);
  };

  const clearSessions = () => setSessions([]);

  return (
    <SessionContext.Provider value={{ sessions, addSession, clearSessions }}>
      {children}
    </SessionContext.Provider>
  );
}; 