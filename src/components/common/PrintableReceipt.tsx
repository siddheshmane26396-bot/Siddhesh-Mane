import React from 'react';
import { FeeReceipt, InstituteSettings } from '../../types';
import { Printer, Download, X } from 'lucide-react';

interface PrintableReceiptProps {
  receipt: FeeReceipt;
  settings: InstituteSettings;
  onClose: () => void;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ receipt, settings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium">Official Fee Receipt Preview</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="printable-area p-8 bg-white text-slate-800 font-sans">
          {/* Institute Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              {settings.instituteName}
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{settings.tagline}</p>
            <p className="text-xs text-slate-500 mt-1">
              {settings.address}, {settings.city} - {settings.pincode}, {settings.state}
            </p>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-center gap-4">
              <span>Tel: {settings.phone}</span>
              <span>·</span>
              <span>Email: {settings.email}</span>
              <span>·</span>
              <span>GSTIN: {settings.gstNumber}</span>
            </div>
          </div>

          {/* Receipt Title Banner */}
          <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded mb-6 text-xs font-semibold">
            <span className="uppercase tracking-wider text-slate-800">FEE PAYMENT RECEIPT</span>
            <span className="text-slate-900 font-mono">Receipt No: {receipt.receiptNumber}</span>
          </div>

          {/* Student & Payment Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 block">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{receipt.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Student ID / Roll No:</span>
              <span className="font-mono font-bold text-slate-900">{receipt.studentIdNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Standard & Batch:</span>
              <span className="font-medium text-slate-800">Class {receipt.standard} · {receipt.batchName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Date:</span>
              <span className="font-medium text-slate-800">{receipt.paymentDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Mode:</span>
              <span className="font-medium text-slate-800">{receipt.paymentMethod}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Transaction Reference:</span>
              <span className="font-mono text-slate-800">{receipt.transactionRef || 'N/A (Cash counter)'}</span>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <table className="w-full text-xs mb-6 border border-slate-300">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                <th className="py-2.5 px-3 text-left">Sr.</th>
                <th className="py-2.5 px-3 text-left">Particulars / Fee Description</th>
                <th className="py-2.5 px-3 text-left">Term / Cadence</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-3 px-3">01.</td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900">{receipt.feeType}</div>
                  <div className="text-[11px] text-slate-500">{receipt.notes || 'Coaching & Academic Assessment Charges'}</div>
                </td>
                <td className="py-3 px-3 text-slate-700">{receipt.installmentMonth || 'AY 2026-2027'}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                  ₹{receipt.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <td colSpan={3} className="py-2.5 px-3 text-right text-slate-800">
                  Total Amount Received:
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-sm text-sky-800">
                  ₹{receipt.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Amount in words note */}
          <div className="text-[11px] text-slate-600 mb-8 italic">
            * Amount received with thanks. Fees once paid are non-refundable and non-transferable under normal circumstances.
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 gap-8 text-xs pt-8 border-t border-slate-200">
            <div>
              <div className="text-slate-400 mb-10">Cashier / Collected By:</div>
              <div className="font-bold text-slate-800">{receipt.receivedBy}</div>
              <div className="text-[10px] text-slate-500">VidyaSetu Accounts Department</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 mb-10">Authorized Signatory / Seal:</div>
              <div className="font-bold text-slate-800">{settings.principalName}</div>
              <div className="text-[10px] text-slate-500">Director & Academic Head</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
