import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, SchoolBoard } from '../../types';
import { X, CheckCircle, GraduationCap, Upload, ShieldCheck } from 'lucide-react';

interface StudentAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student;
}

export const StudentAdmissionModal: React.FC<StudentAdmissionModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
}) => {
  const { batches, addStudent, updateStudent, settings } = useApp();

  const [fullName, setFullName] = useState(studentToEdit?.fullName || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(studentToEdit?.gender || 'Male');
  const [dateOfBirth, setDateOfBirth] = useState(studentToEdit?.dateOfBirth || '2011-05-15');
  const [schoolName, setSchoolName] = useState(studentToEdit?.schoolName || '');
  const [standard, setStandard] = useState<number>(studentToEdit?.standard || 10);
  const [board, setBoard] = useState<SchoolBoard>(studentToEdit?.board || 'CBSE');
  const [stream, setStream] = useState<'Science' | 'Commerce' | 'Arts' | 'General'>(
    studentToEdit?.stream || 'General'
  );
  const [batchId, setBatchId] = useState(studentToEdit?.batchId || (batches[0]?.id || ''));
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>(
    studentToEdit?.enrolledSubjects || ['Mathematics', 'Science']
  );

  const [parentName, setParentName] = useState(studentToEdit?.parentName || '');
  const [parentPhone, setParentPhone] = useState(studentToEdit?.parentPhone || '');
  const [parentEmail, setParentEmail] = useState(studentToEdit?.parentEmail || '');
  const [parentRelation, setParentRelation] = useState<'Father' | 'Mother' | 'Guardian'>(
    studentToEdit?.parentRelation || 'Father'
  );
  const [address, setAddress] = useState(studentToEdit?.address || 'Pune, Maharashtra');
  const [emergencyContact, setEmergencyContact] = useState(studentToEdit?.emergencyContact || '');
  const [totalFee, setTotalFee] = useState<number>(studentToEdit?.totalFee || 36000);
  const [discountScholarship, setDiscountScholarship] = useState<number>(
    studentToEdit?.discountScholarship || 0
  );
  const [previousPercentage, setPreviousPercentage] = useState<number>(
    studentToEdit?.previousPercentage || 85
  );

  if (!isOpen) return null;

  const subjectOptions = [
    'Mathematics',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Marathi',
    'Hindi',
    'Social Science',
    'Accountancy',
    'Economics',
  ];

  const handleSubjectToggle = (subj: string) => {
    setEnrolledSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !parentName || !parentPhone) {
      alert('Please fill student name, parent name, and parent phone.');
      return;
    }

    const selectedBatch = batches.find((b) => b.id === batchId);
    const batchName = selectedBatch ? selectedBatch.name : 'General Batch';

    if (studentToEdit) {
      updateStudent(studentToEdit.id, {
        fullName,
        gender,
        dateOfBirth,
        schoolName,
        standard,
        board,
        stream: standard >= 11 ? stream : undefined,
        batchId,
        batchName,
        enrolledSubjects,
        parentName,
        parentPhone,
        parentEmail,
        parentRelation,
        address,
        emergencyContact: emergencyContact || parentPhone,
        totalFee,
        discountScholarship,
        previousPercentage,
      });
    } else {
      addStudent({
        fullName,
        gender,
        dateOfBirth,
        schoolName,
        standard,
        board,
        stream: standard >= 11 ? stream : undefined,
        academicYear: settings.academicYear,
        enrolledSubjects,
        batchId,
        batchName,
        admissionDate: new Date().toISOString().split('T')[0],
        parentName,
        parentPhone,
        parentEmail,
        parentRelation,
        address,
        emergencyContact: emergencyContact || parentPhone,
        totalFee,
        discountScholarship,
        status: 'Active',
        previousPercentage,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm">
              {studentToEdit ? 'Update Student Admission Profile' : 'New Student Admission & Registration'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Section 1: Academic & Personal Info */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200">
              1. Student Academic & Personal Particulars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyansh Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">School Name</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi Public School / St. Vincent"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard (Class 1-12) *</label>
                <select
                  value={standard}
                  onChange={(e) => setStandard(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s}>
                      Standard {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">School Board *</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value as SchoolBoard)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Maharashtra State Board">Maharashtra State Board (SSC/HSC)</option>
                  <option value="CBSE">CBSE Board</option>
                  <option value="ICSE">ICSE Board</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {standard >= 11 && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stream (11th & 12th)</label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Science">Science (PCM / PCB)</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Batch *</label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.scheduleTime})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subjects selection */}
            <div className="mt-3">
              <label className="block font-semibold text-slate-700 mb-1.5">Enrolled Subjects</label>
              <div className="flex flex-wrap gap-1.5">
                {subjectOptions.map((sub) => {
                  const isSel = enrolledSubjects.includes(sub);
                  return (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => handleSubjectToggle(sub)}
                      className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                        isSel
                          ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {sub} {isSel && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Parent / Guardian Info */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200">
              2. Parent / Guardian Particulars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Verma"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relation</label>
                <select
                  value={parentRelation}
                  onChange={(e) => setParentRelation(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Mobile (For SMS Alerts) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98220 12345"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Number</label>
                <input
                  type="tel"
                  placeholder="+91 98220 99999"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Flat/House, Society, Area, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Fee Structure & Scholarship */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200">
              3. Tuition Fee Structure & Scholarship
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Tuition Fee (₹) *</label>
                <input
                  type="number"
                  required
                  value={totalFee}
                  onChange={(e) => setTotalFee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scholarship / Discount (₹)</label>
                <input
                  type="number"
                  value={discountScholarship}
                  onChange={(e) => setDiscountScholarship(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Net Payable Fee (₹)</label>
                <div className="px-3 py-2 bg-slate-100 rounded-lg font-mono font-bold text-sky-800 text-sm">
                  ₹{Math.max(0, totalFee - discountScholarship).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Form action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-sky-600 hover:bg-sky-700 font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{studentToEdit ? 'Save Changes' : 'Confirm Admission & Issue ID'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
