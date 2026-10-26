import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { PublicWebsite } from './components/public/PublicWebsite';

// Admin modules
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentsList } from './components/admin/StudentsList';
import { BatchesManager } from './components/admin/BatchesManager';
import { FeeManager } from './components/admin/FeeManager';
import { AttendanceRegister } from './components/admin/AttendanceRegister';
import { EnquiriesManager } from './components/admin/EnquiriesManager';
import { ReportsExport } from './components/admin/ReportsExport';
import { SettingsManager } from './components/admin/SettingsManager';

// Shared / Role modules
import { HomeworkModule } from './components/common/HomeworkModule';
import { ExamsModule } from './common/../components/common/ExamsModule';
import { StudyMaterialsModule } from './components/common/StudyMaterialsModule';
import { TimetableModule } from './components/common/TimetableModule';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { StudentPortal } from './components/student/StudentPortal';
import { ParentPortal } from './components/parent/ParentPortal';

const MainAppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentRole,
    setCurrentRole,
    activePortalTab,
  } = useApp();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const renderAdminContent = () => {
    switch (activePortalTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'students':
        return <StudentsList />;
      case 'batches':
        return <BatchesManager />;
      case 'attendance':
        return <AttendanceRegister />;
      case 'fees':
        return <FeeManager />;
      case 'homework':
        return <HomeworkModule />;
      case 'exams':
        return <ExamsModule />;
      case 'materials':
        return <StudyMaterialsModule />;
      case 'timetable':
        return <TimetableModule />;
      case 'enquiries':
        return <EnquiriesManager />;
      case 'reports':
        return <ReportsExport />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* Universal Top Header adhering to Top Bar Contract */}
      <Header onOpenNotifications={() => setIsNotificationOpen(true)} />

      {/* Main Content Area */}
      {activeView === 'website' ? (
        <main className="flex-1">
          <PublicWebsite />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard Left Sidebar */}
          <Sidebar />

          {/* Main Dashboard Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {currentRole === 'admin' && renderAdminContent()}
              {currentRole === 'teacher' && <TeacherPortal />}
              {currentRole === 'student' && <StudentPortal />}
              {currentRole === 'parent' && <ParentPortal />}
            </div>
          </main>
        </div>
      )}

      {/* Floating Demo Role Switcher Bar at Bottom */}
      <div className="no-print fixed bottom-3 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-3 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
          Live Role Preview:
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setCurrentRole('admin');
              setActiveView('portal');
            }}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
              currentRole === 'admin' && activeView === 'portal'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => {
              setCurrentRole('teacher');
              setActiveView('portal');
            }}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
              currentRole === 'teacher' && activeView === 'portal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => {
              setCurrentRole('student');
              setActiveView('portal');
            }}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
              currentRole === 'student' && activeView === 'portal'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => {
              setCurrentRole('parent');
              setActiveView('portal');
            }}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
              currentRole === 'parent' && activeView === 'portal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Parent
          </button>
          <span className="text-slate-600 mx-1">|</span>
          <button
            onClick={() => setActiveView('website')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
              activeView === 'website'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Public Site
          </button>
        </div>
      </div>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
