import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  BookOpen,
  HeartHandshake,
  Lightbulb,
  RotateCcw,
  Zap,
  Brain,
  Mic,
  Square,
  Loader2,
} from 'lucide-react';
import {
  ChatMessage,
  Jenjang,
  MimiMode,
  MessageIntent,
  SubjectInfo,
  classifyUserMessage,
  generateSmartMimiReply,
  sanitizeChatHistoryForQuery,
} from '../lib/mimiEngine';

interface HumanContextBufferState {
  nickname: string;
  preferredVibe: string;
  recentSubjects: string[];
  rememberedNotes: string[];
}

const HUMAN_CONTEXT_KEY = 'mimi_v12_human_context_buffer';

const DEFAULT_HUMAN_BUFFER: HumanContextBufferState = {
  nickname: 'Bestie',
  preferredVibe: 'MLBB & Skena',
  recentSubjects: ['SMP Kelas 8 · Matematika'],
  rememberedNotes: ['Suka ngobrol santai & analogi kehidupan sehari-hari'],
};

export type MimiExpression = 'waving' | 'smirk' | 'pointing' | 'shocked' | 'neutral';

export function getExpressionForIntent(intent?: MessageIntent, mode?: MimiMode): {
  expression: MimiExpression;
  label: string;
} {
  if (intent === 'greeting') {
    return { expression: 'waving', label: 'Waving Casual' };
  }
  if (intent === 'answer_key_request') {
    return { expression: 'shocked', label: 'Shocked (No Kunci!)' };
  }
  if (intent === 'profesor' || mode === 'profesor') {
    return { expression: 'smirk', label: 'Confident Smirk' };
  }
  if (intent === 'math' || intent === 'other_subject') {
    return { expression: 'pointing', label: 'Pointing Assertive' };
  }
  return { expression: 'neutral', label: 'Cool Neutral' };
}

/**
 * Official MIMI V12 Skena Character Avatar (15yo Indonesian Gen Z, Black & Red Streaked Wolfcut,
 * Red Hairpins, Freckles, Black Choker with Red Studs, Black-Red Neck Headphones, Black Oversized MIMI Tee)
 */
