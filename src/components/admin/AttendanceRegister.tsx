import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Calendar,
  Check,
  X,
  Clock,
  AlertTriangle,
  Download,
  Printer,
  Send,
  Users,
} from 'lucide-react';

export const AttendanceRegister: React.FC = () => {
  const { batches, students, attendance, markBatchAttendance, teachers } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-26');

  // Local state for attendance marking for the selected batch on the selected date
  const batchStudents = students.filter((s) => s.batchId === selectedBatchId);
  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  // Initialize or read status from state
  const getStatusForStudent = (studentId: string): AttendanceStatus => {
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate && a.batchId === selectedBatchId
    );
    return record ? record.status : 'present'; // default present
  };

  const [tempStatusMap, setTempStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [tempRemarksMap, setTempRemarksMap] = useState<Record<string, string>>({});
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setTempStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setTempRemarksMap((prev) => ({ ...prev, [studentId]: remark }));
  };

  const handleSaveAttendance = () => {
    const records = batchStudents.map((s) => ({
      studentId: s.id,
      status: tempStatusMap[s.id] || getStatusForStudent(s.id),
      remarks: tempRemarksMap[s.id] || undefined,
    }));

    const teacherId = selectedBatch?.teacherId || teachers[0]?.id || 'tch-1';
    markBatchAttendance(selectedBatchId, selectedDate, records, teacherId);

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    batchStudents.forEach((s) => {
      newMap[s.id] = status;
    });
    setTempStatusMap((prev) => ({ ...prev, ...newMap }));
  };

  // Calculate monthly stats for students in this batch
  const getStudentStats = (studentId: string) => {
    const studentRecords = attendance.filter((a) => a.studentId === studentId);
    if (studentRecords.length === 0) return { total: 0, present: 0, pct: 100 };

    const present = studentRecords.filter((a) => a.status === 'present' || a.status === 'late').length;
    const pct = Math.round((present / studentRecords.length) * 100);
    return { total: studentRecords.length, present, pct };
  };

  const handleExportAttendanceCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Date', 'Batch', 'Status', 'Remarks'];
    const rows = batchStudents.map((s) => {
      const status = tempStatusMap[s.id] || getStatusForStudent(s.id);
      return [s.studentIdNumber, `"${s.fullName}"`, selectedDate, `"${selectedBatch?.name}"`, status, ''];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${selectedBatch?.name}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daily Attendance Register & Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark daily attendance by batch, calculate monthly percentages, and trigger automated absence notices to parents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
          <button
            onClick={handleExportAttendanceCSV}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Batch & Date Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Select Batch:</span>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-medium"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} (Std {b.standard})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Attendance Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-medium font-mono"
            />
          </div>
        </div>

        {/* 1-Click Quick Mark buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Quick Mark All:</span>
          <button
            type="button"
            onClick={() => handleMarkAll('present')}
            className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
          >
            All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('absent')}
            className="px-2 py-1 text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {isSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between">
          <span>✓ Attendance successfully committed to database! SMS alerts queued for absent students.</span>
        </div>
      )}

      {/* Attendance Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Parent Contact</th>
                <th className="py-3 px-3">Monthly Attendance %</th>
                <th className="py-3 px-3">Mark Status ({selectedDate})</th>
                <th className="py-3 px-3">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batchStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No students currently allocated to this batch.
                  </td>
                </tr>
              ) : (
                batchStudents.map((stu) => {
                  const currentStatus = tempStatusMap[stu.id] || getStatusForStudent(stu.id);
                  const stats = getStudentStats(stu.id);
                  const isLowAttendance = stats.pct < 75;

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-600">
                        {stu.studentIdNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{stu.fullName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{stu.schoolName}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {stu.parentPhone}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${isLowAttendance ? 'text-rose-600' : 'text-slate-800'}`}>
                            {stats.pct}%
                          </span>
                          {isLowAttendance && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-semibold flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> Low
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {stats.present} / {stats.total} sessions attended
                        </div>
                      </td>

                      {/* Status Selector Segmented Buttons */}
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stu.id, 'present')}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            P
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stu.id, 'absent')}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stu.id, 'late')}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              currentStatus === 'late'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            L
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stu.id, 'excused')}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              currentStatus === 'excused'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            E
                          </button>
                        </div>
                      </td>

                      {/* Remark Input */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          placeholder="e.g. Informed absence / traffic delay"
                          value={tempRemarksMap[stu.id] || ''}
                          onChange={(e) => handleRemarkChange(stu.id, e.target.value)}
                          className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Save Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Legend: <strong>P</strong> (Present), <strong>A</strong> (Absent - Triggers Parent Alert), <strong>L</strong> (Late), <strong>E</strong> (Excused).
          </div>
          <button
            onClick={handleSaveAttendance}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Commit Batch Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
