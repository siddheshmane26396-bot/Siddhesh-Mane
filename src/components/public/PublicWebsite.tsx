import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolBoard } from '../../types';
import {
  GraduationCap,
  Award,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Star,
  ExternalLink,
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { AcademyLocationMap } from '../common/AcademyLocationMap';

export const PublicWebsite: React.FC = () => {
  const { settings, submitOnlineEnquiry, setActiveView, teachers, batches, language } = useApp();

  // Enquiry form state
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [standard, setStandard] = useState<number>(10);
  const [board, setBoard] = useState<SchoolBoard>('CBSE');
  const [preferredBatchTime, setPreferredBatchTime] = useState('Morning (07:00 AM - 09:30 AM)');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Science']);
  const [notes, setNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const availableSubjects = [
    'Mathematics',
    'Science (Physics/Chem/Bio)',
    'English',
    'Marathi',
    'Hindi',
    'Social Science',
    'Physics (11-12)',
    'Chemistry (11-12)',
    'Biology (11-12)',
    'Accountancy (11-12)',
  ];

  const handleSubjectToggle = (subj: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !parentPhone || !parentName) {
      alert('Please fill student name, parent name, and contact phone number.');
      return;
    }

    submitOnlineEnquiry({
      studentName,
      parentName,
      parentPhone,
      parentEmail,
      schoolName,
      standard,
      board,
      preferredBatchTime,
      subjectsInterested: selectedSubjects,
      notes,
    });

    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                <Award className="w-3.5 h-3.5" />
                <span>Maharashtra & CBSE Board Excellence · Classes 1 to 12</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Empowering School Students to Achieve <span className="text-sky-600">Top Ranks</span> with Conceptual Clarity.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                VidyaSetu Coaching Academy provides structured school coaching from Standards 1 to 12. Expert faculty, limited batch sizes, weekly tests, and individual doubt-solving sessions for Maharashtra State Board, CBSE, and ICSE curricula.
              </p>

              {/* Stat badges */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">14+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Years of Academy Excellence</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-sky-600 font-mono">98.4%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Board Exam Pass Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">2,400+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Successful Alumni</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#admissions"
                  className="px-6 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Book Free Demo & Admission Enquiry</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActiveView('portal')}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Student & Parent Portal Login</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Academy Highlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div>
                    <h3 className="font-bold text-base text-white">Admissions Open 2026–27</h3>
                    <p className="text-xs text-slate-300">Limited to 30 students per batch</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-md border border-emerald-500/30">
                    Active Intake
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Comprehensive 1 to 12 Coaching:</span>
                      <p className="text-slate-300 text-[11px]">Primary, Middle School, SSC/CBSE 10th Boards, and 11th-12th Science & Commerce streams.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Smart Attendance & Parent Alerts:</span>
                      <p className="text-slate-300 text-[11px]">Instant automated SMS notifications for absences and monthly attendance percentage tracking.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Rigorous Weekly Test Series:</span>
                      <p className="text-slate-300 text-[11px]">Unit tests, pre-board model papers, verified answer keys, and ranked progress report cards.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Digital Learning Materials:</span>
                      <p className="text-slate-300 text-[11px]">24/7 access to chapter notes, solved exemplar booklets, and recorded revision video lectures.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-sky-400" />
                    <span>Call: +91 98220 12345</span>
                  </div>
                  <a
                    href="https://wa.me/919822012345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses & Standards Section */}
      <section id="courses" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Curriculum & Standards</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Dedicated Programs for Every Stage of Schooling
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Tailored pedagogical approaches to build lifelong fundamentals and score top percentages in school exams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Std 1-5 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
              1–5
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Primary School (Std 1 to 5)</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Joyful foundational learning in basic arithmetic, reading fluency, handwriting, environmental science, and language basics.
            </p>
            <div className="text-xs font-medium text-slate-700 space-y-1">
              <div>· Basic Math & Mental Arithmetic</div>
              <div>· English & Regional Language (Marathi/Hindi)</div>
              <div>· Environmental Studies (EVS)</div>
            </div>
          </div>

          {/* Std 6-8 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
              6–8
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Middle School (Std 6 to 8)</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Transition from rote memorization to analytical problem solving in algebra, geometry, scientific concepts, and languages.
            </p>
            <div className="text-xs font-medium text-slate-700 space-y-1">
              <div>· Science Laboratory Demonstrations</div>
              <div>· NCERT & State Board Mathematics</div>
              <div>· Grammar & Creative Writing Mastery</div>
            </div>
          </div>

          {/* Std 9-10 */}
          <div className="bg-white p-6 rounded-xl border-2 border-sky-600 shadow-sm relative">
            <span className="absolute -top-3 right-4 bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Flagship
            </span>
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-4">
              9–10
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Board Special (Std 9 & 10)</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Intensive preparation for SSC State Board, CBSE, and ICSE. Chapter-wise question banks, weekly test series, and pre-board mocks.
            </p>
            <div className="text-xs font-medium text-slate-700 space-y-1">
              <div>· Complete Syllabus Coverage by Nov 30</div>
              <div>· 10 Full-Length Model Board Papers</div>
              <div>· Personalized Weak Area Doubt Camps</div>
            </div>
          </div>

          {/* Std 11-12 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
              11–12
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Higher Secondary (Std 11 & 12)</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Specialized coaching for HSC Board examination along with competitive entrance foundation (MHT-CET / JEE / NEET / CUET).
            </p>
            <div className="text-xs font-medium text-slate-700 space-y-1">
              <div>· Physics, Chemistry, Mathematics, Biology</div>
              <div>· Commerce (Accountancy, Economics, SP)</div>
              <div>· Step-by-Step Derivation Notebooks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Showcase */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Distinguished Educators</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Learn from Proven Mentors & Subject Specialists
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Our faculty members possess an average of 10+ years of teaching experience with proven track records of producing board toppers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((tch) => (
              <div key={tch.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-14 h-14 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-lg">
                  {tch.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{tch.name}</h3>
                  <div className="text-xs text-sky-600 font-semibold">{tch.qualification}</div>
                  <div className="text-[11px] text-slate-500">{tch.experienceYears} Years Teaching Experience</div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <span className="font-medium text-slate-800">Subjects: </span>
                  {tch.subjects.join(', ')}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {tch.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Batch Timings Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Flexibility & Discipline</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Convenient Batch Schedules
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Morning batches before school hours and evening batches designed to seamlessly complement school schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-base text-slate-900 mb-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Morning Achievers</span>
            </div>
            <div className="text-xs font-mono font-bold text-sky-600 mb-3">07:00 AM – 09:30 AM</div>
            <p className="text-xs text-slate-500 mb-4">
              Best suited for students attending afternoon school shifts or those who learn best in the fresh morning hours.
            </p>
            <div className="text-xs text-slate-600 space-y-1">
              <div>· Standards: 8th, 9th, 10th CBSE & State Board</div>
              <div>· Days: Monday to Saturday</div>
              <div>· Weekly Unit Test every Sunday morning</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-base text-slate-900 mb-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Evening Champions</span>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-600 mb-3">04:30 PM – 07:30 PM</div>
            <p className="text-xs text-slate-500 mb-4">
              Ideal for students returning from morning schools with sufficient time for evening refreshment before classes.
            </p>
            <div className="text-xs text-slate-600 space-y-1">
              <div>· Standards: 6th to 12th (All Boards)</div>
              <div>· Days: Monday to Friday + Saturday Doubt Clinic</div>
              <div>· Subject-wise staggered lecture timings</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-base text-slate-900 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Weekend & Revision Club</span>
            </div>
            <div className="text-xs font-mono font-bold text-purple-600 mb-3">Saturday & Sunday Special</div>
            <p className="text-xs text-slate-500 mb-4">
              Specialized batches for Olympiad foundation, formula drill revision, and extensive Board mock exam writing practice.
            </p>
            <div className="text-xs text-slate-600 space-y-1">
              <div>· Full-length 3-hour exam simulation</div>
              <div>· Detailed paper discussion & model answers</div>
              <div>· Remedial classes for slow-paced learners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Admission Enquiry Form Section */}
      <section id="admissions" className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Direct Admissions & Enquiry</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Enroll Your Child for Academic Excellence
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
              Submit your enquiry below to reserve a seat, schedule a 3-day free trial class, and receive the institute syllabus prospectus.
            </p>
          </div>

          <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {formSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Enquiry Submitted Successfully!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you! Our academic counselor will call you within 2 hours to confirm your child's batch schedule and free demo session.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setStudentName('');
                      setParentPhone('');
                    }}
                    className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                  <button
                    onClick={() => setActiveView('portal')}
                    className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
                  >
                    Go to Portal Dashboard →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parent Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98220 12345"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      School Class / Standard *
                    </label>
                    <select
                      value={standard}
                      onChange={(e) => setStandard(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
                        <option key={s} value={s}>
                          Standard {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      School Board *
                    </label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value as SchoolBoard)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="Maharashtra State Board">Maharashtra State Board (SSC/HSC)</option>
                      <option value="CBSE">CBSE Board</option>
                      <option value="ICSE">ICSE Board</option>
                      <option value="Other">Other / Cambridge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Batch Timing
                    </label>
                    <select
                      value={preferredBatchTime}
                      onChange={(e) => setPreferredBatchTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="Morning (07:00 AM - 09:30 AM)">Morning (07:00 AM - 09:30 AM)</option>
                      <option value="Evening (04:30 PM - 07:00 PM)">Evening (04:30 PM - 07:00 PM)</option>
                      <option value="Late Evening (05:30 PM - 08:00 PM)">Late Evening (05:30 PM - 08:00 PM)</option>
                      <option value="Weekend Special Only">Weekend Special Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current School Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi Public School / Bal Shikshan Mandir"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                {/* Subjects checkboxes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Subjects Interested In (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSubjects.map((sub) => {
                      const isSelected = selectedSubjects.includes(sub);
                      return (
                        <button
                          type="button"
                          key={sub}
                          onClick={() => handleSubjectToggle(sub)}
                          className={`px-3 py-1.5 text-xs rounded-lg border text-left flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-sky-50 border-sky-400 text-sky-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{sub}</span>
                          {isSelected && <span className="text-sky-600 ml-1">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Any Specific Queries or Academic Goals
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Student needs extra help in quadratic equations, looking for scholarship discount, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your contact details are strictly confidential. No spam.</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Admission Enquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials & Trust */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Parent Testimonials</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Trusted by Over 1,200 Families
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Read how regular coaching at VidyaSetu helped students overcome academic anxiety and secure top percentiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "My son Aarav scored 95% in Class 10 CBSE Maths mock exams. Prof. Ramesh Joshi's step-by-step problem dissection and the automated SMS attendance updates give working parents complete peace of mind."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <div className="font-bold text-xs text-slate-900">Sunita Sharma</div>
              <div className="text-[11px] text-slate-500">Parent of Aarav Sharma (Class 10 CBSE)</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "State Board Marathi and Science coaching is top-notch here. Mrs. Anjali Kulkarni pays personal attention to every student's grammar and answers. Highly recommend for 9th and 10th boards."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <div className="font-bold text-xs text-slate-900">Sanjay Patil</div>
              <div className="text-[11px] text-slate-500">Parent of Rohit Patil (Std 10 SSC)</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The study materials, formula sheets, and printable report cards are so professional. Tanvi excelled in Std 12 HSC Physics under Dr. Neha Deshmukh's guidance."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <div className="font-bold text-xs text-slate-900">Mahesh Deshmukh</div>
              <div className="text-[11px] text-slate-500">Parent of Tanvi Deshmukh (Class 12 HSC)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Common Inquiries</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">What is the batch size at VidyaSetu?</h4>
              <p className="text-slate-600 leading-relaxed">
                To guarantee personalized attention and individual doubt resolution, our batches are strictly capped at 25 to 35 students per class.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Are installment fee options and scholarships available?</h4>
              <p className="text-slate-600 leading-relaxed">
                Yes! We offer quarterly and term-wise installment plans. Merit scholarships up to 25% are awarded based on previous academic percentages and the VidyaSetu Scholarship Aptitude Test (V-SAT). Sibling discounts are also provided.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">How do parents stay updated on student attendance and marks?</h4>
              <p className="text-slate-600 leading-relaxed">
                Parents receive automated instant absence SMS alerts whenever a student is marked absent. Parents also have 24/7 access to the Parent Portal to view daily homework, upcoming exams, test marks, and download official fee receipts.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Can a student attend demo lectures before paying fees?</h4>
              <p className="text-slate-600 leading-relaxed">
                Yes! Every prospective student is welcome to attend 3 complimentary trial lectures in their assigned standard batch before completing admission formalities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academy Campuses & Commute Map Section */}
      <section id="locations" className="py-16 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Campus Locations & Commute</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Visit VidyaSetu Centers & Pickup Points</h2>
            <p className="text-xs text-slate-600 mt-2">
              Explore our main campus, foundation junior wing, and institute bus pickup points across Pune on Google Maps.
            </p>
          </div>

          <AcademyLocationMap heightClass="h-[460px]" />
        </div>
      </section>

      {/* Public Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <GraduationCap className="w-5 h-5 text-sky-400" />
              <span>{settings.instituteName}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Premier coaching institute providing academic foundation and board excellence for Standards 1 to 12.
            </p>
            <div className="text-[11px] text-slate-500">
              Registration No: {settings.registrationNumber}
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-3">Quick Navigation</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#courses" className="hover:text-white">Standards 1 to 12</a></li>
              <li><a href="#admissions" className="hover:text-white">Admission Enquiry</a></li>
              <li><button onClick={() => setActiveView('portal')} className="hover:text-white">Institute Portal Login</button></li>
              <li><a href="#courses" className="hover:text-white">Batch Timings</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-3">Contact Institute</div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.city} - {settings.pincode}, {settings.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-3">Direct Connect</div>
            <p className="text-[11px] text-slate-400 mb-3">
              Connect directly with our admissions desk on WhatsApp or call our helpline.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/919822012345"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Admissions Desk</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            © 2026 {settings.instituteName}. All rights reserved. GSTIN: {settings.gstNumber}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Admission</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Student Code of Conduct</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
