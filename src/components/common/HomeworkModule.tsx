import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Homework, HomeworkSubmission } from '../../types';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  MessageSquare,
  Award,
  X,
  Send,
  Eye,
} from 'lucide-react';

export const HomeworkModule: React.FC = () => {
  const {
    currentRole,
    homework,
    createHomework,
    submitHomework,
    gradeHomeworkSubmission,
    batches,
    students,
    teachers,
    selectedChildId,
  } = useApp();

  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Homework creation state (Teacher/Admin)
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [subject, setSubject] = useState('Mathematics');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-30');
  const [totalMarks, setTotalMarks] = useState<number>(20);
  const [attachmentName, setAttachmentName] = useState('Chapter_Worksheet_SetA.pdf');

  // Student submission state
  const [submittingHw, setSubmittingHw] = useState<Homework | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [fileName, setFileName] = useState('');

  // Teacher grading state
  const [gradingHw, setGradingHw] = useState<Homework | null>(null);
  const [gradingStudentId, setGradingStudentId] = useState<string>('');
  const [awardedMarks, setAwardedMarks] = useState<number>(18);
  const [feedbackText, setFeedbackText] = useState('');

  // Filter based on active role
  const activeStudentId = currentRole === 'student' ? 'stu-1' : currentRole === 'parent' ? selectedChildId : null;
  const currentStudent = students.find((s) => s.id === activeStudentId);

  const filteredHomework = homework.filter((h) => {
    if (selectedBatchFilter !== 'all' && h.batchId !== selectedBatchFilter) return false;
    if (activeStudentId && currentStudent) {
      return h.batchId === currentStudent.batchId;
    }
    return true;
  });

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find((b) => b.id === batchId);
    if (!batch) return;

    createHomework({
      batchId,
      batchName: batch.name,
      standard: batch.standard,
      subject,
      chapter: chapter || 'General Chapter',
      title,
      description,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      teacherId: batch.teacherId || teachers[0]?.id || 'tch-1',
      teacherName: batch.teacherName || teachers[0]?.name || 'Faculty',
      totalMarks: Number(totalMarks),
      attachmentName: attachmentName || undefined,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleExecuteSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingHw || !activeStudentId || !currentStudent) return;

    submitHomework(
      submittingHw.id,
      activeStudentId,
      currentStudent.fullName,
      answerText,
      fileName || `${currentStudent.fullName}_AnswerSheet.pdf`
    );

    setSubmittingHw(null);
    setAnswerText('');
  };

  const handleExecuteGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingHw || !gradingStudentId) return;

    gradeHomeworkSubmission(gradingHw.id, gradingStudentId, Number(awardedMarks), feedbackText);
    setGradingHw(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Homework, Tasks & Assignment Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentRole === 'teacher' || currentRole === 'admin'
              ? 'Assign chapter worksheets, review student submissions, and provide marks and feedback.'
              : currentRole === 'student'
              ? 'View daily assignments, download worksheets, submit completed answers, and view teacher marks.'
              : `Tracking homework progress for ${currentStudent?.fullName || 'Child'}.`}
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Assignment</span>
          </button>
        )}
      </div>

      {/* Batch Filter for Admin/Teacher */}
      {(currentRole === 'admin' || currentRole === 'teacher') && (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700">Filter by Batch:</span>
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-medium"
          >
            <option value="all">All Assigned Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredHomework.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No homework assignments currently posted for this selection.
          </div>
        ) : (
          filteredHomework.map((hw) => {
            // Find submission for current student if student/parent view
            const studentSubmission = activeStudentId
              ? hw.submissions.find((s) => s.studentId === activeStudentId)
              : null;

            return (
              <div
                key={hw.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {hw.batchName} · {hw.subject}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>Due: {hw.dueDate}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{hw.title}</h3>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Chapter: {hw.chapter}</div>

                  <p className="text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {hw.description}
                  </p>

                  {hw.attachmentName && (
                    <div className="mt-3 flex items-center justify-between p-2 bg-sky-50/50 rounded border border-sky-100 text-[11px]">
                      <span className="text-slate-700 font-medium truncate flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-600" />
                        <span>{hw.attachmentName}</span>
                      </span>
                      <button
                        onClick={() => alert(`Downloading teacher attachment: ${hw.attachmentName}`)}
                        className="text-sky-700 hover:underline font-semibold"
                      >
                        Download PDF
                      </button>
                    </div>
                  )}
                </div>

                {/* Role Specific Bottom Actions */}
                <div className="pt-3 border-t border-slate-100">
                  {/* Teacher / Admin: Review Submissions */}
                  {(currentRole === 'teacher' || currentRole === 'admin') ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Student Submissions:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {hw.submissions.length} received · Max Marks: {hw.totalMarks}
                        </span>
                      </div>

                      {hw.submissions.length > 0 && (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {hw.submissions.map((sub) => (
                            <div
                              key={sub.studentId}
                              className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]"
                            >
                              <div>
                                <span className="font-semibold text-slate-900">{sub.studentName}</span>
                                <div className="text-slate-400 text-[10px]">{sub.submittedAt}</div>
                              </div>

                              <div className="flex items-center gap-2">
                                {sub.status === 'Graded' ? (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                                    {sub.marksObtained}/{hw.totalMarks}
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px]">
                                    Pending Grade
                                  </span>
                                )}

                                <button
                                  onClick={() => {
                                    setGradingHw(hw);
                                    setGradingStudentId(sub.studentId);
                                    setAwardedMarks(sub.marksObtained || hw.totalMarks);
                                    setFeedbackText(sub.teacherFeedback || '');
                                  }}
                                  className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium text-[10px]"
                                >
                                  {sub.status === 'Graded' ? 'Edit Marks' : 'Grade'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Student / Parent View */
                    <div className="flex items-center justify-between">
                      {studentSubmission ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-semibold text-emerald-800">
                              {studentSubmission.status === 'Graded'
                                ? `Graded: ${studentSubmission.marksObtained}/${hw.totalMarks} Marks`
                                : 'Submitted for Teacher Review'}
                            </span>
                            {studentSubmission.teacherFeedback && (
                              <div className="text-[10px] text-slate-600 italic">
                                Remark: "{studentSubmission.teacherFeedback}"
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-amber-800 font-medium">Pending Submission</span>
                        </div>
                      )}

                      {currentRole === 'student' && !studentSubmission && (
                        <button
                          onClick={() => {
                            setSubmittingHw(hw);
                            setAnswerText('');
                          }}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold transition-colors flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Solution</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Homework Modal (Teacher/Admin) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Assign New Homework / Task</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-3">
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
                  <label className="block font-semibold text-slate-700 mb-1">Chapter Name</label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Quadratic Equations"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Exemplar Exercise 4.3 & 10 Board Hot Problems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specific problems to solve, steps to show, graphing requirements..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Submission Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Worksheet / PDF Attachment Name</label>
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="e.g. Class10_Exemplar_SetA.pdf"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono text-[11px]"
                />
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
                  Publish to Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Submit Modal */}
      {submittingHw && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Submit Homework Solution</h3>
              <button onClick={() => setSubmittingHw(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="font-semibold text-slate-800">{submittingHw.title}</span>
              <div className="text-slate-500 text-[11px] mt-0.5">Due: {submittingHw.dueDate} · Max Marks: {submittingHw.totalMarks}</div>
            </div>

            <form onSubmit={handleExecuteSubmission} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Answer Notes / Steps</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your explanation or note about completed exercises..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scanned Document / Photo File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav_Maths_HW_Scanned.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmittingHw(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Grade Modal */}
      {gradingHw && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Evaluate Homework Submission</h3>
              <button onClick={() => setGradingHw(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="font-semibold text-slate-800">{gradingHw.title}</span>
              <div className="text-slate-500 text-[11px]">Max Marks: {gradingHw.totalMarks}</div>
            </div>

            <form onSubmit={handleExecuteGrading} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Marks Awarded (Out of {gradingHw.totalMarks}) *</label>
                <input
                  type="number"
                  max={gradingHw.totalMarks}
                  min={0}
                  required
                  value={awardedMarks}
                  onChange={(e) => setAwardedMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher Feedback & Correction Remarks</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Excellent step-by-step factorization! Revise question 9 sign convention."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingHw(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded"
                >
                  Save Marks & Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
