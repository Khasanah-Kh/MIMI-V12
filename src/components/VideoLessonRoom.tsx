import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import {
  VIDEO_LESSONS,
  VideoLesson,
} from '../lib/mimiEngine';

interface VideoLessonRoomProps {
  onAskMimiInChat: (promptText: string, mode?: 'belajar' | 'profesor') => void;
}

export const VideoLessonRoom: React.FC<VideoLessonRoomProps> = ({
  onAskMimiInChat,
}) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string>(VIDEO_LESSONS[0].id);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [simIntensity, setSimIntensity] = useState<number>(75);
  const [simMass, setSimMass] = useState<number>(5);

  const currentVideo: VideoLesson =
    VIDEO_LESSONS.find((v) => v.id === selectedVideoId) || VIDEO_LESSONS[0];
  const currentChapter =
    currentVideo.chapters[activeChapterIdx] || currentVideo.chapters[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveChapterIdx((prev) => {
        if (prev + 1 < currentVideo.chapters.length) {
          return prev + 1;
        }
        setIsPlaying(false);
        return 0;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying, currentVideo.chapters.length]);

  const handleSelectVideo = (vid: VideoLesson) => {
    setSelectedVideoId(vid.id);
    setActiveChapterIdx(0);
    setIsPlaying(false);
  };

  const calculatedAcceleration = (simIntensity / Math.max(1, simMass)).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Module Selector Bar */}
      <div className="skena-glass rounded-[20px] p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">
              Video Pembelajaran &amp; Simulasi Visual Skena Studio (SD–SMA) 🎬
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Materi resmi Kurikulum Merdeka dengan visualisasi interaktif ala SkenaMath Studio, analogi kehidupan nyata, dan Jembatan Keledai Profesor Mimi.
            </p>
          </div>
          <div className="text-xs text-purple-300 bg-purple-500/15 border border-purple-400/30 px-3.5 py-2 rounded-full flex flex-wrap items-center gap-1.5">
            <span>📚 {currentVideo.sourceCitation}</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-300 hover:text-white underline font-semibold"
            >
              buku.kemendikdasmen.go.id ↗
            </a>
          </div>
        </div>

        {/* Module Selector Tabs */}
        <div
          role="group"
          aria-label="Pilih modul video pembelajaran"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
        >
          {VIDEO_LESSONS.map((vid) => {
            const isSelected = vid.id === currentVideo.id;
            return (
              <button
                key={vid.id}
                type="button"
                onClick={() => handleSelectVideo(vid)}
                className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-[0.99] flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'skena-neon-chip-active'
                    : 'bg-white/[0.04] border-white/10 hover:border-purple-400/40 text-zinc-200'
                }`}
              >
                <div className="text-xs opacity-90 flex items-center justify-between gap-2">
                  <span className="font-display font-semibold">
                    {vid.jenjang} Kelas {vid.kelas} · {vid.mapel}
                  </span>
                  <span className="tabular-nums font-mono">{vid.duration}</span>
                </div>
                <p className="text-xs font-display font-extrabold leading-snug">
                  {vid.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Left Zone (8 Cols): Interactive Visual Lesson Player & Simulation Stage */}
        <div className="lg:col-span-8 skena-glass rounded-[20px] p-4 sm:p-6 flex flex-col justify-between space-y-5 sm:space-y-6">
          {/* Top Stage Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5 sm:pb-4">
            <div>
              <p className="text-xs text-pink-400 font-display font-bold mb-1">
                {currentVideo.jenjang} Kelas {currentVideo.kelas} · {currentVideo.mapel} · Bab Interaktif {activeChapterIdx + 1}/{currentVideo.chapters.length}
              </p>
              <h3 className="font-display text-base sm:text-lg font-extrabold text-white">
                {currentChapter.title}
              </h3>
            </div>
            <div className="text-xs font-mono tabular-nums text-purple-200 bg-purple-950/70 border border-purple-500/35 px-3 py-1.5 rounded-full">
              Timestamp: {currentChapter.time} / {currentVideo.duration}
            </div>
          </div>

          {/* Interactive SVG Educational Diagram Canvas */}
          <div className="bg-[#0D0B14] border border-purple-500/30 rounded-2xl p-3.5 sm:p-5 min-h-[220px] sm:min-h-[260px] flex flex-col justify-between">
            <svg
              viewBox="0 0 680 210"
              className="w-full h-48"
              role="img"
              aria-label={`Diagram visualisasi ${currentVideo.title}`}
            >
              <rect width="680" height="210" rx="12" fill="#130F24" />

              {currentVideo.diagramType === 'photosynthesis' && (
                <g>
                  <circle
                    cx="95"
                    cy="55"
                    r={22 + (simIntensity / 100) * 10}
                    fill="#EAB308"
                    opacity="0.9"
                  />
                  <text x="45" y="105" fill="#FDE047" fontSize="11" fontWeight="600">
                    Sinar Matahari ({simIntensity}%)
                  </text>
                  <line x1="130" y1="65" x2="250" y2="95" stroke="#FACC15" strokeWidth="3" strokeDasharray="6 4" />

                  <rect x="255" y="45" width="180" height="115" rx="16" fill="#2E1065" stroke="#8B5CF6" strokeWidth="2" />
                  <text x="275" y="75" fill="#DDD6FE" fontSize="12" fontWeight="700">
                    DAPUR KLOROFIL DAUN
                  </text>
                  <text x="275" y="98" fill="#FFFFFF" fontSize="11">
                    Input: H2O (Xilem) + CO2
                  </text>
                  <text x="275" y="120" fill="#F472B6" fontSize="11">
                    Proses: Bab {activeChapterIdx + 1} Aktif
                  </text>
                  <text x="275" y="142" fill="#FDE68A" fontSize="11" fontWeight="600">
                    Laju Masak: {Math.round(simIntensity * 1.2)} unit/menit
                  </text>

                  <line x1="435" y1="100" x2="505" y2="100" stroke="#EC4899" strokeWidth="3" />
                  <rect x="505" y="55" width="145" height="90" rx="12" fill="#3B0764" stroke="#EC4899" strokeWidth="2" />
                  <text x="520" y="85" fill="#FBCFE8" fontSize="12" fontWeight="700">
                    HASIL FOTOSINTESIS
                  </text>
                  <text x="520" y="108" fill="#FFFFFF" fontSize="11">
                    ● Glukosa (C6H12O6)
                  </text>
                  <text x="520" y="128" fill="#DDD6FE" fontSize="11">
                    ● Oksigen Segar (O2)
                  </text>
                </g>
              )}

              {currentVideo.diagramType === 'algebra_balance' && (
                <g>
                  <polygon points="340,145 315,190 365,190" fill="#6D28D9" />
                  <line x1="140" y1="145" x2="540" y2="145" stroke="#EC4899" strokeWidth="5" />
                  <rect x="155" y="80" width="135" height="58" rx="10" fill="#1E1B4B" stroke="#8B5CF6" strokeWidth="2" />
                  <text x="172" y="106" fill="#DDD6FE" fontSize="13" fontWeight="700">
                    Ruas Kiri: 3x + 7
                  </text>
                  <text x="172" y="126" fill="#E2E8F0" fontSize="11">
                    Langkah {activeChapterIdx + 1}: Setimbang
                  </text>
                  <circle cx="340" cy="110" r="22" fill="#8B5CF6" />
                  <text x="332" y="116" fill="#FFFFFF" fontSize="20" fontWeight="700">
                    =
                  </text>
                  <rect x="390" y="80" width="135" height="58" rx="10" fill="#1E1B4B" stroke="#EC4899" strokeWidth="2" />
                  <text x="410" y="106" fill="#FBCFE8" fontSize="13" fontWeight="700">
                    Ruas Kanan: 22
                  </text>
                  <text x="410" y="126" fill="#E2E8F0" fontSize="11">
                    Target: 3x = 22 - 7
                  </text>
                </g>
              )}

              {currentVideo.diagramType === 'algorithm_flow' && (
                <g>
                  {[
                    { x: 35, title: '1. Dekomposisi', sub: 'Pecah Masalah' },
                    { x: 195, title: '2. Pola', sub: 'Cari Kemiripan' },
                    { x: 355, title: '3. Abstraksi', sub: 'Fokus Penting' },
                    { x: 515, title: '4. Algoritma', sub: 'Langkah Urut' },
                  ].map((node, i) => (
                    <g key={node.title}>
                      <rect
                        x={node.x}
                        y="65"
                        width="135"
                        height="80"
                        rx="12"
                        fill={i <= activeChapterIdx + 1 ? '#5B21B6' : '#1E1B4B'}
                        stroke="#EC4899"
                        strokeWidth="2"
                      />
                      <text x={node.x + 14} y="100" fill="#FFFFFF" fontSize="12" fontWeight="700">
                        {node.title}
                      </text>
                      <text x={node.x + 14} y="122" fill="#FBCFE8" fontSize="11">
                        {node.sub}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {currentVideo.diagramType === 'newton_force' && (
                <g>
                  <line x1="40" y1="165" x2="640" y2="165" stroke="#6D28D9" strokeWidth="3" />
                  <line x1="80" y1="115" x2="210" y2="115" stroke="#F59E0B" strokeWidth="5" />
                  <polygon points="210,105 230,115 210,125" fill="#F59E0B" />
                  <text x="80" y="95" fill="#FDE68A" fontSize="12" fontWeight="700">
                    Gaya Dorong ΣF = {simIntensity} N
                  </text>
                  <rect x="235" y="75" width="130" height="88" rx="12" fill="#4C1D95" stroke="#A78BFA" strokeWidth="2" />
                  <text x="255" y="112" fill="#FFFFFF" fontSize="13" fontWeight="700">
                    Massa m = {simMass} kg
                  </text>
                  <text x="255" y="135" fill="#DDD6FE" fontSize="11">
                    Hukum II Newton
                  </text>
                  <rect x="420" y="75" width="210" height="88" rx="12" fill="#500724" stroke="#EC4899" strokeWidth="2" />
                  <text x="440" y="108" fill="#FBCFE8" fontSize="12" fontWeight="700">
                    PERCEPATAN (a = ΣF / m)
                  </text>
                  <text x="440" y="136" fill="#FFFFFF" fontSize="16" fontWeight="700">
                    a = {calculatedAcceleration} m/s²
                  </text>
                </g>
              )}
            </svg>

            {/* Interactive Parameter Controls */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sim-intensity-slider"
                  className="flex items-center justify-between text-xs text-zinc-300 mb-1"
                >
                  <span>
                    {currentVideo.diagramType === 'newton_force'
                      ? 'Resultan Gaya Dorong (ΣF):'
                      : 'Intensitas Sinar / Parameter Simulasi:'}
                  </span>
                  <span className="font-mono font-bold text-purple-300 tabular-nums">
                    {simIntensity} {currentVideo.diagramType === 'newton_force' ? 'N' : '%'}
                  </span>
                </label>
                <input
                  id="sim-intensity-slider"
                  type="range"
                  min={20}
                  max={100}
                  value={simIntensity}
                  onChange={(e) => setSimIntensity(Number(e.target.value))}
                  className="w-full accent-[#8B5CF6] cursor-pointer"
                />
              </div>

              <div>
                <label
                  htmlFor="sim-mass-slider"
                  className="flex items-center justify-between text-xs text-zinc-300 mb-1"
                >
                  <span>
                    {currentVideo.diagramType === 'newton_force'
                      ? 'Massa Benda (m):'
                      : currentVideo.diagramType === 'photosynthesis'
                      ? 'Kadar Air & CO2 Daun:'
                      : 'Faktor Pengali / Beban Suku:'}
                  </span>
                  <span className="font-mono font-bold text-pink-400 tabular-nums">
                    {simMass} {currentVideo.diagramType === 'newton_force' ? 'kg' : 'unit'}
                  </span>
                </label>
                <input
                  id="sim-mass-slider"
                  type="range"
                  min={1}
                  max={20}
                  value={simMass}
                  onChange={(e) => setSimMass(Number(e.target.value))}
                  className="w-full accent-[#EC4899] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Active Chapter Explanation & Playback Controls */}
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.04] border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-amber-300 font-semibold">
                  {currentChapter.keyFormulaOrKeyword}
                </span>
                <span className="text-xs text-zinc-400">
                  Sumber: Kurikulum Merdeka
                </span>
              </div>
              <p className="text-sm text-zinc-100 leading-relaxed">
                {currentChapter.conceptSummary}
              </p>
              <p className="text-xs text-pink-300">
                <strong>Analogi Mimi:</strong> {currentChapter.visualAnalogy}
              </p>
            </div>

            {/* Playback Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="px-4 py-2 text-xs font-display font-bold bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-full shadow-[0_0_18px_rgba(139,92,246,0.5)] transition-all duration-200 hover:scale-105 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda Video Visual</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Putar Bab Otomatis</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveChapterIdx((prev) => (prev + 1) % currentVideo.chapters.length)
                  }
                  className="px-3.5 py-2 text-xs font-display font-bold bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-200 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Bab Berikutnya</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveChapterIdx(0);
                    setIsPlaying(false);
                  }}
                  aria-label="Ulang dari bab pertama"
                  className="p-2 text-zinc-300 hover:text-white bg-white/[0.06] border border-white/10 rounded-full transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskMimiInChat(
                    `Mim, aku baru nonton modul video "${currentVideo.title}" (${currentVideo.sourceCitation}). Boleh kasih latihan tebak konsep dari video ini?`,
                    'belajar'
                  )
                }
                className="px-4 py-2 text-xs font-display font-bold bg-white text-zinc-950 hover:bg-purple-100 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Tanya Materi Video Ini ke Mimi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Zone (4 Cols): Chapter Deck & Highlighted Profesor Mnemonic Hack */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="skena-glass rounded-[20px] p-5 space-y-4">
            <h3 className="font-display text-sm font-extrabold text-white">
              Daftar Bab Video Pembelajaran 📚
            </h3>
            <div className="space-y-2.5">
              {currentVideo.chapters.map((chap, idx) => {
                const isActive = idx === activeChapterIdx;
                return (
                  <button
                    key={chap.title}
                    type="button"
                    onClick={() => {
                      setActiveChapterIdx(idx);
                      setIsPlaying(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 hover:scale-[1.02] ${
                      isActive
                        ? 'bg-purple-500/20 border-purple-400 text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-purple-400/40 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-purple-300 mb-1">
                      <span className="font-display font-bold">
                        Bab {idx + 1}
                      </span>
                      <span className="font-mono tabular-nums">{chap.time}</span>
                    </div>
                    <p className="text-xs font-display font-bold text-white mb-1">
                      {chap.title}
                    </p>
                    <p className="text-xs text-zinc-300 line-clamp-2">
                      {chap.conceptSummary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Highlighted Pastel Yellow Hack Profesor Card */}
          <div className="profesor-highlight-card rounded-[20px] p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-display font-extrabold text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Hack Jembatan Keledai Video Ini</span>
            </div>
            <div className="p-3.5 bg-amber-950/90 border border-amber-700 rounded-xl text-xs font-mono text-amber-100">
              {currentVideo.profesorHack}
            </div>
            <p className="text-xs text-amber-950/90 leading-relaxed font-medium">
              {currentVideo.summary}
            </p>
            <button
              type="button"
              onClick={() =>
                onAskMimiInChat(
                  `Profesor Mimi, minta trik hafal tambahan buat materi "${currentVideo.title}" (${currentVideo.sourceCitation}) dong!`,
                  'profesor'
                )
              }
              className="w-full py-2.5 px-4 text-xs font-display font-extrabold text-amber-950 rounded-xl shimmer-cta transition-all duration-200 hover:scale-105 whitespace-nowrap"
            >
              Tanya Hack Ini ke Mimi Profesor ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
