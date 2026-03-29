import React, { useState } from 'react';
import { useAuth, getFacultyData } from '@/contexts/AuthContext';
import { students, subjects, attendanceRecords } from '@/data/mockData';
import { getOverallAttendance, getRiskStatus } from '@/lib/attendanceAI';
import { Download, Filter } from 'lucide-react';

export default function FacultyReports() {
  const { user } = useAuth();
  const fac = getFacultyData(user!.id);
  const facSubjects = subjects.filter(s => s.faculty_id === fac!.faculty_id);
  const [selectedSubject, setSelectedSubject] = useState(facSubjects[0]?.subject_id || '');

  const subjectStudentIds = [...new Set(
    attendanceRecords.filter(r => r.subject_id === selectedSubject).map(r => r.student_id)
  )];

  const report = subjectStudentIds.map(sid => {
    const student = students.find(s => s.student_id === sid)!;
    const recs = attendanceRecords.filter(r => r.student_id === sid && r.subject_id === selectedSubject);
    const present = recs.filter(r => r.status === 'Present').length;
    const pct = recs.length > 0 ? (present / recs.length) * 100 : 0;
    return { student, total: recs.length, present, absent: recs.length - present, percentage: pct, risk: getRiskStatus(pct) };
  }).sort((a, b) => a.percentage - b.percentage);

  const handleExport = () => {
    const csv = ['Student ID,Name,Department,Total,Present,Absent,Percentage,Risk',
      ...report.map(r => `${r.student.student_id},${r.student.name},${r.student.department},${r.total},${r.present},${r.absent},${r.percentage.toFixed(1)}%,${r.risk}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'attendance_report.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-heading font-bold">Attendance Reports</h1>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="stat-card">
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50">
          {facSubjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
        </select>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Total</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Present</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Absent</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">%</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Risk</th>
            </tr>
          </thead>
          <tbody>
            {report.map(r => (
              <tr key={r.student.student_id} className="border-b border-border/50 hover:bg-muted/50 transition">
                <td className="py-3 px-4 font-medium">{r.student.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{r.student.department}</td>
                <td className="py-3 px-4 text-center">{r.total}</td>
                <td className="py-3 px-4 text-center text-success">{r.present}</td>
                <td className="py-3 px-4 text-center text-destructive">{r.absent}</td>
                <td className="py-3 px-4 text-center font-medium">{r.percentage.toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.risk === 'Safe' ? 'badge-safe' : r.risk === 'Warning' ? 'badge-warning' : 'badge-critical'}`}>
                    {r.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
