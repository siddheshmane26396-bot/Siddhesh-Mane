import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OnlineEnquiry } from '../../types';
import {
  MessageSquare,
  Phone,
  Mail,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  X,
} from 'lucide-react';

export const EnquiriesManager: React.FC = () => {
  const { enquiries, updateEnquiryStatus, convertEnquiryToStudent, batches, setActivePortalTab } = useApp();

  const [selectedEnquiryForConvert, setSelectedEnquiryForConvert] = useState<OnlineEnquiry | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [admissionFee, setAdmissionFee] = useState<number>(36000);
  const [scholarship, setScholarship] = useState<number>(2000);

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiryForConvert) return;

    convertEnquiryToStudent(selectedEnquiryForConvert.id, selectedBatchId, admissionFee, scholarship);
    setSelectedEnquiryForConvert(null);
    setActivePortalTab('students');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Public Website Admission Enquiries</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prospective parents and students who submitted inquiry forms online. Track follow-ups and convert directly to admissions.
          </p>
        </div>
      </div>

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enquiries.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs">
            No admission enquiries submitted yet.
          </div>
        ) : (
          enquiries.map((enq) => {
            const isEnrolled = enq.status === 'Enrolled';
            return (
              <div
                key={enq.id}
                className={`bg-white p-5 rounded-xl border shadow-xs space-y-3.5 flex flex-col justify-between text-xs transition-colors ${
                  isEnrolled ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        Std {enq.standard} · {enq.board === 'Maharashtra State Board' ? 'SSC/HSC' : enq.board}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{enq.studentName}</h3>
                    </div>

                    <select
                      value={enq.status}
                      onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none ${
                        enq.status === 'New'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : enq.status === 'Contacted'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : enq.status === 'Demo Attended'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : enq.status === 'Enrolled'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Demo Attended">Demo Attended</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="mt-3 space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-700">Parent:</span>
                      <span>{enq.parentName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <a href={`tel:${enq.parentPhone}`} className="text-sky-600 hover:underline">
                        {enq.parentPhone}
                      </a>
                    </div>

                    {enq.parentEmail && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{enq.parentEmail}</span>
                      </div>
                    )}

                    {enq.schoolName && (
                      <div className="text-[11px] text-slate-500">
                        School: <span className="font-medium text-slate-700">{enq.schoolName}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500">
                      Timing Pref: <span className="text-slate-700">{enq.preferredBatchTime}</span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Subjects: <span className="text-slate-700">{enq.subjectsInterested.join(', ')}</span>
                    </div>

                    {enq.notes && (
                      <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600 italic">
                        "{enq.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{enq.submittedAt}</span>
                  {!isEnrolled ? (
                    <button
                      onClick={() => {
                        setSelectedEnquiryForConvert(enq);
                        const match = batches.find((b) => b.standard === enq.standard);
                        if (match) setSelectedBatchId(match.id);
                      }}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold transition-colors flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Convert to Admission</span>
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolled in Batch</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Convert to Student Admission Modal */}
      {selectedEnquiryForConvert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                Convert Enquiry to Student Admission
              </h3>
              <button
                onClick={() => setSelectedEnquiryForConvert(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600">
              Enrolling <strong className="text-slate-900">{selectedEnquiryForConvert.studentName}</strong> (Std {selectedEnquiryForConvert.standard} {selectedEnquiryForConvert.board}).
            </p>

            <form onSubmit={handleConvert} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Batch *</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.scheduleTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Course Fee (₹)</label>
                  <input
                    type="number"
                    value={admissionFee}
                    onChange={(e) => setAdmissionFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount / Scholarship (₹)</label>
                  <input
                    type="number"
                    value={scholarship}
                    onChange={(e) => setScholarship(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiryForConvert(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded"
                >
                  Confirm & Allocate Student ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
