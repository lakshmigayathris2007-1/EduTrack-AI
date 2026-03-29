import React, { useState } from 'react';
import { useAuth, getFacultyData } from '@/contexts/AuthContext';
import { students, subjects, attendanceRecords } from '@/data/mockData';
import { CheckCircle, XCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyMarkAttendance() {
  const { user } = useAuth();
  const fac = getFacultyData(user!.id);
  const facSubjects = subjects.filter(s => s.faculty_id === fac!.faculty_id);
  
  const [selectedSubject, setSelectedSubject] = useState(facSubjects[0]?.subject_id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent'>>({});

  // Get students for selected subject
  const subjectStudentIds = [...new Set(
    attendanceRecords.filter(r => r.subject_id === selectedSubject).map(r => r.student_id)
  )];
  const subjectStudents = students.filter(s => subjectStudentIds.includes(s.student_id));

  const handleToggle = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const markAll = (status: 'Present' | 'Absent') => {
    const map: Record<string, 'Present' | 'Absent'> = {};
    subjectStudents.forEach(s => { map[s.student_id] = status; });
    setAttendance(map);
  };

  const handleSave = () => {
    const marked = Object.keys(attendance).length;
    toast.success(`Attendance saved for ${marked} students on ${selectedDate}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Mark Attendance</h1>

      <div className="stat-card">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setAttendance({}); }}
              className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50">
              {facSubjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => markAll('Present')} className="px-3 py-2 rounded-lg text-sm font-medium bg-success/10 text-success hover:bg-success/20 transition">All Present</button>
            <button onClick={() => markAll('Absent')} className="px-3 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition">All Absent</button>
          </div>
        </div>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Roll No</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {subjectStudents.map(student => {
              const status = attendance[student.student_id];
              return (
                <tr key={student.student_id} className="border-b border-border/50 hover:bg-muted/50 transition">
                  <td className="py-3 px-4 font-mono text-xs">{student.student_id}</td>
                  <td className="py-3 px-4 font-medium">{student.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{student.department}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleToggle(student.student_id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        status === 'Present' ? 'bg-success/10 text-success' : status === 'Absent' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                      }`}>
                      {status === 'Present' ? <><CheckCircle className="w-3.5 h-3.5" /> Present</> :
                       status === 'Absent' ? <><XCircle className="w-3.5 h-3.5" /> Absent</> : 'Mark'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-lg gradient-secondary text-secondary-foreground font-semibold hover:opacity-90 transition">
          <Save className="w-4 h-4" /> Save Attendance
        </button>
      </div>
    </div>
  );
}
