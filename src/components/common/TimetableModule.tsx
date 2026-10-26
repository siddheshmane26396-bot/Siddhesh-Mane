import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableSlot } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';

export const TimetableModule: React.FC = () => {
  const { currentRole, timetable, batches, teachers, students, selectedChildId } = useApp();

  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Student or Parent filter
  const activeStudentId = currentRole === 'student' ? 'stu-1' : currentRole === 'parent' ? selectedChildId : null;
  const currentStudent = students.find((s) => s.id === activeStudentId);

  const filteredSlots = timetable.filter((slot) => {
    if (activeStudentId && currentStudent) {
      return slot.batchId === currentStudent.batchId && slot.dayOfWeek === selectedDayFilter;
    }
    if (currentRole === 'teacher') {
      return slot.dayOfWeek === selectedDayFilter;
    }
    const matchesBatch = selectedBatchFilter === 'all' || slot.batchId === selectedBatchFilter;
    const matchesDay = slot.dayOfWeek === selectedDayFilter;
    return matchesBatch && matchesDay;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Timetable & Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Classroom allocations, subject slots, teacher assignments (Asia/Kolkata timezone).
          </p>
        </div>
      </div>

      {/* Batch filter for admin */}
      {currentRole === 'admin' && (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700">Filter by Batch:</span>
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-medium"
          >
            <option value="all">All Batches (Comprehensive Schedule)</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Day of Week Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDayFilter(day)}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedDayFilter === day
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {filteredSlots.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No lectures or tests scheduled for {selectedDayFilter}.
          </div>
        ) : (
          filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="px-3 py-2 bg-sky-50 text-sky-800 rounded-lg border border-sky-100 font-mono font-bold text-center shrink-0">
                  <div className="text-xs">{slot.startTime}</div>
                  <div className="text-[10px] text-sky-600 font-normal">to {slot.endTime}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{slot.subject}</h3>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Std {slot.standard}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{slot.batchName}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-600 text-[11px] sm:border-l sm:border-slate-200 sm:pl-4">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Teacher: <strong className="text-slate-800">{slot.teacherName}</strong></span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Room: <strong className="text-slate-800">{slot.classroom}</strong></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
