import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      if (!error.response) {
        throw new Error('Cannot connect to the backend server. Please make sure you have started start-server.bat and it is running on port 5000.');
      }
      const msg = error.response.data?.message || 'Login failed. Please try again.';
      throw new Error(msg);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      if (!error.response) {
        throw new Error('Cannot connect to the backend server. Please make sure you have started start-server.bat and it is running on port 5000.');
      }
      const msg = error.response.data?.message || 'Registration failed. Please try again.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await axios.put(`${API_URL}/auth/profile/${user.id}`, data);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      if (!error.response) {
        throw new Error('Cannot connect to the backend server. Please make sure you have started start-server.bat and it is running on port 5000.');
      }
      const msg = error.response.data?.message || 'Failed to update profile.';
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
