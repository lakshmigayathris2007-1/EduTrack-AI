export type UserRole = 'student' | 'faculty' | 'admin';

export interface Student {
  student_id: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  section: string;
}

export interface Faculty {
  faculty_id: string;
  name: string;
  email: string;
  department: string;
}

export interface Admin {
  admin_id: string;
  name: string;
  email: string;
}

export interface Subject {
  subject_id: string;
  subject_name: string;
  faculty_id: string;
}

export interface AttendanceRecord {
  attendance_id: string;
  student_id: string;
  subject_id: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface Notification {
  notification_id: string;
  student_id: string;
  message: string;
  type: 'Warning' | 'Motivation';
  date: string;
  read: boolean;
}

export type RiskStatus = 'Safe' | 'Warning' | 'Critical';

export interface AttendanceSummary {
  subject_id: string;
  subject_name: string;
  total_classes: number;
  attended: number;
  percentage: number;
}

export interface StudentDashboardData {
  student: Student;
  overall_percentage: number;
  risk_status: RiskStatus;
  subject_summaries: AttendanceSummary[];
  notifications: Notification[];
  ai_suggestions: string[];
  weekly_trend: { week: string; percentage: number }[];
}

export interface FacultyDashboardData {
  faculty: Faculty;
  subjects: Subject[];
  class_summaries: {
    subject_id: string;
    subject_name: string;
    total_students: number;
    avg_attendance: number;
    low_attendance_students: Student[];
  }[];
}

export interface AdminDashboardData {
  total_students: number;
  total_faculty: number;
  total_subjects: number;
  college_avg_attendance: number;
  department_stats: { department: string; avg_attendance: number; student_count: number }[];
  monthly_trend: { month: string; attendance: number }[];
  risk_distribution: { status: RiskStatus; count: number }[];
}
