import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeeReceipt, PaymentMethod, InstituteExpense } from '../../types';
import {
  IndianRupee,
  Receipt,
  Plus,
  Printer,
  Download,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import { PrintableReceipt } from '../common/PrintableReceipt';

export const FeeManager: React.FC = () => {
  const {
    students,
    feeReceipts,
    recordFeePayment,
    expenses,
    addExpense,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'receipts' | 'outstanding' | 'record' | 'expenses'>('receipts');
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<FeeReceipt | null>(null);

  // Record Payment Form
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState<number>(8000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [feeType, setFeeType] = useState<FeeReceipt['feeType']>('Installment');
  const [installmentMonth, setInstallmentMonth] = useState('Term 2 Installment');
  const [receivedBy, setReceivedBy] = useState('Accounts Desk - Sudhir');
  const [notes, setNotes] = useState('');

  // Add Expense Form State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<InstituteExpense['category']>('Faculty Salary');
  const [expenseAmount, setExpenseAmount] = useState<number>(25000);
  const [expensePaidTo, setExpensePaidTo] = useState('');
  const [expenseMethod, setExpenseMethod] = useState<PaymentMethod>('Bank Transfer');

  // Summary Metrics
  const totalCollected = feeReceipts.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netSurplus = totalCollected - totalExpenses;

  const totalOutstanding = students.reduce((acc, curr) => {
    return acc + Math.max(0, curr.netFee - curr.paidFee);
  }, 0);

  const studentsWithBalance = students.filter((s) => s.netFee > s.paidFee);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const receipt = recordFeePayment({
      studentId: student.id,
      studentName: student.fullName,
      studentIdNumber: student.studentIdNumber,
      standard: student.standard,
      batchName: student.batchName,
      paymentDate: new Date().toISOString().split('T')[0],
      amount: Number(amount),
      paymentMethod,
      transactionRef: transactionRef || undefined,
      feeType,
      installmentMonth,
      receivedBy,
      notes: notes || undefined,
    });

    setSelectedReceiptForPrint(receipt);
    setActiveTab('receipts');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    addExpense({
      title: expenseTitle,
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: new Date().toISOString().split('T')[0],
      paidTo: expensePaidTo || 'Vendor / Faculty',
      paymentMethod: expenseMethod,
      receiptNumber: `EXP-${Date.now().toString().slice(-4)}`,
    });

    setIsExpenseModalOpen(false);
    setExpenseTitle('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tuition Fees & Financial Accounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Indian tuition fee structures (₹), installments, UPI & cash collections, GST receipts, and expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => setActiveTab('record')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Record Fee Payment</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Fees Collected</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{feeReceipts.length} verified receipts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Outstanding Tuition Dues</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 font-mono tabular-nums">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across {studentsWithBalance.length} students</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Operational Expenses</span>
            <Building className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Rent, faculty honorarium & prints</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Net Institute Surplus</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-sky-700 font-mono tabular-nums">
            ₹{netSurplus.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Healthy operating margin</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'receipts'
              ? 'border-sky-600 text-sky-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Payment Receipts & Invoices ({feeReceipts.length})
        </button>
        <button
          onClick={() => setActiveTab('outstanding')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'outstanding'
              ? 'border-sky-600 text-sky-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Outstanding Fee Ledger ({studentsWithBalance.length})
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'record'
              ? 'border-sky-600 text-sky-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          + Record New Payment
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'expenses'
              ? 'border-sky-600 text-sky-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Expenses Register ({expenses.length})
        </button>
      </div>

      {/* Tab 1: Payment Receipts */}
      {activeTab === 'receipts' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Payment Date</th>
                  <th className="py-2.5 px-3">Amount (₹)</th>
                  <th className="py-2.5 px-3">Method & Ref</th>
                  <th className="py-2.5 px-3">Fee Type</th>
                  <th className="py-2.5 px-3 text-right">Print Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeReceipts.map((rcpt) => (
                  <tr key={rcpt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-700">
                      {rcpt.receiptNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{rcpt.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rcpt.studentIdNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{rcpt.paymentDate}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      ₹{rcpt.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-800">{rcpt.paymentMethod}</span>
                      {rcpt.transactionRef && (
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                          {rcpt.transactionRef}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <div>{rcpt.feeType}</div>
                      <div className="text-[10px] text-slate-400">{rcpt.installmentMonth}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedReceiptForPrint(rcpt)}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Outstanding Fee Ledger */}
      {activeTab === 'outstanding' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-amber-50/50 flex items-center justify-between text-xs">
            <span className="font-medium text-amber-900">
              Showing all students with outstanding balances. Total pending: <strong>₹{totalOutstanding.toLocaleString('en-IN')}</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Standard & Batch</th>
                  <th className="py-2.5 px-3">Parent Contact</th>
                  <th className="py-2.5 px-3">Net Fee</th>
                  <th className="py-2.5 px-3">Paid Amount</th>
                  <th className="py-2.5 px-3">Pending Balance</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsWithBalance.map((stu) => {
                  const balance = Math.max(0, stu.netFee - stu.paidFee);
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{stu.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{stu.studentIdNumber}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <div>Std {stu.standard} ({stu.board === 'Maharashtra State Board' ? 'SSC' : stu.board})</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{stu.batchName}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-slate-800">{stu.parentName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{stu.parentPhone}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                        ₹{stu.netFee.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-emerald-700">
                        ₹{stu.paidFee.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                        ₹{balance.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setStudentId(stu.id);
                            setAmount(balance);
                            setActiveTab('record');
                          }}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium transition-colors"
                        >
                          Collect Fee
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Record Payment Form */}
      {activeTab === 'record' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-600" />
            <span>Record Fee Payment & Issue Receipt</span>
          </h3>

          <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Student *</label>
              <select
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  const sel = students.find((s) => s.id === e.target.value);
                  if (sel) {
                    const bal = Math.max(0, sel.netFee - sel.paidFee);
                    if (bal > 0) setAmount(bal);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {students.map((s) => {
                  const bal = Math.max(0, s.netFee - s.paidFee);
                  return (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentIdNumber}) - Std {s.standard} - Balance: ₹{bal.toLocaleString('en-IN')}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fee Type</label>
                <select
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Installment">Installment</option>
                  <option value="Full Year">Full Year Fee</option>
                  <option value="Admission Fee">Admission Fee</option>
                  <option value="Exam Fee">Exam Fee</option>
                  <option value="Study Material">Study Material</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Term / Month Description</label>
                <input
                  type="text"
                  value={installmentMonth}
                  onChange={(e) => setInstallmentMonth(e.target.value)}
                  placeholder="e.g. Term 2 Installment"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Cheque No</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UPI/26104199882/HDFC"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cashier / Receiver Name</label>
                <input
                  type="text"
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notes / Remarks</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes printed on the receipt..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('receipts')}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Payment & Generate Receipt</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Expenses Register */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Voucher / Ref</th>
                  <th className="py-2.5 px-3">Expense Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Paid To</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-600">{exp.receiptNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{exp.title}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{exp.date}</td>
                    <td className="py-2.5 px-3 text-slate-800">{exp.paidTo}</td>
                    <td className="py-2.5 px-3 text-slate-600">{exp.paymentMethod}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Record Institute Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab Consumables & Beakers"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Faculty Salary">Faculty Salary</option>
                    <option value="Rent & Utilities">Rent & Utilities</option>
                    <option value="Printing & Material">Printing & Material</option>
                    <option value="Software & Tech">Software & Tech</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Paid To / Beneficiary</label>
                  <input
                    type="text"
                    placeholder="Vendor / Party Name"
                    value={expensePaidTo}
                    onChange={(e) => setExpensePaidTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={expenseMethod}
                    onChange={(e) => setExpenseMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT)</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded"
                >
                  Save Expense
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
    </div>
  );
};
