import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<{ user?: User; requiresMfa?: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: string, extra?: Record<string, any>) => Promise<{ user?: User; error?: string }>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLearner: boolean;
  isArtist: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('anunaad_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Load user on mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('anunaad_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email: string, password: string, mfaCode?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mfaCode })
      });
      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Login failed' };
      }

      if (data.requiresMfa) {
        return { requiresMfa: true };
      }

      localStorage.setItem('anunaad_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { user: data.user };
    } catch (err: any) {
      return { error: 'Network error during login' };
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'learner', extra?: Record<string, any>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, ...extra })
      });
      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Registration failed' };
      }

      localStorage.setItem('anunaad_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { user: data.user };
    } catch (err: any) {
      return { error: 'Network error during registration' };
    }
  };

  const logout = () => {
    localStorage.removeItem('anunaad_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isLearner = user?.role === 'learner';
  const isArtist = user?.role === 'artist';
  const isAdmin = user?.role === 'content_admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      setUser,
      isAuthenticated,
      isLearner,
      isArtist,
      isAdmin,
      isSuperAdmin
    }}>
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
