/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Trophy,
  CheckCircle2,
  MessageSquare,
  Play,
  FileText,
  Award,
  Clock,
} from 'lucide-react';
import {
  AchievementBadge,
  AchievementProgressState,
  ChatMessage,
  DailyStreakState,
  DEFAULT_ACHIEVEMENT_PROGRESS,
  Jenjang,
  JENJANG_GRADES,
  MimiMode,
  computeAchievementBadges,
  computeUpdatedStreak,
  getSubjectsForGrade,
  generateSmartMimiReply,
  updateAchievementProgress,
} from './lib/mimiEngine';
import { CurriculumBar } from './components/CurriculumBar';
import { MimiChatRoom } from './components/MimiChatRoom';
import { PracticeQuizRoom } from './components/PracticeQuizRoom';
import { VideoLessonRoom } from './components/VideoLessonRoom';
import { PromptBlueprintView } from './components/PromptBlueprintView';

type ActiveSection = 'chat' | 'quiz' | 'video' | 'prompt';

const CHAT_MESSAGES_STORAGE_KEY = 'mimi_v12_chat_messages_storage';
const DAILY_STREAK_STORAGE_KEY = 'mimi_v12_daily_learning_streak';
const ACHIEVEMENT_BADGES_STORAGE_KEY = 'mimi_v12_achievement_badges_storage';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'mimi-welcome-1',
    role: 'assistant',
    content:
      'Hai bestie! ✨ Kenalin aku MIMI V12 — sahabat belajar kamu dari Kelas 8 SMP yang suka musik skena & push rank MLBB!\n\nKita bisa ngobrol santai dulu, curhat mood hari ini, atau kalau kamu ada PR/soal baru deh kita bedah bareng pakai referensi Katalog Buku Kurikulum Merdeka. Hari ini kamu lagi chill atau ada PR yang mau dibahas nih? 🔥',
    timestamp: '08:00',
    intent: 'greeting',
    mode: 'belajar',
  },
];

function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadInitialMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
    if (!raw) return INITIAL_MESSAGES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_MESSAGES;
  } catch {
    return INITIAL_MESSAGES;
  }
}

function loadAndSyncInitialStreak(): {
  streak: DailyStreakState;
  status: 'started' | 'maintained' | 'incremented' | 'reset';
} {
  const today = getTodayIsoDate();
  try {
    const raw = localStorage.getItem(DAILY_STREAK_STORAGE_KEY);
    const parsed: DailyStreakState | null = raw ? JSON.parse(raw) : null;
    const { next, status } = computeUpdatedStreak(parsed, today);
    localStorage.setItem(DAILY_STREAK_STORAGE_KEY, JSON.stringify(next));
    return { streak: next, status };
  } catch {
    const fallback = computeUpdatedStreak(null, today);
    return { streak: fallback.next, status: fallback.status };
  }
}

function loadInitialAchievementProgress(initialStreakCount: number): AchievementProgressState {
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_BADGES_STORAGE_KEY);
    if (!raw) {
      const seed = { ...DEFAULT_ACHIEVEMENT_PROGRESS, streakDays: initialStreakCount };
      localStorage.setItem(ACHIEVEMENT_BADGES_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ACHIEVEMENT_PROGRESS,
      ...parsed,
      streakDays: Math.max(parsed.streakDays || 1, initialStreakCount),
    };
  } catch {
    return { ...DEFAULT_ACHIEVEMENT_PROGRESS, streakDays: initialStreakCount };
  }
}

interface DailyLearningStreakProps {
  streak: DailyStreakState;
  achievementProgress: AchievementProgressState;
  badges: AchievementBadge[];
  streakPulse: boolean;
  feedbackBanner: string | null;
  onSimulateNextDay: () => void;
}

