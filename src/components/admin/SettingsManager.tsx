import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  Save,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { settings, updateSettings, resetToSampleData } = useApp();

  const [form, setForm] = useState(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all demo data (students, attendance, fees, exams) back to original sample records?')) {
      resetToSampleData();
      alert('Institute data restored to pristine sample state.');
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Institute Profile & System Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure official coaching institute registration details, GSTIN, receipt headers, and director signatories.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Institute settings successfully saved. Changes reflect immediately across all official receipts and report cards.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5 text-xs">
        <div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200">
            Institute Branding & Identification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institute Name *</label>
              <input
                type="text"
                required
                value={form.instituteName}
                onChange={(e) => setForm({ ...form, instituteName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Registration / Trust No</label>
              <input
                type="text"
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Director / Principal Signatory</label>
              <input
                type="text"
                value={form.principalName}
                onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Active Academic Year</label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200">
            Address & Communications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Campus Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Helpline Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Default</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
