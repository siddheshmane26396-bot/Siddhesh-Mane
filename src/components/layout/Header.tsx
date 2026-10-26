import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Globe,
  GraduationCap,
  ChevronDown,
  Search,
  X,
  Users,
  Layers,
  FileText,
  CreditCard,
  Calendar,
  BookOpen,
  MapPin,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { AcademyLocationMap } from '../common/AcademyLocationMap';

interface HeaderProps {
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const {
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    setActivePortalTab,
    language,
    setLanguage,
    notifications,
    students,
    batches,
    exams,
    feeReceipts,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleLabels: Record<UserRole, { label: string; desc: string; color: string }> = {
    admin: { label: 'Institute Admin', desc: 'Dr. Deshpande (Director)', color: 'text-indigo-600' },
    teacher: { label: 'Teacher / Faculty', desc: 'Prof. Joshi (Maths)', color: 'text-emerald-600' },
    student: { label: 'Student', desc: 'Aarav Sharma (Std 10)', color: 'text-sky-600' },
    parent: { label: 'Parent / Guardian', desc: 'Sunita Sharma (Parent)', color: 'text-amber-600' },
  };

  // Keyboard shortcut (Ctrl+K or Command+K or /) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    if (activeView === 'website') {
      setActiveView('portal');
    }
  };

  // Filter items across Students, Batches, Reports
  const q = searchQuery.trim().toLowerCase();

  const matchingStudents = q
    ? students
        .filter(
          (s) =>
            s.fullName.toLowerCase().includes(q) ||
            s.studentIdNumber.toLowerCase().includes(q) ||
            s.schoolName.toLowerCase().includes(q) ||
            s.batchName.toLowerCase().includes(q) ||
            s.parentPhone.includes(q) ||
            `standard ${s.standard}`.includes(q) ||
            `std ${s.standard}`.includes(q)
        )
        .slice(0, 4)
    : [];

  const matchingBatches = q
    ? batches
        .filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.subjects.some((sub) => sub.toLowerCase().includes(q)) ||
            b.teacherName.toLowerCase().includes(q) ||
            `class ${b.standard}`.includes(q) ||
            `std ${b.standard}`.includes(q) ||
            b.board.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  // Common reports and analytical sections
  const reportOptions = [
    {
      title: 'Fee Collection & Pending Dues Register',
      category: 'Financial Report',
      tab: 'fees',
      keywords: 'fee fees payment collection receipt receipts dues discount pending revenue balance',
    },
    {
      title: 'Daily Student Attendance & Absentees Summary',
      category: 'Attendance Report',
      tab: 'attendance',
      keywords: 'attendance absent present biometric register defaulters leaves daily',
    },
    {
      title: 'Academic Examination Marks & Report Cards',
      category: 'Academic Report',
      tab: 'exams',
      keywords: 'exam exams test marks score rank topper grade progress card report evaluation',
    },
    {
      title: 'Institute Analytics & Excel / CSV Data Export',
      category: 'Institute Export',
      tab: 'reports',
      keywords: 'reports analytics export excel csv backup data statistics admission trends audit',
    },
  ];

  const matchingReports = q
    ? reportOptions.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.keywords.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchingStudents.length > 0 || matchingBatches.length > 0 || matchingReports.length > 0;

  const navigateToTab = (tab: string) => {
    setActiveView('portal');
    setActivePortalTab(tab);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <button
              onClick={() => setActiveView('website')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors whitespace-nowrap block">
                {language === 'mr' ? 'विद्यासेतू अकॅडमी' : language === 'hi' ? 'विद्यासेतु एकेडमी' : 'VidyaSetu Academy'}
              </span>
            </button>
          </div>

          {/* Zone 2: Global Search Input Field (Centered & Responsive) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-lg mx-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search students, batches, or reports... (Ctrl+K)"
                className="w-full pl-9 pr-14 py-2 text-xs bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-500 rounded-xl border border-transparent focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                    ⌘K
                  </kbd>
                )}
              </div>
            </div>

            {/* Dropdown Results Card */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {searchQuery.trim().length === 0 ? (
                  <div className="p-4 text-xs text-slate-500">
                    <div className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <span>Quick Navigation & Search Suggestions</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <button
                        onClick={() => navigateToTab('students')}
                        className="p-2.5 rounded-lg border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 text-left transition-colors flex items-center gap-2 text-slate-700"
                      >
                        <Users className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <div>
                          <div className="font-semibold">All Students</div>
                          <div className="text-[10px] text-slate-400">{students.length} active enrollments</div>
                        </div>
                      </button>
                      <button
                        onClick={() => navigateToTab('batches')}
                        className="p-2.5 rounded-lg border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 text-left transition-colors flex items-center gap-2 text-slate-700"
                      >
                        <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-semibold">Tuition Batches</div>
                          <div className="text-[10px] text-slate-400">{batches.length} scheduled groups</div>
                        </div>
                      </button>
                      <button
                        onClick={() => navigateToTab('fees')}
                        className="p-2.5 rounded-lg border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 text-left transition-colors flex items-center gap-2 text-slate-700"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <div>
                          <div className="font-semibold">Fee Receipts</div>
                          <div className="text-[10px] text-slate-400">{feeReceipts.length} payment records</div>
                        </div>
                      </button>
                      <button
                        onClick={() => navigateToTab('reports')}
                        className="p-2.5 rounded-lg border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 text-left transition-colors flex items-center gap-2 text-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <div>
                          <div className="font-semibold">Institute Reports</div>
                          <div className="text-[10px] text-slate-400">Excel / CSV export & trends</div>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : !hasResults ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    <p className="font-medium text-slate-700">No matches found for "{searchQuery}"</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try searching with student name, ID (e.g. VS-2026-001), standard, or report keyword.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 text-xs">
                    {/* Matching Students */}
                    {matchingStudents.length > 0 && (
                      <div className="p-2">
                        <div className="px-2.5 py-1 text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center justify-between">
                          <span>Students ({matchingStudents.length})</span>
                          <button
                            onClick={() => navigateToTab('students')}
                            className="text-sky-600 hover:underline normal-case font-medium flex items-center gap-0.5"
                          >
                            View all <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                        {matchingStudents.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => navigateToTab('students')}
                            className="px-2.5 py-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between group transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={st.photoUrl}
                                alt={st.fullName}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <div className="font-semibold text-slate-900 group-hover:text-sky-600">
                                  {st.fullName}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  Std {st.standard} · {st.board} · {st.batchName} · ID: {st.studentIdNumber}
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ₹{st.paidFee.toLocaleString()} / ₹{st.netFee.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matching Batches */}
                    {matchingBatches.length > 0 && (
                      <div className="p-2">
                        <div className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
                          <span>Batches ({matchingBatches.length})</span>
                          <button
                            onClick={() => navigateToTab('batches')}
                            className="text-emerald-600 hover:underline normal-case font-medium flex items-center gap-0.5"
                          >
                            View all <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                        {matchingBatches.map((bt) => (
                          <div
                            key={bt.id}
                            onClick={() => navigateToTab('batches')}
                            className="px-2.5 py-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between group transition-colors"
                          >
                            <div>
                              <div className="font-semibold text-slate-900 group-hover:text-emerald-600">
                                {bt.name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Std {bt.standard} · {bt.board} · {bt.subjects.join(', ')} · {bt.scheduleTime} · {bt.classroom}
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {bt.enrolledCount}/{bt.capacity} enrolled
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matching Reports & Academic Modules */}
                    {matchingReports.length > 0 && (
                      <div className="p-2">
                        <div className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                          <span>Reports & Analytics</span>
                        </div>
                        {matchingReports.map((rp, idx) => (
                          <div
                            key={idx}
                            onClick={() => navigateToTab(rp.tab)}
                            className="px-2.5 py-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between group transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                              <div>
                                <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                                  {rp.title}
                                </div>
                                <div className="text-[11px] text-slate-500">{rp.category}</div>
                              </div>
                            </div>
                            <span className="text-[11px] text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                              Open →
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Press <kbd className="font-mono bg-white px-1 border rounded">ESC</kbd> to close</span>
                  <span className="text-sky-600 font-medium">VidyaSetu Global Unified Search</span>
                </div>
              </div>
            )}
          </div>

          {/* Zone 3: Navigation Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Campus Map Button */}
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Google Maps Campus & Pickup Route"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>Campus Map</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'en' ? 'EN' : language === 'mr' ? 'मराठी' : 'हिंदी'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                      language === 'en' ? 'font-bold text-sky-600' : 'text-slate-700'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('mr');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                      language === 'mr' ? 'font-bold text-sky-600' : 'text-slate-700'
                    }`}
                  >
                    <span>मराठी</span>
                    {language === 'mr' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                      language === 'hi' ? 'font-bold text-sky-600' : 'text-slate-700'
                    }`}
                  >
                    <span>हिंदी</span>
                    {language === 'hi' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span className="hidden md:inline text-slate-500 font-normal">Role:</span>
                <span className="font-semibold text-slate-900">{roleLabels[currentRole].label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select User Role / View
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                    const info = roleLabels[r];
                    const isCurrent = currentRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-start justify-between transition-colors ${
                          isCurrent ? 'bg-sky-50 text-sky-900' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{info.label}</div>
                          <div className="text-[11px] text-slate-500">{info.desc}</div>
                        </div>
                        {isCurrent && <span className="text-sky-600 font-bold">Active</span>}
                      </button>
                    );
                  })}
                  <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 text-[11px] text-slate-400">
                    Switch instantly to test workflows across all 4 personas.
                  </div>
                </div>
              )}
            </div>

            {/* Primary View Switcher CTA */}
            {activeView === 'website' ? (
              <button
                onClick={() => setActiveView('portal')}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                Portal →
              </button>
            ) : (
              <button
                onClick={() => setActiveView('website')}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Public Site
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Google Maps Campus Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">VidyaSetu Academy Campuses & Pickup Route Map</h3>
                  <p className="text-xs text-slate-500">Interactive Google Maps Platform navigation</p>
                </div>
              </div>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <AcademyLocationMap heightClass="h-[480px]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
