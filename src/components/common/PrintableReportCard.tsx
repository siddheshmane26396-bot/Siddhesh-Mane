import React from 'react';
import { Student, Examination, InstituteSettings } from '../../types';
import { Printer, X, Award, CheckCircle } from 'lucide-react';

interface PrintableReportCardProps {
  student: Student;
  exams: Examination[];
  settings: InstituteSettings;
  onClose: () => void;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({
  student,
  exams,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Find all exams that have scores for this student
  const studentExamData = exams
    .map((exam) => {
      const score = exam.scores.find((s) => s.studentId === student.id);
      return {
        exam,
        score,
      };
    })
    .filter((item) => item.score !== undefined);

  const totalMaxMarks = studentExamData.reduce((acc, curr) => acc + curr.exam.totalMarks, 0);
  const totalMarksObtained = studentExamData.reduce((acc, curr) => acc + (curr.score?.marksObtained || 0), 0);
  const overallPercentage = totalMaxMarks > 0 ? ((totalMarksObtained / totalMaxMarks) * 100).toFixed(1) : '0';

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A1', remark: 'Outstanding' };
    if (percentage >= 80) return { grade: 'A2', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B1', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'B2', remark: 'Good' };
    if (percentage >= 50) return { grade: 'C1', remark: 'Fair' };
    if (percentage >= 40) return { grade: 'C2', remark: 'Average' };
    return { grade: 'D', remark: 'Needs Improvement' };
  };

  const overallGrade = getGrade(parseFloat(overallPercentage));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col">
        {/* Modal Toolbar */}
        <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium">Official Academic Report Card Preview</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report Card</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="printable-area p-8 bg-white text-slate-800 font-sans">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              {settings.instituteName}
            </h1>
            <p className="text-xs text-slate-600 font-medium">{settings.tagline}</p>
            <p className="text-xs text-slate-500 mt-1">
              {settings.address}, {settings.city} - {settings.pincode} · Tel: {settings.phone}
            </p>
            <div className="mt-3 inline-block bg-slate-900 text-white px-4 py-1 rounded text-xs font-bold uppercase tracking-wider">
              Student Academic Performance & Progress Report Card
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Roll / Student ID:</span>
              <span className="font-mono font-bold text-slate-900">{student.studentIdNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Standard & Board:</span>
              <span className="font-semibold text-slate-800">Class {student.standard} ({student.board})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Year:</span>
              <span className="font-medium text-slate-800">{student.academicYear}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Batch:</span>
              <span className="font-medium text-slate-800">{student.batchName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">School Name:</span>
              <span className="font-medium text-slate-800 truncate">{student.schoolName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Parent Name:</span>
              <span className="font-medium text-slate-800">{student.parentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Overall Rank:</span>
              <span className="font-bold text-sky-700">Rank #1 in Batch</span>
            </div>
          </div>

          {/* Examination Marks Table */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Assessment Performance Summary
            </h4>
            <table className="w-full text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-3 text-left">Examination Title</th>
                  <th className="py-2.5 px-3 text-left">Subject</th>
                  <th className="py-2.5 px-3 text-center">Exam Date</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Passing</th>
                  <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-3 text-center">% Score</th>
                  <th className="py-2.5 px-3 text-left">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody>
                {studentExamData.map(({ exam, score }, idx) => {
                  const marks = score?.marksObtained || 0;
                  const pct = ((marks / exam.totalMarks) * 100).toFixed(1);
                  const isPass = marks >= exam.passingMarks;
                  return (
                    <tr key={exam.id} className="border-b border-slate-200">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{exam.title}</td>
                      <td className="py-2.5 px-3 text-slate-700">{exam.subject}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{exam.examDate}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{exam.totalMarks}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{exam.passingMarks}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                        {marks}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-sky-700">
                        {pct}%
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] italic">
                        {score?.remarks || 'Satisfactory progress.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                  <td colSpan={3} className="py-2.5 px-3 text-right text-slate-800">
                    Grand Total / Overall:
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">{totalMaxMarks}</td>
                  <td className="py-2.5 px-3 text-center">-</td>
                  <td className="py-2.5 px-3 text-center font-mono text-sm text-sky-900">
                    {totalMarksObtained}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-sm text-emerald-700">
                    {overallPercentage}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 text-xs font-semibold">
                    Grade: {overallGrade.grade} ({overallGrade.remark})
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Grading Scale & Performance Legend */}
          <div className="grid grid-cols-2 gap-4 text-[11px] mb-8 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Standard Grading System:</span>
              <div className="grid grid-cols-4 gap-1 text-slate-600">
                <span>A1: 91-100%</span>
                <span>A2: 81-90%</span>
                <span>B1: 71-80%</span>
                <span>B2: 61-70%</span>
                <span>C1: 51-60%</span>
                <span>C2: 41-50%</span>
                <span>D: 35-40%</span>
                <span>E: Needs Help</span>
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-700 block mb-1">Faculty Appraisal & Recommendations:</span>
              <p className="text-slate-600 italic leading-relaxed">
                "Demonstrates strong conceptual depth, exemplary class discipline, and diligent homework completion. Recommended to maintain this consistency for upcoming Board examinations."
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 text-xs pt-8 border-t border-slate-200 text-center">
            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Class Teacher</div>
              <div className="text-[10px] text-slate-500">Prof. Ramesh Joshi</div>
            </div>
            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Parent / Guardian</div>
              <div className="text-[10px] text-slate-500">Signature & Acknowledgment</div>
            </div>
            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Institute Director / Seal</div>
              <div className="text-[10px] text-slate-500">{settings.principalName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
