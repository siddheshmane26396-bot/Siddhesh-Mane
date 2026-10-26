import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  InstituteSettings,
  Teacher,
  Student,
  Batch,
  AttendanceRecord,
  AttendanceStatus,
  FeeReceipt,
  Homework,
  Examination,
  StudyMaterial,
  TimetableSlot,
  NotificationItem,
  OnlineEnquiry,
  InstituteExpense,
  Language,
  StudentExamScore,
} from '../types';
import {
  initialSettings,
  initialUsers,
  initialTeachers,
  initialBatches,
  initialStudents,
  initialAttendance,
  initialFeeReceipts,
  initialHomework,
  initialExams,
  initialStudyMaterials,
  initialTimetable,
  initialNotifications,
  initialEnquiries,
  initialExpenses,
} from '../data/initialData';

interface AppContextType {
  settings: InstituteSettings;
  updateSettings: (newSettings: Partial<InstituteSettings>) => void;
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  activeView: 'portal' | 'website';
  setActiveView: (view: 'portal' | 'website') => void;
  activePortalTab: string;
  setActivePortalTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Data collections
  students: Student[];
  teachers: Teacher[];
  batches: Batch[];
  attendance: AttendanceRecord[];
  feeReceipts: FeeReceipt[];
  homework: Homework[];
  exams: Examination[];
  studyMaterials: StudyMaterial[];
  timetable: TimetableSlot[];
  notifications: NotificationItem[];
  enquiries: OnlineEnquiry[];
  expenses: InstituteExpense[];

