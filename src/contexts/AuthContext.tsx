import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserRole, Student, Faculty, Admin } from '@/types/attendance';
import { students, faculty, admins } from '@/data/mockData';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string, role: UserRole): boolean => {
    if (role === 'student') {
      const found = students.find(s => s.email.toLowerCase() === email.toLowerCase()) || students[0];
      setUser({ id: found.student_id, name: found.name, email: found.email, role: 'student' });
      return true;
    }
    if (role === 'faculty') {
      const found = faculty.find(f => f.email.toLowerCase() === email.toLowerCase()) || faculty[0];
      setUser({ id: found.faculty_id, name: found.name, email: found.email, role: 'faculty' });
      return true;
    }
    if (role === 'admin') {
      const found = admins.find(a => a.email.toLowerCase() === email.toLowerCase()) || admins[0];
      setUser({ id: found.admin_id, name: found.name, email: found.email, role: 'admin' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getStudentData(userId: string): Student | undefined {
  return students.find(s => s.student_id === userId);
}

export function getFacultyData(userId: string): Faculty | undefined {
  return faculty.find(f => f.faculty_id === userId);
}
