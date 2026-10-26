import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  Users,
  CalendarCheck,
  Receipt,
  AlertTriangle,
  Award,
  Building,
  Cloud,
  ExternalLink,
  Table,
} from 'lucide-react';
import { GoogleWorkspaceService } from '../../services/workspace';

export const ReportsExport: React.FC = () => {
  const { students, feeReceipts, attendance, exams, homework, expenses, batches } = useApp();

  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportStudents = () => {
    const headers = ['StudentID', 'Name', 'Standard', 'Board', 'Batch', 'ParentName', 'Phone', 'NetFee', 'PaidFee', 'Balance'];
    const rows = students.map((s) => [
      s.studentIdNumber,
      `"${s.fullName}"`,
      s.standard,
      `"${s.board}"`,
      `"${s.batchName}"`,
      `"${s.parentName}"`,
      s.parentPhone,
      s.netFee,
      s.paidFee,
      Math.max(0, s.netFee - s.paidFee),
    ]);
    downloadCSV('VidyaSetu_Student_Directory.csv', headers, rows);
  };

  const handleExportFees = () => {
    const headers = ['ReceiptNo', 'StudentName', 'RollNo', 'Date', 'Amount', 'PaymentMethod', 'FeeType', 'TransactionRef'];
    const rows = feeReceipts.map((r) => [
      r.receiptNumber,
      `"${r.studentName}"`,
      r.studentIdNumber,
      r.paymentDate,
      r.amount,
      r.paymentMethod,
      r.feeType,
      `"${r.transactionRef || ''}"`,
    ]);
    downloadCSV('VidyaSetu_Fee_Collections.csv', headers, rows);
  };

  const handleExportOutstanding = () => {
    const headers = ['RollNo', 'StudentName', 'Standard', 'Batch', 'ParentPhone', 'TotalFee', 'PaidFee', 'OutstandingBalance'];
    const rows = students
      .filter((s) => s.netFee > s.paidFee)
      .map((s) => [
        s.studentIdNumber,
        `"${s.fullName}"`,
        s.standard,
        `"${s.batchName}"`,
        s.parentPhone,
        s.netFee,
        s.paidFee,
        s.netFee - s.paidFee,
      ]);
    downloadCSV('VidyaSetu_Outstanding_Dues.csv', headers, rows);
  };

  const handleExportAttendance = () => {
    const headers = ['Date', 'Batch', 'StudentID', 'StudentName', 'Status', 'Remarks'];
    const rows = attendance.map((a) => [
      a.date,
      `"${a.batchName}"`,
      a.studentRollNumber,
      `"${a.studentName}"`,
      a.status,
      `"${a.remarks || ''}"`,
    ]);
    downloadCSV('VidyaSetu_Attendance_Register.csv', headers, rows);
  };

  const handleExportExams = () => {
    const headers = ['ExamTitle', 'Subject', 'Date', 'StudentName', 'RollNo', 'MarksObtained', 'TotalMarks', 'Rank'];
    const rows: (string | number)[][] = [];
    exams.forEach((exam) => {
      exam.scores.forEach((sc) => {
        rows.push([
          `"${exam.title}"`,
          exam.subject,
          exam.examDate,
          `"${sc.studentName}"`,
          sc.studentRollNumber,
          sc.marksObtained,
          exam.totalMarks,
          sc.rank || '-',
        ]);
      });
    });
    downloadCSV('VidyaSetu_Exam_Marksheets.csv', headers, rows);
  };

  const handleExportExpenses = () => {
    const headers = ['VoucherNo', 'Title', 'Category', 'Date', 'Amount', 'PaidTo', 'Method'];
    const rows = expenses.map((e) => [
      e.receiptNumber || 'EXP',
      `"${e.title}"`,
      e.category,
      e.date,
      e.amount,
      `"${e.paidTo}"`,
      e.paymentMethod,
    ]);
    downloadCSV('VidyaSetu_Expenses_Ledger.csv', headers, rows);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Reports & Data Exports</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate structured CSV sheets and print-ready administrative audit reports for audits, accounting, and compliance.
        </p>
      </div>

      {/* Google Workspace Cloud Integrations Banner */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Google Workspace Cloud Sync Active</h4>
            <p className="text-xs text-slate-600">
              Synchronize student registers to Google Sheets, backup documents to Google Drive, and sync exam schedules to Google Calendar.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
          <a
            href={GoogleWorkspaceService.getSheetsExportUrl('VidyaSetu Academy Master Records')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Open Google Sheets</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={GoogleWorkspaceService.getDriveMaterialsFolderUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Google Drive Archive</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Student Directory */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs">
          <div>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Student Admission Register</h3>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Complete student roll list with standard, board, batch, parent contact, and active enrollment statuses.
            </p>
          </div>
          <button
            onClick={handleExportStudents}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV ({students.length} Records)</span>
          </button>
        </div>

        {/* Fee Collection */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Fee Collection Report</h3>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Audited transaction register with receipt numbers, UPI references, payment methods, and GST breakdowns.
            </p>
          </div>
          <button
            onClick={handleExportFees}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV ({feeReceipts.length} Receipts)</span>
          </button>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs">
          <div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Outstanding Dues Ledger</h3>
            <p className="text-slate-500 mt-1 leading-relaxed">
              List of all student accounts with overdue installments, parent phone numbers for follow-up reminders.
            </p>
          </div>
          <button
            onClick={handleExportOutstanding}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Outstanding CSV</span>
          </button>
        </div>

        {/* Attendance Register */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Attendance Log & Percentages</h3>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Batch-wise daily attendance records, absent flags, late arrivals, and monthly student percentage reports.
            </p>
          </div>
          <button
            onClick={handleExportAttendance}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Attendance CSV</span>
          </button>
        </div>

        {/* Exam Marksheets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs">
          <div>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Examination Results & Ranks</h3>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Consolidated marks scored across Unit Tests, Mid-Terms, and Mock Board exams with subject-wise ranks.
            </p>
          </div>
          <button
            onClick={handleExportExams}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Results CSV</span>
          </button>
        </div>

        {/* Expenses Ledger */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs">
          <div>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Expenses & Salary Ledger</h3>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Expenditure on faculty remuneration, classroom rent, utility bills, study material printing, and software.
            </p>
          </div>
          <button
            onClick={handleExportExpenses}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Expenses CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
