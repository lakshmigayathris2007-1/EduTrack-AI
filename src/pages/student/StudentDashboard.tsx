import React from 'react';
import { useAuth, getStudentData } from '@/contexts/AuthContext';
import { getStudentDashboardData, predictRisk } from '@/lib/attendanceAI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Target, Brain, BookOpen, AlertTriangle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['hsl(174, 60%, 40%)', 'hsl(38, 92%, 55%)', 'hsl(0, 72%, 51%)', 'hsl(199, 89%, 48%)'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const student = getStudentData(user!.id);
  if (!student) return <div>Student not found</div>;

  const data = getStudentDashboardData(student);
  const prediction = predictRisk(student.student_id);

  const riskColor = data.risk_status === 'Safe' ? 'text-success' : data.risk_status === 'Warning' ? 'text-warning' : 'text-destructive';
  const riskBadge = data.risk_status === 'Safe' ? 'badge-safe' : data.risk_status === 'Warning' ? 'badge-warning' : 'badge-critical';

  const pieData = data.subject_summaries.map(s => ({ name: s.subject_name, value: Math.round(s.percentage) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Welcome, {student.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">{student.department} • Semester {student.semester} • Section {student.section}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Overall Attendance</span>
            {data.overall_percentage >= 75 ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
          </div>
          <p className="text-3xl font-heading font-bold">{data.overall_percentage.toFixed(1)}%</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Risk Status</span>
            <Target className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-heading font-bold ${riskColor}`}>{data.risk_status}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskBadge}`}>{prediction.confidence * 100}% conf</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Subjects</span>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-heading font-bold">{data.subject_summaries.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Notifications</span>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <p className="text-3xl font-heading font-bold">{data.notifications.length}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <div className="lg:col-span-2 stat-card">
          <h3 className="font-heading font-semibold mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.weekly_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="week" fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis domain={[0, 100]} fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)' }} />
              <Line type="monotone" dataKey="percentage" stroke="hsl(174, 60%, 40%)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Suggestions */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-secondary" />
            <h3 className="font-heading font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {data.ai_suggestions.map((suggestion, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted text-sm leading-relaxed">
                {suggestion}
              </div>
            ))}
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-sm">
              <p className="font-medium text-secondary mb-1">Risk Prediction</p>
              <p className="text-muted-foreground">{prediction.reason}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-heading font-semibold mb-4">Subject-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.subject_summaries} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis type="number" domain={[0, 100]} fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis dataKey="subject_name" type="category" width={120} fontSize={11} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)' }} />
              <Bar dataKey="percentage" fill="hsl(174, 60%, 40%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="font-heading font-semibold mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${value}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
