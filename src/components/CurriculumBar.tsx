import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import {
  Jenjang,
  JENJANG_GRADES,
  SubjectInfo,
} from '../lib/mimiEngine';

interface CurriculumBarProps {
  jenjang: Jenjang;
  kelas: number;
  mapel: string;
  subjects: SubjectInfo[];
  onSelectJenjang: (j: Jenjang) => void;
  onSelectKelas: (k: number) => void;
  onSelectMapel: (m: string) => void;
}

export const CurriculumBar: React.FC<CurriculumBarProps> = ({
  jenjang,
  kelas,
  mapel,
  subjects,
  onSelectJenjang,
  onSelectKelas,
  onSelectMapel,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const currentSubject = subjects.find((s) => s.id === mapel) || subjects[0];
  const grades = JENJANG_GRADES[jenjang];

  return (
    <section
      aria-label="Pemilih Tingkatan Kurikulum Merdeka"
      className="bg-[#161521]/90 backdrop-blur-xl border-b border-purple-500/20 px-3.5 sm:px-6 py-2.5 sm:py-4 relative z-10"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5 sm:gap-3.5">
        {/* Mobile Compact Summary Bar (< 640px) */}
        <div className="flex sm:hidden items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-[11px] font-display font-bold whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
              {jenjang} · Kelas {kelas}
            </span>
            {currentSubject && (
              <span className="text-[11px] text-purple-200 font-medium truncate">
                📚 {currentSubject.sampleChapter} (Hal. {currentSubject.samplePage})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen((prev) => !prev)}
            aria-expanded={mobileDrawerOpen}
            className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-purple-400/40 text-purple-200 text-[11px] font-display font-bold flex items-center gap-1 whitespace-nowrap shrink-0 active:scale-95 transition-transform"
          >
            <span>{mobileDrawerOpen ? 'Tutup' : 'Ubah Kelas'}</span>
            {mobileDrawerOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-pink-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-pink-400" />
            )}
          </button>
        </div>

        {/* Full Jenjang + Kelas + Kemendikdasmen Book Bar (Always visible on sm+, collapsible on mobile) */}
        <div
          className={`${
            mobileDrawerOpen ? 'flex' : 'hidden sm:flex'
          } flex-wrap items-center justify-between gap-3 sm:gap-4 pt-1 sm:pt-0 border-t border-white/10 sm:border-0`}
        >
          {/* Left: Tingkatan (SD / SMP / SMA) + Kelas Story-Style Chips */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-300/80 whitespace-nowrap">
                Tingkatan:
              </span>
              <div
                role="group"
                aria-label="Pilih Jenjang Sekolah"
                className="flex items-center gap-1 sm:gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-full"
              >
                {(['SD', 'SMP', 'SMA'] as Jenjang[]).map((item) => {
                  const isActive = jenjang === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSelectJenjang(item)}
                      className={`px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_16px_rgba(139,92,246,0.65)]'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
              <span className="text-xs font-semibold text-purple-300/80 whitespace-nowrap shrink-0">
                Kelas:
              </span>
              <div
                role="group"
                aria-label="Pilih Kelas"
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
              >
                {grades.map((k) => {
                  const isActive = kelas === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        onSelectKelas(k);
                        setMobileDrawerOpen(false);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 tabular-nums whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'skena-neon-chip-active text-white'
                          : 'bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-purple-400/50'
                      }`}
                    >
                      Kelas {k}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Official Kemendikdasmen Katalog Buku Kurikulum Merdeka Source Metadata */}
          {currentSubject && (
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-purple-200 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-pink-400 shrink-0 sm:hidden" />
                <span>📚 {currentSubject.bookTitle}</span>
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="text-slate-300 hidden sm:inline">{currentSubject.sampleChapter}</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="tabular-nums text-pink-300">Hal. {currentSubject.samplePage}</span>
              <span aria-hidden="true">·</span>
              <a
                href="https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 hover:text-white hover:border-pink-400 transition-all duration-200 hover:scale-105 font-semibold"
              >
                Katalog Resmi: buku.kemendikdasmen.go.id ↗
              </a>
            </div>
          )}
        </div>

        {/* Bottom row: Mata Pelajaran Instagram-Story-Style Aesthetic Chips (Thumb Swipeable on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] sm:text-xs font-semibold text-purple-300/80 whitespace-nowrap shrink-0 mr-0.5">
            Mapel:
          </span>
          <div
            role="group"
            aria-label="Pilih Mata Pelajaran"
            className="flex items-center gap-1.5 sm:gap-2"
          >
            {subjects.map((sub) => {
              const active = sub.id === mapel;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSelectMapel(sub.id)}
                  className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 ${
                    active
                      ? 'skena-neon-chip-active text-white font-bold'
                      : 'bg-white/[0.04] border border-white/10 text-slate-300 hover:border-pink-500/40 hover:text-white'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

