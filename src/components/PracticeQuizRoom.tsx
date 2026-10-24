import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  Jenjang,
  PRACTICE_QUESTIONS,
  PracticeQuestion,
} from '../lib/mimiEngine';

interface PracticeQuizRoomProps {
  activeJenjang: Jenjang;
  onAskMimiInChat: (promptText: string) => void;
}

export const PracticeQuizRoom: React.FC<PracticeQuizRoomProps> = ({
  activeJenjang,
  onAskMimiInChat,
}) => {
  const [filterJenjang, setFilterJenjang] = useState<'ALL' | Jenjang>('ALL');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C'>>({});
  const [revealedClues, setRevealedClues] = useState<Record<string, boolean>>({});

  const filteredQuestions = PRACTICE_QUESTIONS.filter((q) =>
    filterJenjang === 'ALL' ? true : q.jenjang === filterJenjang
  );

  const completedCount = Object.keys(selectedAnswers).length;
  const masteredCount = PRACTICE_QUESTIONS.filter((q) => {
    const pick = selectedAnswers[q.id];
    if (!pick) return false;
    const opt = q.options.find((o) => o.key === pick);
    return Boolean(opt?.isBestApproach);
  }).length;

  const toggleClue = (qId: string) => {
    setRevealedClues((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSelectOption = (q: PracticeQuestion, key: 'A' | 'B' | 'C') => {
    setSelectedAnswers((prev) => ({ ...prev, [q.id]: key }));
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header & Filter Bar */}
      <div className="skena-glass rounded-[20px] p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-[11px] font-display font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Skena Math &amp; Brainrot Quiz Arena</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">
            Latihan Soal Interaktif (Metode Bertahap &amp; Analogi Mimi) 🔥
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
            Bukan sekadar tebak kunci jawaban bestie! Pahami cara berpikir lewat 3 Langkah Matematika atau Clue &amp; Analogi Mapel Lain sesuai Buku Paket Kurikulum Merdeka.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 max-w-full">
          {/* Progress Stats */}
          <div className="text-xs text-zinc-300 flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10">
            <span>
              Soal Dijawab:{' '}
              <strong className="text-white tabular-nums">
                {completedCount}/{PRACTICE_QUESTIONS.length}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Langkah Tepat:{' '}
              <strong className="text-emerald-400 tabular-nums">{masteredCount}</strong>
            </span>
          </div>

          {/* Filter Jenjang */}
          <div
            role="group"
            aria-label="Filter soal berdasarkan jenjang"
            className="flex items-center gap-1.5 p-1.5 bg-white/[0.04] border border-white/10 rounded-full overflow-x-auto no-scrollbar max-w-full"
          >
            {(['ALL', 'SD', 'SMP', 'SMA'] as const).map((j) => (
              <button
                key={j}
                type="button"
                onClick={() => setFilterJenjang(j)}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-display font-bold rounded-full transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-105 active:scale-95 ${
                  filterJenjang === j
                    ? 'skena-neon-chip-active'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {j === 'ALL' ? `Semua (${activeJenjang})` : `Jenjang ${j}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredQuestions.map((q, idx) => {
          const pickedKey = selectedAnswers[q.id];
          const pickedOption = q.options.find((o) => o.key === pickedKey);
          const isClueOpen = Boolean(revealedClues[q.id]);

          return (
            <article
              key={q.id}
              className="skena-glass rounded-[20px] p-4 sm:p-6 flex flex-col justify-between space-y-5 transition-transform duration-200 hover:border-purple-400/50"
            >
              <div className="space-y-4">
                {/* Metadata Kicker */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-purple-300">
                      0{idx + 1}. {q.jenjang} Kelas {q.kelas}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-pink-400">{q.mapel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[11px]">
                      {q.isMath ? 'Konsep 3 Langkah + 3 Opsi' : 'Konsep Clue + Analogi'}
                    </span>
                  </div>
                  <span className="tabular-nums text-zinc-400">{q.webReference}</span>
                </div>

                <div>
                  <h3 className="font-display text-base font-extrabold text-white mb-1.5">
                    {q.topic}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/90 mb-3">
                    <span>📚 {q.sourceCitation}</span>
                    <a
                      href="https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-300 hover:text-white underline decoration-pink-400/50 font-semibold"
                    >
                      (Katalog Kemendikdasmen ↗)
                    </a>
                  </div>
                  <p className="text-sm text-zinc-100 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {/* Math 3 Steps Box (Only for Matematika per Golden Rule 3) */}
                {q.isMath && q.mathSteps && (
                  <div className="p-4 bg-purple-950/40 border border-purple-500/35 rounded-2xl space-y-1.5">
                    <p className="text-xs font-display font-bold text-purple-200">
                      ⚡ Panduan 3 Langkah Matematika Mimi:
                    </p>
                    {q.mathSteps.map((stepText) => (
                      <p key={stepText} className="text-xs text-zinc-200">
                        {stepText}
                      </p>
                    ))}
                  </div>
                )}

                {/* Clue & Analogy Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleClue(q.id)}
                    className="text-xs font-display font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1.5 transition-all duration-200 hover:scale-105"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>
                      {isClueOpen
                        ? 'Sembunyikan Clue & Analogi Mimi'
                        : 'Buka Clue & Analogi Mimi Sebelum Menjawab ✨'}
                    </span>
                  </button>

                  {isClueOpen && (
                    <div className="mt-2.5 p-4 bg-purple-950/50 border border-pink-500/40 rounded-2xl space-y-2 text-xs text-zinc-200">
                      <p>
                        <strong className="text-pink-300">Clue Buku:</strong> {q.mimiClue}
                      </p>
                      <p>
                        <strong className="text-purple-300">Analogi Mimi:</strong> {q.mimiAnalogy}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3 Options (A, B, C) */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-display font-bold text-zinc-300">
                    {q.isMath
                      ? 'Pilih salah satu dari 3 Opsi Langkah Pengerjaan (A / B / C):'
                      : 'Pilih Analisis Berdasarkan Clue & Analogi (A / B / C):'}
                  </p>
                  {q.options.map((opt) => {
                    const isSelected = pickedKey === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectOption(q, opt.key)}
                        className={`w-full text-left px-4 py-3 rounded-2xl border text-xs leading-relaxed transition-all duration-200 hover:scale-[1.02] flex items-start gap-3 ${
                          isSelected
                            ? opt.isBestApproach
                              ? 'bg-emerald-500/20 border-emerald-400 text-white font-semibold shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                              : 'bg-amber-500/20 border-amber-400 text-white font-semibold shadow-[0_0_16px_rgba(245,158,11,0.3)]'
                            : 'bg-white/[0.04] border-white/10 hover:border-purple-400/50 text-zinc-200'
                        }`}
                      >
                        <span className="font-mono font-bold text-purple-300 shrink-0">
                          {opt.key})
                        </span>
                        <span className="flex-1">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback & Profesor Hack Footer */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {pickedOption ? (
                  <div
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      pickedOption.isBestApproach
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100'
                        : 'bg-amber-950/50 border-amber-500/40 text-amber-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-display font-bold">
                      {pickedOption.isBestApproach ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Langkah Strategis Tepat! Slay Bestie! 🔥</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Yuk Cek Lagi Clue-nya Bestie! 💡</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed">{pickedOption.stepFeedback}</p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        <strong>Hack Profesor:</strong> {q.profesorTip}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">
                    Pilih opsi A, B, atau C di atas untuk menguji alur berpikirmu.
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-zinc-400">
                    Ingat: Kunci jawaban lengkap hubungi Mimi in real life 😉
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onAskMimiInChat(
                        `Mim, kita bahas soal ${q.mapel} Kelas ${q.kelas} tentang "${q.topic}" ini yuk: ${q.question}`
                      )
                    }
                    className="px-4 py-2 text-xs font-display font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-full shadow-[0_0_16px_rgba(139,92,246,0.45)] transition-all duration-200 hover:scale-105 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Bahas Bareng Mimi di Chat</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
