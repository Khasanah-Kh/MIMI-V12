import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyUserMessage,
  generateSmartMimiReply,
  buildMimiSystemPrompt,
  getSubjectsForGrade,
  sanitizeChatHistoryForQuery,
  computeUpdatedStreak,
  computeAchievementBadges,
  updateAchievementProgress,
  OFFICIAL_MIMI_V12_CLEAN_PROMPT,
  PRACTICE_QUESTIONS,
  VIDEO_LESSONS,
} from './mimiEngine';

test('MIMI V12 Golden Rule 6: Simple greetings & small talk are classified as greeting and answered briefly without Sumber Buku or 3 Langkah', () => {
  assert.equal(classifyUserMessage('Halo', 'Matematika', 'belajar'), 'greeting');
  assert.equal(classifyUserMessage('pagi mimi!', 'IPA', 'belajar'), 'greeting');
  assert.equal(classifyUserMessage('hai bestie ✨', 'Fisika', 'belajar'), 'greeting');
  assert.equal(
    classifyUserMessage('Halo Mimi! Gimana kabarnya hari ini?', 'Matematika', 'belajar'),
    'greeting'
  );
  assert.equal(classifyUserMessage('lagi apa mim?', 'Matematika', 'belajar'), 'greeting');

  const res = generateSmartMimiReply({
    userMessage: 'Halo Mimi! Gimana kabarnya hari ini?',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    mode: 'belajar',
  });
  assert.equal(res.intent, 'greeting');
  assert.equal(res.sourceCitation, undefined, 'Greeting must NEVER cite Sumber Buku');
  assert.equal(res.mathOptions, undefined, 'Greeting must NEVER include mathOptions');
  assert.ok(!res.reply.includes('Sumber:'), 'Greeting reply text must NEVER mention Sumber:');
  assert.ok(!res.reply.includes('Langkah 1'), 'Greeting must not lecture with 3 steps');
  assert.ok(res.reply.split(/\s+/).length <= 22, 'Greeting must be short and concise');
});

test('MIMI V12 Golden Rule 2: Answer key requests are refused with the mandatory real-life contact phrase', () => {
  assert.equal(
    classifyUserMessage('Mim minta kunci jawaban dong buat PR ini', 'Matematika', 'belajar'),
    'answer_key_request'
  );

  const res = generateSmartMimiReply({
    userMessage: 'Kasih jawaban langsung aja mim kunci jawaban bab 3',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    mode: 'belajar',
  });
  assert.equal(res.intent, 'answer_key_request');
  assert.ok(
    res.reply.includes('hubungi Mimi in real life'),
    'Must include signature phrase to contact Mimi in real life for answer keys'
  );
});

test('MIMI V12 Golden Rule 3: Mathematics ONLY uses 3 Langkah + 3 Opsi (A, B, C) and cites official source', () => {
  const intent = classifyUserMessage('Gimana cara ngerjain persamaan aljabar 2x + 5 = 15?', 'Matematika', 'belajar');
  assert.equal(intent, 'math');

  const res = generateSmartMimiReply({
    userMessage: 'Gimana cara ngerjain persamaan aljabar 2x + 5 = 15?',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    mode: 'belajar',
  });
  assert.equal(res.intent, 'math');
  assert.ok(res.reply.includes('Sumber:'), 'Must cite official Kemendikbud source');
  assert.ok(res.reply.includes('Langkah 1'), 'Math reply must include Langkah 1');
  assert.ok(res.reply.includes('Langkah 2'), 'Math reply must include Langkah 2');
  assert.ok(res.reply.includes('Langkah 3'), 'Math reply must include Langkah 3');
  assert.ok(res.mathOptions?.optionA.startsWith('A)'), 'Math reply must provide Option A');
  assert.ok(res.mathOptions?.optionB.startsWith('B)'), 'Math reply must provide Option B');
  assert.ok(res.mathOptions?.optionC.startsWith('C)'), 'Math reply must provide Option C');
});

