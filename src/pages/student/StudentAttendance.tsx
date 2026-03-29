import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceRecords, subjects } from '@/data/mockData';
import { getStudentAttendanceSummary } from '@/lib/attendanceAI';
import { Calendar, Filter, Search } from 'lucide-react';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const records = attendanceRecords.filter(r => r.student_id === user!.id);
  const studentSubjectIds = [...new Set(records.map(r => r.subject_id))];
  const studentSubjects = subjects.filter(s => studentSubjectIds.includes(s.subject_id));

  let filtered = records;
  if (selectedSubject !== 'all') filtered = filtered.filter(r => r.subject_id === selectedSubject);
  if (dateFrom) filtered = filtered.filter(r => r.date >= dateFrom);
  if (dateTo) filtered = filtered.filter(r => r.date <= dateTo);

  filtered.sort((a, b) => b.date.localeCompare(a.date));
  const summaries = getStudentAttendanceSummary(user!.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Attendance History</h1>

      {/* Filters */}
      <div className="stat-card">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            >
              <option value="all">All Subjects</option>
              {studentSubjects.map(s => (
                <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaries.map(s => (
          <div key={s.subject_id} className="stat-card">
            <p className="text-xs text-muted-foreground mb-1 truncate">{s.subject_name}</p>
            <p className={`text-xl font-heading font-bold ${s.percentage >= 75 ? 'text-success' : s.percentage >= 70 ? 'text-warning' : 'text-destructive'}`}>
              {s.percentage.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">{s.attended}/{s.total_classes} classes</p>
          </div>
        ))}
      </div>

      {/* Records Table */}
      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(record => (
              <tr key={record.attendance_id} className="border-b border-border/50 hover:bg-muted/50 transition">
                <td className="py-3 px-4">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                <td className="py-3 px-4">{subjects.find(s => s.subject_id === record.subject_id)?.subject_name}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'Present' ? 'badge-safe' : 'badge-critical'}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 50 && <p className="text-xs text-muted-foreground text-center py-3">Showing first 50 of {filtered.length} records</p>}
      </div>
    </div>
  );
}
