export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export type SchoolBoard = 'Maharashtra State Board' | 'CBSE' | 'ICSE' | 'Other';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Cheque';

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Overdue';

export type ExamType = 'Unit Test' | 'Weekly Test' | 'Monthly Test' | 'Semester Exam' | 'Annual Exam' | 'Mock Board Exam';

export type Language = 'en' | 'mr' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  associatedId?: string; // Teacher ID, Student ID, or Parent ID
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experienceYears: number;
  subjects: string[];
  assignedBatches: string[];
  photoUrl?: string;
  bio?: string;
  joiningDate: string;
}

export interface Student {
  id: string;
  studentIdNumber: string; // e.g. VS-2026-0101
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  schoolName: string;
  standard: number; // 1 to 12
  board: SchoolBoard;
  stream?: 'Science' | 'Commerce' | 'Arts' | 'General'; // For 11-12
  academicYear: string;
  enrolledSubjects: string[];
  batchId: string;
  batchName: string;
  admissionDate: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  parentRelation: 'Father' | 'Mother' | 'Guardian';
  address: string;
  emergencyContact: string;
  photoUrl?: string;
  totalFee: number;
  discountScholarship: number;
  netFee: number;
  paidFee: number;
  status: 'Active' | 'Transferred' | 'Promoted' | 'Archived';
  previousPercentage?: number;
}

export interface Batch {
  id: string;
  name: string;
  standard: number;
  board: SchoolBoard;
  timingType: 'Morning' | 'Afternoon' | 'Evening' | 'Weekend';
  scheduleTime: string; // e.g. "07:00 AM - 09:30 AM"
  daysOfWeek: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  classroom: string;
  capacity: number;
  enrolledCount: number;
  teacherId: string;
  teacherName: string;
  subjects: string[];
  academicYear: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  batchId: string;
  batchName: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  status: AttendanceStatus;
  remarks?: string;
  markedByTeacherId: string;
}

export interface FeeReceipt {
  id: string;
  receiptNumber: string; // e.g. REC-2026-1042
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  standard: number;
  batchName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  feeType: 'Tuition Fee' | 'Admission Fee' | 'Exam Fee' | 'Study Material' | 'Full Year' | 'Installment';
  installmentMonth?: string;
  receivedBy: string;
  notes?: string;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: PaymentStatus;
  installments: {
    title: string;
    amount: number;
    dueDate: string;
    status: PaymentStatus;
    paidDate?: string;
  }[];
}

export interface HomeworkSubmission {
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  fileAttachment?: string;
  status: 'Submitted' | 'Graded' | 'Late';
  marksObtained?: number;
  teacherFeedback?: string;
}

export interface Homework {
  id: string;
  batchId: string;
  batchName: string;
  standard: number;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  teacherId: string;
  teacherName: string;
  attachmentName?: string;
  totalMarks: number;
  submissions: HomeworkSubmission[];
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  type: 'MCQ' | 'Short' | 'Long';
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

export interface StudentExamScore {
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  marksObtained: number;
  rank?: number;
  remarks?: string;
}

export interface Examination {
  id: string;
  title: string;
  type: ExamType;
  standard: number;
  board: SchoolBoard;
  batchId: string;
  batchName: string;
  subject: string;
  examDate: string;
  startTime: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  isPublished: boolean;
  questionCount: number;
  scores: StudentExamScore[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  standard: number;
  subject: string;
  chapter: string;
  type: 'PDF Notes' | 'Worksheet' | 'Sample Paper' | 'Formula Sheet' | 'Video Lesson';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  videoUrl?: string;
  uploadedDate: string;
  uploadedByTeacher: string;
  downloadsCount: number;
}

export interface TimetableSlot {
  id: string;
  batchId: string;
  batchName: string;
  standard: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  classroom: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  category: 'Attendance' | 'Fee' | 'Exam' | 'Homework' | 'Announcement' | 'Enquiry';
  targetRole: 'all' | 'students' | 'parents' | 'teachers' | 'admin';
  isRead: boolean;
  actionUrl?: string;
}

export interface OnlineEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  schoolName: string;
  standard: number;
  board: SchoolBoard;
  preferredBatchTime: string;
  subjectsInterested: string[];
  notes?: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Demo Attended' | 'Enrolled' | 'Closed';
}

export interface InstituteExpense {
  id: string;
  title: string;
  category: 'Faculty Salary' | 'Rent & Utilities' | 'Printing & Material' | 'Software & Tech' | 'Marketing' | 'Maintenance';
  amount: number;
  date: string;
  paidTo: string;
  paymentMethod: PaymentMethod;
  receiptNumber?: string;
}

export interface InstituteSettings {
  instituteName: string;
  tagline: string;
  registrationNumber: string;
  gstNumber: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  academicYear: string;
  principalName: string;
  currencySymbol: string;
  primaryColor: string;
}