test('MIMI V12 Golden Rule 4: Non-Math subjects use Clue + Kisi-kisi + Sumber + Analogi and NEVER 3 Langkah', () => {
  const intent = classifyUserMessage('Jelaskan tentang proses fotosintesis pada tumbuhan', 'IPA', 'belajar');
  assert.equal(intent, 'other_subject');

  const res = generateSmartMimiReply({
    userMessage: 'Jelaskan tentang proses fotosintesis pada tumbuhan',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'IPA',
    mode: 'belajar',
  });
  assert.equal(res.intent, 'other_subject');
  assert.ok(res.reply.includes('Sumber:'), 'Must cite official Kemendikbud source');
  assert.ok(res.reply.includes('Clue'), 'Must include clue');
  assert.ok(res.reply.includes('Kisi-Kisi'), 'Must include Kisi-kisi');
  assert.ok(res.reply.includes('Analogi'), 'Must include analogy');
  assert.ok(!res.reply.includes('Langkah 1'), 'Non-math subject must NOT use 3 Langkah format');
  assert.equal(res.mathOptions, undefined);
});

test('MIMI V12 Strict Prompt Separation: buildMimiSystemPrompt uses 3-step ONLY for Math and Clue + Kisi-kisi for all other subjects', () => {
  const mathPrompt = buildMimiSystemPrompt({
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    mode: 'belajar',
    intent: 'math',
  });
  assert.ok(mathPrompt.includes('MIMI (Versi V12)'));
  assert.ok(mathPrompt.includes('3 Langkah'), 'Math prompt must include 3 Langkah structure');
  assert.ok(mathPrompt.includes('3 Opsi Pilihan (A, B, C)'), 'Math prompt must include 3 Opsi Pilihan');
  assert.ok(!mathPrompt.includes('CLUE + KISI-KISI + SUMBER + ANALOGI'), 'Math prompt must not include non-math structure header');

  const ipaPrompt = buildMimiSystemPrompt({
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'IPA',
    mode: 'belajar',
    intent: 'other_subject',
  });
  assert.ok(ipaPrompt.includes('MIMI (Versi V12)'));
  assert.ok(ipaPrompt.includes('CLUE + KISI-KISI + SUMBER + ANALOGI'), 'Non-math prompt must use Clue + Kisi-kisi structure');
  assert.ok(!/3\s*langkah/i.test(ipaPrompt), 'Non-math prompt must NOT contain 3-step instructions anywhere');
  assert.ok(!/langkah\s*1/i.test(ipaPrompt), 'Non-math prompt must NOT contain Langkah 1');
});

test('MIMI V12 Chat History Sanitization: removes 3-step logic from chat history for non-math queries', () => {
  const sampleHistory = [
    {
      role: 'assistant' as const,
      content: 'Halo bestie! Selamat datang di MIMI V12.\n• Kalau tanya Matematika pakai 3 Langkah + 3 Opsi Pilihan\n• Kalau tanya IPA pakai Clue & Kisi-kisi',
      intent: 'greeting' as const,
    },
    {
      role: 'user' as const,
      content: 'Gimana cara kerjain 2x + 4 = 10?',
    },
    {
      role: 'assistant' as const,
      content: 'Kita pecah 3 Langkah yuk:\nLangkah 1: ...\nLangkah 2: ...\nLangkah 3: ...\nKamu mau mulai dari mana? A) ... B) ... C) ...',
      intent: 'math' as const,
      mathOptions: { optionA: 'A) 1', optionB: 'B) 2', optionC: 'C) 3' },
    },
    {
      role: 'user' as const,
      content: 'Sekarang aku mau tanya IPA tentang fotosintesis',
    },
  ];

  // For non-math query (isMathQuery = false), all 3-step turns and 3-step lines must be removed
  const sanitizedForNonMath = sanitizeChatHistoryForQuery(sampleHistory, false);
  for (const msg of sanitizedForNonMath) {
    assert.ok(!/3\s*langkah/i.test(msg.content), 'Sanitized non-math history must not contain 3 Langkah');
    assert.ok(!/langkah\s*1/i.test(msg.content), 'Sanitized non-math history must not contain Langkah 1');
  }

  // For math query (isMathQuery = true), 3-step turns are preserved
  const preservedForMath = sanitizeChatHistoryForQuery(sampleHistory, true);
  assert.equal(preservedForMath.length, 4);
  assert.ok(preservedForMath.some((m) => m.content.includes('Langkah 1')));
});

