import type { Student, Faculty, Admin, Subject, AttendanceRecord, Notification } from '@/types/attendance';

const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology'];
const sections = ['A', 'B', 'C'];

const firstNames = ['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Reyansh','Ayaan','Krishna','Ishaan',
  'Ananya','Diya','Myra','Sara','Aanya','Aadhya','Isha','Kavya','Riya','Priya',
  'Rohan','Karan','Nikhil','Rahul','Amit','Sneha','Pooja','Neha','Shruti','Meera',
  'Dev','Harsh','Yash','Raj','Vikram','Simran','Tanvi','Nisha','Deepa','Lakshmi',
  'Aryan','Dhruv','Manav','Pranav','Kunal','Ankita','Swati','Pallavi','Komal','Jyoti'];

const lastNames = ['Sharma','Patel','Singh','Kumar','Gupta','Reddy','Joshi','Mehta','Shah','Verma',
  'Nair','Iyer','Pillai','Rao','Das','Chatterjee','Banerjee','Desai','Kulkarni','Jain'];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const students: Student[] = firstNames.map((name, i) => ({
  student_id: `STU${String(i + 1).padStart(3, '0')}`,
  name: `${name} ${lastNames[i % lastNames.length]}`,
  email: `${name.toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@college.edu`,
  department: departments[i % departments.length],
  semester: (i % 8) + 1,
  section: sections[i % sections.length],
}));

const facultyNames = [
  'Dr. Ramesh Krishnan','Prof. Sunita Deshmukh','Dr. Anil Kapoor','Prof. Meena Iyer',
  'Dr. Suresh Babu','Prof. Kavita Sharma','Dr. Rajesh Pillai','Prof. Lakshmi Rao',
  'Dr. Venkat Subramanian','Prof. Anjali Mehta'
];

export const faculty: Faculty[] = facultyNames.map((name, i) => ({
  faculty_id: `FAC${String(i + 1).padStart(3, '0')}`,
  name,
  email: `${name.split(' ').pop()!.toLowerCase()}@college.edu`,
  department: departments[i % departments.length],
}));

export const admins: Admin[] = [
  { admin_id: 'ADM001', name: 'Principal Dr. Sharma', email: 'principal@college.edu' },
  { admin_id: 'ADM002', name: 'Dean Academics', email: 'dean@college.edu' },
];

const subjectNames = [
  'Data Structures','Algorithms','Database Systems','Operating Systems','Computer Networks',
  'Digital Electronics','Signal Processing','Circuit Theory','Thermodynamics','Fluid Mechanics',
  'Structural Analysis','Concrete Technology','Web Technologies','Machine Learning',
  'Software Engineering','Discrete Mathematics','Compiler Design','Microprocessors',
  'Control Systems','Artificial Intelligence'
];

export const subjects: Subject[] = subjectNames.map((name, i) => ({
  subject_id: `SUB${String(i + 1).padStart(3, '0')}`,
  subject_name: name,
  faculty_id: faculty[i % faculty.length].faculty_id,
}));

// Generate 2 months of attendance records
function generateAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const startDate = new Date('2025-01-06');
  const endDate = new Date('2025-03-07');

  students.forEach(student => {
    // Each student takes 4 subjects based on their department
    const deptIndex = departments.indexOf(student.department);
    const studentSubjects = subjects.filter((_, i) => i % departments.length === deptIndex).slice(0, 4);

    const current = new Date(startDate);
    while (current <= endDate) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        studentSubjects.forEach(subject => {
          // Create varied attendance patterns
          const studentIndex = parseInt(student.student_id.slice(3));
          let attendanceProbability = 0.82;

          // Some students have lower attendance
          if (studentIndex <= 5) attendanceProbability = 0.95;
          else if (studentIndex <= 15) attendanceProbability = 0.80;
          else if (studentIndex <= 25) attendanceProbability = 0.72;
          else if (studentIndex <= 35) attendanceProbability = 0.65;
          else if (studentIndex <= 40) attendanceProbability = 0.55;
          else attendanceProbability = 0.88;

          // Add some subject-specific variation
          const subjectIndex = parseInt(subject.subject_id.slice(3));
          if (subjectIndex % 3 === 0) attendanceProbability -= 0.05;

          // Weekly pattern - more absences on Mondays/Fridays
          const dayOfWeek = current.getDay();
          if (dayOfWeek === 1 || dayOfWeek === 5) attendanceProbability -= 0.08;

          records.push({
            attendance_id: generateId(),
            student_id: student.student_id,
            subject_id: subject.subject_id,
            date: current.toISOString().split('T')[0],
            status: Math.random() < attendanceProbability ? 'Present' : 'Absent',
          });
        });
      }
      current.setDate(current.getDate() + 1);
    }
  });

  return records;
}

export const attendanceRecords: AttendanceRecord[] = generateAttendanceRecords();

// Generate notifications
export const notifications: Notification[] = [];

students.forEach(student => {
  const studentRecords = attendanceRecords.filter(r => r.student_id === student.student_id);
  const total = studentRecords.length;
  const present = studentRecords.filter(r => r.status === 'Present').length;
  const percentage = total > 0 ? (present / total) * 100 : 0;

  if (percentage < 70) {
    notifications.push({
      notification_id: generateId(),
      student_id: student.student_id,
      message: `⚠️ Your attendance is ${percentage.toFixed(1)}%, below the required 70%. Please attend classes regularly to avoid academic penalties.`,
      type: 'Warning',
      date: '2025-03-07',
      read: false,
    });
  }
  if (percentage >= 95) {
    notifications.push({
      notification_id: generateId(),
      student_id: student.student_id,
      message: `🌟 Outstanding! Your attendance is ${percentage.toFixed(1)}%. Keep up the excellent work!`,
      type: 'Motivation',
      date: '2025-03-07',
      read: false,
    });
  }
});
