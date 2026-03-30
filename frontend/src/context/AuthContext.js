import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('teachs_token');
    const stored = localStorage.getItem('teachs_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
      api.get('/auth/me')
        .then(res => { setUser(res.data); localStorage.setItem('teachs_user', JSON.stringify(res.data)); })
        .catch(() => { localStorage.removeItem('teachs_token'); localStorage.removeItem('teachs_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('teachs_token', res.data.token);
    localStorage.setItem('teachs_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('teachs_token');
    localStorage.removeItem('teachs_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin', isTeacher: user?.role === 'teacher', isStudent: user?.role === 'student' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
