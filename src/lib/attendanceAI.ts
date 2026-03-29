import type { Student, RiskStatus, AttendanceSummary, StudentDashboardData } from '@/types/attendance';
import { attendanceRecords, subjects, notifications } from '@/data/mockData';

export function getRiskStatus(percentage: number): RiskStatus {
  if (percentage >= 80) return 'Safe';
  if (percentage >= 70) return 'Warning';
  return 'Critical';
}

export function getStudentAttendanceSummary(studentId: string): AttendanceSummary[] {
  const studentRecords = attendanceRecords.filter(r => r.student_id === studentId);
  const subjectMap = new Map<string, { total: number; attended: number }>();

  studentRecords.forEach(record => {
    const curr = subjectMap.get(record.subject_id) || { total: 0, attended: 0 };
    curr.total++;
    if (record.status === 'Present') curr.attended++;
    subjectMap.set(record.subject_id, curr);
  });

  return Array.from(subjectMap.entries()).map(([subjectId, data]) => {
    const subject = subjects.find(s => s.subject_id === subjectId);
    return {
      subject_id: subjectId,
      subject_name: subject?.subject_name || 'Unknown',
      total_classes: data.total,
      attended: data.attended,
      percentage: data.total > 0 ? (data.attended / data.total) * 100 : 0,
    };
  });
}

export function getOverallAttendance(studentId: string): number {
  const records = attendanceRecords.filter(r => r.student_id === studentId);
  if (records.length === 0) return 0;
  const present = records.filter(r => r.status === 'Present').length;
  return (present / records.length) * 100;
}

export function generateAISuggestions(studentId: string, percentage: number, summaries: AttendanceSummary[]): string[] {
  const suggestions: string[] = [];

  if (percentage < 70) {
    const deficit = 70 - percentage;
    const avgClassesPerSubject = summaries.length > 0 ? summaries[0].total_classes : 40;
    const classesNeeded = Math.ceil((deficit / 100) * avgClassesPerSubject * summaries.length * 0.6);
    suggestions.push(`📊 Attend the next ${classesNeeded} consecutive classes across all subjects to reach 70% attendance.`);
  }

  const worstSubject = summaries.reduce((worst, s) => s.percentage < worst.percentage ? s : worst, summaries[0]);
  if (worstSubject && worstSubject.percentage < 75) {
    const needed = Math.ceil(((75 - worstSubject.percentage) / 100) * worstSubject.total_classes * 1.5);
    suggestions.push(`📚 Focus on ${worstSubject.subject_name} — attend ${needed} more classes to reach 75%.`);
  }

  if (percentage >= 70 && percentage < 80) {
    suggestions.push(`💡 You're close to the safe zone! Just ${Math.ceil((80 - percentage) * 0.5)} more classes will boost you above 80%.`);
  }

  if (percentage >= 90) {
    suggestions.push(`🏆 Excellent attendance! You're in the top performers. Keep it up!`);
  }

  if (percentage < 75) {
    suggestions.push(`⏰ Set a daily alarm 30 minutes before your first class. Consistency is key!`);
    suggestions.push(`👥 Find a study buddy to stay accountable for attendance.`);
  }

  return suggestions.slice(0, 4);
}

export function getWeeklyTrend(studentId: string): { week: string; percentage: number }[] {
  const records = attendanceRecords.filter(r => r.student_id === studentId);
  const weekMap = new Map<string, { total: number; present: number }>();

  records.forEach(record => {
    const date = new Date(record.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    const weekKey = weekStart.toISOString().split('T')[0];

    const curr = weekMap.get(weekKey) || { total: 0, present: 0 };
    curr.total++;
    if (record.status === 'Present') curr.present++;
    weekMap.set(weekKey, curr);
  });

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));
}

export function getStudentDashboardData(student: Student): StudentDashboardData {
  const summaries = getStudentAttendanceSummary(student.student_id);
  const overall = getOverallAttendance(student.student_id);
  const risk = getRiskStatus(overall);
  const studentNotifications = notifications.filter(n => n.student_id === student.student_id);
  const suggestions = generateAISuggestions(student.student_id, overall, summaries);
  const trend = getWeeklyTrend(student.student_id);

  return {
    student,
    overall_percentage: overall,
    risk_status: risk,
    subject_summaries: summaries,
    notifications: studentNotifications,
    ai_suggestions: suggestions,
    weekly_trend: trend,
  };
}

export function predictRisk(studentId: string): { risk: RiskStatus; confidence: number; reason: string } {
  const records = attendanceRecords.filter(r => r.student_id === studentId);
  if (records.length === 0) return { risk: 'Warning', confidence: 0.5, reason: 'No data available' };

  const sortedDates = [...new Set(records.map(r => r.date))].sort();
  const recentDates = sortedDates.slice(-10);
  const recentRecords = records.filter(r => recentDates.includes(r.date));
  const recentRate = recentRecords.filter(r => r.status === 'Present').length / recentRecords.length;

  const overallRate = records.filter(r => r.status === 'Present').length / records.length;
  const trend = recentRate - overallRate;

  if (recentRate < 0.5) return { risk: 'Critical', confidence: 0.9, reason: `Recent attendance at ${(recentRate * 100).toFixed(0)}% with declining trend` };
  if (recentRate < 0.7 || trend < -0.1) return { risk: 'Warning', confidence: 0.8, reason: `Attendance trending down by ${Math.abs(trend * 100).toFixed(0)}% recently` };
  return { risk: 'Safe', confidence: 0.85, reason: `Stable attendance at ${(recentRate * 100).toFixed(0)}%` };
}
