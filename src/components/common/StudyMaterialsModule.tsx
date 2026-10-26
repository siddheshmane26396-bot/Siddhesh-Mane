import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyMaterial } from '../../types';
import {
  FolderDown,
  Plus,
  FileText,
  Video,
  Download,
  Search,
  Filter,
  CheckCircle,
  X,
  BookOpen,
  Cloud,
} from 'lucide-react';
import { GoogleWorkspaceService } from '../../services/workspace';

export const StudyMaterialsModule: React.FC = () => {
  const {
    currentRole,
    studyMaterials,
    addStudyMaterial,
    incrementMaterialDownload,
    teachers,
    selectedChildId,
    students,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Active student standard if in student or parent portal
  const activeStudentId = currentRole === 'student' ? 'stu-1' : currentRole === 'parent' ? selectedChildId : null;
  const currentStudent = students.find((s) => s.id === activeStudentId);

  // New material form
  const [title, setTitle] = useState('');
  const [standard, setStandard] = useState<number>(10);
  const [subject, setSubject] = useState('Mathematics');
  const [chapter, setChapter] = useState('');
  const [type, setType] = useState<StudyMaterial['type']>('PDF Notes');
  const [fileName, setFileName] = useState('Study_Notes_Chapter.pdf');
  const [fileSize, setFileSize] = useState('4.2 MB');
  const [videoUrl, setVideoUrl] = useState('');

  const filteredMaterials = studyMaterials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.chapter.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStd =
      selectedStandard === 'all'
        ? activeStudentId && currentStudent
          ? m.standard === currentStudent.standard
          : true
        : m.standard.toString() === selectedStandard;

    const matchesType = selectedType === 'all' || m.type === selectedType;

    return matchesSearch && matchesStd && matchesType;
  });

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;

    addStudyMaterial({
      title,
      standard,
      subject,
      chapter: chapter || 'General Revision',
      type,
      fileUrl: '#download-resource',
      fileName,
      fileSize,
      videoUrl: videoUrl || undefined,
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedByTeacher: teachers[0]?.name || 'Faculty Member',
    });

    setIsUploadModalOpen(false);
    setTitle('');
    setChapter('');
  };

  const handleDownloadClick = (material: StudyMaterial) => {
    incrementMaterialDownload(material.id);
    alert(`Downloading "${material.fileName}" (${material.fileSize}). Material is now saved to student study vault.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Study Materials, Question Papers & Video Lectures</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject-wise PDF notes, formula sheets, previous year board papers, and recorded revision video lectures.
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Material</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes, chapters, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            <option value="all">
              {activeStudentId ? `Standard ${currentStudent?.standard} (Recommended)` : 'All Standards (1-12)'}
            </option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s.toString()}>
                Standard {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            <option value="all">All Content Types</option>
            <option value="PDF Notes">PDF Notes</option>
            <option value="Formula Sheet">Formula Sheet</option>
            <option value="Sample Paper">Sample Paper / Past Exam</option>
            <option value="Worksheet">Practice Worksheet</option>
            <option value="Video Lesson">Recorded Video Lecture</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No study materials found matching the current search.
          </div>
        ) : (
          filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 text-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    Std {mat.standard} · {mat.subject}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {mat.type}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">{mat.title}</h3>
                <div className="text-[11px] text-slate-500 mt-1">Topic: {mat.chapter}</div>

                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">File Name:</span>
                    <span className="font-mono text-slate-700 truncate max-w-[150px]">{mat.fileName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="font-mono text-slate-700">{mat.fileSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Faculty:</span>
                    <span className="text-slate-700">{mat.uploadedByTeacher}</span>
                  </div>
                </div>

                {mat.videoUrl && (
                  <div className="mt-3 p-2 bg-purple-50 rounded border border-purple-100 flex items-center gap-2 text-purple-900 text-[11px]">
                    <Video className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Includes HD video lecture playback</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] gap-2">
                <a
                  href={GoogleWorkspaceService.getDriveMaterialsFolderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                  title="Open in Google Drive"
                >
                  <Cloud className="w-3 h-3 text-sky-600" />
                  <span>Google Drive</span>
                </a>
                <button
                  onClick={() => handleDownloadClick(mat)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Material Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Upload Study Material / Video Lesson</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document / Lesson Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 Trigonometry Formula Chart & HOT Problems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Material Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Sample Paper">Sample Paper / Past Board Exam</option>
                    <option value="Worksheet">Practice Worksheet</option>
                    <option value="Video Lesson">Recorded Video Lesson</option>
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
                    placeholder="e.g. Science / Physics"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chapter / Topic</label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Light Reflection"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Name</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {type === 'Video Lesson' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Video Stream URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded"
                >
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
