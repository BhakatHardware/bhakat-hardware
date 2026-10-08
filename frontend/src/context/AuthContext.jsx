import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bh_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const stored = localStorage.getItem('bh_admin');
      if (stored) setAdmin(JSON.parse(stored));
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    const { token: t, admin: a } = res.data;
    localStorage.setItem('bh_token', t);
    localStorage.setItem('bh_admin', JSON.stringify(a));
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t);
    setAdmin(a);
    return a;
  };

  const logout = () => {
    localStorage.removeItem('bh_token');
    localStorage.removeItem('bh_admin');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
