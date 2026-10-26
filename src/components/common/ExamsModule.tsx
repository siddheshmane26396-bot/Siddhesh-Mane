import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Examination, ExamType, SchoolBoard, StudentExamScore } from '../../types';
import {
  FileCheck2,
  Plus,
  Calendar,
  Clock,
  Award,
  Printer,
  Eye,
  CheckCircle,
  X,
  Users,
  CalendarPlus,
} from 'lucide-react';
import { PrintableReportCard } from './PrintableReportCard';
import { GoogleWorkspaceService } from '../../services/workspace';

export const ExamsModule: React.FC = () => {
  const {
    currentRole,
    exams,
    createExam,
    saveExamScores,
    batches,
    students,
    settings,
    selectedChildId,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeExamForGrading, setActiveExamForGrading] = useState<Examination | null>(null);
  const [selectedStudentForReportCard, setSelectedStudentForReportCard] = useState<any | null>(null);

  // New Exam Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ExamType>('Unit Test');
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [subject, setSubject] = useState('Mathematics');
  const [examDate, setExamDate] = useState('2026-11-05');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [totalMarks, setTotalMarks] = useState<number>(40);
  const [passingMarks, setPassingMarks] = useState<number>(14);
  const [questionCount, setQuestionCount] = useState<number>(20);

  // Marks entry state
  const [tempScoresMap, setTempScoresMap] = useState<Record<string, { marks: number; remarks: string }>>({});
  const [publishImmediately, setPublishImmediately] = useState(true);

  // Filter based on active role
  const activeStudentId = currentRole === 'student' ? 'stu-1' : currentRole === 'parent' ? selectedChildId : null;
  const currentStudent = students.find((s) => s.id === activeStudentId);

  const filteredExams = exams.filter((e) => {
    if (activeStudentId && currentStudent) {
      return e.batchId === currentStudent.batchId;
    }
    return true;
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find((b) => b.id === batchId);
    if (!batch) return;

    createExam({
      title,
      type,
      standard: batch.standard,
      board: batch.board,
      batchId,
      batchName: batch.name,
      subject,
      examDate,
      startTime,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      isPublished: false,
      questionCount: Number(questionCount),
    });

    setIsCreateModalOpen(false);
    setTitle('');
  };

  const handleOpenMarksEntry = (exam: Examination) => {
    setActiveExamForGrading(exam);
    const initialMap: Record<string, { marks: number; remarks: string }> = {};

    // Find students in this batch
    const batchStudents = students.filter((s) => s.batchId === exam.batchId);
    batchStudents.forEach((stu) => {
      const existing = exam.scores.find((s) => s.studentId === stu.id);
      initialMap[stu.id] = {
        marks: existing ? existing.marksObtained : Math.round(exam.totalMarks * 0.8),
        remarks: existing?.remarks || 'Good attempt. Keep practicing.',
      };
    });

    setTempScoresMap(initialMap);
    setPublishImmediately(exam.isPublished);
  };

  const handleSaveMarks = () => {
    if (!activeExamForGrading) return;
    const batchStudents = students.filter((s) => s.batchId === activeExamForGrading.batchId);

    const scoresList: StudentExamScore[] = batchStudents.map((stu) => ({
      studentId: stu.id,
      studentName: stu.fullName,
      studentRollNumber: stu.studentIdNumber,
      marksObtained: Number(tempScoresMap[stu.id]?.marks || 0),
      remarks: tempScoresMap[stu.id]?.remarks || '',
    }));

    saveExamScores(activeExamForGrading.id, scoresList, publishImmediately);
    setActiveExamForGrading(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Examinations, Tests & Report Cards</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit tests, semester exams, and mock board tests with rank calculations and formal printable report cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentStudent && (
            <button
              onClick={() => setSelectedStudentForReportCard(currentStudent)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Report Card</span>
            </button>
          )}

          {(currentRole === 'admin' || currentRole === 'teacher') && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New Examination</span>
            </button>
          )}
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => {
          // If student or parent view, find student's personal score
          const studentScore = activeStudentId
            ? exam.scores.find((s) => s.studentId === activeStudentId)
            : null;

          return (
            <div
              key={exam.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    {exam.type} · {exam.subject}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      exam.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {exam.isPublished ? 'Published' : 'Draft / Unreleased'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{exam.title}</h3>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{exam.batchName}</div>

                <div className="mt-3 space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{exam.examDate}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{exam.startTime} ({exam.durationMinutes}m)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span>Total Marks: <strong className="font-mono text-slate-800">{exam.totalMarks}</strong></span>
                    <span>Passing: <strong className="font-mono text-slate-800">{exam.passingMarks}</strong></span>
                  </div>
                </div>

                {/* Score section for student/parent */}
                {activeStudentId && exam.isPublished && studentScore && (
                  <div className="mt-3 p-3 bg-sky-50 rounded-lg border border-sky-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Marks Obtained:</span>
                      <span className="font-mono font-bold text-base text-sky-900">
                        {studentScore.marksObtained} / {exam.totalMarks}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>Percentage: {((studentScore.marksObtained / exam.totalMarks) * 100).toFixed(1)}%</span>
                      {studentScore.rank && (
                        <span className="font-bold text-emerald-700">Batch Rank #{studentScore.rank}</span>
                      )}
                    </div>
                    {studentScore.remarks && (
                      <div className="text-[10px] text-slate-500 italic mt-1 pt-1 border-t border-sky-100">
                        "{studentScore.remarks}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    `VidyaSetu Exam: ${exam.title} (${exam.subject})`
                  )}&dates=${exam.examDate.replace(/-/g, '')}T090000Z/${exam.examDate.replace(/-/g, '')}T110000Z&details=${encodeURIComponent(
                    `Batch: ${exam.batchName}\nTotal Marks: ${exam.totalMarks}\nPass Marks: ${exam.passingMarks}\nLocation: VidyaSetu Academy Main Campus`
                  )}&location=VidyaSetu+Main+Campus`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                  title="Add this exam date to your Google Calendar"
                >
                  <CalendarPlus className="w-3 h-3 text-sky-600" />
                  <span className="hidden sm:inline">Google Calendar</span>
                </a>

                {(currentRole === 'admin' || currentRole === 'teacher') ? (
                  <>
                    <button
                      onClick={() => handleOpenMarksEntry(exam)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold transition-colors flex items-center gap-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>{exam.scores.length > 0 ? 'Edit Marks & Ranks' : 'Enter Marks'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-slate-400 text-[11px]">
                      {exam.isPublished ? 'Official marksheet available' : 'Results pending release'}
                    </span>
                    {exam.isPublished && currentStudent && (
                      <button
                        onClick={() => setSelectedStudentForReportCard(currentStudent)}
                        className="text-sky-600 hover:underline font-semibold"
                      >
                        View Report Card
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Marks Entry Modal */}
      {activeExamForGrading && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 text-xs max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Marks Entry: {activeExamForGrading.title} ({activeExamForGrading.subject})
                </h3>
                <div className="text-slate-500 text-[11px]">
                  Batch: {activeExamForGrading.batchName} · Max Marks: {activeExamForGrading.totalMarks}
                </div>
              </div>
              <button onClick={() => setActiveExamForGrading(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Students marks table */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3 w-28">Marks (/{activeExamForGrading.totalMarks})</th>
                    <th className="py-2.5 px-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter((s) => s.batchId === activeExamForGrading.batchId)
                    .map((stu) => {
                      const currentVal = tempScoresMap[stu.id] || { marks: 0, remarks: '' };
                      return (
                        <tr key={stu.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-600">
                            {stu.studentIdNumber}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {stu.fullName}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min={0}
                              max={activeExamForGrading.totalMarks}
                              value={currentVal.marks}
                              onChange={(e) =>
                                setTempScoresMap((prev) => ({
                                  ...prev,
                                  [stu.id]: {
                                    ...prev[stu.id],
                                    marks: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-20 px-2 py-1 border border-slate-300 rounded font-mono font-bold focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={currentVal.remarks}
                              onChange={(e) =>
                                setTempScoresMap((prev) => ({
                                  ...prev,
                                  [stu.id]: {
                                    ...prev[stu.id],
                                    remarks: e.target.value,
                                  },
                                }))
                              }
                              placeholder="Remarks..."
                              className="w-full px-2 py-1 border border-slate-300 rounded text-[11px] focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Publication toggle */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishImmediately}
                  onChange={(e) => setPublishImmediately(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                />
                <span className="font-semibold text-slate-800">
                  Publish results immediately to Student & Parent Portals
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveExamForGrading(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMarks}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded shadow-xs"
                >
                  Save Marks & Compute Ranks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Exam Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Schedule Examination / Test</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Examination Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit Test 3 - Linear Equations & Geometry"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ExamType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Unit Test">Unit Test</option>
                    <option value="Weekly Test">Weekly Test</option>
                    <option value="Monthly Test">Monthly Test</option>
                    <option value="Semester Exam">Semester Exam</option>
                    <option value="Mock Board Exam">Mock Board Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Batch *</label>
                  <select
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} (Std {b.standard})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Marks *</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Passing Marks *</label>
                  <input
                    type="number"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Report Card Modal */}
      {selectedStudentForReportCard && (
        <PrintableReportCard
          student={selectedStudentForReportCard}
          exams={exams}
          settings={settings}
          onClose={() => setSelectedStudentForReportCard(null)}
        />
      )}
    </div>
  );
};
