'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from './types';
import { sampleUsers, technicians } from './data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, phone: string, village: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, _password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo, we'll authenticate based on role
    let foundUser: User | null = null;

    if (role === 'reporter') {
      foundUser = sampleUsers.find((u) => u.phone.includes(phone.slice(-4))) || {
        id: `u${Date.now()}`,
        name: 'Demo Reporter',
        phone: phone,
        role: 'reporter',
        village: 'v1',
        createdAt: new Date(),
      };
    } else if (role === 'technician') {
      const tech = technicians.find((t) => t.phone.includes(phone.slice(-4)));
      if (tech) {
        foundUser = {
          id: tech.id,
          name: tech.name,
          phone: tech.phone,
          email: tech.email,
          role: 'technician',
          assignedVillages: tech.assignedVillages,
          createdAt: new Date(),
        };
      } else {
        foundUser = {
          id: 't1',
          name: technicians[0].name,
          phone: technicians[0].phone,
          email: technicians[0].email,
          role: 'technician',
          assignedVillages: technicians[0].assignedVillages,
          createdAt: new Date(),
        };
      }
    } else if (role === 'admin') {
      foundUser = {
        id: 'admin1',
        name: 'Admin User',
        phone: phone,
        email: 'admin@energy.gov.in',
        role: 'admin',
        createdAt: new Date(),
      };
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (name: string, phone: string, village: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      phone,
      role: 'reporter',
      village,
      createdAt: new Date(),
    };

    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
