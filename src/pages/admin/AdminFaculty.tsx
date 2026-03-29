import React from 'react';
import { faculty, subjects } from '@/data/mockData';

export default function AdminFaculty() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Faculty Management</h1>

      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subjects</th>
            </tr>
          </thead>
          <tbody>
            {faculty.map(fac => {
              const facSubjects = subjects.filter(s => s.faculty_id === fac.faculty_id);
              return (
                <tr key={fac.faculty_id} className="border-b border-border/50 hover:bg-muted/50 transition">
                  <td className="py-3 px-4 font-mono text-xs">{fac.faculty_id}</td>
                  <td className="py-3 px-4 font-medium">{fac.name}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{fac.email}</td>
                  <td className="py-3 px-4">{fac.department}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {facSubjects.map(s => (
                        <span key={s.subject_id} className="px-2 py-0.5 rounded-full text-xs bg-secondary/10 text-secondary">{s.subject_name}</span>
                      ))}
                    </div>
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