  // Mutators
  addStudent: (data: Omit<Student, 'id' | 'studentIdNumber' | 'paidFee' | 'netFee'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  promoteStudent: (id: string, newStandard: number, newBatchId: string, newBatchName: string) => void;
  transferBatch: (studentId: string, newBatchId: string, newBatchName: string) => void;

  addBatch: (data: Omit<Batch, 'id' | 'enrolledCount'>) => Batch;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  markBatchAttendance: (
    batchId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    teacherId: string
  ) => void;

  recordFeePayment: (data: Omit<FeeReceipt, 'id' | 'receiptNumber'>) => FeeReceipt;

  createHomework: (data: Omit<Homework, 'id' | 'submissions'>) => Homework;
  submitHomework: (
    hwId: string,
    studentId: string,
    studentName: string,
    content: string,
    fileAttachment?: string
  ) => void;
  gradeHomeworkSubmission: (
    hwId: string,
    studentId: string,
    marks: number,
    feedback: string
  ) => void;

  createExam: (data: Omit<Examination, 'id' | 'scores'>) => Examination;
  saveExamScores: (examId: string, scores: StudentExamScore[], publish: boolean) => void;

  addStudyMaterial: (data: Omit<StudyMaterial, 'id' | 'downloadsCount'>) => StudyMaterial;
  incrementMaterialDownload: (id: string) => void;

  submitOnlineEnquiry: (
    data: Omit<OnlineEnquiry, 'id' | 'submittedAt' | 'status'>
  ) => OnlineEnquiry;
  updateEnquiryStatus: (id: string, status: OnlineEnquiry['status']) => void;
  convertEnquiryToStudent: (
    enquiryId: string,
    batchId: string,
    fee: number,
    scholarship: number
  ) => Student | null;

  addExpense: (data: Omit<InstituteExpense, 'id'>) => InstituteExpense;
  markNotificationRead: (id: string) => void;
  addNotification: (data: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => void;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`vidyasetu_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage`, e);
      return fallback;
    }
  };

  const [settings, setSettings] = useState<InstituteSettings>(() => loadStored('settings', initialSettings));
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [selectedChildId, setSelectedChildId] = useState<string>('stu-1');
  const [activeView, setActiveView] = useState<'portal' | 'website'>('website');
  const [activePortalTab, setActivePortalTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<Language>(() => loadStored('lang', 'en'));
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [students, setStudents] = useState<Student[]>(() => loadStored('students', initialStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadStored('teachers', initialTeachers));
  const [batches, setBatches] = useState<Batch[]>(() => loadStored('batches', initialBatches));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadStored('attendance', initialAttendance));
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>(() => loadStored('feeReceipts', initialFeeReceipts));
  const [homework, setHomework] = useState<Homework[]>(() => loadStored('homework', initialHomework));
  const [exams, setExams] = useState<Examination[]>(() => loadStored('exams', initialExams));
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => loadStored('studyMaterials', initialStudyMaterials));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => loadStored('timetable', initialTimetable));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored('notifications', initialNotifications));
  const [enquiries, setEnquiries] = useState<OnlineEnquiry[]>(() => loadStored('enquiries', initialEnquiries));
  const [expenses, setExpenses] = useState<InstituteExpense[]>(() => loadStored('expenses', initialExpenses));

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vidyasetu_settings', JSON.stringify(settings));
      localStorage.setItem('vidyasetu_students', JSON.stringify(students));
      localStorage.setItem('vidyasetu_teachers', JSON.stringify(teachers));
      localStorage.setItem('vidyasetu_batches', JSON.stringify(batches));
      localStorage.setItem('vidyasetu_attendance', JSON.stringify(attendance));
      localStorage.setItem('vidyasetu_feeReceipts', JSON.stringify(feeReceipts));
      localStorage.setItem('vidyasetu_homework', JSON.stringify(homework));
      localStorage.setItem('vidyasetu_exams', JSON.stringify(exams));
      localStorage.setItem('vidyasetu_studyMaterials', JSON.stringify(studyMaterials));
      localStorage.setItem('vidyasetu_timetable', JSON.stringify(timetable));
      localStorage.setItem('vidyasetu_notifications', JSON.stringify(notifications));
      localStorage.setItem('vidyasetu_enquiries', JSON.stringify(enquiries));
      localStorage.setItem('vidyasetu_expenses', JSON.stringify(expenses));
      localStorage.setItem('vidyasetu_lang', JSON.stringify(language));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [settings, students, teachers, batches, attendance, feeReceipts, homework, exams, studyMaterials, timetable, notifications, enquiries, expenses, language]);

  // Update current user when role changes
  useEffect(() => {
    const matched = initialUsers.find((u) => u.role === currentRole);
    if (matched) {
      setCurrentUser(matched);
    }
  }, [currentRole]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateSettings = (newSettings: Partial<InstituteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addStudent = (data: Omit<Student, 'id' | 'studentIdNumber' | 'paidFee' | 'netFee'>): Student => {
    const nextNum = students.length + 1025;
    const studentIdNumber = `VS-2026-${nextNum}`;
    const netFee = Math.max(0, data.totalFee - data.discountScholarship);
    const newStudent: Student = {
      ...data,
      id: `stu-${Date.now()}`,
      studentIdNumber,
      netFee,
      paidFee: 0,
    };
    setStudents((prev) => [newStudent, ...prev]);

    // Update batch count
    setBatches((prev) =>
      prev.map((b) => (b.id === data.batchId ? { ...b, enrolledCount: b.enrolledCount + 1 } : b))
    );

    addNotification({
      title: 'New Student Admitted',
      message: `${data.fullName} enrolled in ${data.batchName} (Std ${data.standard}).`,
      category: 'Announcement',
      targetRole: 'admin',
    });

    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          if (updates.totalFee !== undefined || updates.discountScholarship !== undefined) {
            updated.netFee = Math.max(0, updated.totalFee - updated.discountScholarship);
          }
          return updated;
        }
        return s;
      })
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const promoteStudent = (id: string, newStandard: number, newBatchId: string, newBatchName: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              standard: newStandard,
              batchId: newBatchId,
              batchName: newBatchName,
              status: 'Promoted',
              academicYear: '2027-2028',
            }
          : s
      )
    );
  };

  const transferBatch = (studentId: string, newBatchId: string, newBatchName: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              batchId: newBatchId,
              batchName: newBatchName,
              status: 'Active',
            }
          : s
      )
    );
  };

  const addBatch = (data: Omit<Batch, 'id' | 'enrolledCount'>): Batch => {
    const newBatch: Batch = {
      ...data,
      id: `batch-${Date.now()}`,
      enrolledCount: 0,
    };
    setBatches((prev) => [...prev, newBatch]);
    return newBatch;
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
  };

  const markBatchAttendance = (
    batchId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    teacherId: string
  ) => {
    const batch = batches.find((b) => b.id === batchId);
    const batchName = batch ? batch.name : 'Class Batch';

    // Remove existing records for this batch & date to allow updates
    const filtered = attendance.filter((a) => !(a.batchId === batchId && a.date === date));

    const newRecords: AttendanceRecord[] = records.map((r) => {
      const student = students.find((s) => s.id === r.studentId);
      return {
        id: `att-${Date.now()}-${r.studentId}`,
        date,
        batchId,
        batchName,
        studentId: r.studentId,
        studentName: student?.fullName || 'Student',
        studentRollNumber: student?.studentIdNumber || 'N/A',
        status: r.status,
        remarks: r.remarks,
        markedByTeacherId: teacherId,
      };
    });

    setAttendance([...filtered, ...newRecords]);

    // Send absent notifications for parents
    const absentCount = records.filter((r) => r.status === 'absent').length;
    if (absentCount > 0) {
      addNotification({
        title: `Absence Alert: ${absentCount} Student(s) Absent`,
        message: `${absentCount} student(s) marked absent in ${batchName} on ${date}. Automated SMS alert dispatched to parents.`,
        category: 'Attendance',
        targetRole: 'parents',
      });
    }
  };

  const recordFeePayment = (data: Omit<FeeReceipt, 'id' | 'receiptNumber'>): FeeReceipt => {
    const receiptNumber = `REC-2026-${feeReceipts.length + 1046}`;
    const newReceipt: FeeReceipt = {
      ...data,
      id: `rec-${Date.now()}`,
      receiptNumber,
    };
    setFeeReceipts((prev) => [newReceipt, ...prev]);

    // Update student's paidFee
    setStudents((prev) =>
      prev.map((s) =>
        s.id === data.studentId
          ? { ...s, paidFee: s.paidFee + data.amount }
          : s
      )
    );

    addNotification({
      title: 'Fee Payment Received',
      message: `₹${data.amount.toLocaleString('en-IN')} received for ${data.studentName} (${receiptNumber}). Receipt generated.`,
      category: 'Fee',
      targetRole: 'parents',
    });

    return newReceipt;
  };

  const createHomework = (data: Omit<Homework, 'id' | 'submissions'>): Homework => {
    const newHw: Homework = {
      ...data,
      id: `hw-${Date.now()}`,
      submissions: [],
    };
    setHomework((prev) => [newHw, ...prev]);

    addNotification({
      title: `New Homework: ${data.subject}`,
      message: `${data.title} assigned for ${data.batchName}. Due: ${data.dueDate}`,
      category: 'Homework',
      targetRole: 'students',
    });

    return newHw;
  };

  const submitHomework = (
    hwId: string,
    studentId: string,
    studentName: string,
    content: string,
    fileAttachment?: string
  ) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setHomework((prev) =>
      prev.map((h) => {
        if (h.id === hwId) {
          const existing = h.submissions.filter((s) => s.studentId !== studentId);
          const isLate = new Date() > new Date(h.dueDate);
          return {
            ...h,
            submissions: [
              ...existing,
              {
                studentId,
                studentName,
                submittedAt: timeStr,
                content,
                fileAttachment,
                status: isLate ? 'Late' : 'Submitted',
              },
            ],
          };
        }
        return h;
      })
    );
  };

  const gradeHomeworkSubmission = (
    hwId: string,
    studentId: string,
    marks: number,
    feedback: string
  ) => {
    setHomework((prev) =>
      prev.map((h) => {
        if (h.id === hwId) {
          return {
            ...h,
            submissions: h.submissions.map((sub) =>
              sub.studentId === studentId
                ? {
                    ...sub,
                    marksObtained: marks,
                    teacherFeedback: feedback,
                    status: 'Graded',
                  }
                : sub
            ),
          };
        }
        return h;
      })
    );
  };

  const createExam = (data: Omit<Examination, 'id' | 'scores'>): Examination => {
    const newExam: Examination = {
      ...data,
      id: `exam-${Date.now()}`,
      scores: [],
    };
    setExams((prev) => [newExam, ...prev]);

    addNotification({
      title: `Exam Scheduled: ${data.title}`,
      message: `${data.subject} exam on ${data.examDate} (${data.totalMarks} marks) for ${data.batchName}.`,
      category: 'Exam',
      targetRole: 'students',
    });

    return newExam;
  };

  const saveExamScores = (examId: string, scores: StudentExamScore[], publish: boolean) => {
    // Sort scores descending to calculate ranks
    const sorted = [...scores].sort((a, b) => b.marksObtained - a.marksObtained);
    const rankedScores = sorted.map((s, idx) => ({ ...s, rank: idx + 1 }));

    setExams((prev) =>
      prev.map((e) =>
        e.id === examId
          ? {
              ...e,
              scores: rankedScores,
              isPublished: publish,
            }
          : e
      )
    );

    if (publish) {
      const exam = exams.find((e) => e.id === examId);
      addNotification({
        title: `Results Published: ${exam?.title || 'Examination'}`,
        message: `Marks and report cards for ${exam?.subject || 'Exam'} are now published and viewable by students & parents.`,
        category: 'Exam',
        targetRole: 'students',
      });
    }
  };

  const addStudyMaterial = (data: Omit<StudyMaterial, 'id' | 'downloadsCount'>): StudyMaterial => {
    const newMat: StudyMaterial = {
      ...data,
      id: `mat-${Date.now()}`,
      downloadsCount: 0,
    };
    setStudyMaterials((prev) => [newMat, ...prev]);

    addNotification({
      title: `Study Material Uploaded: ${data.subject}`,
      message: `${data.title} added by ${data.uploadedByTeacher} (Std ${data.standard}).`,
      category: 'Announcement',
      targetRole: 'students',
    });

    return newMat;
  };

  const incrementMaterialDownload = (id: string) => {
    setStudyMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m))
    );
  };

  const submitOnlineEnquiry = (
    data: Omit<OnlineEnquiry, 'id' | 'submittedAt' | 'status'>
  ): OnlineEnquiry => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newEnq: OnlineEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      submittedAt: timeStr,
      status: 'New',
    };
    setEnquiries((prev) => [newEnq, ...prev]);

    addNotification({
      title: 'New Online Admission Enquiry',
      message: `${data.studentName} (Std ${data.standard} ${data.board}) - Parent: ${data.parentName} (${data.parentPhone}).`,
      category: 'Enquiry',
      targetRole: 'admin',
    });

    return newEnq;
  };

  const updateEnquiryStatus = (id: string, status: OnlineEnquiry['status']) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const convertEnquiryToStudent = (
    enquiryId: string,
    batchId: string,
    fee: number,
    scholarship: number
  ): Student | null => {
    const enq = enquiries.find((e) => e.id === enquiryId);
    if (!enq) return null;

    const batch = batches.find((b) => b.id === batchId);
    const batchName = batch ? batch.name : 'General Batch';

    const newStudent = addStudent({
      fullName: enq.studentName,
      gender: 'Male',
      dateOfBirth: '2011-01-01',
      schoolName: enq.schoolName || 'Local School',
      standard: enq.standard,
      board: enq.board,
      academicYear: settings.academicYear,
      enrolledSubjects: enq.subjectsInterested,
      batchId,
      batchName,
      admissionDate: new Date().toISOString().split('T')[0],
      parentName: enq.parentName,
      parentPhone: enq.parentPhone,
      parentEmail: enq.parentEmail,
      parentRelation: 'Father',
      address: 'Pune, Maharashtra',
      emergencyContact: enq.parentPhone,
      totalFee: fee,
      discountScholarship: scholarship,
      status: 'Active',
    });

    updateEnquiryStatus(enquiryId, 'Enrolled');
    return newStudent;
  };

  const addExpense = (data: Omit<InstituteExpense, 'id'>): InstituteExpense => {
    const newExp: InstituteExpense = {
      ...data,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
    return newExp;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const addNotification = (data: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const resetToSampleData = () => {
    setSettings(initialSettings);
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setBatches(initialBatches);
    setAttendance(initialAttendance);
    setFeeReceipts(initialFeeReceipts);
    setHomework(initialHomework);
    setExams(initialExams);
    setStudyMaterials(initialStudyMaterials);
    setTimetable(initialTimetable);
    setNotifications(initialNotifications);
    setEnquiries(initialEnquiries);
    setExpenses(initialExpenses);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        currentUser,
        currentRole,
        setCurrentRole,
        selectedChildId,
        setSelectedChildId,
        activeView,
        setActiveView,
        activePortalTab,
        setActivePortalTab,
        language,
        setLanguage,
        theme,
        toggleTheme,
        students,
        teachers,
        batches,
        attendance,
        feeReceipts,
        homework,
        exams,
        studyMaterials,
        timetable,
        notifications,
        enquiries,
        expenses,
        addStudent,
        updateStudent,
        deleteStudent,
        promoteStudent,
        transferBatch,
        addBatch,
        updateBatch,
        deleteBatch,
        markBatchAttendance,
        recordFeePayment,
        createHomework,
        submitHomework,
        gradeHomeworkSubmission,
        createExam,
        saveExamScores,
        addStudyMaterial,
        incrementMaterialDownload,
        submitOnlineEnquiry,
        updateEnquiryStatus,
        convertEnquiryToStudent,
        addExpense,
        markNotificationRead,
        addNotification,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
