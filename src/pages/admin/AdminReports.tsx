import React, { useState } from 'react';
import { students, attendanceRecords } from '@/data/mockData';
import { getOverallAttendance, getRiskStatus } from '@/lib/attendanceAI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

const departments = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology'];

export default function AdminReports() {
  const [deptFilter, setDeptFilter] = useState('All');
  const [semFilter, setSemFilter] = useState('All');

  let filtered = students;
  if (deptFilter !== 'All') filtered = filtered.filter(s => s.department === deptFilter);
  if (semFilter !== 'All') filtered = filtered.filter(s => s.semester === parseInt(semFilter));

  const reportData = filtered.map(s => ({
    student: s,
    attendance: getOverallAttendance(s.student_id),
    risk: getRiskStatus(getOverallAttendance(s.student_id)),
  }));

  const distribution = [
    { range: '90-100%', count: reportData.filter(r => r.attendance >= 90).length },
    { range: '80-90%', count: reportData.filter(r => r.attendance >= 80 && r.attendance < 90).length },
    { range: '70-80%', count: reportData.filter(r => r.attendance >= 70 && r.attendance < 80).length },
    { range: '60-70%', count: reportData.filter(r => r.attendance >= 60 && r.attendance < 70).length },
    { range: '<60%', count: reportData.filter(r => r.attendance < 60).length },
  ];

  const handleExport = () => {
    const csv = ['Student ID,Name,Department,Semester,Attendance,Risk',
      ...reportData.map(r => `${r.student.student_id},${r.student.name},${r.student.department},${r.student.semester},${r.attendance.toFixed(1)}%,${r.risk}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'college_report.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-heading font-bold">College Reports</h1>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="stat-card flex flex-wrap gap-4">
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50">
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={semFilter} onChange={e => setSemFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50">
          <option value="All">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>

      <div className="stat-card">
        <h3 className="font-heading font-semibold mb-4">Attendance Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="range" fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
            <YAxis fontSize={12} tick={{ fill: 'hsl(220, 9%, 46%)' }} />
            <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)' }} />
            <Bar dataKey="count" fill="hsl(174, 60%, 40%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <p className="text-sm text-muted-foreground mb-1">Average Attendance</p>
          <p className="text-3xl font-heading font-bold">{(reportData.reduce((s, r) => s + r.attendance, 0) / (reportData.length || 1)).toFixed(1)}%</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-sm text-muted-foreground mb-1">At Risk Students</p>
          <p className="text-3xl font-heading font-bold text-warning">{reportData.filter(r => r.risk !== 'Safe').length}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-sm text-muted-foreground mb-1">Critical Students</p>
          <p className="text-3xl font-heading font-bold text-destructive">{reportData.filter(r => r.risk === 'Critical').length}</p>
        </div>
      </div>
    </div>
  );
}
