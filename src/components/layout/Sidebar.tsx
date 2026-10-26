import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarCheck,
  Receipt,
  BookOpen,
  FileCheck2,
  FolderDown,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Sparkles,
  UserCheck,
  GraduationCap,
  Baby,
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    activePortalTab,
    setActivePortalTab,
    language,
    students,
    selectedChildId,
    setSelectedChildId,
  } = useApp();

  // Filter linked children for parent
  const parentChildren = students.filter(
    (s) => s.parentName.toLowerCase().includes('sunita') || s.id === 'stu-1' || s.id === 'stu-2'
  );

  const getMenuItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: getTranslation(language, 'dashboard'), icon: LayoutDashboard },
          { id: 'students', label: getTranslation(language, 'students'), icon: Users },
          { id: 'batches', label: getTranslation(language, 'batches'), icon: Layers },
          { id: 'attendance', label: getTranslation(language, 'attendance'), icon: CalendarCheck },
          { id: 'fees', label: getTranslation(language, 'fees'), icon: Receipt },
          { id: 'homework', label: getTranslation(language, 'homework'), icon: BookOpen },
          { id: 'exams', label: getTranslation(language, 'exams'), icon: FileCheck2 },
          { id: 'materials', label: getTranslation(language, 'materials'), icon: FolderDown },
          { id: 'timetable', label: getTranslation(language, 'timetable'), icon: Calendar },
          { id: 'enquiries', label: getTranslation(language, 'enquiries'), icon: MessageSquare },
          { id: 'reports', label: getTranslation(language, 'reports'), icon: FileText },
          { id: 'settings', label: getTranslation(language, 'settings'), icon: Settings },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Batch Attendance', icon: CalendarCheck },
          { id: 'homework', label: 'Homework & Submissions', icon: BookOpen },
          { id: 'exams', label: 'Exams & Marks Entry', icon: FileCheck2 },
          { id: 'materials', label: 'Upload Study Material', icon: FolderDown },
          { id: 'timetable', label: 'Teaching Schedule', icon: Calendar },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'timetable', label: 'My Class Timetable', icon: Calendar },
          { id: 'attendance', label: 'Attendance Records', icon: CalendarCheck },
          { id: 'homework', label: 'My Homework & Tasks', icon: BookOpen },
          { id: 'exams', label: 'Exam Marks & Report Card', icon: FileCheck2 },
          { id: 'materials', label: 'Notes & Video Lectures', icon: FolderDown },
          { id: 'fees', label: 'Fee Status & Receipts', icon: Receipt },
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Child Academic Overview', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance & Alerts', icon: CalendarCheck },
          { id: 'exams', label: 'Marks, Ranks & Reports', icon: FileCheck2 },
          { id: 'homework', label: 'Homework Status', icon: BookOpen },
          { id: 'fees', label: 'Pending Dues & Pay Online', icon: Receipt },
          { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Role specific header or child selector */}
      {currentRole === 'parent' ? (
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <Baby className="w-3.5 h-3.5 text-sky-600" />
            <span>Select Linked Child</span>
          </div>
          <div className="space-y-1.5">
            {parentChildren.map((child) => {
              const isSelected = selectedChildId === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-sm font-semibold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="truncate">{child.fullName}</div>
                    <div className={`text-[11px] ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                      Std {child.standard} · {child.board}
                    </div>
                  </div>
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {currentRole === 'admin'
              ? 'Administrator Console'
              : currentRole === 'teacher'
              ? 'Faculty Portal'
              : 'Student Workspace'}
          </div>
          <div className="text-sm font-semibold text-slate-800 mt-1">
            {currentRole === 'admin'
              ? 'Dr. Sudhir Deshpande'
              : currentRole === 'teacher'
              ? 'Prof. Ramesh Joshi'
              : 'Aarav Sharma (Std 10)'}
          </div>
        </div>
      )}

      {/* Navigation menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePortalTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePortalTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar bottom academy trust footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500">
        <div className="font-semibold text-slate-700">VidyaSetu Academy</div>
        <div className="text-slate-400">AY 2026-2027 · Reg: MAH/8834</div>
      </div>
    </aside>
  );
};