test('MIMI V12 Golden Rule 5 & 7: Curhat session is human-random and Profesor Mode provides hacks', () => {
  const curhatRes = generateSmartMimiReply({
    userMessage: 'Mim aku capek banget hari ini rasanya sedih dan galau',
    jenjang: 'SMA',
    kelas: 11,
    mapel: 'Matematika',
    mode: 'curhat',
  });
  assert.equal(curhatRes.intent, 'curhat');
  assert.ok(!curhatRes.reply.includes('Langkah 1'));

  const profRes = generateSmartMimiReply({
    userMessage: 'Kasih jembatan keledai buat materi ini dong',
    jenjang: 'SMA',
    kelas: 10,
    mapel: 'Kimia',
    mode: 'profesor',
  });
  assert.equal(profRes.intent, 'profesor');
  assert.ok(profRes.reply.includes('MODE MIMI PROFESOR V12 AKTIF'));
});

test('Curriculum covers SD (1-6), SMP (7-9), and SMA (10-12) and MIMI V12 clean prompt omits visual design clutter', () => {
  assert.ok(getSubjectsForGrade('SD', 1).length >= 4);
  assert.ok(getSubjectsForGrade('SMP', 8).length >= 5);
  assert.ok(getSubjectsForGrade('SMA', 12).length >= 5);
  assert.ok(OFFICIAL_MIMI_V12_CLEAN_PROMPT.includes('MIMI (V12)'));
  assert.ok(!OFFICIAL_MIMI_V12_CLEAN_PROMPT.includes('pastel, kawaii untuk anak perempuan'));
  assert.ok(PRACTICE_QUESTIONS.length >= 6);
  assert.ok(VIDEO_LESSONS.length >= 4);
});

test('Daily Learning Streak: tracks consecutive days, same-day maintenance, and missed-day resets accurately', () => {
  // 1. First visit starts at 1
  const day1 = computeUpdatedStreak(null, '2026-10-20');
  assert.equal(day1.status, 'started');
  assert.equal(day1.next.count, 1);
  assert.equal(day1.next.bestStreak, 1);

  // 2. Same day interaction maintains count = 1 and increments totalInteractions
  const sameDay = computeUpdatedStreak(day1.next, '2026-10-20');
  assert.equal(sameDay.status, 'maintained');
  assert.equal(sameDay.next.count, 1);
  assert.equal(sameDay.next.totalInteractions, 2);

  // 3. Next consecutive day increments count to 2
  const day2 = computeUpdatedStreak(sameDay.next, '2026-10-21');
  assert.equal(day2.status, 'incremented');
  assert.equal(day2.next.count, 2);
  assert.equal(day2.next.bestStreak, 2);

  // 4. Skipping a day resets count to 1 while preserving bestStreak = 2
  const skipped = computeUpdatedStreak(day2.next, '2026-10-24');
  assert.equal(skipped.status, 'reset');
  assert.equal(skipped.next.count, 1);
  assert.equal(skipped.next.bestStreak, 2);
});

test('Achievement Badges: unlocks Mimi\'s Bestie, Pejuang Belajar, and Master Matematika based on interactions & study duration', () => {
  let progress = updateAchievementProgress(null, {
    intent: 'math',
    mapel: 'Matematika',
    mode: 'belajar',
    addedMinutes: 5,
    streakDays: 1,
  });
  progress = updateAchievementProgress(progress, {
    intent: 'math',
    mapel: 'Matematika',
    mode: 'belajar',
    addedMinutes: 5,
    streakDays: 2,
  });
  progress = updateAchievementProgress(progress, {
    intent: 'math',
    mapel: 'Matematika',
    mode: 'profesor',
    addedMinutes: 5,
    streakDays: 3,
  });

  const badges = computeAchievementBadges(progress);
  const bestie = badges.find((b) => b.id === 'mimis-bestie');
  const pejuang = badges.find((b) => b.id === 'pejuang-belajar');
  const masterMtk = badges.find((b) => b.id === 'master-matematika');
  const rajaStreak = badges.find((b) => b.id === 'raja-streak-skena');

  assert.equal(bestie?.unlocked, true);
  assert.equal(pejuang?.unlocked, true);
  assert.equal(masterMtk?.unlocked, true);
  assert.equal(rajaStreak?.unlocked, true);
});


