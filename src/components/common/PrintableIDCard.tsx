import React from 'react';
import { Student, InstituteSettings } from '../../types';
import { Printer, X, GraduationCap, Phone, MapPin, UserCheck } from 'lucide-react';

interface PrintableIDCardProps {
  student: Student;
  settings: InstituteSettings;
  onClose: () => void;
}

export const PrintableIDCard: React.FC<PrintableIDCardProps> = ({ student, settings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Modal Toolbar */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider">Student ID Card</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 rounded text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card */}
        <div className="printable-area p-6 flex flex-col items-center justify-center bg-slate-50">
          <div className="w-80 bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden relative">
            {/* Top header strip */}
            <div className="bg-sky-700 text-white p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 font-bold text-sm tracking-tight">
                <GraduationCap className="w-4 h-4" />
                <span>{settings.instituteName}</span>
              </div>
              <div className="text-[10px] text-sky-100 font-medium">STUDENT IDENTITY CARD · {student.academicYear}</div>
            </div>

            {/* Photo & Roll section */}
            <div className="p-4 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-sky-600 flex items-center justify-center text-slate-400 mb-2 overflow-hidden shadow-inner">
                {student.photoUrl ? (
                  <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-sky-700">
                    {student.fullName.split(' ').map((n) => n[0]).join('')}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-slate-900">{student.fullName}</h3>
              <div className="font-mono text-xs font-semibold text-sky-700 mt-0.5">
                ID: {student.studentIdNumber}
              </div>

              {/* Card Meta Details */}
              <div className="w-full mt-4 space-y-1.5 text-left text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard / Class:</span>
                  <span className="font-semibold text-slate-900">Std {student.standard} ({student.board})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch:</span>
                  <span className="font-medium text-slate-800 text-[11px] truncate max-w-[150px]">{student.batchName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">School:</span>
                  <span className="font-medium text-slate-800 text-[11px] truncate max-w-[150px]">{student.schoolName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parent Contact:</span>
                  <span className="font-mono text-slate-800">{student.parentPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Contact:</span>
                  <span className="font-mono text-rose-600 font-semibold">{student.emergencyContact}</span>
                </div>
              </div>

              {/* Barcode visual */}
              <div className="w-full mt-4 pt-2 border-t border-slate-200 flex flex-col items-center">
                <div className="h-7 w-48 flex items-center justify-between px-2 bg-slate-100 rounded">
                  <div className="h-5 w-1 bg-slate-800"></div>
                  <div className="h-5 w-2 bg-slate-800"></div>
                  <div className="h-5 w-0.5 bg-slate-800"></div>
                  <div className="h-5 w-1.5 bg-slate-800"></div>
                  <div className="h-5 w-1 bg-slate-800"></div>
                  <div className="h-5 w-3 bg-slate-800"></div>
                  <div className="h-5 w-1 bg-slate-800"></div>
                  <div className="h-5 w-2 bg-slate-800"></div>
                  <div className="h-5 w-1.5 bg-slate-800"></div>
                  <div className="h-5 w-0.5 bg-slate-800"></div>
                  <div className="h-5 w-2 bg-slate-800"></div>
                  <div className="h-5 w-1 bg-slate-800"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">{student.studentIdNumber}</span>
              </div>
            </div>

            {/* Bottom institute footer */}
            <div className="bg-slate-100 px-3 py-2 text-center text-[10px] text-slate-500 border-t border-slate-200">
              {settings.address}, {settings.city} · Helpline: {settings.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
