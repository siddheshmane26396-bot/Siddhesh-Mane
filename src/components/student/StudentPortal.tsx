import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  BookOpen,
  FileCheck2,
  FolderDown,
  Calendar,
  Receipt,
  CreditCard,
  Printer,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { HomeworkModule } from '../common/HomeworkModule';
import { ExamsModule } from '../common/ExamsModule';
import { StudyMaterialsModule } from '../common/StudyMaterialsModule';
import { TimetableModule } from '../common/TimetableModule';
import { PrintableReportCard } from '../common/PrintableReportCard';
import { PrintableIDCard } from '../common/PrintableIDCard';
import { PrintableReceipt } from '../common/PrintableReceipt';
import { FeeReceipt } from '../../types';

export const StudentPortal: React.FC = () => {
  const {
    activePortalTab,
    setActivePortalTab,
    students,
    attendance,
    homework,
    exams,
    feeReceipts,
    settings,
  } = useApp();

  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<FeeReceipt | null>(null);

  // Current logged in student: Aarav Sharma (stu-1)
  const currentStudent = students.find((s) => s.id === 'stu-1') || students[0];

  // Attendance stats for Aarav
  const myAttendance = attendance.filter((a) => a.studentId === currentStudent.id);
  const presentCount = myAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendancePct = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 96;

  // Pending Homework
  const pendingHw = homework.filter(
    (h) => h.batchId === currentStudent.batchId && !h.submissions.some((s) => s.studentId === currentStudent.id)
  );

  // Recent scores
  const recentExams = exams.filter((e) => e.isPublished && e.scores.some((s) => s.studentId === currentStudent.id));

  // My receipts
  const myReceipts = feeReceipts.filter((r) => r.studentId === currentStudent.id);

  // Render tab modules
  if (activePortalTab === 'timetable') return <TimetableModule />;
  if (activePortalTab === 'homework') return <HomeworkModule />;
  if (activePortalTab === 'exams') return <ExamsModule />;
  if (activePortalTab === 'materials') return <StudyMaterialsModule />;
  if (activePortalTab === 'attendance') {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">My Attendance History</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Batch</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAttendance.map((att) => (
                <tr key={att.id}>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{att.date}</td>
                  <td className="py-2.5 px-3 text-slate-600">{att.batchName}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        att.status === 'present'
                          ? 'bg-emerald-50 text-emerald-700'
                          : att.status === 'absent'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 italic">{att.remarks || 'Regular attendance'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (activePortalTab === 'fees') {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-slate-900">My Tuition Fee Status & Receipts</h2>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Total Net Fee (AY 2026-27):</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono">
              ₹{currentStudent.netFee.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Total Paid:</div>
            <div className="text-xl font-extrabold text-emerald-600 font-mono">
              ₹{currentStudent.paidFee.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Balance Pending:</div>
            <div className="text-xl font-extrabold text-amber-600 font-mono">
              ₹{Math.max(0, currentStudent.netFee - currentStudent.paidFee).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Receipt No</th>
                <th className="py-2.5 px-3">Payment Date</th>
                <th className="py-2.5 px-3">Amount (₹)</th>
                <th className="py-2.5 px-3">Payment Mode</th>
                <th className="py-2.5 px-3">Particulars</th>
                <th className="py-2.5 px-3 text-right">Official Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myReceipts.map((r) => (
                <tr key={r.id}>
                  <td className="py-2.5 px-3 font-mono font-bold text-sky-700">{r.receiptNumber}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.paymentDate}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">₹{r.amount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-slate-700">{r.paymentMethod}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.installmentMonth || r.feeType}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceiptForPrint(r)}
                      className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium inline-flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Default: Student Dashboard
  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Student Portal · {currentStudent.fullName}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Standard {currentStudent.standard} ({currentStudent.board})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Batch: <strong className="text-slate-700">{currentStudent.batchName}</strong> · Roll No:{' '}
            <span className="font-mono">{currentStudent.studentIdNumber}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIdCardOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>My Student ID Card</span>
          </button>
          <button
            onClick={() => setIsReportCardOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Official Report Card</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Overall Attendance Rate</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {attendancePct}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Eligible for all board exams</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Pending Homework</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            {pendingHw.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Due in the next 3 days</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Latest Exam Score</span>
            <Award className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-sky-700 font-mono">
            95% (76/80)
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Rank #1 in Mid-Term Maths</div>
        </div>
      </div>

      {/* Main Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Upcoming Homework Deadlines</h3>
            <button
              onClick={() => setActivePortalTab('homework')}
              className="text-xs text-sky-600 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {pendingHw.length === 0 ? (
              <div className="py-6 text-center text-slate-400">All assigned homework submitted! 🎉</div>
            ) : (
              pendingHw.map((hw) => (
                <div key={hw.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{hw.title}</span>
                    <span className="font-mono text-amber-700 font-semibold text-[11px]">Due {hw.dueDate}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {hw.subject} · {hw.chapter} · Max: {hw.totalMarks} marks
                  </div>
                  <button
                    onClick={() => setActivePortalTab('homework')}
                    className="mt-1 text-sky-600 hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Submit Answer Solution</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Test Results */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Recent Test Performance</h3>
            <button
              onClick={() => setIsReportCardOpen(true)}
              className="text-xs text-sky-600 hover:underline font-semibold"
            >
              Full Report Card →
            </button>
          </div>

          <div className="space-y-3">
            {recentExams.map((exam) => {
              const sc = exam.scores.find((s) => s.studentId === currentStudent.id);
              return (
                <div key={exam.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{exam.title}</span>
                    <span className="font-mono font-bold text-sky-800">
                      {sc?.marksObtained} / {exam.totalMarks} Marks
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{exam.subject} ({exam.examDate})</span>
                    {sc?.rank && <span className="text-emerald-700 font-bold">Rank #{sc.rank}</span>}
                  </div>
                  {sc?.remarks && (
                    <div className="text-[10px] text-slate-500 italic mt-0.5">
                      Teacher Remark: "{sc.remarks}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isReportCardOpen && (
        <PrintableReportCard
          student={currentStudent}
          exams={exams}
          settings={settings}
          onClose={() => setIsReportCardOpen(false)}
        />
      )}

      {isIdCardOpen && (
        <PrintableIDCard
          student={currentStudent}
          settings={settings}
          onClose={() => setIsIdCardOpen(false)}
        />
      )}

      {selectedReceiptForPrint && (
        <PrintableReceipt
          receipt={selectedReceiptForPrint}
          settings={settings}
          onClose={() => setSelectedReceiptForPrint(null)}
        />
      )}
    </div>
  );
};