function DailyLearningStreak({
  streak,
  achievementProgress,
  badges,
  streakPulse,
  feedbackBanner,
  onSimulateNextDay,
}: DailyLearningStreakProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Daily Learning Streak: ${streak.count} hari berturut-turut, ${unlockedCount} badge terbuka`}
        title="Klik untuk lihat Daily Learning Streak & Badge Pencapaian kamu"
        className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border text-xs font-display font-bold flex items-center gap-1.5 sm:gap-2 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 ${
          streakPulse
            ? 'bg-gradient-to-r from-orange-500/35 via-amber-500/35 to-red-500/35 border-amber-400 text-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.75)] scale-105'
            : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/50 text-amber-200 shadow-[0_0_16px_rgba(249,115,22,0.35)] hover:border-amber-300'
        }`}
      >
        <span className="relative flex items-center justify-center">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 fill-orange-400 animate-pulse" />
        </span>
        <span className="tabular-nums font-extrabold text-white">
          {streak.count} Hari
        </span>
        <span className="hidden sm:inline text-[11px] text-amber-300/90 font-semibold">
          Streak 🔥
        </span>
        <span className="px-1.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/50 text-[10px] text-purple-200 font-extrabold tabular-nums">
          🏅 {unlockedCount}/{badges.length}
        </span>
      </button>

      {/* Live Visual Feedback Pill when Streak or Badge Updates */}
      {feedbackBanner && (
        <div
          role="status"
          className="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 z-40 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-[11px] font-display font-extrabold whitespace-nowrap shadow-[0_0_20px_rgba(245,158,11,0.65)] flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 shrink-0" />
          <span className="truncate">{feedbackBanner}</span>
        </div>
      )}

      {/* Streak & Achievement Badges Popover Card */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30 sm:hidden bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-96 max-h-[80vh] overflow-y-auto bg-[#12101D] rounded-3xl p-4 z-50 border border-orange-400/50 shadow-[0_24px_64px_rgba(0,0,0,0.96)] space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                </div>
                <div>
                  <h3 className="font-display text-xs font-extrabold text-white">
                    Daily Streak &amp; Badge Pencapaian
                  </h3>
                  <p className="text-[11px] text-amber-300">
                    Koleksi Lencana Belajar MIMI V12
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold shrink-0">
                {unlockedCount}/{badges.length} Lencana
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-zinc-400 block">Streak Aktif</span>
                <span className="font-display font-extrabold text-sm text-amber-300 tabular-nums">
                  🔥 {streak.count} Hari
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-400" /> Terbaik
                </span>
                <span className="font-display font-extrabold text-sm text-white tabular-nums">
                  {streak.bestStreak} Hari
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-300" /> Durasi
                </span>
                <span className="font-display font-extrabold text-sm text-purple-200 tabular-nums">
                  {achievementProgress.studyMinutes} mnt
                </span>
              </div>
            </div>

            {/* Achievement Badges Showcase */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-extrabold text-purple-200 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-pink-400" />
                  <span>Badge Pencapaian (LocalStorage)</span>
                </span>
                <span className="text-[11px] text-zinc-400 tabular-nums">
                  {achievementProgress.totalInteractions}x interaksi
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-2xl border transition-all ${
                      badge.unlocked
                        ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-amber-500/20 border-amber-400/60 shadow-[0_0_16px_rgba(245,158,11,0.2)]'
                        : 'bg-white/[0.03] border-white/10 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0" aria-hidden="true">
                          {badge.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display text-xs font-extrabold text-white truncate">
                              {badge.title}
                            </span>
                            {badge.unlocked ? (
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-400/25 border border-amber-300/60 text-amber-200 text-[9px] font-extrabold uppercase shrink-0">
                                Terbuka ✨
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-400 text-[9px] font-semibold shrink-0">
                                Terkunci
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-300 leading-snug mt-0.5">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-purple-200 whitespace-nowrap shrink-0">
                        {badge.progressText}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          badge.unlocked
                            ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500'
                            : 'bg-purple-500/60'
                        }`}
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={onSimulateNextDay}
                className="flex-1 py-2 px-3 rounded-full bg-orange-500/20 hover:bg-orange-500/35 border border-orange-400/50 text-amber-200 text-[11px] font-display font-bold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                ⚡ Klaim +1 Hari &amp; +5 Menit (Demo)
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('chat');
  const [jenjang, setJenjang] = useState<Jenjang>('SMP');
  const [kelas, setKelas] = useState<number>(8);
  const [mapel, setMapel] = useState<string>('Matematika');
  const [mode, setMode] = useState<MimiMode>('belajar');
  const [messages, setMessages] = useState<ChatMessage[]>(loadInitialMessages);

  const [streakData, setStreakData] = useState<DailyStreakState>(
    () => loadAndSyncInitialStreak().streak
  );
  const [achievementProgress, setAchievementProgress] =
    useState<AchievementProgressState>(() =>
      loadInitialAchievementProgress(loadAndSyncInitialStreak().streak.count)
    );
  const [streakPulse, setStreakPulse] = useState(false);
  const [streakFeedback, setStreakFeedback] = useState<string | null>(null);

  const badges = computeAchievementBadges(achievementProgress);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  // Automatically track active study duration every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAchievementProgress((prev) => {
        const next: AchievementProgressState = {
          ...prev,
          studyMinutes: prev.studyMinutes + 1,
        };
        try {
          localStorage.setItem(
            ACHIEVEMENT_BADGES_STORAGE_KEY,
            JSON.stringify(next)
          );
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const recordStreakInteraction = (
    customBanner?: string,
    eventMeta?: { intent?: ChatMessage['intent']; addedMinutes?: number }
  ) => {
    const today = getTodayIsoDate();
    let updatedStreakDays = streakData.count;

    setStreakData((prev) => {
      const { next, status } = computeUpdatedStreak(prev, today);
      updatedStreakDays = next.count;
      try {
        localStorage.setItem(DAILY_STREAK_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      const messageText =
        customBanner ||
        (status === 'incremented'
          ? `Streak Naik! 🔥 ${next.count} Hari Berturut-turut!`
          : `Streak Hari ke-${next.count} Aktif! 🔥`);
      setStreakFeedback(messageText);
      return next;
    });

    setAchievementProgress((prev) => {
      const prevUnlocked = computeAchievementBadges(prev)
        .filter((b) => b.unlocked)
        .map((b) => b.id);
      const next = updateAchievementProgress(prev, {
        intent: eventMeta?.intent,
        mapel,
        mode,
        streakDays: updatedStreakDays,
        addedMinutes: eventMeta?.addedMinutes ?? 3,
      });
      try {
        localStorage.setItem(
          ACHIEVEMENT_BADGES_STORAGE_KEY,
          JSON.stringify(next)
        );
      } catch {
        // Ignore storage errors
      }
      const newlyUnlocked = computeAchievementBadges(next).find(
        (b) => b.unlocked && !prevUnlocked.includes(b.id)
      );
      if (newlyUnlocked) {
        setStreakFeedback(
          `🏅 Badge Baru Terbuka: ${newlyUnlocked.icon} ${newlyUnlocked.title}!`
        );
      }
      return next;
    });

    setStreakPulse(true);
    setTimeout(() => setStreakPulse(false), 1200);
    setTimeout(() => setStreakFeedback(null), 3200);
  };

  const handleSimulateNextDayStreak = () => {
    let nextCount = streakData.count + 1;
    setStreakData((prev) => {
      nextCount = prev.count + 1;
      const updated: DailyStreakState = {
        count: nextCount,
        bestStreak: Math.max(prev.bestStreak, nextCount),
        lastActiveDate: getTodayIsoDate(),
        totalInteractions: prev.totalInteractions + 1,
      };
      try {
        localStorage.setItem(DAILY_STREAK_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });

    setAchievementProgress((prev) => {
      const prevUnlocked = computeAchievementBadges(prev)
        .filter((b) => b.unlocked)
        .map((b) => b.id);
      const updated = updateAchievementProgress(prev, {
        intent: mapel === 'Matematika' ? 'math' : 'other_subject',
        mapel,
        mode,
        streakDays: nextCount,
        addedMinutes: 5,
      });
      try {
        localStorage.setItem(
          ACHIEVEMENT_BADGES_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch {
        // Ignore storage errors
      }
      const newlyUnlocked = computeAchievementBadges(updated).find(
        (b) => b.unlocked && !prevUnlocked.includes(b.id)
      );
      if (newlyUnlocked) {
        setStreakFeedback(
          `🏅 Badge Baru Terbuka: ${newlyUnlocked.icon} ${newlyUnlocked.title}!`
        );
      } else {
        setStreakFeedback(
          `Gokil Bestie! 🔥 Streak ${nextCount} Hari & +5 Menit Belajar!`
        );
      }
      return updated;
    });

    setStreakPulse(true);
    setTimeout(() => setStreakPulse(false), 1200);
    setTimeout(() => setStreakFeedback(null), 3200);
  };

  const switchSection = (sec: ActiveSection) => {
    setActiveSection(sec);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const subjects = getSubjectsForGrade(jenjang, kelas);

  const filterOutMathStepsFromMessages = (msgs: ChatMessage[]): ChatMessage[] =>
    msgs.filter(
      (m) =>
        m.intent !== 'math' &&
        !m.mathOptions &&
        !/\blangkah\s*1\b[\s\S]*\blangkah\s*2\b/i.test(m.content)
    );

  const handleSelectJenjang = (newJenjang: Jenjang) => {
    const defaultKelas = JENJANG_GRADES[newJenjang][0];
    const newSubjects = getSubjectsForGrade(newJenjang, defaultKelas);
    const nextMapel = newSubjects[0].id;
    setJenjang(newJenjang);
    setKelas(defaultKelas);
    setMapel(nextMapel);
    if (nextMapel !== 'Matematika') {
      setMessages((prev) => filterOutMathStepsFromMessages(prev));
    }
  };

  const handleSelectKelas = (newKelas: number) => {
    const newSubjects = getSubjectsForGrade(jenjang, newKelas);
    setKelas(newKelas);
    if (!newSubjects.some((s) => s.id === mapel)) {
      const nextMapel = newSubjects[0].id;
      setMapel(nextMapel);
      if (nextMapel !== 'Matematika') {
        setMessages((prev) => filterOutMathStepsFromMessages(prev));
      }
    }
  };

  const handleSelectMapel = (newMapel: string) => {
    setMapel(newMapel);
    if (newMapel !== 'Matematika') {
      setMessages((prev) => filterOutMathStepsFromMessages(prev));
    }
  };

  const handleAddMessages = (newMsgs: ChatMessage[]) => {
    const assistantMsg = newMsgs.find((m) => m.role === 'assistant');
    if (newMsgs.some((m) => m.role === 'user')) {
      recordStreakInteraction(undefined, {
        intent: assistantMsg?.intent,
        addedMinutes: 3,
      });
    } else if (assistantMsg?.intent === 'math' || assistantMsg?.mode === 'profesor') {
      setAchievementProgress((prev) => {
        const next = {
          ...prev,
          mathInteractions:
            prev.mathInteractions + (assistantMsg.intent === 'math' ? 1 : 0),
          profesorInteractions:
            prev.profesorInteractions +
            (assistantMsg.intent === 'profesor' || assistantMsg.mode === 'profesor'
              ? 1
              : 0),
        };
        try {
          localStorage.setItem(
            ACHIEVEMENT_BADGES_STORAGE_KEY,
            JSON.stringify(next)
          );
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    }
    setMessages((prev) => {
      const hasNonMathAssistantReply = newMsgs.some(
        (m) => m.role === 'assistant' && m.intent && m.intent !== 'math'
      );
      const baseHistory = hasNonMathAssistantReply
        ? filterOutMathStepsFromMessages(prev)
        : prev;
      return [...baseHistory, ...newMsgs];
    });
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    try {
      localStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleAskMimiFromOtherTab = async (
    promptText: string,
    targetMode: MimiMode = 'belajar'
  ) => {
    setMode(targetMode);
    setActiveSection('chat');
    recordStreakInteraction();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      mode: targetMode,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/mimi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          history: messages,
          jenjang,
          kelas,
          mapel,
          mode: targetMode,
          engineMode: 'gemini-3.6-fast',
        }),
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `mimi-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        intent: data.intent,
        mode: targetMode,
        sourceCitation: data.sourceCitation,
        mathOptions: data.mathOptions,
      };
      setMessages((prev) => {
        const base =
          data.intent !== 'math' ? filterOutMathStepsFromMessages(prev) : prev;
        return [...base, assistantMsg];
      });
    } catch {
      const fallback = generateSmartMimiReply({
        userMessage: promptText,
        jenjang,
        kelas,
        mapel,
        mode: targetMode,
      });

      const assistantMsg: ChatMessage = {
        id: `mimi-${Date.now() + 1}`,
        role: 'assistant',
        content: fallback.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        intent: fallback.intent,
        mode: targetMode,
        sourceCitation: fallback.sourceCitation,
        mathOptions: fallback.mathOptions,
      };

      setMessages((prev) => {
        const base =
          fallback.intent !== 'math' ? filterOutMathStepsFromMessages(prev) : prev;
        return [...base, assistantMsg];
      });
    }
  };

  const navTabs = [
    { id: 'chat' as const, label: 'Room Chat Mimi', shortLabel: 'Chat Mimi', Icon: MessageSquare },
    { id: 'quiz' as const, label: 'Latihan Soal', shortLabel: 'Latihan', Icon: CheckCircle2 },
    { id: 'video' as const, label: 'Video & Materi', shortLabel: 'Video 9:16', Icon: Play },
    { id: 'prompt' as const, label: 'Prompt Mimi V12', shortLabel: 'Prompt V12', Icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white relative overflow-x-hidden pb-20 md:pb-0 selection:bg-[#8B5CF6] selection:text-white">
      {/* Subtle Grain Texture Overlay */}
      <div className="skena-grain" aria-hidden="true" />

      {/* Ambient Neon Glow & Slow Floating Elements (✨📚🚀💜) */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute -top-28 -left-24 w-96 h-96 rounded-full bg-[#8B5CF6]/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-[#EC4899]/12 blur-[130px]" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[#8B5CF6]/10 blur-[140px]" />

        <span className="hidden md:inline-block absolute top-28 left-8 text-xl opacity-35 animate-slow-float select-none">
          ✨
        </span>
        <span className="hidden md:inline-block absolute top-44 right-10 text-xl opacity-35 animate-slow-float-delayed select-none">
          📚
        </span>
        <span className="hidden lg:inline-block absolute bottom-24 left-12 text-lg opacity-30 animate-slow-float-delayed select-none">
          💜
        </span>
        <span className="hidden lg:inline-block absolute bottom-32 right-14 text-lg opacity-30 animate-slow-float select-none">
          🚀
        </span>
      </div>

      {/* Sticky Gen Z Skena Header & Pill Navigation */}
      <header className="sticky top-0 z-30 bg-[#121212]/90 backdrop-blur-xl border-b border-purple-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3.5">
          {/* Zone 1: Cool Skena Studio Logo + Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              switchSection('chat');
            }}
            className="flex items-center gap-2 sm:gap-3 group min-w-0 shrink transition-transform duration-200 hover:scale-105"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#EF4444] via-[#8B5CF6] to-[#EC4899] p-[1.5px] shadow-[0_0_20px_rgba(139,92,246,0.55)] shrink-0">
              <div className="w-full h-full bg-[#141122] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display text-sm sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent whitespace-nowrap">
                  <span className="sm:hidden">MIMI V12</span>
                  <span className="hidden sm:inline">MIMI Room Belajar</span>
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-red-500/20 text-red-300 border border-red-400/40 whitespace-nowrap shrink-0">
                  <span className="sm:hidden">Skena</span>
                  <span className="hidden sm:inline">V12 Skena</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Skena Math &amp; Kurikulum Merdeka AI Studio · SD–SMA
              </p>
            </div>
          </a>

          {/* Zone 2: Pill-Shaped Tabs (Desktop & Tablet md:flex; on Smartphone moved to thumb-friendly bottom dock) */}
          <nav
            aria-label="Navigasi Utama Room Belajar"
            className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white/[0.04] border border-white/10 overflow-x-auto no-scrollbar max-w-full"
          >
            {navTabs.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchSection(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] scale-[1.03]'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Daily Learning Streak Counter + Super Action Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <DailyLearningStreak
              streak={streakData}
              achievementProgress={achievementProgress}
              badges={badges}
              streakPulse={streakPulse}
              feedbackBanner={streakFeedback}
              onSimulateNextDay={handleSimulateNextDayStreak}
            />

            <button
              type="button"
              onClick={() => {
                setMode('profesor');
                switchSection('chat');
              }}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-display font-extrabold text-amber-950 rounded-full shimmer-cta transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-950 shrink-0" />
              <span className="hidden sm:inline">Aktifkan Mimi Profesor</span>
              <span className="sm:hidden">Profesor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Instagram-Story Style Curriculum Filter Bar */}
      <CurriculumBar
        jenjang={jenjang}
        kelas={kelas}
        mapel={mapel}
        subjects={subjects}
        onSelectJenjang={handleSelectJenjang}
        onSelectKelas={handleSelectKelas}
        onSelectMapel={handleSelectMapel}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {activeSection === 'chat' && (
          <MimiChatRoom
            jenjang={jenjang}
            kelas={kelas}
            mapel={mapel}
            mode={mode}
            subjects={subjects}
            messages={messages}
            onChangeMode={setMode}
            onAddMessages={handleAddMessages}
            onResetChat={handleResetChat}
          />
        )}

        {activeSection === 'quiz' && (
          <PracticeQuizRoom
            activeJenjang={jenjang}
            onAskMimiInChat={(promptText) =>
              handleAskMimiFromOtherTab(promptText, 'belajar')
            }
          />
        )}

        {activeSection === 'video' && (
          <VideoLessonRoom
            onAskMimiInChat={(promptText, targetMode) =>
              handleAskMimiFromOtherTab(promptText, targetMode || 'belajar')
            }
          />
        )}

        {activeSection === 'prompt' && (
          <PromptBlueprintView
            jenjang={jenjang}
            kelas={kelas}
            mapel={mapel}
            mode={mode}
          />
        )}
      </main>

      {/* Dark Glass Footer */}
      <footer className="relative z-10 bg-[#121212]/90 border-t border-purple-500/20 px-4 sm:px-6 py-4 mt-6 sm:mt-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-purple-300">
              MIMI V12 — Asisten Belajar Masa Depan Indonesia ✨
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="text-[11px] sm:text-xs">
              Asisten BelajarMu - GuruMu, AsistenMu, Teman CurhatMu 💜
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-[11px] sm:text-xs text-zinc-400">
            <span className="text-pink-400 font-semibold">Sumber Buku Resmi:</span>
            <a
              href="https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-pink-300 underline decoration-purple-500/50 font-semibold transition-colors"
            >
              buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka
            </a>
            <span aria-hidden="true">·</span>
            <span>kemdikbud.go.id</span>
          </div>
        </div>
      </footer>

      {/* Smartphone Thumb-Friendly Bottom Navigation Dock (< 768px) */}
      <nav
        aria-label="Navigasi Smartphone MIMI V12"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#121212]/95 backdrop-blur-2xl border-t border-purple-500/30 px-2 pt-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.65)]"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {navTabs.map(({ id, shortLabel, Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchSection(id)}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-2xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8B5CF6]/30 to-[#EC4899]/30 border border-purple-400/50 text-white shadow-[0_0_16px_rgba(139,92,246,0.4)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-pink-300' : 'text-zinc-400'
                  }`}
                />
                <span className="font-display text-[10px] font-bold tracking-tight whitespace-nowrap">
                  {shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

