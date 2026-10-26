import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  IndianRupee,
  CalendarCheck,
  AlertTriangle,
  GraduationCap,
  TrendingUp,
  Clock,
  UserPlus,
  Receipt,
  FileCheck2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    batches,
    attendance,
    feeReceipts,
    exams,
    enquiries,
    timetable,
    setActivePortalTab,
    language,
    settings,
  } = useApp();

  // Metrics
  const activeStudentsCount = students.filter((s) => s.status === 'Active').length;

  const totalFeeCollected = feeReceipts.reduce((acc, curr) => acc + curr.amount, 0);

  // Month collections (e.g. current month)
  const currentMonth = '2026-10';
  const monthlyCollection = feeReceipts
    .filter((r) => r.paymentDate.startsWith(currentMonth))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOutstanding = students.reduce((acc, curr) => {
    return acc + Math.max(0, curr.netFee - curr.paidFee);
  }, 0);

  // Today's attendance percentage
  const todayDate = '2026-10-26';
  const todayRecords = attendance.filter((a) => a.date === todayDate);
  const todayPresent = todayRecords.filter((a) => a.status === 'present' || a.status === 'late').length;
  const todayAttendancePct =
    todayRecords.length > 0 ? ((todayPresent / todayRecords.length) * 100).toFixed(0) : '94';

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;

  // Recent admissions
  const recentStudents = [...students].slice(0, 5);

  // Today's schedule
  const todayClasses = timetable.filter((t) => t.dayOfWeek === 'Monday').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">
            <span>Academic Year {settings.academicYear}</span>
            <span>·</span>
            <span>Standards 1 to 12</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Institute Operational Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daily monitoring of enrollments, fee collections, faculty lectures, and student attendance.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePortalTab('students')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student Admission</span>
          </button>
          <button
            onClick={() => setActivePortalTab('fees')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Record Fee Payment</span>
          </button>
          <button
            onClick={() => setActivePortalTab('attendance')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Batch Attendance</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>{getTranslation(language, 'activeStudents')}</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {activeStudentsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold font-mono">+4</span>
            <span>admitted this month</span>
          </div>
        </div>

        {/* Monthly Collection */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>{getTranslation(language, 'monthlyCollection')}</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            ₹{monthlyCollection.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Total FY: ₹{totalFeeCollected.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>{getTranslation(language, 'todayAttendance')}</span>
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {todayAttendancePct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {todayPresent} present across active batches
          </div>
        </div>

        {/* Total Outstanding Dues */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>{getTranslation(language, 'pendingFees')}</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Due across {students.filter((s) => s.netFee > s.paidFee).length} student accounts
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Recent Admissions & Live Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Admissions Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-sm text-slate-900">Recent Student Admissions</h3>
            </div>
            <button
              onClick={() => setActivePortalTab('students')}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
            >
              <span>View All ({students.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Class & Board</th>
                  <th className="py-2.5 px-3">Batch</th>
                  <th className="py-2.5 px-3 text-right">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((stu) => {
                  const isPaid = stu.paidFee >= stu.netFee;
                  const isPartial = stu.paidFee > 0 && !isPaid;
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-600">
                        {stu.studentIdNumber}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {stu.fullName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        Std {stu.standard} ({stu.board === 'Maharashtra State Board' ? 'SSC' : stu.board})
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                        {stu.batchName}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isPartial
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isPaid ? 'Full Paid' : isPartial ? 'Partial' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Today's Lectures & Enquiries Alert */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">Today's Class Schedule</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Monday</span>
            </div>

            <div className="space-y-3">
              {todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cls.subject}</span>
                    <span className="font-mono text-sky-700 font-semibold">{cls.startTime} - {cls.endTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{cls.batchName}</span>
                    <span>Teacher: {cls.teacherName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Classroom: {cls.classroom}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Enquiries Banner */}
          <div className="bg-gradient-to-br from-sky-900 to-indigo-900 text-white p-5 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-300" />
                <h4 className="font-bold text-sm text-white">Online Admission Inquiries</h4>
              </div>
              <span className="px-2 py-0.5 bg-sky-500/30 text-sky-200 text-xs font-mono font-bold rounded">
                {newEnquiriesCount} New
              </span>
            </div>
            <p className="text-xs text-sky-100 leading-relaxed">
              Parents submitted enquiry forms from the public website. Review prospective students and convert them into registered batches with 1 click.
            </p>
            <button
              onClick={() => setActivePortalTab('enquiries')}
              className="w-full py-2 bg-white text-slate-900 hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage Admission Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
