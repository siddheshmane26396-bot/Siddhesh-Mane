import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  BookOpen,
  FileCheck2,
  FolderDown,
  Calendar,
  Clock,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react';
import { AttendanceRegister } from '../admin/AttendanceRegister';
import { HomeworkModule } from '../common/HomeworkModule';
import { ExamsModule } from '../common/ExamsModule';
import { StudyMaterialsModule } from '../common/StudyMaterialsModule';
import { TimetableModule } from '../common/TimetableModule';

export const TeacherPortal: React.FC = () => {
  const { activePortalTab, setActivePortalTab, batches, homework, exams, timetable } = useApp();

  // Assigned batches for Prof. Ramesh Joshi
  const myBatches = batches.filter((b) => b.teacherId === 'tch-1');
  const myHomeworkPendingReview = homework.filter(
    (h) => h.teacherId === 'tch-1' && h.submissions.some((s) => s.status === 'Submitted')
  );
  const myUpcomingExams = exams.filter((e) => e.batchId === 'batch-1' && !e.isPublished);

  // Render sub-views if a specific tab is selected
  if (activePortalTab === 'attendance') return <AttendanceRegister />;
  if (activePortalTab === 'homework') return <HomeworkModule />;
  if (activePortalTab === 'exams') return <ExamsModule />;
  if (activePortalTab === 'materials') return <StudyMaterialsModule />;
  if (activePortalTab === 'timetable') return <TimetableModule />;

  // Default: Teacher Dashboard
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Faculty Portal · Prof. Ramesh Joshi (Senior Mathematics & Science)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Teacher Workspace & Evaluation Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mark attendance for your assigned batches, review homework solutions, and schedule tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePortalTab('attendance')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Today's Attendance</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>My Assigned Batches</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {myBatches.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Std 10 CBSE & Std 8 Foundation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Homework to Review</span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-sky-700 font-mono">
            {myHomeworkPendingReview.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Submissions awaiting feedback</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Upcoming / Draft Tests</span>
            <FileCheck2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">
            {myUpcomingExams.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mock Board Exam 1 scheduled</div>
        </div>
      </div>

      {/* Quick Access Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assigned Batches List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span>My Active Batches</span>
            <span className="text-xs text-slate-400 font-normal">AY 2026-27</span>
          </h3>

          <div className="space-y-3">
            {myBatches.map((b) => (
              <div key={b.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{b.name}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{b.scheduleTime}</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Classroom: {b.classroom} · Enrolled: <strong>{b.enrolledCount} students</strong>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200">
                  <button
                    onClick={() => setActivePortalTab('attendance')}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    Mark Attendance →
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    onClick={() => setActivePortalTab('homework')}
                    className="text-xs text-sky-700 hover:underline font-semibold"
                  >
                    Assign Task →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Faculty Quick Actions</h3>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            <button
              onClick={() => setActivePortalTab('homework')}
              className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <div>
                  <div className="font-semibold text-slate-900">Review Student Homework</div>
                  <div className="text-[11px] text-slate-500">Read uploaded answers and enter marks & corrections</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActivePortalTab('exams')}
              className="p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="font-semibold text-slate-900">Enter Exam Marks & Publish Ranks</div>
                  <div className="text-[11px] text-slate-500">Fill test marksheets for recent Unit Tests</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActivePortalTab('materials')}
              className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <FolderDown className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900">Upload Study Notes & Formula Sheets</div>
                  <div className="text-[11px] text-slate-500">Share chapter-wise PDFs and video lecture links</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
