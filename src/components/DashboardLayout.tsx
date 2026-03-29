import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, Calendar, Bell, BarChart3,
  Users, BookOpen, Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Attendance', path: '/student/attendance', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Notifications', path: '/student/notifications', icon: <Bell className="w-5 h-5" /> },
];

const facultyNav: NavItem[] = [
  { label: 'Dashboard', path: '/faculty', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Mark Attendance', path: '/faculty/mark', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Reports', path: '/faculty/reports', icon: <BarChart3 className="w-5 h-5" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Students', path: '/admin/students', icon: <Users className="w-5 h-5" /> },
  { label: 'Faculty', path: '/admin/faculty', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Reports', path: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const navItems = user.role === 'student' ? studentNav : user.role === 'faculty' ? facultyNav : adminNav;
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sidebar-nav flex flex-col transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-secondary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-sidebar-foreground">AttendAI</h1>
              <p className="text-xs text-sidebar-foreground/50">{roleLabel} Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${user.role}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-2 mb-3">
            <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{roleLabel}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-foreground">{user.name}</span>
          </div>
        </header>
        <div className="p-6 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
