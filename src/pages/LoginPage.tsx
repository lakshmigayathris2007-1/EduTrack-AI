import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/attendance';
import { GraduationCap, BookOpen, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roles: { role: UserRole; label: string; icon: React.ReactNode; description: string; demoEmail: string }[] = [
  { role: 'student', label: 'Student', icon: <GraduationCap className="w-6 h-6" />, description: 'View attendance, get AI insights', demoEmail: 'aarav.sharma@college.edu' },
  { role: 'faculty', label: 'Faculty', icon: <BookOpen className="w-6 h-6" />, description: 'Mark attendance, view reports', demoEmail: 'krishnan@college.edu' },
  { role: 'admin', label: 'Admin', icon: <Shield className="w-6 h-6" />, description: 'Manage college-wide data', demoEmail: 'principal@college.edu' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState(roles[0].demoEmail);
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(roles.find(r => r.role === role)!.demoEmail);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    const success = login(email, password, selectedRole);
    if (!success) setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-primary-foreground">AttendAI</h1>
          </div>
          <h2 className="text-4xl font-heading font-bold text-primary-foreground mb-4">
            Smart Attendance Management
          </h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            AI-powered attendance tracking with predictive analytics, automated alerts, and personalized suggestions for students, faculty, and administrators.
          </p>
          <div className="mt-10 grid gap-4">
            {['Predictive Risk Analysis', 'Real-time Notifications', 'Comprehensive Reports'].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-primary-foreground/80">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold">AttendAI</h1>
          </div>

          <h2 className="text-2xl font-heading font-bold mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Select your role and sign in</p>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {roles.map(({ role, label, icon }) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedRole === role
                    ? 'border-secondary bg-secondary/10'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className={`mx-auto mb-2 ${selectedRole === role ? 'text-secondary' : 'text-muted-foreground'}`}>
                  {icon}
                </div>
                <span className={`text-sm font-medium ${selectedRole === role ? 'text-secondary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
                placeholder="Enter password"
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-lg gradient-secondary text-secondary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Sign In as {roles.find(r => r.role === selectedRole)?.label}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo mode: any password works. Email is pre-filled.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
