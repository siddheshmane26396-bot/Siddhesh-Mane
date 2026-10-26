import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Search,
  Filter,
  UserPlus,
  Download,
  CreditCard,
  FileCheck2,
  Trash2,
  Edit,
  ArrowRightCircle,
  GraduationCap,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { StudentAdmissionModal } from './StudentAdmissionModal';
import { PrintableIDCard } from '../common/PrintableIDCard';
import { PrintableReportCard } from '../common/PrintableReportCard';

export const StudentsList: React.FC = () => {
  const { students, batches, deleteStudent, promoteStudent, transferBatch, exams, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | undefined>(undefined);

  // Print Modals
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);

  // Transfer / Promotion modal state
  const [transferringStudent, setTransferringStudent] = useState<Student | null>(null);
  const [targetBatchId, setTargetBatchId] = useState('');

  // Filtering
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentPhone.includes(searchQuery);

    const matchesStandard = selectedStandard === 'all' || s.standard.toString() === selectedStandard;
    const matchesBoard = selectedBoard === 'all' || s.board === selectedBoard;
    const matchesBatch = selectedBatch === 'all' || s.batchId === selectedBatch;

    return matchesSearch && matchesStandard && matchesBoard && matchesBatch;
  });

  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Full Name',
      'Standard',
      'Board',
      'Batch',
      'School',
      'Parent Name',
      'Parent Phone',
      'Net Fee',
      'Paid Fee',
      'Balance',
      'Status',
    ];
    const rows = filteredStudents.map((s) => [
      s.studentIdNumber,
      `"${s.fullName}"`,
      s.standard,
      `"${s.board}"`,
      `"${s.batchName}"`,
      `"${s.schoolName}"`,
      `"${s.parentName}"`,
      s.parentPhone,
      s.netFee,
      s.paidFee,
      Math.max(0, s.netFee - s.paidFee),
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VidyaSetu_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteTransfer = () => {
    if (!transferringStudent || !targetBatchId) return;
    const targetBatch = batches.find((b) => b.id === targetBatchId);
    if (!targetBatch) return;

    transferBatch(transferringStudent.id, targetBatch.id, targetBatch.name);
    setTransferringStudent(null);
  };

  const handlePromote = (student: Student) => {
    if (student.standard >= 12) {
      alert('Student is already in Standard 12. You can archive them upon board graduation.');
      return;
    }
    const nextStd = student.standard + 1;
    const matchingBatch = batches.find((b) => b.standard === nextStd);
    const batchId = matchingBatch ? matchingBatch.id : batches[0].id;
    const batchName = matchingBatch ? matchingBatch.name : `Standard ${nextStd} Batch`;

    if (confirm(`Promote ${student.fullName} from Standard ${student.standard} to Standard ${nextStd}?`)) {
      promoteStudent(student.id, nextStd, batchId, batchName);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Directory & Admissions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage registrations for Standards 1 to 12, student ID cards, batch allocations, and academic promotions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setStudentToEdit(undefined);
              setIsAdmissionModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student Admission</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student, roll no, mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Standard Filter */}
        <div>
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            <option value="all">All Standards (1 to 12)</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s.toString()}>
                Standard {s}
              </option>
            ))}
          </select>
        </div>

        {/* Board Filter */}
        <div>
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            <option value="all">All Boards</option>
            <option value="Maharashtra State Board">Maharashtra State Board (SSC/HSC)</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
          </select>
        </div>

        {/* Batch Filter */}
        <div>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Student Details</th>
                <th className="py-3 px-3">Class & Board</th>
                <th className="py-3 px-3">Batch & Timings</th>
                <th className="py-3 px-3">Parent Contact</th>
                <th className="py-3 px-3">Fee Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No students found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const isPaid = stu.paidFee >= stu.netFee;
                  const balance = Math.max(0, stu.netFee - stu.paidFee);
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{stu.fullName}</div>
                        <div className="text-[11px] font-mono text-sky-700 font-medium">
                          {stu.studentIdNumber}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {stu.schoolName}
                        </div>
                      </td>

                      {/* Standard & Board */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">Std {stu.standard}</div>
                        <div className="text-[11px] text-slate-500">
                          {stu.board === 'Maharashtra State Board' ? 'SSC / State' : stu.board}
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 truncate max-w-[160px]">
                          {stu.batchName}
                        </div>
                        <div className="text-[10px] text-slate-400">Enrolled: {stu.enrolledSubjects.length} subjects</div>
                      </td>

                      {/* Parent */}
                      <td className="py-3 px-3">
                        <div className="text-slate-800">{stu.parentName} ({stu.parentRelation})</div>
                        <div className="font-mono text-slate-500 text-[11px]">{stu.parentPhone}</div>
                      </td>

                      {/* Fee */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-semibold text-slate-900">
                          ₹{stu.paidFee.toLocaleString('en-IN')} / ₹{stu.netFee.toLocaleString('en-IN')}
                        </div>
                        {balance > 0 ? (
                          <div className="text-[10px] font-mono font-medium text-amber-600">
                            Due: ₹{balance.toLocaleString('en-IN')}
                          </div>
                        ) : (
                          <div className="text-[10px] font-medium text-emerald-600">Cleared</div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print ID Card */}
                          <button
                            onClick={() => setIdCardStudent(stu)}
                            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                            title="Print Student ID Card"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Report Card */}
                          <button
                            onClick={() => setReportCardStudent(stu)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Generate Academic Report Card"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Transfer Batch */}
                          <button
                            onClick={() => {
                              setTransferringStudent(stu);
                              setTargetBatchId(stu.batchId);
                            }}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            title="Transfer Batch"
                          >
                            <ArrowRightCircle className="w-3.5 h-3.5" />
                          </button>

                          {/* Promote */}
                          <button
                            onClick={() => handlePromote(stu)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Promote to Next Class"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setStudentToEdit(stu);
                              setIsAdmissionModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="Edit Student Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Remove record for ${stu.fullName}?`)) {
                                deleteStudent(stu.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admission Modal */}
      <StudentAdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
        studentToEdit={studentToEdit}
      />

      {/* ID Card Modal */}
      {idCardStudent && (
        <PrintableIDCard
          student={idCardStudent}
          settings={settings}
          onClose={() => setIdCardStudent(null)}
        />
      )}

      {/* Report Card Modal */}
      {reportCardStudent && (
        <PrintableReportCard
          student={reportCardStudent}
          exams={exams}
          settings={settings}
          onClose={() => setReportCardStudent(null)}
        />
      )}

      {/* Batch Transfer Modal */}
      {transferringStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Transfer Batch for {transferringStudent.fullName}
            </h3>
            <p className="text-slate-500">
              Current Batch: <span className="font-semibold text-slate-800">{transferringStudent.batchName}</span>
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Destination Batch</label>
              <select
                value={targetBatchId}
                onChange={(e) => setTargetBatchId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.scheduleTime})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setTransferringStudent(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
