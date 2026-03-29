import React from 'react';
import { students, faculty, subjects, attendanceRecords } from '@/data/mockData';
import { getOverallAttendance, getRiskStatus } from '@/lib/attendanceAI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, BookOpen, GraduationCap, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology'];
const COLORS = ['hsl(174, 60%, 40%)', 'hsl(38, 92%, 55%)', 'hsl(0, 72%, 51%)', 'hsl(199, 89%, 48%)', 'hsl(280, 60%, 50%)'];

export default function AdminDashboard() {
  const collegeAvg = students.reduce((sum, s) => sum + getOverallAttendance(s.student_id), 0) / students.length;

  const deptStats = departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const avg = deptStudents.length > 0 ? deptStudents.reduce((s, st) => s + getOverallAttendance(st.student_id), 0) / deptStudents.length : 0;
    return { department: dept.length > 12 ? dept.slice(0, 12) + '…' : dept, avg_attendance: Math.round(avg), student_count: deptStudents.length };
  });

  const riskDist = [
    { status: 'Safe', count: students.filter(s => getRiskStatus(getOverallAttendance(s.student_id)) === 'Safe').length },
    { status: 'Warning', count: students.filter(s => getRiskStatus(getOverallAttendance(s.student_id)) === 'Warning').length },
    { status: 'Critical', count: students.filter(s => getRiskStatus(getOverallAttendance(s.student_id)) === 'Critical').length },
  ];

  const riskColors = ['hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)'];

  // Monthly trend
  const months = ['Jan 2025', 'Feb 2025', 'Mar 2025'];
  const monthlyTrend = months.map((month, i) => {
    const monthNum = i + 1;
    const monthStr = `2025-${String(monthNum).padStart(2, '0')}`;
    const monthRecords = attendanceRecords.filter(r => r.date.startsWith(monthStr));
    const pct = monthRecords.length > 0 ? (monthRecords.filter(r => r.status === 'Present').length / monthRecords.length) * 100 : 0;
    return { month, attendance: Math.round(pct) };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: <GraduationCap className="w-4 h-4 text-secondary" /> },
          { label: 'Total Faculty', value: faculty.length, icon: <Users className="w-4 h-4 text-info" /> },
          { label: 'Subjects', value: subjects.length, icon: <BookOpen className="w-4 h-4 text-accent" /> },
          { label: 'College Avg', value: `${collegeAvg.toFixed(1)}%`, icon: <TrendingUp className="w-4 h-4 text-success" /> },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-3xl font-heading font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card">
          <h3 className="font-heading font-semibold mb-4">Department-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="department" fontSize={11} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis domain={[0, 100]} fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)' }} />
              <Bar dataKey="avg_attendance" fill="hsl(174, 60%, 40%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="font-heading font-semibold mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="count"
                label={({ status, count }) => `${status}: ${count}`}>
                {riskDist.map((_, i) => <Cell key={i} fill={riskColors[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {riskDist.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: riskColors[i] }} />
                <span className="text-muted-foreground">{entry.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="font-heading font-semibold mb-4">Monthly Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="month" fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
            <YAxis domain={[0, 100]} fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
            <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)' }} />
            <Line type="monotone" dataKey="attendance" stroke="hsl(222, 60%, 22%)" strokeWidth={2.5} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top At-Risk Students */}
      <div className="stat-card">
        <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Top At-Risk Students
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Semester</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Attendance</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Risk</th>
              </tr>
            </thead>
            <tbody>
              {students
                .map(s => ({ student: s, pct: getOverallAttendance(s.student_id), risk: getRiskStatus(getOverallAttendance(s.student_id)) }))
                .filter(s => s.risk !== 'Safe')
                .sort((a, b) => a.pct - b.pct)
                .slice(0, 10)
                .map(({ student, pct, risk }) => (
                  <tr key={student.student_id} className="border-b border-border/50 hover:bg-muted/50 transition">
                    <td className="py-3 px-4 font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{student.department}</td>
                    <td className="py-3 px-4 text-center">{student.semester}</td>
                    <td className="py-3 px-4 text-center font-medium">{pct.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk === 'Warning' ? 'badge-warning' : 'badge-critical'}`}>{risk}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
