import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

// Use VITE_API_URL if defined (for production), otherwise use empty string to rely on Vite proxy
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set token header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user profile on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/user/profile');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        if (error.response?.status === 401) {
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success('Logged in successfully');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success('Registered successfully');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const googleLogin = async (credential) => {
    try {
      const res = await axios.post('/api/auth/google', { credential });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success('Google login successful');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
