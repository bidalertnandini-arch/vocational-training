import React, { createContext, useContext, useState, useCallback } from 'react';
import { users, User } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAsRole: (role: User['role']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback(async (username: string, _password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    const foundUser = users.find((u) => u.username === username);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('auth-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  }, []);

  const loginAsRole = useCallback((role: User['role']) => {
    const foundUser = users.find((u) => u.role === role);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('auth-user', JSON.stringify(foundUser));
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth-user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loginAsRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
