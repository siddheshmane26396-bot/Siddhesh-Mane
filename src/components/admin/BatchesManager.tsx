import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Batch, SchoolBoard } from '../../types';
import {
  Layers,
  Plus,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  X,
  Calendar,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

export const BatchesManager: React.FC = () => {
  const { batches, addBatch, updateBatch, deleteBatch, teachers, students, settings } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [standard, setStandard] = useState<number>(10);
  const [board, setBoard] = useState<SchoolBoard>('CBSE');
  const [timingType, setTimingType] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Weekend'>('Morning');
  const [scheduleTime, setScheduleTime] = useState('07:00 AM - 09:30 AM');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [classroom, setClassroom] = useState('Hall A - Smart Classroom 1');
  const [capacity, setCapacity] = useState<number>(35);
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'Science']);

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDayToggle = (day: string) => {
    setDaysOfWeek((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleOpenModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setName(batch.name);
      setStandard(batch.standard);
      setBoard(batch.board);
      setTimingType(batch.timingType);
      setScheduleTime(batch.scheduleTime);
      setDaysOfWeek(batch.daysOfWeek);
      setClassroom(batch.classroom);
      setCapacity(batch.capacity);
      setTeacherId(batch.teacherId);
      setSubjects(batch.subjects);
    } else {
      setEditingBatch(null);
      setName(`Std ${standard} ${board} - Morning Batch`);
      setScheduleTime('07:00 AM - 09:30 AM');
      setClassroom('Hall A');
      setCapacity(30);
      setDaysOfWeek(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    }
    setIsModalOpen(true);
  };

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTeacher = teachers.find((t) => t.id === teacherId);
    const teacherName = assignedTeacher ? assignedTeacher.name : 'Unassigned';

    if (editingBatch) {
      updateBatch(editingBatch.id, {
        name,
        standard,
        board,
        timingType,
        scheduleTime,
        daysOfWeek,
        classroom,
        capacity,
        teacherId,
        teacherName,
        subjects,
      });
    } else {
      addBatch({
        name,
        standard,
        board,
        timingType,
        scheduleTime,
        daysOfWeek,
        classroom,
        capacity,
        teacherId,
        teacherName,
        subjects,
        academicYear: settings.academicYear,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Classes, Batches & Timetable Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure morning, afternoon, and evening batches for Standards 1–12, classrooms, and teacher allocations.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {batches.map((batch) => {
          const enrolledInThisBatch = students.filter((s) => s.batchId === batch.id).length;
          const occupancyPct = Math.min(100, Math.round((enrolledInThisBatch / batch.capacity) * 100));

          return (
            <div
              key={batch.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      Standard {batch.standard} · {batch.board === 'Maharashtra State Board' ? 'SSC/HSC' : batch.board}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1.5">{batch.name}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {batch.timingType}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono font-medium text-slate-800">{batch.scheduleTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{batch.classroom}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Mentor: <strong className="text-slate-800">{batch.teacherName}</strong></span>
                  </div>

                  {/* Days */}
                  <div className="flex items-center gap-1 pt-1">
                    {allDays.map((d) => (
                      <span
                        key={d}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          batch.daysOfWeek.includes(d)
                            ? 'bg-slate-900 text-white font-semibold'
                            : 'text-slate-300 bg-slate-50'
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom: Capacity progress and actions */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Seat Capacity:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {enrolledInThisBatch} / {batch.capacity} Students ({occupancyPct}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occupancyPct >= 90 ? 'bg-rose-500' : occupancyPct >= 70 ? 'bg-amber-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${occupancyPct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleOpenModal(batch)}
                    className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    Edit Batch
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete batch "${batch.name}"?`)) {
                        deleteBatch(batch.id);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {editingBatch ? 'Update Batch Details' : 'Create New Coaching Batch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBatch} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Std 10 CBSE - Morning Achievers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class / Standard *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Board *</label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value as SchoolBoard)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Maharashtra State Board">Maharashtra State Board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shift / Timing Type</label>
                  <select
                    value={timingType}
                    onChange={(e) => setTimingType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Weekend">Weekend</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Timing Schedule</label>
                  <input
                    type="text"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    placeholder="e.g. 07:00 AM - 09:30 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Classroom / Room</label>
                  <input
                    type="text"
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                    placeholder="e.g. Hall A - Smart Lab"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Capacity (Students)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Lead Teacher</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.qualification})
                    </option>
                  ))}
                </select>
              </div>

              {/* Days selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Days of Week</label>
                <div className="flex items-center gap-1.5">
                  {allDays.map((d) => {
                    const isSel = daysOfWeek.includes(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => handleDayToggle(d)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                          isSel
                            ? 'bg-sky-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