export function SkenaMimiAvatar({
  size = 'md',
  expression = 'smirk',
}: {
  size?: 'sm' | 'md' | 'lg';
  expression?: MimiExpression;
}) {
  const dim =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';

  return (
    <div
      className={`${dim} rounded-2xl bg-gradient-to-br from-[#EF4444] via-[#991B1B] to-[#8B5CF6] p-[1.5px] shadow-[0_0_20px_rgba(239,68,68,0.45)] shrink-0`}
    >
      <div className="w-full h-full rounded-[14px] bg-[#0F0D15] flex items-center justify-center overflow-hidden relative">
        <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
          {/* Background Skena Cyber Grid Glow */}
          <rect width="80" height="80" fill="#120E1A" />
          <line x1="0" y1="68" x2="80" y2="18" stroke="#EF4444" strokeWidth="1.5" opacity="0.35" />
          <line x1="8" y1="78" x2="80" y2="34" stroke="#DC2626" strokeWidth="1" opacity="0.25" />

          {/* Back Wolfcut Hair (Black base + Crimson Red right streaks) */}
          <path
            d="M14 34 C10 48, 12 64, 18 72 L62 72 C68 64, 70 48, 66 34 Z"
            fill="#141418"
          />
          <path
            d="M42 28 C54 34, 66 48, 63 70 L50 70 C54 54, 50 40, 42 28 Z"
            fill="#DC2626"
          />

          {/* Black Oversized Tee with Red "MIMI" Logo */}
          <path
            d="M16 78 C17 63, 27 58, 40 58 C53 58, 63 63, 64 78 Z"
            fill="#18181B"
            stroke="#27272A"
            strokeWidth="1"
          />
          <text
            x="40"
            y="74"
            textAnchor="middle"
            fill="#EF4444"
            fontSize="9"
            fontWeight="900"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="0.8"
          >
            MIMI
          </text>

          {/* Neck & Black Choker with Red Studs */}
          <rect x="35" y="49" width="10" height="10" rx="3" fill="#D99B78" />
          <rect x="34" y="53" width="12" height="3.2" rx="1" fill="#09090B" />
          <circle cx="37" cy="54.6" r="0.9" fill="#EF4444" />
          <circle cx="40" cy="54.6" r="0.9" fill="#EF4444" />
          <circle cx="43" cy="54.6" r="0.9" fill="#EF4444" />

          {/* Black & Red Neck Headphones */}
          <ellipse cx="29" cy="59" rx="5.5" ry="4.5" fill="#18181B" stroke="#EF4444" strokeWidth="1.6" />
          <ellipse cx="51" cy="59" rx="5.5" ry="4.5" fill="#18181B" stroke="#EF4444" strokeWidth="1.6" />

          {/* Ears & Silver Hoop Earrings */}
          <circle cx="22" cy="39" r="3.2" fill="#D99B78" />
          <circle cx="58" cy="39" r="3.2" fill="#D99B78" />
          <circle cx="21" cy="42.5" r="1.6" fill="none" stroke="#E4E4E7" strokeWidth="1.1" />
          <circle cx="59" cy="42.5" r="1.6" fill="none" stroke="#EF4444" strokeWidth="1.1" />

          {/* Face (Warm Tan Skin) */}
          <path
            d="M23 30 C23 20, 57 20, 57 30 C57 43, 49 51, 40 51 C31 51, 23 43, 23 30 Z"
            fill="#E5A985"
          />

          {/* Cute Nose & Cheek Freckles */}
          <circle cx="29" cy="40" r="0.7" fill="#B46947" />
          <circle cx="31.5" cy="41" r="0.7" fill="#B46947" />
          <circle cx="34" cy="40.2" r="0.6" fill="#B46947" />
          <circle cx="46" cy="40.2" r="0.6" fill="#B46947" />
          <circle cx="48.5" cy="41" r="0.7" fill="#B46947" />
          <circle cx="51" cy="40" r="0.7" fill="#B46947" />

          {/* Eyes & Eyebrows */}
          {expression === 'shocked' ? (
            <>
              <circle cx="32.5" cy="35.5" r="3.6" fill="#FFFFFF" />
              <circle cx="47.5" cy="35.5" r="3.6" fill="#FFFFFF" />
              <circle cx="32.5" cy="35.5" r="2.1" fill="#18181B" />
              <circle cx="47.5" cy="35.5" r="2.1" fill="#18181B" />
              <circle cx="31.8" cy="34.6" r="0.8" fill="#FFFFFF" />
              <circle cx="46.8" cy="34.6" r="0.8" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <ellipse cx="32.5" cy="35.5" rx="3.2" ry="2.8" fill="#18181B" />
              <ellipse cx="47.5" cy="35.5" rx="3.2" ry="2.8" fill="#18181B" />
              <circle cx="31.5" cy="34.5" r="1" fill="#FFFFFF" />
              <circle cx="46.5" cy="34.5" r="1" fill="#FFFFFF" />
            </>
          )}

          {/* Expressive Mouth */}
          {expression === 'shocked' ? (
            <ellipse cx="40" cy="45" rx="2.4" ry="3.1" fill="#7F1D1D" />
          ) : expression === 'smirk' ? (
            <path
              d="M35 44.5 Q40 46.8 46 43.2"
              fill="none"
              stroke="#451A03"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M35.5 44 Q40 47.2 44.5 44"
              fill="none"
              stroke="#451A03"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Front Wolfcut Bangs: Left Black + Right Crimson Red Highlights */}
          <path
            d="M19 32 C19 15, 42 12, 43 22 C37 22, 33 27, 30 33 C27 28, 24 29, 19 32 Z"
            fill="#141418"
          />
          <path
            d="M39 14 C52 14, 62 21, 61 35 C57 29, 53 26, 49 32 C47 25, 43 22, 39 14 Z"
            fill="#EF4444"
          />
          {/* Red Streak Center Bangs */}
          <path d="M36 16 C39 22, 41 27, 39 33 C37 27, 35 23, 36 16 Z" fill="#EF4444" />

          {/* Two Signature Red Hairpins on Left Side */}
          <rect
            x="23"
            y="24"
            width="5.5"
            height="1.7"
            rx="0.8"
            transform="rotate(-18 23 24)"
            fill="#EF4444"
          />
          <rect
            x="24"
            y="27"
            width="5.5"
            height="1.7"
            rx="0.8"
            transform="rotate(-18 24 27)"
            fill="#FCA5A5"
          />
        </svg>
      </div>
    </div>
  );
}

interface MimiChatRoomProps {
  jenjang: Jenjang;
  kelas: number;
  mapel: string;
  mode: MimiMode;
  subjects: SubjectInfo[];
  messages: ChatMessage[];
  onChangeMode: (m: MimiMode) => void;
  onAddMessages: (newMsgs: ChatMessage[]) => void;
  onResetChat: () => void;
}

export const MimiChatRoom: React.FC<MimiChatRoomProps> = ({
  jenjang,
  kelas,
  mapel,
  mode,
  subjects,
  messages,
  onChangeMode,
  onAddMessages,
  onResetChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [engineMode, setEngineMode] = useState<
    'gemini-3.6-fast' | 'gemini-3.8-search' | 'gemini-4-argon'
  >('gemini-3.6-fast');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [humanBuffer, setHumanBuffer] = useState<HumanContextBufferState>(() => {
    try {
      const saved = localStorage.getItem(HUMAN_CONTEXT_KEY);
      if (saved) {
        return { ...DEFAULT_HUMAN_BUFFER, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage error
    }
    return DEFAULT_HUMAN_BUFFER;
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentSubject = subjects.find((s) => s.id === mapel) || subjects[0];

  // Persist Human Context Buffer across subject switches
  useEffect(() => {
    const subjectTag = `${jenjang} Kelas ${kelas} · ${currentSubject.name}`;
    setHumanBuffer((prev) => {
      const updatedRecent = [
        subjectTag,
        ...prev.recentSubjects.filter((s) => s !== subjectTag),
      ].slice(0, 4);
      const next = { ...prev, recentSubjects: updatedRecent };
      try {
        localStorage.setItem(HUMAN_CONTEXT_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  }, [jenjang, kelas, currentSubject.name]);

  const updateHumanBuffer = (patch: Partial<HumanContextBufferState>) => {
    setHumanBuffer((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(HUMAN_CONTEXT_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  useEffect(() => {
    if (messages.length > 1 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages.length, isSending]);

  const cycleEngineMode = () => {
    setEngineMode((prev) =>
      prev === 'gemini-3.6-fast'
        ? 'gemini-3.8-search'
        : prev === 'gemini-3.8-search'
        ? 'gemini-4-argon'
        : 'gemini-3.6-fast'
    );
  };

  const handleToggleVoiceRecording = async () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        if (audioBlob.size === 0) return;

        setIsTranscribing(true);
        try {
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const resStr = String(reader.result || '');
              const base64 = resStr.includes(',') ? resStr.split(',')[1] : resStr;
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
          });

          const resp = await fetch('/api/mimi/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType: audioBlob.type || 'audio/webm',
            }),
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.transcript) {
              setInputText((prev) =>
                prev ? `${prev} ${data.transcript}` : data.transcript
              );
            }
          }
        } catch {
          // Ignore transcription error
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const sendMessage = async (textToSend: string, overrideMode?: MimiMode) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    const effectiveMode = overrideMode || mode;
    if (overrideMode && overrideMode !== mode) {
      onChangeMode(overrideMode);
    }

    // Extract personal preferences into Human Context Buffer
    const nameMatch = trimmed.match(/(?:namaku|panggil\s+aku|aku\s+namanya)\s+([a-zA-Z]{2,16})/i);
    if (nameMatch?.[1]) {
      updateHumanBuffer({
        nickname: nameMatch[1],
        rememberedNotes: [
          `Nama panggilan: ${nameMatch[1]}`,
          ...humanBuffer.rememberedNotes.slice(0, 3),
        ],
      });
    } else if (/suka\s+([^\n.,!?]{3,35})/i.test(trimmed)) {
      const prefMatch = trimmed.match(/suka\s+([^\n.,!?]{3,35})/i);
      if (prefMatch?.[1]) {
        updateHumanBuffer({
          rememberedNotes: [
            `Suka ${prefMatch[1].trim()}`,
            ...humanBuffer.rememberedNotes.filter((n) => !n.includes(prefMatch[1].trim())).slice(0, 3),
          ],
        });
      }
    }

    const detectedIntent = classifyUserMessage(trimmed, mapel, effectiveMode);
    const isMathQuery = detectedIntent === 'math';
    const historyForRequest = sanitizeChatHistoryForQuery(messages, isMathQuery);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      mode: effectiveMode,
    };

    setInputText('');
    setIsSending(true);
    onAddMessages([userMsg]);

    // Client-side 3.8s hard timeout so Mimi NEVER delays more than 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3800);

    try {
      const response = await fetch('/api/mimi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmed,
          history: historyForRequest,
          jenjang,
          kelas,
          mapel,
          mode: effectiveMode,
          engineMode,
          userContext: {
            nickname: humanBuffer.nickname,
            preferredVibe: humanBuffer.preferredVibe,
            rememberedNotes: humanBuffer.rememberedNotes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server Mimi');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `mimi-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        intent: data.intent,
        mode: effectiveMode,
        sourceCitation: data.sourceCitation,
        mathOptions: data.mathOptions,
      };
      onAddMessages([assistantMsg]);
    } catch {
      const fallback = generateSmartMimiReply({
        userMessage: trimmed,
        jenjang,
        kelas,
        mapel,
        mode: effectiveMode,
      });
      const assistantMsg: ChatMessage = {
        id: `mimi-${Date.now()}`,
        role: 'assistant',
        content: fallback.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        intent: fallback.intent,
        mode: effectiveMode,
        sourceCitation: fallback.sourceCitation,
        mathOptions: fallback.mathOptions,
      };
      onAddMessages([assistantMsg]);
    } finally {
      clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const quickPrompts = [
    {
      label: '👋 Sapaan Santai ("pgi mim gmn kbr")',
      prompt: 'pgi mim gmn kbr mu hr ini',
      targetMode: 'belajar' as MimiMode,
    },
    {
      label: '📱 Typo & Singkat ("gmn crny mtk aljbr")',
      prompt: 'mim gmn crny ngerjain mtk aljbr 3x+5=20 benerin y',
      targetMode: 'belajar' as MimiMode,
    },
    {
      label: '🎮 Ngobrol MLBB & Skena',
      prompt: 'Eh Mim, abis push rank MLBB nih, kamu main role apa?',
      targetMode: 'curhat' as MimiMode,
    },
    {
      label: '📐 Tanya Soal MTK (3 Langkah)',
      prompt: `Mim, gimana cara mulai ngerjain soal Matematika Kelas ${kelas} tentang persamaan & pythagoras ini?`,
      targetMode: 'belajar' as MimiMode,
    },
    {
      label: `🔬 Clue & Analogi ${currentSubject.name === 'Matematika' ? 'IPA / Sains' : currentSubject.name}`,
      prompt:
        currentSubject.name === 'Matematika'
          ? `mim jelasin proses fotosintesis sm kloropil pake analogi seru dong!`
          : `Mim, kasih clue, kisi-kisi buku, dan analogi seru buat materi ${currentSubject.name} (${currentSubject.sampleChapter}) dong!`,
      targetMode: 'belajar' as MimiMode,
    },
    {
      label: '⚡ Hack Mimi Profesor',
      prompt: `Profesor Mimi, bagi jembatan keledai dan trik hafal cepat buat ${currentSubject.name} Kelas ${kelas} dong!`,
      targetMode: 'profesor' as MimiMode,
    },
    {
      label: '💜 Curhat ("aq bosen bgt hr ini")',
      prompt: 'mim aq bosen bgt hr ini pgn curhat...',
      targetMode: 'curhat' as MimiMode,
    },
  ];

  const [mobilePanel, setMobilePanel] = useState<'none' | 'hack' | 'memory'>('none');

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const currentAvatarState = getExpressionForIntent(lastAssistantMsg?.intent, mode);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start relative z-10">
      {/* Left 8 Columns: Active MIMI V12 Conversation Studio */}
      <div className="lg:col-span-8 skena-glass flex flex-col overflow-hidden">
        {/* Workspace Toolbar: Skena Mimi Header + 3-in-1 Role Pills */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-b border-purple-500/20 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 bg-[#19162B]/90">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <SkenaMimiAvatar size="md" expression={currentAvatarState.expression} />
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide truncate">
                    MIMI V12 · Room Belajar
                  </h2>
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-red-200 bg-red-500/20 border border-red-400/35 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    15 yo · Skena
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 tracking-wide truncate">
                  <span className="text-purple-200 font-semibold">{jenjang} Kelas {kelas}</span>
                  <span aria-hidden="true"> · </span>
                  <span className="text-pink-300 font-semibold">{currentSubject.name}</span>
                  <span aria-hidden="true" className="hidden sm:inline"> · </span>
                  <span className="hidden sm:inline">Pose: {currentAvatarState.label}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetChat}
              title="Reset percakapan"
              aria-label="Reset percakapan"
              className="sm:hidden p-2 text-slate-300 hover:text-white rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 active:scale-95 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {/* Mode Switcher Pill Buttons (Full 3-column grid on Smartphone, Pill flex on Desktop) */}
            <div
              role="group"
              aria-label="Pilih Peran Mimi"
              className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 p-1 bg-black/45 border border-white/10 rounded-full w-full sm:w-auto"
            >
              <button
                type="button"
                onClick={() => onChangeMode('belajar')}
                className={`px-2 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide rounded-full transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  mode === 'belajar'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.55)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden">Guru</span>
                <span className="hidden sm:inline">Guru &amp; Asisten</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeMode('profesor')}
                className={`px-2 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide rounded-full transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  mode === 'profesor'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.55)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden">Profesor</span>
                <span className="hidden sm:inline">Mimi Profesor</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeMode('curhat')}
                className={`px-2 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide rounded-full transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  mode === 'curhat'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.55)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden">Curhat</span>
                <span className="hidden sm:inline">Teman Curhat</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onResetChat}
              title="Reset percakapan"
              aria-label="Reset percakapan"
              className="hidden sm:inline-flex p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 hover:scale-105 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Quick Access Strip for Hack Profesor & Human Context Buffer (< 1024px) */}
          <div className="grid grid-cols-2 lg:hidden gap-2 pt-1.5 border-t border-white/10">
            <button
              type="button"
              onClick={() =>
                setMobilePanel((prev) => (prev === 'hack' ? 'none' : 'hack'))
              }
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-display font-bold flex items-center justify-center gap-1.5 min-w-0 transition-all active:scale-95 ${
                mobilePanel === 'hack'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                  : 'bg-amber-500/20 border border-amber-400/50 text-amber-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">⚡ Hack {currentSubject.name}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setMobilePanel((prev) => (prev === 'memory' ? 'none' : 'memory'))
              }
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-display font-bold flex items-center justify-center gap-1.5 min-w-0 transition-all active:scale-95 ${
                mobilePanel === 'memory'
                  ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]'
                  : 'bg-purple-500/20 border border-purple-400/40 text-purple-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">🧠 Memori: {humanBuffer.nickname}</span>
            </button>
          </div>

          {/* Inline Collapsible Mobile Panel for Hack Profesor or Human Context Buffer */}
          {mobilePanel === 'hack' && (
            <div className="lg:hidden profesor-highlight-card p-4 text-slate-950 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>{currentSubject.profesorHackTitle}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setMobilePanel('none')}
                  className="text-[11px] font-bold text-amber-950 underline"
                >
                  Tutup
                </button>
              </div>
              <div className="p-3 bg-slate-950 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono leading-relaxed">
                {currentSubject.profesorHackMnemonic}
              </div>
              <p className="text-xs text-slate-900 font-medium leading-relaxed">
                {currentSubject.profesorHackExplanation}
              </p>
              <button
                type="button"
                onClick={() => {
                  setMobilePanel('none');
                  sendMessage(
                    `Profesor Mimi, jelasin lebih lanjut cara pakai jembatan keledai "${currentSubject.profesorHackTitle}" di soal ${currentSubject.name} Kelas ${kelas} dong!`,
                    'profesor'
                  );
                }}
                className="w-full py-2.5 px-3 text-xs font-extrabold tracking-wide text-slate-950 shimmer-cta rounded-full active:scale-95"
              >
                ⚡ Tanya Hack Ini ke Mimi Profesor
              </button>
            </div>
          )}

          {mobilePanel === 'memory' && (
            <div className="lg:hidden p-3.5 rounded-2xl bg-[#13111C] border border-purple-500/35 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-purple-200">
                  Pilih Vibe Analogi Favorit ({humanBuffer.nickname}):
                </span>
                <button
                  type="button"
                  onClick={() => setMobilePanel('none')}
                  className="text-[11px] font-bold text-pink-300 underline"
                >
                  Tutup
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['MLBB & Skena', 'Gaming & Esports', 'Kuliner & Masak', 'Visual & Cerita'].map(
                  (vibe) => {
                    const isSelected = humanBuffer.preferredVibe === vibe;
                    return (
                      <button
                        key={vibe}
                        type="button"
                        onClick={() => updateHumanBuffer({ preferredVibe: vibe })}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          isSelected
                            ? 'skena-neon-chip-active text-white'
                            : 'bg-white/5 border border-white/10 text-slate-300'
                        }`}
                      >
                        {vibe}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat Messages Stream with Subtle Dot Grid & Dark Purple Mesh */}
        <div
          ref={chatContainerRef}
          role="log"
          aria-label="Riwayat obrolan dengan Mimi"
          className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto min-h-[210px] max-h-[36vh] sm:min-h-[430px] sm:max-h-[540px] skena-chat-mesh"
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const msgExpr = getExpressionForIntent(msg.intent, msg.mode);
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 sm:gap-3.5 ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {!isUser && (
                  <SkenaMimiAvatar size="sm" expression={msgExpr.expression} />
                )}

                <div
                  className={`flex flex-col max-w-[89%] sm:max-w-[84%] ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 px-1 text-[11px] sm:text-xs text-slate-400 tracking-wide">
                    <span className="font-bold text-slate-200">
                      {isUser ? `Kamu (${humanBuffer.nickname})` : 'MIMI V12'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{msg.timestamp}</span>
                    {!isUser && msg.intent && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-purple-300 font-semibold">
                          {msg.intent === 'math'
                            ? 'Mode Ngajar MTK (3 Langkah)'
                            : msg.intent === 'other_subject'
                            ? 'Clue + Kisi-Kisi + Analogi'
                            : msg.intent === 'profesor'
                            ? 'Hack Trik Hafal Profesor'
                            : msg.intent === 'curhat'
                            ? 'Teman Curhat & Mabar'
                            : msg.intent === 'answer_key_request'
                            ? 'Aturan No Kunci Jawaban'
                            : 'Sapaan Santai (Waving Casual)'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Aesthetic Telegram/WhatsApp Bubble with Clean Spacing & Letter-Spacing */}
                  <div
                    className={`rounded-[20px] px-4 py-3 sm:px-5 sm:py-4 text-[13.5px] sm:text-[14px] leading-[1.68] tracking-[0.015em] whitespace-pre-wrap break-words shadow-lg ${
                      isUser
                        ? 'rounded-tr-xs bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_8px_25px_-5px_rgba(139,92,246,0.5)]'
                        : 'rounded-tl-xs bg-[#1E1B2E]/95 border border-purple-500/30 text-slate-100 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    {msg.content}

                    {/* Interactive 3 Options (A, B, C) for Mathematics Golden Rule 3 */}
                    {!isUser && msg.mathOptions && (
                      <div className="mt-3.5 pt-3 border-t border-purple-500/25">
                        <p className="text-xs font-bold text-purple-200 mb-2 tracking-wide">
                          Pilih langkah awalmu bestie (klik salah satu opsi di bawah):
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            msg.mathOptions.optionA,
                            msg.mathOptions.optionB,
                            msg.mathOptions.optionC,
                          ].map((optText) => (
                            <button
                              key={optText}
                              type="button"
                              onClick={() =>
                                sendMessage(
                                  `Aku pilih mulai dari ${optText}. Tolong bimbing aku di langkah ini ya Mim!`
                                )
                              }
                              className="text-left px-3.5 py-2.5 text-xs font-semibold tracking-wide bg-white/[0.06] hover:bg-purple-500/25 text-slate-100 hover:text-white border border-purple-400/30 hover:border-purple-400 rounded-xl transition-all duration-200 active:scale-[0.99]"
                            >
                              {optText}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Official Kemendikdasmen Katalog Buku Kurikulum Merdeka Citation Footer (ONLY on Lesson/Subject replies) */}
                    {!isUser && msg.sourceCitation && msg.intent !== 'greeting' && msg.intent !== 'curhat' && (
                      <div className="mt-3.5 pt-3 border-t border-white/10 text-xs text-purple-300/90 flex flex-wrap items-center justify-between gap-2 tracking-wide">
                        <span>{msg.sourceCitation}</span>
                        <a
                          href="https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-pink-200 hover:text-white hover:border-pink-400 transition-all duration-200 hover:scale-105 font-semibold shrink-0"
                        >
                          <span>Buka Katalog Buku Kemendikdasmen ↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Animated "Mimi V12 is typing..." Bubble with 3 Bouncing Dots */}
          {isSending && (
            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <SkenaMimiAvatar size="sm" expression="waving" />
              <div className="flex flex-col items-start">
                <div className="text-xs text-purple-300 font-semibold mb-1 px-1 tracking-wide">
                  Mimi V12 is typing...
                </div>
                <div className="bg-[#1E1B2E] border border-purple-500/40 rounded-[20px] rounded-tl-xs px-4 py-3 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-bounce [animation-delay:300ms]" />
                  <span className="text-xs text-slate-300 ml-1 tracking-wide">
                    Mimi lagi ngetik balasan...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Scenario Triggers */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 bg-[#171524] border-t border-purple-500/20">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] sm:text-xs font-bold text-purple-200 tracking-wide">
              Coba Skenario Adaptive Intent MIMI V12:
            </span>
            <button
              type="button"
              onClick={cycleEngineMode}
              title="Klik untuk ganti Engine AI (Default: Gemini 3.6 Flash Kilat < 3 Detik & Paham Semua)"
              className={`text-[11px] sm:text-xs font-semibold tracking-wide flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 ${
                engineMode === 'gemini-3.6-fast'
                  ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                  : engineMode === 'gemini-3.8-search'
                  ? 'bg-purple-500/25 border-purple-400/60 text-purple-200 shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                  : 'bg-pink-500/25 border-pink-400/60 text-pink-200 shadow-[0_0_12px_rgba(236,72,153,0.35)]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {engineMode === 'gemini-3.6-fast'
                  ? 'Engine: Gemini 3.6 Flash (Kilat < 3 Detik & Paham Semua)'
                  : engineMode === 'gemini-3.8-search'
                  ? 'Engine: Gemini 3.8 + Google Search'
                  : 'Engine: Gemini 4 Argon (Deep Reasoning)'}
              </span>
              <span className="sm:hidden">
                {engineMode === 'gemini-3.6-fast'
                  ? 'Gemini 3.6 Kilat'
                  : engineMode === 'gemini-3.8-search'
                  ? 'Gemini 3.8 Search'
                  : 'Gemini 4 Argon'}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {quickPrompts.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => sendMessage(item.prompt, item.targetMode)}
                className="px-3.5 sm:px-4 py-2 text-xs font-semibold tracking-wide bg-white/[0.05] hover:bg-purple-500/25 text-slate-200 hover:text-white border border-white/10 hover:border-purple-400/60 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form (16px text-base on mobile prevents iOS Safari auto-zoom) */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3 sm:p-4 sm:px-6 bg-[#13111C] border-t border-purple-500/20 flex items-center gap-2 sm:gap-2.5"
        >
          <label htmlFor="mimi-chat-input" className="sr-only">
            Sapa Mimi, ngobrol MLBB/curhat, atau tanya soal pelajaran
          </label>
          <button
            type="button"
            onClick={handleToggleVoiceRecording}
            disabled={isSending || isTranscribing}
            title={
              isRecording
                ? 'Berhenti Rekam Suara'
                : 'Bicara ke Mimi (Voice Transcribe)'
            }
            className={`p-3 min-h-[46px] min-w-[46px] rounded-full border flex items-center justify-center transition-all shrink-0 ${
              isRecording
                ? 'bg-red-500/30 border-red-400 text-red-200 animate-pulse shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                : isTranscribing
                ? 'bg-purple-500/20 border-purple-400/50 text-purple-300'
                : 'bg-white/[0.06] hover:bg-purple-500/20 border-purple-500/30 text-purple-300 hover:text-white'
            }`}
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
          <input
            id="mimi-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? '🎙️ Lagi rekam suara... Klik kotak merah buat selesai'
                : isTranscribing
                ? '⏳ Mimi lagi dengerin suaramu...'
                : mode === 'curhat'
                ? 'Curhat mood atau ajak ngobrol MLBB / skena...'
                : mode === 'profesor'
                ? `Minta trik hafal ${currentSubject.name} Kelas ${kelas}...`
                : `Tanya Mimi apa aja (singkatan & typo langsung paham!)...`
            }
            className="flex-1 min-w-0 px-4 sm:px-5 py-3 text-base sm:text-sm tracking-wide bg-white/[0.06] border border-purple-500/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="px-4 sm:px-5 py-3 min-h-[46px] text-xs font-bold tracking-wide text-white bg-gradient-to-r from-[#EF4444] via-[#EC4899] to-[#8B5CF6] hover:opacity-95 disabled:opacity-40 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.45)] flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Kirim Pesan</span>
            <span className="sm:hidden">Kirim</span>
            <Send className="w-3.5 h-3.5 shrink-0" />
          </button>
        </form>
      </div>

      {/* Right 4 Columns: HIGHLIGHT Hack Profesor Card + MIMI V12 Character Sheet + Human Context Buffer */}
      <aside className="lg:col-span-4 space-y-4 sm:space-y-5">
        {/* Card 1: HIGHLIGHT Pastel Yellow + Glow Border Profesor Hack Card */}
        <div className="profesor-highlight-card p-5 sm:p-6 text-slate-950 transition-transform duration-300 hover:scale-[1.01]">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <h3 className="font-display text-base font-extrabold text-slate-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600 shrink-0" />
              <span>Hack Profesor: {currentSubject.name}</span>
            </h3>
            <span className="text-xs font-bold text-amber-950 bg-amber-400/50 border border-amber-600/30 px-3 py-0.5 rounded-full tabular-nums shrink-0">
              {jenjang} Kelas {kelas}
            </span>
          </div>

          <p className="text-xs font-bold text-slate-900 mb-2.5 tracking-wide">
            {currentSubject.profesorHackTitle}
          </p>
          <div className="p-3.5 sm:p-4 bg-slate-950 text-amber-300 border border-amber-500/40 rounded-2xl text-xs font-mono leading-relaxed mb-3.5 shadow-inner">
            {currentSubject.profesorHackMnemonic}
          </div>
          <p className="text-xs text-slate-900 font-medium leading-relaxed mb-4 tracking-wide">
            {currentSubject.profesorHackExplanation}
          </p>
          <button
            type="button"
            onClick={() =>
              sendMessage(
                `Profesor Mimi, jelasin lebih lanjut cara pakai jembatan keledai "${currentSubject.profesorHackTitle}" di soal ${currentSubject.name} Kelas ${kelas} dong!`,
                'profesor'
              )
            }
            className="w-full py-3 px-4 text-xs font-extrabold tracking-wide text-slate-950 shimmer-cta rounded-full transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            ⚡ Tanya Hack Ini ke Mimi Profesor
          </button>
        </div>

        {/* Card 2: MIMI V12 Official Skena Character Reference Sheet Card */}
        <div className="skena-glass p-5 sm:p-6 space-y-4 border-red-500/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <SkenaMimiAvatar size="md" expression="smirk" />
              <div>
                <h3 className="font-display text-sm font-bold text-white tracking-wide">
                  MIMI V12 · Character Sheet
                </h3>
                <p className="text-[11px] text-red-300 font-semibold tracking-wider uppercase">
                  Indonesian Gen Z · 15 YO · Skena
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="text-red-400 font-bold block">Hair &amp; Outfit</span>
              <span>Black-Red Wolfcut &amp; Oversized MIMI Tee</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="text-purple-300 font-bold block">Vibe &amp; Hobi</span>
              <span>Skena Streetwear · Push Rank MLBB</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'Cool Neutral',
              'Confident Smirk',
              'Shocked',
              'Pointing Assertive',
              'Waving Casual',
            ].map((pose) => (
              <span
                key={pose}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border ${
                  currentAvatarState.label.includes(pose.split(' ')[0])
                    ? 'bg-red-500/25 border-red-400 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-400'
                }`}
              >
                {pose}
              </span>
            ))}
          </div>
        </div>

        {/* Card 3: Human Context Buffer (Memori Lintas Mapel di LocalStorage) */}
        <div className="skena-glass p-5 sm:p-6 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 tracking-wide">
              <Brain className="w-4 h-4 text-[#EC4899]" />
              <span>Human Context Buffer</span>
            </h3>
            <span className="text-[11px] text-purple-300 font-semibold tracking-wide">
              Memori: {humanBuffer.nickname}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed tracking-wide">
            Mimi mengingat gaya ngobrol &amp; analogi favoritmu meskipun kamu pindah mata pelajaran:
          </p>

          <div className="flex flex-wrap gap-2">
            {['MLBB & Skena', 'Gaming & Esports', 'Kuliner & Masak', 'Visual & Cerita'].map(
              (vibe) => {
                const isSelected = humanBuffer.preferredVibe === vibe;
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => updateHumanBuffer({ preferredVibe: vibe })}
                    className={`px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${
                      isSelected
                        ? 'skena-neon-chip-active text-white'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              }
            )}
          </div>

          <div className="pt-2.5 border-t border-white/10 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <p>
              <strong className="text-purple-200">Riwayat Mapel:</strong>{' '}
              {humanBuffer.recentSubjects.join(' → ')}
            </p>
            <p>
              <strong className="text-pink-300">Catatan Memori:</strong>{' '}
              {humanBuffer.rememberedNotes[0]}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

