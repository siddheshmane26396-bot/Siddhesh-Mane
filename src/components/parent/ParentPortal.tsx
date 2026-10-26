import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  BookOpen,
  FileCheck2,
  Receipt,
  Phone,
  MessageCircle,
  Award,
  CreditCard,
  Printer,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Baby,
} from 'lucide-react';
import { PrintableReceipt } from '../common/PrintableReceipt';
import { PrintableReportCard } from '../common/PrintableReportCard';
import { FeeReceipt, PaymentMethod } from '../../types';

export const ParentPortal: React.FC = () => {
  const {
    students,
    selectedChildId,
    setSelectedChildId,
    attendance,
    homework,
    exams,
    feeReceipts,
    recordFeePayment,
    settings,
  } = useApp();

  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<FeeReceipt | null>(null);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);

  // Online Payment Checkout Modal state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(8000);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Linked children
  const linkedChildren = students.filter(
    (s) => s.id === 'stu-1' || s.id === 'stu-2' || s.parentName.toLowerCase().includes('sunita')
  );

  const currentChild = students.find((s) => s.id === selectedChildId) || linkedChildren[0];

  // Child statistics
  const childAttendance = attendance.filter((a) => a.studentId === currentChild.id);
  const presentCount = childAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendancePct = childAttendance.length > 0 ? Math.round((presentCount / childAttendance.length) * 100) : 95;
  const hasAbsences = childAttendance.some((a) => a.status === 'absent');

  // Homework for child's batch
  const childHomework = homework.filter((h) => h.batchId === currentChild.batchId);

  // Exams for child
  const childExams = exams.filter((e) => e.isPublished && e.scores.some((s) => s.studentId === currentChild.id));

  // Child receipts
  const childReceipts = feeReceipts.filter((r) => r.studentId === currentChild.id);
  const pendingFee = Math.max(0, currentChild.netFee - currentChild.paidFee);

  const handleOnlinePaymentSuccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      const receipt = recordFeePayment({
        studentId: currentChild.id,
        studentName: currentChild.fullName,
        studentIdNumber: currentChild.studentIdNumber,
        standard: currentChild.standard,
        batchName: currentChild.batchName,
        paymentDate: new Date().toISOString().split('T')[0],
        amount: Number(payAmount),
        paymentMethod: payMethod,
        transactionRef: `UPI/${Date.now().toString().slice(-8)}/RAZORPAY`,
        feeType: 'Installment',
        installmentMonth: 'Online Portal Installment',
        receivedBy: 'VidyaSetu Online Gateway',
        notes: 'Verified via Razorpay / UPI Instant Clearance',
      });

      setIsProcessingPayment(false);
      setIsPayModalOpen(false);
      setSelectedReceiptForPrint(receipt);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Child Selector */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Parent & Guardian Portal · Sunita Sharma
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Academic & Fee Monitoring: {currentChild.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Std {currentChild.standard} ({currentChild.board}) · Batch: <strong>{currentChild.batchName}</strong>
          </p>
        </div>

        {/* Child Switcher Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold mr-1">Switch Child:</span>
          {linkedChildren.map((ch) => {
            const isSel = ch.id === currentChild.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChildId(ch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>{ch.fullName} (Std {ch.standard})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Attendance Rate</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {attendancePct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {hasAbsences ? '1 absence recorded (SMS dispatched)' : '100% regular attendance'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Pending Tuition Fees</span>
            <Receipt className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            ₹{pendingFee.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {pendingFee > 0 ? 'Installment due Nov 15' : 'All annual fees cleared'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Report Card Status</span>
            <Award className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-sky-700 font-mono">
            Grade A1
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            <button onClick={() => setIsReportCardOpen(true)} className="text-sky-600 hover:underline font-semibold">
              View Formal Report Card →
            </button>
          </div>
        </div>
      </div>

      {/* Fee Payment Section with simulated online checkout */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Tuition Fee Ledger & Online UPI Payments</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely clear pending installments via UPI / Card or download authorized tax-deductible receipts.
            </p>
          </div>

          {pendingFee > 0 && (
            <button
              onClick={() => {
                setPayAmount(pendingFee);
                setIsPayModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay Balance Online (₹{pendingFee.toLocaleString('en-IN')})</span>
            </button>
          )}
        </div>

        {/* Past receipts table */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Receipt No</th>
                <th className="py-2.5 px-3">Payment Date</th>
                <th className="py-2.5 px-3">Amount Paid</th>
                <th className="py-2.5 px-3">Payment Mode</th>
                <th className="py-2.5 px-3">Installment Notes</th>
                <th className="py-2.5 px-3 text-right">Download Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {childReceipts.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-sky-700">{r.receiptNumber}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.paymentDate}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    ₹{r.amount.toLocaleString('en-IN')}
                  </td>
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

      {/* Homework & Academic Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child Homework Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Child's Daily Homework Status
          </h3>

          <div className="space-y-3">
            {childHomework.map((hw) => {
              const sub = hw.submissions.find((s) => s.studentId === currentChild.id);
              return (
                <div key={hw.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{hw.title}</span>
                    <span className="font-mono text-slate-500 text-[11px]">Due: {hw.dueDate}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Subject: {hw.subject} · {hw.chapter}
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    {sub ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>
                          {sub.status === 'Graded'
                            ? `Graded: ${sub.marksObtained}/${hw.totalMarks} Marks`
                            : 'Submitted by student'}
                        </span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Pending Submission</span>
                      </span>
                    )}

                    {sub?.teacherFeedback && (
                      <span className="text-slate-500 italic max-w-[180px] truncate">
                        "{sub.teacherFeedback}"
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Marks & Teacher Feedback */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Exam Scores & Performance</h3>
            <button
              onClick={() => setIsReportCardOpen(true)}
              className="text-xs text-sky-600 hover:underline font-semibold"
            >
              Print Progress Report →
            </button>
          </div>

          <div className="space-y-3">
            {childExams.map((exam) => {
              const sc = exam.scores.find((s) => s.studentId === currentChild.id);
              return (
                <div key={exam.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{exam.title}</span>
                    <span className="font-mono font-bold text-sky-800">
                      {sc?.marksObtained} / {exam.totalMarks} Marks
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{exam.subject}</span>
                    {sc?.rank && <span className="font-bold text-emerald-700">Rank #{sc.rank}</span>}
                  </div>
                  {sc?.remarks && (
                    <div className="text-[10px] text-slate-600 italic bg-white p-2 rounded border border-slate-200 mt-1">
                      Faculty Appraisal: "{sc.remarks}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Institute Help Box */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-600 text-[11px]">
            <span>Need to speak with batch mentor?</span>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Call Desk</span>
              </a>
              <a
                href="https://wa.me/919822012345"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-semibold flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Online Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">Secure Online Fee Payment</h3>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-slate-600">
              Paying tuition installment for <strong className="text-slate-900">{currentChild.fullName}</strong> ({currentChild.studentIdNumber}).
            </p>

            <form onSubmit={handleOnlinePaymentSuccess} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Installment Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-base focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Payment Gateway / Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('UPI')}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                      payMethod === 'UPI'
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>UPI QR / Apps</div>
                    <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod('Card')}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                      payMethod === 'Card'
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>Debit / Credit Card</div>
                    <div className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</div>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>256-bit encrypted gateway. Official tax invoice receipt generated instantly upon successful confirmation.</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  {isProcessingPayment ? (
                    <span>Verifying with Bank...</span>
                  ) : (
                    <span>Confirm & Pay ₹{payAmount.toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Receipt Modal */}
      {selectedReceiptForPrint && (
        <PrintableReceipt
          receipt={selectedReceiptForPrint}
          settings={settings}
          onClose={() => setSelectedReceiptForPrint(null)}
        />
      )}

      {/* Official Report Card Modal */}
      {isReportCardOpen && (
        <PrintableReportCard
          student={currentChild}
          exams={exams}
          settings={settings}
          onClose={() => setIsReportCardOpen(false)}
        />
      )}
    </div>
  );
};
