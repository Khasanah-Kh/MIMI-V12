/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  X,
  RefreshCw,
  LogOut,
  ExternalLink,
  Send,
  AlertCircle,
  FileCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initClassroomAuth,
  signInWithGoogleClassroom,
  signOutGoogleClassroom,
  fetchClassroomCourses,
  fetchCourseWork,
  ClassroomCourse,
  ClassroomCourseWork,
} from '../services/classroomAuth';

interface ClassroomSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskMimiAboutHomework: (prompt: string, courseTitle?: string) => void;
}

export const ClassroomSyncModal: React.FC<ClassroomSyncModalProps> = ({
  isOpen,
  onClose,
  onAskMimiAboutHomework,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [courseWorks, setCourseWorks] = useState<ClassroomCourseWork[]>([]);
  const [isLoadingWorks, setIsLoadingWorks] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initClassroomAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        loadCourses(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setCourses([]);
        setSelectedCourse(null);
        setCourseWorks([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadCourses = async (token: string) => {
    setIsLoadingCourses(true);
    setErrorMessage(null);
    try {
      const items = await fetchClassroomCourses(token);
      setCourses(items);
      if (items.length > 0 && !selectedCourse) {
        handleSelectCourse(items[0], token);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat daftar kelas.';
      setErrorMessage(msg);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleSelectCourse = async (course: ClassroomCourse, tokenOverride?: string) => {
    setSelectedCourse(course);
    const token = tokenOverride || accessToken;
    if (!token) return;

    setIsLoadingWorks(true);
    setErrorMessage(null);
    try {
      const works = await fetchCourseWork(course.id, token);
      setCourseWorks(works);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat tugas kelas.';
      setErrorMessage(msg);
    } finally {
      setIsLoadingWorks(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoadingAuth(true);
    setErrorMessage(null);
    try {
      const res = await signInWithGoogleClassroom();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        await loadCourses(res.accessToken);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk dengan Google Classroom.';
      setErrorMessage(msg);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogleClassroom();
    setCurrentUser(null);
    setAccessToken(null);
    setCourses([]);
    setSelectedCourse(null);
    setCourseWorks([]);
  };

  const handleSendToMimi = (work: ClassroomCourseWork) => {
    const subjectPrefix = selectedCourse ? `[${selectedCourse.name}]` : '';
    const dueInfo = work.dueDate
      ? ` (Deadline: ${work.dueDate.day}/${work.dueDate.month}/${work.dueDate.year})`
      : '';
    const desc = work.description ? `\nDetail Tugas:\n${work.description.slice(0, 300)}` : '';
    const prompt = `Mim, tolong bantuin PR Google Classroom aku nih ${subjectPrefix}: "${work.title}"${dueInfo}.${desc}\nKasih aku petunjuk dan cara ngerjainnya bertahap ya! 🔥`;

    onAskMimiAboutHomework(prompt, selectedCourse?.name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#12101D] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-red-950/40 via-purple-950/20 to-black">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-red-600 to-rose-700 rounded-xl shadow-lg shadow-red-600/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white tracking-wide">
                  Google Classroom Sync
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">
                  MIMI V12
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Hubungkan tugas sekolahmu langsung ke ruang belajar MIMI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 bg-red-500/15 border border-red-500/30 rounded-xl flex items-start space-x-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!currentUser ? (
            <div className="text-center py-8 px-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 shadow-inner">
                <BookOpen className="w-8 h-8 text-red-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Sinkronkan Tugas Google Classroom Kamu
              </h4>
              <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
                Tampilkan semua kelas, materi, dan PR yang ada di Google Classroom kamu secara
                langsung di sini. Kamu bisa langsung minta Mimi untuk membimbing pengerjaan tugas!
              </p>

              {/* Standard Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoadingAuth}
                className="inline-flex items-center space-x-3 px-5 py-3 bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isLoadingAuth ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-700" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                <span>{isLoadingAuth ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>

              <div className="mt-6 flex items-center space-x-2 text-xs text-zinc-500">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Aman & sesuai izin resmi Google Classroom</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account summary banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Akun Google'}
                      className="w-10 h-10 rounded-full border border-red-500/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {currentUser.displayName || 'Siswa Google Classroom'}
                    </p>
                    <p className="text-xs text-zinc-400">{currentUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => accessToken && loadCourses(accessToken)}
                    disabled={isLoadingCourses}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg text-xs transition-colors flex items-center space-x-1"
                    title="Segarkan data kelas"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoadingCourses ? 'animate-spin text-red-400' : ''}`}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-xs transition-colors flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>

              {/* Class Tabs */}
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Pilih Kelas ({courses.length})
                </p>
                {isLoadingCourses ? (
                  <div className="py-6 text-center text-xs text-zinc-400 flex items-center justify-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                    <span>Memuat kelas Google Classroom kamu...</span>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 text-center text-xs text-zinc-400">
                    Belum ada kelas aktif di akun Google Classroom kamu.
                  </div>
                ) : (
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
                    {courses.map((course) => {
                      const isSelected = selectedCourse?.id === course.id;
                      return (
                        <button
                          key={course.id}
                          onClick={() => handleSelectCourse(course)}
                          className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 border ${
                            isSelected
                              ? 'bg-red-600/30 text-white border-red-500/60 shadow-lg shadow-red-600/20'
                              : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5 text-red-400" />
                          <span className="truncate max-w-[150px]">{course.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Coursework list for selected course */}
              {selectedCourse && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-red-400" />
                      <span>Daftar Tugas: {selectedCourse.name}</span>
                    </h4>
                    {selectedCourse.alternateLink && (
                      <a
                        href={selectedCourse.alternateLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
                      >
                        <span>Buka di Classroom</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {isLoadingWorks ? (
                    <div className="py-8 text-center text-xs text-zinc-400 flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                      <span>Memuat tugas dari kelas ini...</span>
                    </div>
                  ) : courseWorks.length === 0 ? (
                    <div className="p-6 bg-zinc-900/40 rounded-xl border border-white/5 text-center text-xs text-zinc-400">
                      🎉 Hore! Belum ada tugas atau PR baru di kelas ini.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {courseWorks.map((work) => {
                        return (
                          <div
                            key={work.id}
                            className="p-3.5 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                          >
                            <div className="space-y-1 flex-1">
                              <p className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors">
                                {work.title}
                              </p>
                              {work.description && (
                                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                  {work.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-1">
                                {work.dueDate && (
                                  <span className="flex items-center space-x-1 text-amber-300/90 font-mono">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      Tenggat: {work.dueDate.day}/{work.dueDate.month}/
                                      {work.dueDate.year}
                                    </span>
                                  </span>
                                )}
                                {work.maxPoints && (
                                  <span className="text-zinc-400">Nilai: {work.maxPoints} pts</span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSendToMimi(work)}
                              className="self-end sm:self-center shrink-0 px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-red-500/25 transition-all flex items-center space-x-1.5 active:scale-95"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Tanya Mimi</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
