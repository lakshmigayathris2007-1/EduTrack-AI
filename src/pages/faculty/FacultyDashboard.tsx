import React, { useState } from 'react';
import { useAuth, getFacultyData } from '@/contexts/AuthContext';
import { students, subjects, attendanceRecords } from '@/data/mockData';
import { getOverallAttendance, getRiskStatus } from '@/lib/attendanceAI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const fac = getFacultyData(user!.id);
  if (!fac) return <div>Faculty not found</div>;

  const facSubjects = subjects.filter(s => s.faculty_id === fac.faculty_id);

  const classSummaries = facSubjects.map(subject => {
    const subRecords = attendanceRecords.filter(r => r.subject_id === subject.subject_id);
    const studentIds = [...new Set(subRecords.map(r => r.student_id))];
    const totalStudents = studentIds.length;
    const avgAttendance = totalStudents > 0
      ? studentIds.reduce((sum, sid) => {
          const sRecs = subRecords.filter(r => r.student_id === sid);
          return sum + (sRecs.filter(r => r.status === 'Present').length / sRecs.length) * 100;
        }, 0) / totalStudents
      : 0;

    const lowStudents = studentIds
      .filter(sid => {
        const sRecs = subRecords.filter(r => r.student_id === sid);
        return (sRecs.filter(r => r.status === 'Present').length / sRecs.length) * 100 < 70;
      })
      .map(sid => students.find(s => s.student_id === sid)!)
      .filter(Boolean);

    return { subject, totalStudents, avgAttendance, lowStudents };
  });

  const chartData = classSummaries.map(c => ({
    name: c.subject.subject_name.length > 15 ? c.subject.subject_name.slice(0, 15) + '…' : c.subject.subject_name,
    attendance: Math.round(c.avgAttendance),
    students: c.totalStudents,
  }));

  const totalLowStudents = new Set(classSummaries.flatMap(c => c.lowStudents.map(s => s.student_id))).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Faculty Dashboard</h1>
        <p className="text-muted-foreground">{fac.name} • {fac.department}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">My Subjects</span>
            <BookOpen className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-3xl font-heading font-bold">{facSubjects.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Avg Attendance</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-3xl font-heading font-bold">
            {classSummaries.length > 0 ? (classSummaries.reduce((s, c) => s + c.avgAttendance, 0) / classSummaries.length).toFixed(1) : 0}%
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Low Attendance Students</span>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <p className="text-3xl font-heading font-bold text-warning">{totalLowStudents}</p>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="stat-card">
        <h3 className="font-heading font-semibold mb-4">Subject-wise Average Attendance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="name" fontSize={11} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
            <YAxis domain={[0, 100]} fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
            <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)' }} />
            <Bar dataKey="attendance" fill="hsl(174, 60%, 40%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low Attendance Students */}
      {classSummaries.some(c => c.lowStudents.length > 0) && (
        <div className="stat-card">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Students Below 70% Attendance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Attendance</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody>
                {classSummaries.flatMap(c =>
                  c.lowStudents.map(student => {
                    const overall = getOverallAttendance(student.student_id);
                    const risk = getRiskStatus(overall);
                    return (
                      <tr key={`${student.student_id}-${c.subject.subject_id}`} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{student.department}</td>
                        <td className="py-3 px-4">{c.subject.subject_name}</td>
                        <td className="py-3 px-4">{overall.toFixed(1)}%</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk === 'Safe' ? 'badge-safe' : risk === 'Warning' ? 'badge-warning' : 'badge-critical'}`}>
                            {risk}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
