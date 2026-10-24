import React, { useState } from 'react';
import { Copy, Check, FileText, Sparkles } from 'lucide-react';
import {
  Jenjang,
  MimiMode,
  OFFICIAL_MIMI_V12_CLEAN_PROMPT,
  buildMimiSystemPrompt,
} from '../lib/mimiEngine';

interface PromptBlueprintViewProps {
  jenjang: Jenjang;
  kelas: number;
  mapel: string;
  mode: MimiMode;
}

export const PromptBlueprintView: React.FC<PromptBlueprintViewProps> = ({
  jenjang,
  kelas,
  mapel,
  mode,
}) => {
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedDynamic, setCopiedDynamic] = useState(false);
  const [activeTab, setActiveTab] = useState<'master' | 'dynamic'>('master');

  const dynamicPrompt = buildMimiSystemPrompt({ jenjang, kelas, mapel, mode });

  const handleCopy = async (text: string, type: 'master' | 'dynamic') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback copy handled silently
    }
    if (type === 'master') {
      setCopiedMaster(true);
      setTimeout(() => setCopiedMaster(false), 2500);
    } else {
      setCopiedDynamic(true);
      setTimeout(() => setCopiedDynamic(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="skena-glass rounded-[20px] p-4 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-[11px] font-display font-bold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Engine Blueprint MIMI V12</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">
              Dokumen Identitas &amp; Sistem Prompt Resmi MIMI V12 🚀
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl">
              Logika MIMI V12 tetap murni &amp; dipisah ketat: 3 Langkah khusus Matematika, Clue + Kisi-kisi untuk semua Mapel Lain, Mode Profesor, serta Curhat Human Random dengan Human Context Buffer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 max-w-full">
            <div
              role="group"
              aria-label="Pilih versi prompt"
              className="flex items-center gap-1.5 p-1.5 bg-white/[0.04] border border-white/10 rounded-full overflow-x-auto no-scrollbar max-w-full"
            >
              <button
                type="button"
                onClick={() => setActiveTab('master')}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-display font-bold rounded-full transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-105 active:scale-95 ${
                  activeTab === 'master'
                    ? 'skena-neon-chip-active'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Master Prompt MIMI V12
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dynamic')}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-display font-bold rounded-full transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-105 active:scale-95 ${
                  activeTab === 'dynamic'
                    ? 'skena-neon-chip-active'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Prompt Konteks ({jenjang} Kelas {kelas} · {mapel})
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  activeTab === 'master' ? OFFICIAL_MIMI_V12_CLEAN_PROMPT : dynamicPrompt,
                  activeTab
                )
              }
              className="px-4 py-2 text-xs font-display font-extrabold text-amber-950 rounded-full shimmer-cta transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              {(activeTab === 'master' ? copiedMaster : copiedDynamic) ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Prompt Tersalin! ✨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Sistem Prompt MIMI V12</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prompt Code Box */}
        <div className="bg-[#0D0B14] text-zinc-100 rounded-2xl p-3.5 sm:p-5 border border-purple-500/30 overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 pb-3 mb-3 border-b border-white/10">
            <span className="flex items-center gap-1.5 font-mono text-purple-300">
              <FileText className="w-3.5 h-3.5 text-pink-400" />
              <span>
                {activeTab === 'master'
                  ? 'mimi-v12-classroom-system-prompt.txt'
                  : `mimi-v12-${jenjang.toLowerCase()}-kelas-${kelas}-${mapel.toLowerCase()}.txt`}
              </span>
            </span>
            <span className="text-pink-300 font-medium">
              Bahasa Santai Universal · Pemisahan Ketat Matematika vs Mapel Lain · Siap Pakai
            </span>
          </div>
          <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap text-zinc-200">
            {activeTab === 'master' ? OFFICIAL_MIMI_V12_CLEAN_PROMPT : dynamicPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
};
