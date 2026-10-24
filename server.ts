import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  buildMimiSystemPrompt,
  classifyUserMessage,
  generateSmartMimiReply,
  getSubjectsForGrade,
  Jenjang,
  MimiMode,
  MessageIntent,
  sanitizeChatHistoryForQuery,
} from './src/lib/mimiEngine.ts';
import { normalizeIndonesianSlang } from './src/lib/slangNormalizer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  app.post('/api/mimi/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm' } = req.body as {
        audioBase64?: string;
        mimeType?: string;
      };
      if (!audioBase64 || typeof audioBase64 !== 'string') {
        res.status(400).json({ error: 'Data audio tidak ditemukan bestie!' });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(503).json({ error: 'Layanan transkripsi belum siap.' });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: audioBase64,
                },
              },
              {
                text: 'Transkripsikan ucapan suara bahasa Indonesia ini secara akurat menjadi teks biasa tanpa tambahan komentar.',
              },
            ],
          },
        ],
      });

      const transcript = response?.text?.trim() || '';
      res.json({ transcript });
    } catch (error) {
      console.error('Transcription error:', error);
      res.status(500).json({ error: 'Gagal mentranskripsi suara.' });
    }
  });

  app.post('/api/mimi/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        jenjang = 'SMP',
        kelas = 8,
        mapel = 'Matematika',
        mode = 'belajar',
        engineMode = 'gemini-3.6-fast',
        userContext,
      } = req.body as {
        message: string;
        history?: Array<{
          role: 'user' | 'assistant';
          content: string;
          intent?: MessageIntent;
          mathOptions?: unknown;
        }>;
        jenjang?: Jenjang;
        kelas?: number;
        mapel?: string;
        mode?: MimiMode;
        engineMode?: 'gemini-3.6-fast' | 'gemini-3.8-search' | 'gemini-4-argon';
        userContext?: {
          nickname?: string;
          preferredVibe?: string;
          rememberedNotes?: string[];
        };
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Pesan tidak boleh kosong bestie!' });
        return;
      }

      const cleanMessage = message.trim();
      const intent = classifyUserMessage(cleanMessage, mapel, mode);
      const isMathQuery = intent === 'math';
      const subjects = getSubjectsForGrade(jenjang, Number(kelas));
      const subjectInfo = subjects.find((s) => s.id === mapel) || subjects[0];
      const fallback = generateSmartMimiReply({
        userMessage: cleanMessage,
        jenjang,
        kelas: Number(kelas),
        mapel,
        mode,
      });

      // Rule 2: Answer key request is strictly intercepted to guarantee 100% compliance
      if (intent === 'answer_key_request') {
        res.json({
          reply: fallback.reply,
          intent: fallback.intent,
          sourceCitation: fallback.sourceCitation,
          modelUsed: 'gemini-3.1-flash-lite',
        });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.json({
          reply: fallback.reply,
          intent: fallback.intent,
          sourceCitation: fallback.sourceCitation,
          mathOptions: fallback.mathOptions,
          modelUsed: 'mimi-v12-offline-engine',
        });
        return;
      }

      const systemInstruction = buildMimiSystemPrompt({
        jenjang,
        kelas: Number(kelas),
        mapel,
        mode,
        intent,
        userContext,
      });

      // Strictly remove 3-step logic from chat history for non-math queries
      const sanitizedHistory = sanitizeChatHistoryForQuery(history, isMathQuery);

      const { normalized, wasModified } = normalizeIndonesianSlang(cleanMessage);
      const userMessageContext = wasModified
        ? `Pesan Asli User: "${cleanMessage}"\n(Pahami Maksud & Singkatan/Typo: "${normalized}")`
        : `Pesan User: "${cleanMessage}"`;

      // Build contextual prompt so Gemini understands ANY query while honoring MIMI V12 rules
      const contextualUserPrompt =
        intent === 'greeting'
          ? `[INTENT 1: User menyapa / small talk (mungkin disingkat misal 'pgi mim', 'gmn kbr'). Jawab PENDEK maksimal 1-2 kalimat (15-20 kata), ramah, nyambung langsung sama kalimat user, dan tanya balik sebagai MIMI V12 (sahabat SMP kelas 8, cewek skena merah hitam, suka main MLBB). JANGAN sebut Sumber Buku, Kurikulum Merdeka, atau 3 Langkah! Jawab nyambung tanpa mengoreksi typo!]\n${userMessageContext}`
          : intent === 'curhat'
          ? `[INTENT 2 & 4: User sedang curhat, ngobrol santai, atau bertanya pengetahuan umum / topik bebas di luar buku sekolah. Pahami singkatan/typo dan jawab langsung secara CERDAS, PAHAM KONTEKS, dan NYAMBUNG seperti Gemini AI namun tetap dengan gaya santai MIMI V12 ("bestie, loh, tau gak, eh"). JANGAN sebut Sumber Buku Siswa dan JANGAN pakai 3 Langkah!]\n${userMessageContext}`
          : intent === 'profesor'
          ? `[INTENT 5: MODE MIMI PROFESOR V12 untuk ${jenjang} Kelas ${kelas} Mapel ${subjectInfo.name}. Jawab langsung pertanyaan spesifik user (pahami singkatan/typo) dengan memberikan HACK TRIK HAFAL, jembatan keledai (mnemonic), atau rumus cepat beserta Sumber: ${subjectInfo.bookTitle} ${subjectInfo.sampleChapter} Hal ${subjectInfo.samplePage}.]\n${userMessageContext}`
          : intent === 'math'
          ? `[INTENT 3: User bertanya tentang MATEMATIKA (${jenjang} Kelas ${kelas}). Pahami soal/pertanyaan spesifik user (termasuk singkatan seperti mtk, aljbr, rmus, pytagoras) dan bahas konsepnya secara cerdas & nyambung! WAJIB sebutkan Sumber: ${subjectInfo.bookTitle} ${subjectInfo.sampleChapter} Hal ${subjectInfo.samplePage}. Pecah cara pengerjaannya jadi 3 Langkah (Langkah 1, Langkah 2, Langkah 3) TANPA membocorkan hasil akhir, lalu akhiri dengan 3 Opsi Pilihan (A, B, C) cara memulai pengerjaan.]\n${userMessageContext}`
          : `[INTENT 3: User bertanya tentang materi/pengetahuan (${subjectInfo.name} · ${jenjang} Kelas ${kelas}). Pahami pertanyaan user meskipun disingkat/typo dan jawab langsung substansi pertanyaan secara cerdas, nyambung, dan akurat menggunakan struktur Clue + Kisi-kisi + Sumber resmi (${subjectInfo.bookTitle} ${subjectInfo.sampleChapter} Hal ${subjectInfo.samplePage} & ${subjectInfo.webSource}) + Analogi sehari-hari yang mudah diingat. Jangan gunakan format 3 Langkah.]\n${userMessageContext}`;

      const formattedContents = [
        ...sanitizedHistory.slice(-10).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: contextualUserPrompt }],
        },
      ];

      // Determine if live Google Search Grounding is needed
      const needsLiveWebSearch =
        engineMode === 'gemini-3.8-search' ||
        /\b(berita\s+terbaru|cari\s+di\s+google|hari\s+ini\s+tanggal|skor\s+pertandingan|cuaca\s+hari\s+ini|harga\s+terbaru|tahun\s+2026)\b/i.test(
          cleanMessage
        );

      // Default 'gemini-3.6-fast' uses 'gemini-3.1-flash-lite' with MINIMAL thinking for sub-second speed!
      const selectedModel = needsLiveWebSearch
        ? 'gemini-3.8-flash'
        : engineMode === 'gemini-4-argon'
        ? 'gemini-4-argon'
        : 'gemini-3.1-flash-lite';

      // Strict < 3.2s timeout guarantee so Mimi NEVER delays more than 5 seconds
      const response = await Promise.race([
        ai.models.generateContent({
          model: selectedModel,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.9,
            topP: 0.95,
            thinkingConfig: {
              thinkingLevel:
                selectedModel === 'gemini-3.1-flash-lite'
                  ? ThinkingLevel.MINIMAL
                  : ThinkingLevel.LOW,
            },
            tools: needsLiveWebSearch ? [{ googleSearch: {} }] : undefined,
          },
        }),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3200)),
      ]);

      const replyText = response?.text?.trim() || fallback.reply;

      res.json({
        reply: replyText,
        intent,
        sourceCitation:
          intent === 'greeting' || intent === 'curhat'
            ? undefined
            : `Sumber: ${subjectInfo.bookTitle} (${subjectInfo.sampleChapter}, Hal. ${subjectInfo.samplePage}) · https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka`,
        mathOptions: intent === 'math' ? fallback.mathOptions : undefined,
        modelUsed: selectedModel,
      });
    } catch (error) {
      // Graceful fallback if network/API is unreachable
      const {
        message = 'Halo',
        jenjang = 'SMP',
        kelas = 8,
        mapel = 'Matematika',
        mode = 'belajar',
      } = req.body || {};
      const fallback = generateSmartMimiReply({
        userMessage: String(message),
        jenjang,
        kelas: Number(kelas),
        mapel,
        mode,
      });
      res.json({
        reply: fallback.reply,
        intent: fallback.intent,
        sourceCitation: fallback.sourceCitation,
        mathOptions: fallback.mathOptions,
        modelUsed: 'mimi-v12-fallback',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MIMI V12 Room Belajar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
