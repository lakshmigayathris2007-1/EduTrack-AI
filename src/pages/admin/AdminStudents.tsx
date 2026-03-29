import React, { useState } from 'react';
import { students } from '@/data/mockData';
import { getOverallAttendance, getRiskStatus } from '@/lib/attendanceAI';
import { Search, Filter } from 'lucide-react';

const departments = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology'];

export default function AdminStudents() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  let filtered = students;
  if (deptFilter !== 'All') filtered = filtered.filter(s => s.department === deptFilter);
  if (search) filtered = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.student_id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Student Management</h1>

      <div className="stat-card flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
          </div>
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50">
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Sem</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Sec</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Attendance</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(student => {
              const pct = getOverallAttendance(student.student_id);
              const risk = getRiskStatus(pct);
              return (
                <tr key={student.student_id} className="border-b border-border/50 hover:bg-muted/50 transition">
                  <td className="py-3 px-4 font-mono text-xs">{student.student_id}</td>
                  <td className="py-3 px-4 font-medium">{student.name}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{student.email}</td>
                  <td className="py-3 px-4">{student.department}</td>
                  <td className="py-3 px-4 text-center">{student.semester}</td>
                  <td className="py-3 px-4 text-center">{student.section}</td>
                  <td className="py-3 px-4 text-center font-medium">{pct.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk === 'Safe' ? 'badge-safe' : risk === 'Warning' ? 'badge-warning' : 'badge-critical'}`}>{risk}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
