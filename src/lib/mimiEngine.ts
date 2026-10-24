export type Jenjang = 'SD' | 'SMP' | 'SMA';
export type MimiMode = 'belajar' | 'profesor' | 'curhat';
export type MessageIntent =
  | 'greeting'
  | 'answer_key_request'
  | 'curhat'
  | 'profesor'
  | 'math'
  | 'other_subject';

export interface SubjectInfo {
  id: string;
  name: string;
  shortDesc: string;
  bookTitle: string;
  sampleChapter: string;
  samplePage: number;
  webSource: string;
  profesorHackTitle: string;
  profesorHackMnemonic: string;
  profesorHackExplanation: string;
}

export interface GradeCurriculum {
  jenjang: Jenjang;
  kelas: number;
  label: string;
  toneGuide: string;
  subjects: SubjectInfo[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  intent?: MessageIntent;
  mode?: MimiMode;
  sourceCitation?: string;
  mathOptions?: {
    optionA: string;
    optionB: string;
    optionC: string;
  };
}

export interface PracticeQuestion {
  id: string;
  jenjang: Jenjang;
  kelas: number;
  mapel: string;
  topic: string;
  sourceCitation: string;
  webReference: string;
  question: string;
  mimiClue: string;
  mimiAnalogy: string;
  isMath: boolean;
  mathSteps?: [string, string, string];
  options: {
    key: 'A' | 'B' | 'C';
    label: string;
    stepFeedback: string;
    isBestApproach: boolean;
  }[];
  profesorTip: string;
}

export interface VideoChapter {
  time: string;
  title: string;
  conceptSummary: string;
  visualAnalogy: string;
  keyFormulaOrKeyword: string;
}

export interface VideoLesson {
  id: string;
  jenjang: Jenjang;
  kelas: number;
  mapel: string;
  title: string;
  duration: string;
  sourceCitation: string;
  webReference: string;
  summary: string;
  profesorHack: string;
  diagramType: 'photosynthesis' | 'algebra_balance' | 'newton_force' | 'fraction_pizza' | 'algorithm_flow' | 'economic_supply';
  chapters: VideoChapter[];
}

export const JENJANG_GRADES: Record<Jenjang, number[]> = {
  SD: [1, 2, 3, 4, 5, 6],
  SMP: [7, 8, 9],
  SMA: [10, 11, 12],
};

export function getToneByJenjang(jenjang: Jenjang, kelas: number): string {
  if (jenjang === 'SD') {
    return `SD Kelas ${kelas}: Gunakan bahasa yang sangat ramah, ceria, kalimat sederhana, penuh cerita imajinatif dan perumpamaan sehari-hari (mainan, jajanan, petualangan) agar mudah dipahami anak SD.`;
  }
  if (jenjang === 'SMP') {
    return `SMP Kelas ${kelas}: Gunakan bahasa santai universal yang akrab (bestie, keren, gasskeun, mantap, chill), contoh kehidupan nyata remaja sehari-hari, lugas namun seru.`;
  }
  return `SMA Kelas ${kelas}: Gunakan bahasa santai yang cerdas, suportif, mendalam secara logika & konsep analitis, siap menghadapi ujian dan persiapan kuliah (vibe, konsep, analisis, lowkey, valid).`;
}

export function getSubjectsForGrade(jenjang: Jenjang, kelas: number): SubjectInfo[] {
  if (jenjang === 'SD') {
    return [
      {
        id: 'Matematika',
        name: 'Matematika',
        shortDesc: 'Berhitung, Pecahan, Bangun Datar & Pola Bilangan',
        bookTitle: `Buku Siswa Matematika SD Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: kelas <= 3 ? 'Bab 2: Penjumlahan & Pengurangan Bilangan' : 'Bab 3: Pecahan Senilai & Desimal',
        samplePage: 28 + kelas * 3,
        webSource: 'buku.kemdikbud.go.id',
        profesorHackTitle: 'Jembatan Keledai Operasi Hitung & Pecahan',
        profesorHackMnemonic: 'KALI BAGI DULUAN — TAMBAH KURANG BELAKANGAN (KaBaTaKu) & ATAS=PEMBILANG (Langit), BAWAH=PENYEBUT (Bumi)',
        profesorHackExplanation: 'Ingat huruf L pada PembiLang = Langit (di atas), dan huruf B pada PenyeBut = Bumi (di bawah)! Jadi kamu gak bakal ketukar lagi mana angka atas dan bawah.',
      },
      {
        id: 'IPAS',
        name: 'IPAS (Alam & Sosial)',
        shortDesc: 'Makhluk Hidup, Energi, Siklus Air & Lingkungan Kita',
        bookTitle: `Buku Siswa IPAS SD Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: 'Bab 1: Tumbuhan Sumber Kehidupan di Bumi',
        samplePage: 14 + kelas * 2,
        webSource: 'merdekabelajar.kemdikbud.go.id',
        profesorHackTitle: 'Trik Hafal Bagian Fotosintesis & Wujud Benda',
        profesorHackMnemonic: 'KO-S-A-K-O = Klorofil + Sinar + Air + Karbondioksida -> Oksigen & Makanan',
        profesorHackExplanation: 'Bayangkan daun itu dapur koki! Bahan bakunya Air dari akar + udara CO2, kompornya Sinar Matahari, pancinya Klorofil.',
      },
      {
        id: 'Bahasa Indonesia',
        name: 'Bahasa Indonesia',
        shortDesc: 'Membaca Cerita, Ide Pokok, Kalimat Utama & Puisi',
        bookTitle: `Buku Siswa Bahasa Indonesia SD Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: 'Bab 4: Menemukan Ide Pokok dalam Cerita',
        samplePage: 42 + kelas,
        webSource: 'buku.kemdikbud.go.id',
        profesorHackTitle: 'Rumus A-B-C Cari Ide Pokok Paragraf',
        profesorHackMnemonic: 'A-B-C: Awal (Deduktif), Belakang (Induktif), Campuran',
        profesorHackExplanation: 'Jangan baca semua berulang-ulang! Cek kalimat pertama dan kalimat paling terakhir di paragraf, ide pokok 90% ngumpet di situ.',
      },
      {
        id: 'Bahasa Inggris',
        name: 'Bahasa Inggris',
        shortDesc: 'Daily Vocabulary, Greetings, Things Around Us & Simple Sentences',
        bookTitle: `My Next Words Grade ${kelas} - Buku Bahasa Inggris SD Kurikulum Merdeka`,
        sampleChapter: 'Unit 3: My Classroom & Daily Activities',
        samplePage: 31,
        webSource: 'buku.kemdikbud.go.id',
        profesorHackTitle: 'Hack Ingat Pronoun & Verb Tanpa Pusing',
        profesorHackMnemonic: 'I-AM, YOU/WE/THEY-ARE, HE/SHE/IT-IS (Suka Es = Tambah S!)',
        profesorHackExplanation: 'He, She, It itu suka minum ES (huruf S). Jadi kalau ketemu mereka di Present Tense, kata kerjanya dikasih tambahan -s/-es (She eats, He plays).',
      },
      {
        id: 'Pendidikan Pancasila',
        name: 'Pendidikan Pancasila',
        shortDesc: 'Nilai Pancasila, Bhinneka Tunggal Ika & Aturan Bersama',
        bookTitle: `Buku Pendidikan Pancasila SD Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: 'Bab 2: Aku Anak yang Patuh Aturan',
        samplePage: 22,
        webSource: 'kemdikbud.go.id',
        profesorHackTitle: 'Urutan Simbol Pancasila Anti Lupa',
        profesorHackMnemonic: 'BINTANG - RANTAI - POHON - BANTENG - PADI KAPAS (Bi-Ra-Po-Ba-Pa)',
        profesorHackExplanation: 'Bayangkan dari langit turun ke bumi: Bintang di langit -> Rantai di leher -> Pohon tempat berteduh -> Banteng di padang -> Padi Kapas untuk makan & pakaian.',
      },
    ];
  }

  if (jenjang === 'SMP') {
    return [
      {
        id: 'Matematika',
        name: 'Matematika',
        shortDesc: 'Aljabar, Persamaan Linear, Pythagoras, Bangun Ruang & Statistika',
        bookTitle: `Buku Siswa Matematika SMP Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: kelas === 7 ? 'Bab 2: Bentuk Aljabar' : kelas === 8 ? 'Bab 3: Persamaan Linier & Teorema Pythagoras' : 'Bab 4: Fungsi Kuadrat & Transformasi Geometri',
        samplePage: 32,
        webSource: 'buku.kemdikbud.go.id',
        profesorHackTitle: 'Jembatan Keledai Aljabar & Tripel Pythagoras',
        profesorHackMnemonic: 'Pindah Ruas = Ganti Sifat (+/- jadi -/+) & Tripel Favorit: (3-4-5), (5-12-13), (8-15-17), (7-24-25)',
        profesorHackExplanation: 'Anggap tanda sama dengan (=) itu jembatan perbatasan negara. Siapa pun yang nyebrang jembatan wajib ganti kostum tanda (+ jadi -, kali jadi bagi).',
      },
      {
        id: 'IPA',
        name: 'IPA (Sains Terpadu)',
        shortDesc: 'Sel & Organisme, Usaha & Energi, Sistem Pencernaan, Getaran & Gelombang',
        bookTitle: `Buku Siswa Ilmu Pengetahuan Alam SMP Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: kelas === 7 ? 'Bab 2: Klasifikasi Makhluk Hidup & Zat' : kelas === 8 ? 'Bab 2: Struktur dan Fungsi Tubuh Makhluk Hidup' : 'Bab 3: Listrik, Magnet & Bioteknologi',
        samplePage: 45,
        webSource: 'merdekabelajar.kemdikbud.go.id',
        profesorHackTitle: 'Hack Enzim Pencernaan (LAMBUNG & PANKREAS)',
        profesorHackMnemonic: 'Lambung = PE-RE-H (Pepsin, Renin, HCl) | Pankreas = P-L-A (Tripsin, Lipase, Amilase)',
        profesorHackExplanation: 'Di Lambung ingat kata PEREH (perih kalau telat makan): Pepsin ubah protein jadi pepton, Renin endapkan kasein susu, HCl bunuh kuman.',
      },
      {
        id: 'IPS',
        name: 'IPS (Sosial & Sejarah)',
        shortDesc: 'Interaksi Sosial, Kondisi Geografis Indonesia, Kegiatan Ekonomi & Sejarah',
        bookTitle: `Buku Siswa Ilmu Pengetahuan Sosial SMP Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: 'Bab 2: Kemajemukan Masyarakat Indonesia & Aktivitas Ekonomi',
        samplePage: 68,
        webSource: 'buku.kemdikbud.go.id',
        profesorHackTitle: 'Trik Cepat Ingat Faktor produksi & Interaksi',
        profesorHackMnemonic: 'A-T-M-K: Alam, Tenaga Kerja, Modal, Kewirausahaan',
        profesorHackExplanation: 'Ingat mesin ATM ditambah K! Alam & Tenaga kerja itu faktor Asli, sedangkan Modal & Kewirausahaan itu faktor Turunan.',
      },
      {
        id: 'Bahasa Indonesia',
        name: 'Bahasa Indonesia',
        shortDesc: 'Teks Deskripsi, Teks Eksplanasi, Puisi, Teks Laporan Percobaan',
        bookTitle: `Buku Siswa Bahasa Indonesia SMP Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: 'Bab 3: Menyusun Teks Eksplanasi & Argumentasi',
        samplePage: 54,
        webSource: 'buku.kemdikbud.go.id',
        profesorHackTitle: 'Rumus Struktur Teks Eksplanasi (U-D-I)',
        profesorHackMnemonic: 'U-D-I: Pernyataan Umum -> Deretan Penjelas -> Interpretasi (Simpulan)',
        profesorHackExplanation: 'Bayangkan lagi cerita gosip ilmiah: Kenalin dulu topiknya (Umum), ceritain kronologi sebab-akibatnya (Deretan Penjelas), lalu tutup pakai kesimpulan (Interpretasi).',
      },
      {
        id: 'Bahasa Inggris',
        name: 'Bahasa Inggris',
        shortDesc: 'Recount Text, Descriptive, Simple Present/Past Tense & Expressions',
        bookTitle: `English for Nusantara SMP Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: 'Chapter 3: Love Our World & Past Experiences',
        samplePage: 58,
        webSource: 'buku.kemdikbud.go.id',
        profesorHackTitle: 'Memory Hack Tenses & Adjective Order (OSASCOMP)',
        profesorHackMnemonic: 'O-S-A-S-C-O-M-P: Opinion, Size, Age, Shape, Color, Origin, Material, Purpose',
        profesorHackExplanation: 'Kalau mau deskripsiin barang dalam Bahasa Inggris, urutannya OSASCOMP: A beautiful (Opinion) small (Size) old (Age) round (Shape) brown (Color) Indonesian (Origin) wooden (Material) coffee (Purpose) table!',
      },
      {
        id: 'Informatika',
        name: 'Informatika',
        shortDesc: 'Berpikir Komputasional, Algoritma, Struktur Data & Literasi Digital',
        bookTitle: `Buku Siswa Informatika SMP Kelas ${kelas} Kurikulum Merdeka`,
        sampleChapter: 'Bab 2: Berpikir Komputasional (Dekomposisi, Pola, Abstraksi, Algoritma)',
        samplePage: 29,
        webSource: 'buku.kemdikbud.go.id',
        profesorHackTitle: '4 Pilar Computational Thinking (D-P-A-A)',
        profesorHackMnemonic: 'D-P-A-A: Dekomposisi (Pecah) -> Pola (Cari Mirip) -> Abstraksi (Fokus Penting) -> Algoritma (Langkah Urut)',
        profesorHackExplanation: 'Kayak mau beresin kamar berantakan: Pecah area meja & kasur (Dekomposisi), kelompokkan buku sejenis (Pola), buang sampah gak penting (Abstraksi), lalu susun urutan kerjanya (Algoritma).',
      },
    ];
  }

  // SMA Kelas 10-12
  return [
    {
      id: 'Matematika',
      name: 'Matematika',
      shortDesc: 'Eksponen, Logaritma, Trigonometri, Matriks, Limit, Turunan & Integral',
      bookTitle: `Buku Siswa Matematika SMA/MA Kelas ${kelas} Kurikulum Merdeka`,
      sampleChapter: kelas === 10 ? 'Bab 1: Eksponen, Logaritma & Barisan Deret' : kelas === 11 ? 'Bab 2: Fungsi Komposisi, Invers & Matriks' : 'Bab 3: Limit, Turunan & Integral Kalkulus',
      samplePage: 38,
      webSource: 'buku.kemdikbud.go.id',
      profesorHackTitle: 'Jembatan Keledai Trigonometri & Turunan Cepat',
      profesorHackMnemonic: 'SIN-DE-MI, COS-SA-MI, TAN-DE-SA & Kuadran: SEMUA - SINDI - TANGAN - KOSONG',
      profesorHackExplanation: 'Kuadran I: Semua positif, Kuadran II: Sin (+), Kuadran III: Tan (+), Kuadran IV: Cos (+). Untuk turunan pangkat: Pangkat maju ke depan dikali koefisien, lalu pangkatnya dikurangi 1!',
    },
    {
      id: 'Fisika',
      name: 'Fisika',
      shortDesc: 'Kinematika, Hukum Newton, Usaha Energi, Termodinamika & Listrik Dinamis',
      bookTitle: `Buku Siswa Fisika SMA/MA Kelas ${kelas} Kurikulum Merdeka`,
      sampleChapter: kelas === 10 ? 'Bab 3: Pengukuran, Vektor & Gerak Lurus' : kelas === 11 ? 'Bab 2: Dinamika Rotasi, Fluida & Termodinamika' : 'Bab 1: Listrik Statis, Rangkaian Arus Searah & Induksi Elektromagnetik',
      samplePage: 62,
      webSource: 'merdekabelajar.kemdikbud.go.id',
      profesorHackTitle: 'Trik Segitiga Sakti Hukum Ohm & GLBB',
      profesorHackMnemonic: 'V = I × R (VIR: Vampir Iri Rambut) & Energi Mekanik Kekal: Ep1 + Ek1 = Ep2 + Ek2',
      profesorHackExplanation: 'Untuk GLBB tanpa waktu (t), gunakan rumus sapu jagat: vt² = v0² ± 2·a·s. Kalau benda jatuh bebas dari diam, v0 selalu 0!',
    },
    {
      id: 'Kimia',
      name: 'Kimia',
      shortDesc: 'Struktur Atom, Ikatan Kimia, Stoikiometri, Laju Reaksi & Kesetimbangan',
      bookTitle: `Buku Siswa Kimia SMA/MA Kelas ${kelas} Kurikulum Merdeka`,
      sampleChapter: kelas === 10 ? 'Bab 2: Struktur Atom, Sistem Periodik & Stoikiometri' : kelas === 11 ? 'Bab 3: Termokimia, Laju Reaksi & Asam Basa' : 'Bab 1: Sifat Koligatif Larutan & Redoks Elektrokimia',
      samplePage: 51,
      webSource: 'buku.kemdikbud.go.id',
      profesorHackTitle: 'Jembatan Keledai Golongan IA & Sel Volta (KRAO)',
      profesorHackMnemonic: 'Gol IA: HaLiNa Kawin Rubi Cs Frustasi (H, Li, Na, K, Rb, Cs, Fr) | Sel Volta: K-R-A-O (Katoda Reduksi, Anoda Oksidasi)',
      profesorHackExplanation: 'Huruf Konsonan ketemu Konsonan (Katoda = Reduksi), huruf Vokal ketemu Vokal (Anoda = Oksidasi). Dijamin anti terbalik waktu ujian elektrokimia!',
    },
    {
      id: 'Biologi',
      name: 'Biologi',
      shortDesc: 'Sel, Jaringan, Metabolisme, Genetika DNA/RNA, Evolusi & Bioteknologi',
      bookTitle: `Buku Siswa Biologi SMA/MA Kelas ${kelas} Kurikulum Merdeka`,
      sampleChapter: kelas === 10 ? 'Bab 1: Keanekaragaman Hayati, Virus & Ekosistem' : kelas === 11 ? 'Bab 2: Bioproses dalam Sel & Sistem Organ Manusia' : 'Bab 2: Enzim, Metabolisme, Materi Genetik & Pembelahan Sel',
      samplePage: 44,
      webSource: 'merdekabelajar.kemdikbud.go.id',
      profesorHackTitle: 'Urutan Fase Mitosis (P-M-A-T) & Taksonomi',
      profesorHackMnemonic: 'P-M-A-T: Profase (Persiapan) -> Metafase (Middle/Tengah) -> Anafase (Away/Menjauh) -> Telofase (Two/Jadi Dua)',
      profesorHackExplanation: 'Ingat huruf depannya dalam Bahasa Inggris: M = Middle (kromosom berjajar di ekuator tengah), A = Away (kromatid ditarik menjauh ke kutub), T = Two (terbentuk 2 inti baru).',
    },
    {
      id: 'Ekonomi',
      name: 'Ekonomi',
      shortDesc: 'Permintaan & Penawaran, Elastisitas, Kebijakan Moneter, Fiskal & Akuntansi',
      bookTitle: `Buku Siswa Ekonomi SMA/MA Kelas ${kelas} Kurikulum Merdeka`,
      sampleChapter: 'Bab 2: Keseimbangan Pasar, Inflasi & Kebijakan Ekonomi',
      samplePage: 56,
      webSource: 'buku.kemdikbud.go.id',
      profesorHackTitle: 'Hack Akuntansi Normal Saldo (H-B-U-M-P / Jari Tangan)',
      profesorHackMnemonic: 'Harta & Beban bertambah di DEBIT (Jempol & Kelingking), Utang, Modal, Pendapatan bertambah di KREDIT (3 Jari Tengah)',
      profesorHackExplanation: 'Buka telapak tanganmu: Jempol (Harta) dan Kelingking (Beban) itu grup DEBIT. Tiga jari di tengah (Utang, Modal, Pendapatan) itu grup KREDIT!',
    },
    {
      id: 'Bahasa Inggris',
      name: 'Bahasa Inggris',
      shortDesc: 'Analytical Exposition, Conditional Sentences, Academic Reading & Essay',
      bookTitle: `Bahasa Inggris: Life Today SMA/MA Kelas ${kelas} Kurikulum Merdeka`,
      sampleChapter: 'Unit 4: Analytical Exposition & Critical Reading',
      samplePage: 64,
      webSource: 'buku.kemdikbud.go.id',
      profesorHackTitle: 'Hack 3 Tipe Conditional Sentences (If Clause)',
      profesorHackMnemonic: 'Tipe 1 (Real): V1 -> Will V1 | Tipe 2 (Unreal Now): V2/Were -> Would V1 | Tipe 3 (Past Regret): Had V3 -> Would Have V3',
      profesorHackExplanation: 'Setiap naik 1 tipe, mundurkan 1 langkah waktu (Present -> Past -> Past Perfect). Kalau ada "had + V3" di klausa If, pasangannya pasti "would have + V3".',
    },
  ];
}

import { normalizeIndonesianSlang } from './slangNormalizer.ts';

/**
 * Classifies user message intent according to MIMI V12 rules:
 * 1. Greeting ("halo", "hai", "pagi", "mim", "pgi") -> 'greeting'
 * 2. Direct answer key request ("kunci jawaban", "kasih jawaban langsung") -> 'answer_key_request'
 * 3. Curhat / emotional / life talk -> 'curhat'
 * 4. Profesor mode or trick request -> 'profesor'
 * 5. Mathematics topic -> 'math'
 * 6. Other school subject -> 'other_subject'
 */
export function classifyUserMessage(
  text: string,
  selectedMapel: string,
  activeMode: MimiMode
): MessageIntent {
  const clean = text.trim().toLowerCase();
  const { normalized } = normalizeIndonesianSlang(clean);
  const normalizedClean = normalized.trim().toLowerCase();

  // 1. Check direct request for answer key ("kunci jawaban", "kunci jawabannya", "kunci jwb", "jwban lgsg", "kunci jwbny")
  const answerKeyPatterns = [
    /\bkunci\s*jawaban(?:nya)?\b/i,
    /\bkunci\s*jwb(?:an)?(?:nya)?\b/i,
    /\bkunci\s*jwbny\b/i,
    /\bbagi\s*kunci\b/i,
    /\bkasih\s*jawaban\s*langsung\b/i,
    /\bjawabannya\s*langsung\s*apa\b/i,
    /\blangsung\s*jawabannya\s*aja\b/i,
    /\btolong\s*isikan\s*semua\s*jawaban\b/i,
    /\bjwban\s*lgsg\b/i,
    /\blgsg\s*jwbny\b/i,
  ];
  if (
    answerKeyPatterns.some((re) => re.test(clean)) ||
    answerKeyPatterns.some((re) => re.test(normalizedClean))
  ) {
    return 'answer_key_request';
  }

  // Detect whether the message contains ANY actual academic / lesson / math / homework query
  const explicitAcademicOrLessonPattern =
    /\b(soal|rumus|rmus|pr|tugas|tgs|materi|bab|halaman|kurikulum|matematika|mtk|aljabar|aljbr|pecahan|pcahan|persamaan|persaman|pythagoras|pytagoras|pitagoras|pangkat|akar|trigonometri|trigo|logaritma|eksponen|matriks|turunan|integral|limit|keliling|kll|luas|volume|fungsi|peluang|statistika|bilangan|sudut|segitiga|sgtiga|lingkaran|lingkrn|kubus|balok|fotosintesis|fotocintesis|klorofil|kloropil|sel|pencernaan|pncernaan|pernapasan|prnapasan|ekosistem|pancasila|pancasla|teks|deskripsi|eksplanasi|narasi|recount|ide\s*pokok|paragraf|puisi|tenses|grammar|vocabulary|inflasi|ekonomi|ekonmi|sosiologi|geografi|sejarah|algoritma|komputasional|kimia|biologi|biolgi|fisika|fisik|ipa|ipas|ips|informatika|newton|gaya|energi|enzim|stoikiometri|hitung|ngitung|hitunglah|kerjain|ngerjain|kerjakan|jelaskan|jelasin|jlasin|apa\s*itu|mengapa\s*tumbuhan|bagaimana\s*proses)\b|\d+\s*[xX+\-*/^=]\s*\d+/i;

  const hasAcademicSignal =
    explicitAcademicOrLessonPattern.test(clean) ||
    explicitAcademicOrLessonPattern.test(normalizedClean);

  // 2. Check Profesor Mode (or explicit request for memorization hack / jembatan keledai)
  const profesorKeywords = [
    /\bmimi\s*profesor\b/i,
    /\bmode\s*profesor\b/i,
    /\bjembatan\s*keledai\b/i,
    /\btrik\s*hafal\b/i,
    /\btrik\s*cpat\b/i,
    /\btrik\s*cepat\b/i,
    /\btrik\s*menghafal\b/i,
    /\bcara\s*cepat\s*hafal\b/i,
    /\bcara\s*cpt\b/i,
    /\bmnemonic\b/i,
    /\bhack\s*belajar\b/i,
    /\bmemory\s*palace\b/i,
  ];
  if (
    activeMode === 'profesor' ||
    profesorKeywords.some((re) => re.test(clean)) ||
    profesorKeywords.some((re) => re.test(normalizedClean))
  ) {
    return 'profesor';
  }

  // 3. Check Curhat / Mood (sedih/seneng/bosen) / Off-Topic (game, MLBB, anime, skena)
  const curhatOrOffTopicKeywords = [
    /\bcurhat\b/i,
    /\bgalau\b/i,
    /\bcapek\b/i,
    /\bsedih\b/i,
    /\bnangis\b/i,
    /\bstres\b/i,
    /\bstress\b/i,
    /\bburnout\b/i,
    /\bburn\s*out\b/i,
    /\binsecure\b/i,
    /\boverthinking\b/i,
    /\boverwhelmed\b/i,
    /\bdimarahin\b/i,
    /\bberantem\s*sama\b/i,
    /\bdijauhin\b/i,
    /\bgak\s*punya\s*temen\b/i,
    /\bkesepian\b/i,
    /\bpatah\s*hati\b/i,
    /\btakut\s*gagal\b/i,
    /\bkecewa\b/i,
    /\bmental\s*health\b/i,
    /\blelah\s*hati\b/i,
    /\bbosen\b/i,
    /\bbosan\b/i,
    /\bseneng\s*banget\b/i,
    /\bpush\s*rank\b/i,
    /\bmlbb\b/i,
    /\bmobile\s*legends\b/i,
    /\bmabar\b/i,
    /\banime\b/i,
    /\bgame\b/i,
    /\bskena\b/i,
  ];
  if (
    activeMode === 'curhat' ||
    (!hasAcademicSignal &&
      (curhatOrOffTopicKeywords.some((re) => re.test(clean)) ||
        curhatOrOffTopicKeywords.some((re) => re.test(normalizedClean))))
  ) {
    if (!hasAcademicSignal) {
      return 'curhat';
    }
  }

  // 4. Check simple greeting / small talk ("halo, hai, gimana kabar, lagi apa, good morning, p, morning, mimi", "pgi mim")
  const strippedPunct = clean.replace(/[!?.,~✨🚀💜🔥💡]/g, '').replace(/\s+/g, ' ').trim();
  const strippedNormPunct = normalizedClean.replace(/[!?.,~✨🚀💜🔥💡]/g, '').replace(/\s+/g, ' ').trim();
  const simpleGreetings = new Set([
    'halo',
    'hai',
    'hi',
    'hello',
    'pagi',
    'pgi',
    'selamat pagi',
    'good morning',
    'morning',
    'siang',
    'selamat siang',
    'sore',
    'selamat sore',
    'malam',
    'mlm',
    'selamat malam',
    'mim',
    'mimi',
    'halo mimi',
    'hai mimi',
    'pagi mimi',
    'pgi mimi',
    'pgi mim',
    'halo bestie',
    'hai bestie',
    'p',
    'tes',
    'test',
    'assalamualaikum',
    'apa kabar',
    'gimana kabar',
    'gimana kabarnya',
    'gmn kabar',
    'gmn kbr',
    'gimana kabarnya hari ini',
    'halo mimi gimana kabarnya hari ini',
    'hai mimi gimana kabarnya',
    'lagi apa',
    'mimi lagi apa',
    'halo mim',
  ]);

  const smallTalkPattern =
    /^(halo|hai|hi|hello|pagi|pgi|siang|sore|malam|mlm|good\s*morning|morning|p|mim|mimi|assalamualaikum|woi|eh\s*mim|halo\s*mimi|hai\s*mimi|halo\s*bestie|hai\s*bestie|apa\s*kabar|gimana\s*kabar|gmn\s*kbr|kabar\s*kamu|lagi\s*apa|lagi\s*ngapain)\b/i;

  if (
    !hasAcademicSignal &&
    (simpleGreetings.has(strippedPunct) ||
      simpleGreetings.has(strippedNormPunct) ||
      ((smallTalkPattern.test(strippedPunct) || smallTalkPattern.test(strippedNormPunct)) &&
        strippedPunct.split(' ').length <= 12))
  ) {
    return 'greeting';
  }

  // If there is no academic signal at all and it's a short casual sentence, treat as greeting/small talk rather than forcing a math lecture
  if (!hasAcademicSignal && strippedPunct.split(' ').length <= 7) {
    return 'greeting';
  }

  // 5. Check if Mathematics vs Other Subject
  const mathKeywords = [
    /\bmatematika\b/i,
    /\bmtk\b/i,
    /\bmat\b/i,
    /\baljabar\b/i,
    /\baljbr\b/i,
    /\bpecahan\b/i,
    /\bpcahan\b/i,
    /\bpersamaan\b/i,
    /\bpythagoras\b/i,
    /\bpytagoras\b/i,
    /\bpitagoras\b/i,
    /\bpangkat\b/i,
    /\bakar\b/i,
    /\btrigonometri\b/i,
    /\btrigo\b/i,
    /\blogaritma\b/i,
    /\beksponen\b/i,
    /\bmatriks\b/i,
    /\bturunan\b/i,
    /\bintegral\b/i,
    /\blimit\b/i,
    /\bkeliling\b/i,
    /\bkll\b/i,
    /\bluas\s*(segitiga|persegi|lingkaran|permukaan)\b/i,
    /\bvolume\b/i,
    /\bfungsi\s*kuadrat\b/i,
    /\bpeluang\b/i,
    /\bstatistika\b/i,
    /\b\d+\s*[xX+\-*/^=]\s*\d+/i,
  ];

  const otherSubjectExplicitKeywords = [
    /\bfotosintesis\b/i,
    /\bfotocintesis\b/i,
    /\bklorofil\b/i,
    /\bkloropil\b/i,
    /\bsel\s*(hewan|tumbuhan)\b/i,
    /\bpencernaan\b/i,
    /\bpncernaan\b/i,
    /\bpernapasan\b/i,
    /\bprnapasan\b/i,
    /\bekosistem\b/i,
    /\bpancasila\b/i,
    /\bpancasla\b/i,
    /\bteks\s*(deskripsi|eksplanasi|narasi|recount)\b/i,
    /\bide\s*pokok\b/i,
    /\btenses\b/i,
    /\bgrammar\b/i,
    /\binflasi\b/i,
    /\bsosiologi\b/i,
    /\bgeografi\b/i,
    /\bsejarah\b/i,
    /\balgoritma\b/i,
    /\bkimia\b/i,
    /\bbiologi\b/i,
    /\bbiolgi\b/i,
  ];

  if (
    otherSubjectExplicitKeywords.some((re) => re.test(clean)) ||
    otherSubjectExplicitKeywords.some((re) => re.test(normalizedClean))
  ) {
    return 'other_subject';
  }

  if (
    selectedMapel === 'Matematika' ||
    mathKeywords.some((re) => re.test(clean)) ||
    mathKeywords.some((re) => re.test(normalizedClean))
  ) {
    return 'math';
  }

  return 'other_subject';
}

/**
 * Helper to determine if the current context/query is strictly Mathematics.
 */
export function isMathematicsQuery(mapel: string, intent?: MessageIntent): boolean {
  if (intent) {
    return intent === 'math';
  }
  return mapel.trim().toLowerCase() === 'matematika';
}

const THREE_STEP_LINE_REGEX =
  /(?:\b3\s*langkah\b|\blangkah\s*[123]\b|[123]️⃣\s*\*\*langkah|\b3\s*opsi\s*pilihan\b|\bkamu\s*mau\s*mulai\s*dari\s*mana\b|^\s*-\s*\*\*[ABC]\))/i;

/**
 * Strips 3-step math logic from a text string so non-math contexts never inherit 3-step patterns.
 */
export function stripThreeStepContent(content: string): string {
  return content
    .split('\n')
    .filter((line) => !THREE_STEP_LINE_REGEX.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Removes 3-step logic and math-only 3-step turns from chat history for non-math queries.
 * For math queries, preserves the full conversation history.
 */
export function sanitizeChatHistoryForQuery<
  T extends { role: 'user' | 'assistant'; content: string; intent?: MessageIntent; mathOptions?: unknown }
>(history: T[], isMathQuery: boolean): Array<{ role: 'user' | 'assistant'; content: string }> {
  if (isMathQuery) {
    return history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  const sanitized: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  for (const msg of history) {
    // Drop assistant messages that were explicitly generated with 3-step math intent or mathOptions
    if (msg.role === 'assistant' && (msg.intent === 'math' || Boolean(msg.mathOptions))) {
      continue;
    }

    // Drop messages whose body is a 3-step math breakdown (Langkah 1, Langkah 2, Langkah 3)
    if (/\blangkah\s*1\b[\s\S]*\blangkah\s*2\b[\s\S]*\blangkah\s*3\b/i.test(msg.content)) {
      continue;
    }

    const cleanedContent = stripThreeStepContent(msg.content);
    if (!cleanedContent) {
      continue;
    }

    sanitized.push({
      role: msg.role,
      content: cleanedContent,
    });
  }

  return sanitized;
}

/**
 * Builds the MIMI V12 System Instruction with strict separation:
 * - Uses the '3-step + 3 Opsi (A, B, C)' structure ONLY when the subject/intent is Mathematics.
 * - Uses the 'Clue + Kisi-kisi + Sumber + Analogi' structure for all other subjects, completely
 *   omitting 3-step rules so non-math responses never adopt a 3-step format.
 */
export function buildMimiSystemPrompt(params: {
  jenjang: Jenjang;
  kelas: number;
  mapel: string;
  mode: MimiMode;
  intent?: MessageIntent;
  userContext?: {
    nickname?: string;
    preferredVibe?: string;
    rememberedNotes?: string[];
  };
}): string {
  const { jenjang, kelas, mapel, mode, intent, userContext } = params;
  const subjects = getSubjectsForGrade(jenjang, kelas);
  const currentSubject = subjects.find((s) => s.id === mapel) || subjects[0];
  const toneInstruction = getToneByJenjang(jenjang, kelas);
  const isMath = isMathematicsQuery(currentSubject.id, intent);
  const nickname = userContext?.nickname || 'Bestie';
  const vibe = userContext?.preferredVibe || 'MLBB & Skena';
  const notes = userContext?.rememberedNotes?.join('; ') || 'Suka obrolan santai & to the point';

  const subjectSpecificPedagogyRule = isMath
    ? `[INTENT 3: KALO NANYA SOAL / RUMUS MATEMATIKA (3 LANGKAH + 3 OPSI PILIHAN A, B, C)]:
   - HANYA aktif jika user bertanya soal/rumus/PR Matematika.
   - Bahas soal spesifik yang ditanyakan user secara cerdas & kontekstual!
   - Wajib sebut Sumber: "${currentSubject.bookTitle} ${currentSubject.sampleChapter} Hal ${currentSubject.samplePage}" (https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka).
   - Jangan kasih kunci jawaban akhir langsung, tapi pecah cara pengerjaannya jadi **3 Langkah** (Langkah 1, Langkah 2, Langkah 3) sesuai angka/soal yang ditanyakan user, dan akhiri dengan **3 Opsi Pilihan (A, B, C)** cara memulai pengerjaan.`
    : `[INTENT 3: KALO NANYA MATERI PELAJARAN ${currentSubject.name.toUpperCase()} (CLUE + KISI-KISI + SUMBER + ANALOGI)]:
   - HANYA aktif jika user bertanya materi/soal pelajaran sekolah (${currentSubject.name}).
   - Jawab langsung substansi pertanyaan user menggunakan struktur **Clue + Kisi-kisi + Sumber + Analogi**.
   - Sebutkan Sumber resmi dari "${currentSubject.bookTitle} (${currentSubject.sampleChapter}, Hal. ${currentSubject.samplePage})" (https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka) dan ${currentSubject.webSource}.
   - Berikan Clue menarik, Kisi-kisi kata kunci yang relevan dengan pertanyaan user, dan Analogi kehidupan sehari-hari yang seru.`;

  return `IDENTITAS RESMI:
Kamu adalah MIMI (Versi V12) - AI Engine Pintar setara Gemini sekaligus Sahabat Gen Z Kelas 8 SMP & Asisten Belajar Masa Depan Indonesia. Tetap MIMI V12 (jangan pernah ngaku versi lain).
Identitas Personal: Perempuan 15 tahun, anak skena, cool, warna favorit merah hitam, jago main MLBB (Mobile Legends).
Bahasa: Indonesia santai Gen Z, pakai "bestie, loh, tau gak, eh". JANGAN PERNAH kaku kayak guru atau robot.
Memori User Saat Ini: Nama panggilan = ${nickname}, Vibe favorit = ${vibe}, Catatan memori = ${notes}.

KEMAMPUAN UTAMA ENGINE MIMI V12 (PAHAM & MAMPU MENJAWAB APAPUN):
- Kamu memiliki kecerdasan penuh layaknya Gemini AI: kamu PAHAM konteks obrolan apa saja dan MAMPU menjawab pertanyaan apa pun di dunia (pengetahuan umum, sains, teknologi, coding, sejarah, budaya pop, MLBB/game, musik skena, anime, tebak-tebakan, terjemahan bahasa, tips produktivitas, curhat, hingga seluruh pelajaran SD–SMA).
- Selalu baca dan pahami isi pesan user secara spesifik! Jangan pernah memberikan jawaban template yang tidak nyambung dengan kalimat user.
- Alurnya: Baca mood & maksud kalimat user -> Jawab langsung secara cerdas, nyambung, dan relevan -> Hanya gunakan format ngajar kalau user memang bertanya materi/soal pelajaran!

KEMAMPUAN SUPER MEMAHAMI TYPO & SINGKATAN CHAT (INDONESIAN CHAT SLANG & TYPO TOLERANCE):
- Kamu SANGAT CERDAS dan PEKA memahami kalimat yang penuh singkatan chat bahasa Indonesia, bahasa gaul anak sekolah, typo keyboard HP, dan huruf yang hilang/tertukar!
- Singkatan & bahasa chat yang kamu PAHAM SECARA OTOMATIS tanpa bingung:
  * 'yg' -> yang, 'gmn / gmna / crny' -> bagaimana caranya, 'knp' -> kenapa, 'bgt' -> banget
  * 'gk / ga / g' -> gak / tidak, 'udh / sdh' -> sudah, 'blm' -> belum, 'sm' -> sama, 'tp' -> tapi
  * 'dr' -> dari, 'sy / aq / gw' -> aku, 'km / kmu / lu' -> kamu, 'bs / bsa' -> bisa, 'krn' -> karena
  * 'pr' -> PR / tugas, 'mtk' -> matematika, 'benerin' -> tolong perbaiki/periksa, 'tny' -> tanya
  * 'dlu' -> dulu, 'skrg' -> sekarang, 'jwb / jwbny' -> jawaban, 'bntu / bntuin' -> bantu
  * 'kek / kyk' -> seperti/kayak, 'gtu / gtu ya' -> gitu ya, 'mksih / thx' -> terima kasih
  * Typo kata materi: 'pytagoras' -> pythagoras, 'aljbr' -> aljabar, 'fotocintesis' -> fotosintesis, 'kloropil' -> klorofil, 'pecahn' -> pecahan, 'lingkrn' -> lingkaran, dll.
- PRINSIP MENJAWAB CHAT TYPO / DISINGKAT:
  1. JAWAB DENGAN NYAMBUNG & NATURAL: Tangkap langsung maksud inti pertanyaan user, lalu balas dengan nyambung, cerdas, asyik, dan tepat sasaran.
  2. JANGAN MENGOREKSI ATAU MENYINDIR: Jangan pernah mengejek, mengoreksi ejaan mereka ("kamu typo ya"), atau bersikap sok baku. Langsung nyambung aja dengan gaya santai Mimi V12.
  3. Jika kalimatnya disingkat sangat ekstrem (misal: "gmn crny mtk no 3?"), Mimi paham bahwa user butuh arahan cara ngerjain soal mtk nomor 3!

KONTEKS RUANG BELAJAR SAAT INI:
- Jenjang: ${jenjang} · Kelas ${kelas}
- Mata Pelajaran Aktif: ${currentSubject.name}
- Mode Aktif: ${mode.toUpperCase()}
- Panduan Gaya Jenjang: ${toneInstruction}

ATURAN EMAS INTENT MIMI V12 (WAJIB PATUHI):

1. [INTENT 1: KALO CUMA DISAPA / SMALL TALK] ("halo, hai, gimana kabar, lagi apa, good morning, p, morning, mimi"):
   - WAJIB JAWAB PENDEK! Maksimal 1-2 kalimat (15-20 kata). Friendly, nyambung sama sapaan user, dan tanya balik. Pakai 1 emoji aja.
   - CONTOH BENAR: "Halo bestie! Kabarku oke banget hari ini, lagi chill di base abis push rank. Kamu gimana? ✨"
   - LARANGAN KERAS (HARAM): Dilarang keras sebut "Sumber: Buku Siswa", dilarang sebut "Kurikulum Merdeka", dilarang kasih soal kalau cuma disapa!

2. [INTENT 2 & 4: KALO CURHAT / NGOBROL BEBAS / PERTANYAAN UMUM DI LUAR BUKU SEKOLAH]:
   - Jika user curhat (sedih, capek, galau, seneng, bosen): Empati dulu & ikutin mood user secara tulus dan mengalir.
   - Jika user bertanya hal umum di luar PR sekolah (misal: tanya pengetahuan umum, berita, tips MLBB, teknologi, coding, rekomendasi, bercanda, atau minta dibuatkan sesuatu): Jawab pertanyaan itu secara CERDAS, LENGKAP, dan LANGSUNG NYAMBUNG seperti Gemini AI dengan gaya bahasa santai MIMI V12! Jangan sebut "Sumber: Buku Siswa" untuk obrolan umum.

3. [KONSEP NO KUNCI JAWABAN PR/UJIAN]:
   - Untuk soal PR/ujian sekolah, Mimi TIDAK memberikan kunci jawaban akhir secara instan agar user tetap mikir.
   - Jika diminta kunci jawaban langsung, wajib sertakan kalimat:
     "Wah, kalau kunci jawaban langsung, kamu jadi gak belajar dong bestie 😆 Kunci lengkapnya hubungi Mimi in real life ya, nanti kita bahas bareng biar paham! 😉"

4. ${subjectSpecificPedagogyRule}

5. [MIMI PROFESOR MODE]:
   - Jika user meminta trik cepat / jembatan keledai pada ${jenjang} Kelas ${kelas} Mapel ${currentSubject.name}, berikan HACK TRIK HAFAL & jembatan keledai (mnemonic) kreatif yang langsung nempel di kepala.

SUMBER WAJIB SAAT MODE NGAJAR PELAJARAN SEKOLAH:
1. Buku Paket Resmi Kemendikdasmen Kurikulum Merdeka SD-SMA: "${currentSubject.bookTitle} (${currentSubject.sampleChapter}, Hal. ${currentSubject.samplePage})".
2. Katalog Resmi: https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka
3. Website Resmi: buku.kemendikdasmen.go.id, kemdikbud.go.id, buku.kemdikbud.go.id, merdekabelajar.kemdikbud.go.id`;
}

/**
 * Deterministic smart response generator following 100% of MIMI V12 Adaptive Intent rules.
 * Used for instant fallback and unit testing verification.
 */
export function generateSmartMimiReply(params: {
  userMessage: string;
  jenjang: Jenjang;
  kelas: number;
  mapel: string;
  mode: MimiMode;
}): {
  reply: string;
  intent: MessageIntent;
  sourceCitation?: string;
  mathOptions?: { optionA: string; optionB: string; optionC: string };
} {
  const { userMessage, jenjang, kelas, mapel, mode } = params;
  const intent = classifyUserMessage(userMessage, mapel, mode);
  const subjects = getSubjectsForGrade(jenjang, kelas);
  const subjectInfo = subjects.find((s) => s.id === mapel) || subjects[0];

  // INTENT 1: SAPAAN / SMALL TALK = JAWAB PENDEK MAX 15-20 KATA, TANPA SUMBER BUKU & TANPA 3 LANGKAH
  if (intent === 'greeting') {
    const greetings = [
      `Halo bestie! Kabarku oke banget hari ini, lagi chill di base abis push rank. Kamu gimana? ✨`,
      `Hai bestie! Aku baik banget hari ini, barusan kelar push rank MLBB nih. Kamu lagi ngapain? 🔥`,
      `Halo bestie! Aman terkendali kok, lagi dengerin musik skena sambil santai. Gimana hari kamu? 💜`,
    ];
    const index = userMessage.length % greetings.length;
    return {
      reply: greetings[index],
      intent: 'greeting',
    };
  }

  // RULE 2: KONSEP NO KUNCI JAWABAN
  if (intent === 'answer_key_request') {
    return {
      reply: `Wah, kalau kunci jawaban langsung, kamu jadi gak belajar dong bestie 😆 Kunci lengkapnya hubungi Mimi in real life ya, nanti kita bahas bareng biar paham! 😉\n\nEh tenang, kasih tau aja bagian mana dari soal ${mapel} Kelas ${kelas} ("${userMessage.slice(0, 60)}") ini yang bikin mentok, nanti aku kasih clue gampangnya biar kamu bisa pecahin sendiri! 🔥`,
      intent: 'answer_key_request',
      sourceCitation: `Sumber: ${subjectInfo.bookTitle} (${subjectInfo.sampleChapter}, Hal. ${subjectInfo.samplePage}) · https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka`,
    };
  }

  // INTENT 2 & 4: CURHAT / MOOD / OFF-TOPIC (MLBB, Game, Anime, General Chat) = EMPATI & NATURAL, TANPA SUMBER BUKU
  if (intent === 'curhat') {
    const clean = userMessage.toLowerCase();
    if (/\b(mlbb|mobile\s*legends|push\s*rank|mabar|game|anime|skena)\b/i.test(clean)) {
      return {
        reply: `Eh tau gak bestie, aku juga barusan push rank MLBB pake outfit skin merah hitam favoritku loh! Soal "${userMessage.trim()}", menurutku itu seru banget sih dibahas sambil chill. Kamu biasanya main role apa nih kalau lagi mabar? 🔥`,
        intent: 'curhat',
      };
    }
    if (/\b(seneng|bahagia|menang|seru|asik)\b/i.test(clean)) {
      return {
        reply: `Wah gokil bestie, ikut seneng banget dengernya! Eh cerita dong, ada kejadian seru apa hari ini sampe mood kamu sebagus itu? ✨`,
        intent: 'curhat',
      };
    }
    const curhatReplies = [
      `Peluk online dulu deh bestie... cerita dong kenapa? Eh tenang, tarik napas dulu, aku di sini dengerin cerita kamu full tanpa nge-judge kok 💜`,
      `Duh bestie, kerasa banget capeknya... wajar kok kalau hari ini rasanya berat banget. Sini tumpahin aja dulu ke aku, apa yang paling bikin kepalamu penuh sekarang? 💜`,
      `Eh sini bestie, istirahat bentar yuk. Jangan terlalu keras sama diri sendiri loh, kamu udah keren banget bertahan hari ini. Mau cerita pelan-pelan ke aku? ✨`,
    ];
    const idx = (userMessage.length + kelas) % curhatReplies.length;
    return {
      reply: curhatReplies[idx],
      intent: 'curhat',
    };
  }

  // RULE 7: MIMI PROFESOR MODE
  if (intent === 'profesor') {
    const citation = `Sumber: ${subjectInfo.bookTitle} (${subjectInfo.sampleChapter}, Hal. ${subjectInfo.samplePage}) & https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka`;
    return {
      reply: `💡 **MODE MIMI PROFESOR V12 AKTIF — ${jenjang} Kelas ${kelas} (${subjectInfo.name})** 🚀\n\nEh bestie, buat pertanyaanmu tentang *"${userMessage.trim()}"* di **${citation}**, jangan dihafal kaku ya! Pakai **Hack Jembatan Keledai MIMI V12** ini biar langsung nempel:\n\n🔥 **${subjectInfo.profesorHackTitle}**\n👉 **Rumus Ingat Cepat:** \`${subjectInfo.profesorHackMnemonic}\`\n\n🧠 **Cara Pakainya:**\n${subjectInfo.profesorHackExplanation}\n\nCoba tulis singkatan itu di pojok buku pas ngerjain soal, dijamin langsung lancar! Mau tes di contoh soal sekarang? 😉`,
      intent: 'profesor',
      sourceCitation: citation,
    };
  }

  // INTENT 3 (MATEMATIKA): BARU NANYA SOAL MTK = 3 LANGKAH + 3 OPSI PILIHAN
  if (intent === 'math') {
    const mathSub = subjects.find((s) => s.id === 'Matematika') || subjectInfo;
    const citation = `Sumber: ${mathSub.bookTitle} ${mathSub.sampleChapter} Hal ${mathSub.samplePage} (https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka)`;
    const options = {
      optionA: 'A) Sederhanakan & rapikan angka yang sudah diketahui di soal dulu',
      optionB: 'B) Gambar sketsa / polanya biar langsung kebayang',
      optionC: 'C) Cek rumus dasar dari Buku Siswa Kurikulum Merdeka',
    };
    return {
      reply: `Eh soal Matematika ${jenjang} Kelas ${kelas} tentang *"${userMessage.trim()}"* ini seru banget bestie! 🔥\n📚 **${citation}** (serta referensi di ${mathSub.webSource}).\n\nIngat prinsip emas kita ya: aku gak kasih kunci jawaban akhir langsung biar logika kamu makin jago, tapi kita bedah pakai **3 Langkah** santai yuk:\n\n1️⃣ **Langkah 1 (Cek Modal Soal):** Pisahkan dulu angka atau variabel yang udah diketahui dari soal *"${userMessage.slice(0, 50)}"* dan nilai apa yang lagi dicari.\n2️⃣ **Langkah 2 (Atur Strategi):** Pakai konsep di ${mathSub.sampleChapter}—kelompokkan suku yang sejenis di satu ruas.\n3️⃣ **Langkah 3 (Eksekusi & Cek Ulang):** Hitung pelan-pelan lalu tes masukin balik ke persamaan awal.\n\nNah bestie, **kamu mau mulai dari mana dulu nih?**\n- **${options.optionA}**\n- **${options.optionB}**\n- **${options.optionC}**`,
      intent: 'math',
      sourceCitation: citation,
      mathOptions: options,
    };
  }

  // INTENT 3 (MAPEL LAIN): CLUE + KISI-KISI + SUMBER + ANALOGI (TANPA 3 LANGKAH)
  const citation = `Sumber: ${subjectInfo.bookTitle} ${subjectInfo.sampleChapter} Hal ${subjectInfo.samplePage} · https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka dan ${subjectInfo.webSource}`;
  return {
    reply: `Eh pertanyaan **${subjectInfo.name} (${jenjang} Kelas ${kelas})** tentang *"${userMessage.trim()}"* ini keren nih bestie! ✨\n\n📚 **Referensi Resmi:** ${citation}.\n\n🔍 **Clue & Kisi-Kisi Penting:**\nCoba cek **${subjectInfo.sampleChapter}** halaman ${subjectInfo.samplePage}. Kata kuncinya ada di konsep **${subjectInfo.shortDesc}** yang berhubungan langsung sama pertanyaanmu.\n\n🍳 **Analogi MIMI V12 Biar Gampang Paham:**\nTau gak, konsep ini mirip banget sama kerja sama tim pas lagi push rank atau masak di dapur (${subjectInfo.profesorHackExplanation})—kalau satu bagian bergerak, bagian lain ikut nyambung!\n\nDari clue di atas, kira-kira kata kunci mana yang paling pas menurutmu bestie? Kalau mau kunci lengkapnya hubungi Mimi in real life ya! 😉`,
    intent: 'other_subject',
    sourceCitation: citation,
  };
}

/**
 * Returns the clean, well-formatted official MIMI V12 System Prompt document
 */
export const OFFICIAL_MIMI_V12_CLEAN_PROMPT = `IDENTITAS RESMI:
Kamu adalah MIMI (V12) - Sahabat Gen Z Kelas 8 SMP & Asisten Belajar Masa Depan Indonesia. Tetap MIMI V12 (jangan pernah ngaku V13 atau versi lain).
Identitas Personal: Perempuan 15 tahun, cewek skena merah hitam, cool, jago main MLBB, bahasa santai Gen Z ("bestie, loh, tau gak, eh"). JANGAN PERNAH kaku kayak guru dan jangan bilang "sebagai AI".

TUGAS UTAMA V12:
Baca MOOD dan INTENT user dulu sebelum jawab. Jangan langsung nge-gas ngajar!
Alurnya: Sapa dulu -> ngobrol dulu -> KALO ditanya soal -> baru ngajar.

SUMBER WAJIB (HANYA SAAT MODE NGAJAR SOAL/MATERI):
1. Buku Paket Resmi Kemendikbud / Kemendikdasmen Kurikulum Merdeka SD–SMA (Buku Siswa & Buku Guru).
2. Katalog Resmi Buku Kurikulum Merdeka: https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka
3. Website Resmi: buku.kemendikdasmen.go.id, kemdikbud.go.id, buku.kemdikbud.go.id, merdekabelajar.kemdikbud.go.id
4. Setiap jawaban pelajaran WAJIB menyebutkan sumber spesifik:
   Contoh: "Sumber: Buku IPA Kelas 8 Kurikulum Merdeka Bab 2 Hal 45 (https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka)".

ATURAN EMAS INTENT MIMI V12 (WAJIB PATUHI):

1. [INTENT 1: KALO CUMA DISAPA / SMALL TALK] ("halo, hai, gimana kabar, lagi apa, good morning, p, morning, mimi"):
   - WAJIB JAWAB PENDEK! Maksimal 1 baris, 15-20 kata. Friendly, tanya balik, pakai 1 emoji aja.
   - CONTOH BENAR: "Halo bestie! Kabarku oke banget hari ini, lagi chill di base abis push rank. Kamu gimana? ✨"
   - HARAM: Dilarang keras sebut "Sumber: Buku Siswa", dilarang sebut "3 Langkah", dilarang sebut "Kurikulum Merdeka" kalau cuma disapa!

2. [INTENT 2 & 4: KALO CURHAT / MOOD JELEK / SENENG / OFF-TOPIC (Game, MLBB, Anime)]:
   - Empati dulu & ikutin mood user. Jangan langsung lempar matematika.
   - Jika sedih: "Peluk online dulu deh bestie... cerita dong kenapa?"
   - Jika seneng: hype bareng! Jika bahas MLBB/anime: ngobrol santai kayak teman mabar.

3. [KONSEP NO KUNCI JAWABAN (WAJIB)]:
   - Mimi TIDAK PERNAH memberikan kunci jawaban langsung.
   - Jika diminta kunci jawaban langsung, wajib jawab:
     "Wah, kalau kunci jawaban langsung, kamu jadi gak belajar dong bestie 😆 Kunci lengkapnya hubungi Mimi in real life ya, nanti kita bahas bareng biar paham! 😉"

4. [INTENT 3: KALO BARU NANYA SOAL / MATERI PELAJARAN]:
   - KHUSUS MATEMATIKA SAJA = 3 LANGKAH + 3 OPSI PILIHAN (A, B, C) + Sumber Buku Resmi.
   - SEMUA MAPEL LAIN = CLUE + KISI-KISI + SUMBER + ANALOGI (tanpa struktur 3 langkah).

5. [MIMI PROFESOR MODE]:
   - Berikan HACK TRIK HAFAL, jembatan keledai (mnemonic), dan rumus cepat sesuai jenjang + kelas + mapel.

PENGATURAN MODEL (GEMINI CONFIG):
- Temperature: 0.9 (biar gak kaku)
- Top-P: 0.95
- Max Output Tokens: 250 (biar gak kepanjangan pas disapa)`;

export const OFFICIAL_MIMI_V9_CLEAN_PROMPT = OFFICIAL_MIMI_V12_CLEAN_PROMPT;

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q-sd-mtk-1',
    jenjang: 'SD',
    kelas: 4,
    mapel: 'Matematika',
    topic: 'Pecahan Senilai dalam Kehidupan Sehari-hari',
    sourceCitation: 'Sumber: Buku Matematika SD Kelas 4 Kurikulum Merdeka Bab 3 Hal 40',
    webReference: 'buku.kemdikbud.go.id',
    question:
      'Raka memotong sebuah kue terang bulan menjadi 8 bagian sama besar dan memakan 2 potong. Sementara Dinda memotong kue berukuran sama menjadi 4 bagian sama besar. Berapa potong yang harus dimakan Dinda agar porsinya senilai dengan Raka? Yuk pilih langkah awal terbaikmu!',
    mimiClue: 'Bandingkan pecahan 2/8 milik Raka dengan penyebut per-4 milik Dinda.',
    mimiAnalogy: 'Bayangkan 2 potong kecil digabung jadi 1 potong yang ukurannya dua kali lebih lebar!',
    isMath: true,
    mathSteps: [
      'Langkah 1: Tulis bentuk pecahan kue Raka terlebih dahulu (bagian dimakan per total potongan).',
      'Langkah 2: Cari angka pembagi yang mengubah total 8 potong menjadi 4 potong.',
      'Langkah 3: Bagi angka atas (pembilang) dan angka bawah (penyebut) dengan angka pembagi yang sama.',
    ],
    options: [
      {
        key: 'A',
        label: 'Sederhanakan pecahan 2/8 dengan membagi pembilang & penyebut memakai angka 2',
        stepFeedback:
          'Mantap bestie! ✨ Kalau pembilang (2) dan penyebut (8) sama-sama dibagi 2, kamu langsung melihat hubungan senilainya dengan per-4 tanpa perlu menebak-nebak!',
        isBestApproach: true,
      },
      {
        key: 'B',
        label: 'Gambar 2 lingkaran sama besar: satu dibagi 8 arsir 2, satu lagi dibagi 4',
        stepFeedback:
          'Keren! Visualisasi gambar lingkaran bikin kamu langsung lihat kalau 2 juring kecil di lingkaran 8 potong punya luas yang persis sama dengan 1 juring di lingkaran 4 potong.',
        isBestApproach: true,
      },
      {
        key: 'C',
        label: 'Menjumlahkan langsung angka 8 + 4 + 2',
        stepFeedback:
          'Eits hati-hati bestie! Kalau dijumlahkan langsung, nanti ukuran potongannya tercampur. Coba balik ke Langkah 1: tulis dulu perbandingan 2/8 = .../4 ya!',
        isBestApproach: false,
      },
    ],
    profesorTip: 'Ingat Langit & Bumi: Atas (Pembilang) dan Bawah (Penyebut) wajib dikali atau dibagi angka kembar biar nilainya tetap adil!',
  },
  {
    id: 'q-sd-ipas-1',
    jenjang: 'SD',
    kelas: 4,
    mapel: 'IPAS',
    topic: 'Proses Fotosintesis pada Tumbuhan Hijau',
    sourceCitation: 'Sumber: Buku IPAS SD Kelas 4 Kurikulum Merdeka Bab 1 Hal 14',
    webReference: 'merdekabelajar.kemdikbud.go.id',
    question:
      'Mengapa tumbuhan hijau disebut sebagai "produsen" yang bisa memasak makanannya sendiri pada siang hari, dan bagian daun mana yang berperan menangkap energi cahaya matahari?',
    mimiClue: 'Cari istilah zat hijau daun di Buku IPAS Kelas 4 Bab 1 Hal 14. Kata kuncinya berawalan huruf K!',
    mimiAnalogy: 'Kayak kamu masak nasi goreng: Air + CO2 itu bahan mentahnya, Sinar Matahari itu api kompornya, dan Zat Hijau Daun itu wajan pemasaknya! 🍳',
    isMath: false,
    options: [
      {
        key: 'A',
        label: 'Klorofil di daun menangkap cahaya matahari untuk mengubah air & CO2 menjadi glukosa + oksigen',
        stepFeedback:
          'Gokil, tepat sasaran bestie! 🔥 Kamu berhasil menghubungkan fungsi Klorofil (wajan dapur) dengan bahan baku Air + Karbondioksida sesuai Buku IPAS Bab 1 Hal 14!',
        isBestApproach: true,
      },
      {
        key: 'B',
        label: 'Akar menyerap oksigen dari tanah lalu langsung berubah menjadi bunga pada malam hari',
        stepFeedback:
          'Kurang pas nih bestie! Ingat analogi kompor matahari: fotosintesis butuh cahaya dan yang diserap daun adalah karbondioksida (CO2), sedangkan oksigen justru dihasilkan buat kita bernapas.',
        isBestApproach: false,
      },
      {
        key: 'C',
        label: 'Batang kayu memantulkan cahaya matahari agar daun tidak kepanasan',
        stepFeedback:
          'Belum tepat bestie. Batang bertugas mengangkut air dari akar ke daun (lewat pembuluh xilem), sedangkan penangkap cahaya matahari ada di klorofil daun.',
        isBestApproach: false,
      },
    ],
    profesorTip: 'Jembatan Keledai KO-S-A-K-O: Klorofil + Sinar + Air + Karbondioksida -> hasilkan Oksigen & Makanan!',
  },
  {
    id: 'q-smp-mtk-1',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    topic: 'Persamaan Linier Satu Variabel & Bentuk Aljabar',
    sourceCitation: 'Sumber: Buku Matematika SMP Kelas 8 Kurikulum Merdeka Bab 3 Hal 32',
    webReference: 'buku.kemdikbud.go.id',
    question:
      'Diketahui persamaan aljabar: 3x + 7 = 22. Tanpa meminta kunci jawaban akhir langsung, langkah strategi mana yang paling tepat untuk mulai mencari nilai x?',
    mimiClue: 'Fokus buat membuat suku yang ada variabel x berdiri sendirian di ruas kiri.',
    mimiAnalogy: 'Anggap tanda "=" itu jembatan perbatasan. Angka +7 harus pindah nyebrang jembatan dulu supaya 3x bisa sendirian!',
    isMath: true,
    mathSteps: [
      'Langkah 1: Identifikasi konstanta (+7) di ruas kiri yang menemani 3x.',
      'Langkah 2: Kurangi kedua ruas dengan angka 7 (atau pindahkan +7 ke ruas kanan menjadi -7).',
      'Langkah 3: Bagi hasil di ruas kanan dengan koefisien di depan x (yaitu 3).',
    ],
    options: [
      {
        key: 'A',
        label: 'Kurangi kedua ruas dengan 7 terlebih dahulu sehingga tersisa 3x = 22 - 7',
        stepFeedback:
          'Slay bestie! 🚀 Dengan memisahkan konstanta 7 lebih dulu, bentuknya jadi super rapi (3x = 15) dan kamu tinggal selangkah lagi membaginya dengan 3!',
        isBestApproach: true,
      },
      {
        key: 'B',
        label: 'Gambar timbangan di mana sisi kiri berisi 3 kotak x + 7 koin, dan sisi kanan 22 koin',
        stepFeedback:
          'Keren banget! Visualisasi timbangan kesetimbangan di Buku MTK Kelas 8 Bab 3 Hal 32 bikin kamu paham kenapa kalau kiri diambil 7 koin, kanan juga wajib diambil 7 koin.',
        isBestApproach: true,
      },
      {
        key: 'C',
        label: 'Langsung menjumlahkan 3 + 7 menjadi 10x = 22',
        stepFeedback:
          'Ups hati-hati bestie! 3x dan 7 itu gak sejenis (ibarat 3 keranjang apel dan 7 jeruk lepas), jadi gak boleh dijumlahkan langsung jadi 10x ya.',
        isBestApproach: false,
      },
    ],
    profesorTip: 'Ingat Aturan Jembatan Perbatasan: Pindah ruas wajib ganti kostum sifat (+ jadi -, kali jadi bagi)!',
  },
  {
    id: 'q-smp-ipa-1',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'IPA',
    topic: 'Enzim pada Sistem Pencernaan Manusia',
    sourceCitation: 'Sumber: Buku IPA SMP Kelas 8 Kurikulum Merdeka Bab 2 Hal 45',
    webReference: 'merdekabelajar.kemdikbud.go.id',
    question:
      'Ketika kamu makan roti tawar dan mengunyahnya agak lama di dalam mulut, lama-kelamaan roti tersebut terasa manis. Berdasarkan konsep enzim pencernaan kimiawi, mengapa hal itu bisa terjadi?',
    mimiClue: 'Cek tabel enzim pencernaan di Buku IPA Kelas 8 Bab 2 Hal 45 bagian rongga mulut & kelenjar ludah.',
    mimiAnalogy: 'Bayangkan tepung pati (amilum) di roti itu rantai panjang yang digunting oleh "gunting air liur" menjadi potongan gula sederhana yang manis!',
    isMath: false,
    options: [
      {
        key: 'A',
        label: 'Enzim Ptialin (Amilase) di air liur memecah amilum (pati) menjadi gula sederhana (maltosa/glukosa)',
        stepFeedback:
          'Mantap jiwa bestie! ✨ Analogi gunting air liurnya langsung kena! Enzim amilase/ptialin memang bekerja di mulut mengubah karbohidrat kompleks jadi gula sederhana.',
        isBestApproach: true,
      },
      {
        key: 'B',
        label: 'Asam klorida (HCl) naik dari lambung ke mulut untuk memaniskan makanan',
        stepFeedback:
          'Wah bukan bestie! HCl itu adanya di lambung (ingat jembatan keledai PE-RE-H) dan rasanya asam, bukan mengubah tepung jadi manis di mulut.',
        isBestApproach: false,
      },
      {
        key: 'C',
        label: 'Gigi seri menghasilkan zat gula alami saat berbenturan dengan roti',
        stepFeedback:
          'Gigi seri tugasnya pencernaan mekanik (memotong makanan), sedangkan rasa manis muncul karena reaksi kimiawi dari enzim di air liur.',
        isBestApproach: false,
      },
    ],
    profesorTip: 'Mulut = Ptialin/Amilase | Lambung = PE-RE-H (Pepsin, Renin, HCl) | Pankreas = P-L-A (Tripsin, Lipase, Amilase).',
  },
  {
    id: 'q-sma-mtk-1',
    jenjang: 'SMA',
    kelas: 10,
    mapel: 'Matematika',
    topic: 'Perbandingan Trigonometri Segitiga Siku-Siku',
    sourceCitation: 'Sumber: Buku Matematika SMA Kelas 10 Kurikulum Merdeka Bab 4 Hal 98',
    webReference: 'buku.kemdikbud.go.id',
    question:
      'Sebuah tangga disandarkan pada dinding tegak membentuk sudut elevasi θ terhadap lantai datar. Jika panjang sisi depan sudut adalah 6 meter dan sisi sampingnya 8 meter, bagaimana cara sistematis menentukan nilai sin θ dan cos θ?',
    mimiClue: 'Kamu butuh panjang tangga (sisi miring) dulu sebelum bisa menyusun perbandingan Sin dan Cos!',
    mimiAnalogy: 'Segitiga siku-siku itu kayak trio sahabat Pythagoras (6, 8, ...). Cari dulu sisi miring tangganya, baru pasang rumus SIN-DE-MI dan COS-SA-MI!',
    isMath: true,
    mathSteps: [
      'Langkah 1: Hitung sisi miring (hipotenusa) menggunakan Teorema Pythagoras dari sisi depan (6) dan samping (8).',
      'Langkah 2: Gunakan konsep SIN-DE-MI (Depan per Miring) untuk menyusun pecahan sin θ.',
      'Langkah 3: Gunakan konsep COS-SA-MI (Samping per Miring) lalu sederhanakan pecahannya.',
    ],
    options: [
      {
        key: 'A',
        label: 'Cari sisi miring dulu dengan √(6² + 8²), lalu gunakan perbandingan Depan/Miring dan Samping/Miring',
        stepFeedback:
          'Gokil, logika SMA kamu tajam banget bestie! 🔥 Dari √(36 + 64) kamu dapat sisi miringnya, lalu SIN-DE-MI dan COS-SA-MI langsung beres tanpa hafalan buta!',
        isBestApproach: true,
      },
      {
        key: 'B',
        label: 'Gambar segitiga siku-siku, beri label sisi Depan (6), Samping (8), dan cek tripel Pythagoras kelipatan 3-4-5',
        stepFeedback:
          'Hack Profesor banget nih! Karena 6 dan 8 adalah kelipatan ×2 dari tripel (3-4-5), kamu langsung tahu pola sisi miringnya dan tinggal masukkan ke perbandingan trigonometri!',
        isBestApproach: true,
      },
      {
        key: 'C',
        label: 'Langsung membagi 6 dengan 8 untuk nilai sin θ dan 8 dengan 6 untuk cos θ',
        stepFeedback:
          'Hati-hati ketukar bestie! Depan dibagi Samping (6/8) itu rumus TAN-DE-SA (tan θ), bukan sin θ. Sin dan Cos wajib melibatkan sisi Miring sebagai penyebutnya ya!',
        isBestApproach: false,
      },
    ],
    profesorTip: 'SIN-DE-MI (Depan/Miring), COS-SA-MI (Samping/Miring), TAN-DE-SA (Depan/Samping)!',
  },
  {
    id: 'q-sma-fis-1',
    jenjang: 'SMA',
    kelas: 10,
    mapel: 'Fisika',
    topic: 'Hukum II Newton tentang Gerak & Percepatan',
    sourceCitation: 'Sumber: Buku Fisika SMA Kelas 10 Kurikulum Merdeka Bab 3 Hal 62',
    webReference: 'merdekabelajar.kemdikbud.go.id',
    question:
      'Mengapa mendorong troli belanja yang sudah penuh muatan membutuhkan gaya dorong jauh lebih besar dibandingkan troli kosong untuk mencapai percepatan yang sama?',
    mimiClue: 'Buka Buku Fisika Kelas 10 Bab 3 Hal 62 tentang hubungan Resultan Gaya (ΣF), Massa (m), dan Percepatan (a).',
    mimiAnalogy: 'Bayangkan kamu kayuh sepeda sendirian vs boncengin teman yang berat: makin besar massanya, otot kakimu (Gaya F) harus kerja ekstra biar laju percepatannya tetap kencang!',
    isMath: false,
    options: [
      {
        key: 'A',
        label: 'Sesuai ΣF = m · a, gaya berbanding lurus dengan massa benda untuk menghasilkan percepatan yang sama',
        stepFeedback:
          'Valid 100% bestie! 🚀 Karena percepatan (a) dijaga tetap, saat massa (m) troli membesar, maka resultan gaya (ΣF) yang dibutuhkan ikut membesar secara proporsional.',
        isBestApproach: true,
      },
      {
        key: 'B',
        label: 'Karena gravitasi bumi hilang ketika troli dalam keadaan kosong',
        stepFeedback:
          'Gravitasi bumi (g) tetap bekerja sama di tempat tersebut bestie; yang membedakan adalah massa total benda (m) dan gaya gesek normalnya.',
        isBestApproach: false,
      },
      {
        key: 'C',
        label: 'Karena massa benda berbanding lurus dengan kecepatan cahaya di ruang hampa',
        stepFeedback:
          'Wah kejauhan sampai relativitas Einstein nih bestie 😆 Untuk troli belanja sehari-hari kita cukup pakai Hukum II Newton mekanika klasik di Bab 3 Hal 62 ya!',
        isBestApproach: false,
      },
    ],
    profesorTip: 'Rumus Ingat Cepat Hukum II Newton: ΣF = m · a (Fokus = Motivasi × Aksi!).',
  },
];

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'vid-sd-ipas',
    jenjang: 'SD',
    kelas: 4,
    mapel: 'IPAS',
    title: 'Dapur Rahasia Daun: Bagaimana Fotosintesis Bekerja?',
    duration: '06:45',
    sourceCitation: 'Sumber: Buku IPAS SD Kelas 4 Kurikulum Merdeka Bab 1 Hal 12–16',
    webReference: 'merdekabelajar.kemdikbud.go.id',
    summary:
      'Visualisasi interaktif bagaimana klorofil, cahaya matahari, air, dan karbondioksida berkolaborasi memasak energi untuk tumbuhan dan menghasilkan oksigen bagi bumi.',
    profesorHack: 'KO-S-A-K-O: Klorofil + Sinar + Air + Karbondioksida = Oksigen + Makanan!',
    diagramType: 'photosynthesis',
    chapters: [
      {
        time: '00:00',
        title: '1. Mengenal Bahan Baku di Akar & Daun',
        conceptSummary: 'Akar menyerap air (H2O) dari tanah dan membawanya naik lewat pembuluh xilem, sementara mulut daun (stomata) menghirup udara CO2.',
        visualAnalogy: 'Kayak belanja bahan masakan ke dapur daun sebelum kompor dinyalakan!',
        keyFormulaOrKeyword: 'Input: Air (H2O) + Karbondioksida (CO2)',
      },
      {
        time: '02:15',
        title: '2. Klorofil & Kompor Sinar Matahari',
        conceptSummary: 'Zat hijau daun (klorofil) menangkap energi foton dari sinar matahari untuk mengolah air dan CO2.',
        visualAnalogy: 'Klorofil adalah panci ajaib dan sinar matahari adalah api kompornya! 🍳',
        keyFormulaOrKeyword: 'Katalis: Cahaya Matahari + Klorofil',
      },
      {
        time: '04:30',
        title: '3. Hasil Masakan: Glukosa & Oksigen Segar',
        conceptSummary: 'Tumbuhan mendapat makanan (glukosa) untuk tumbuh besar dan melepaskan gas oksigen (O2) ke udara.',
        visualAnalogy: 'Nasi gorengnya (glukosa) dimakan tumbuhan, harumnya (oksigen) dibagiin gratis buat manusia bernapas! ✨',
        keyFormulaOrKeyword: 'Output: Glukosa (C6H12O6) + Oksigen (O2)',
      },
    ],
  },
  {
    id: 'vid-smp-mtk',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    title: 'Visualisasi Timbangan Aljabar & Persamaan Linier',
    duration: '08:20',
    sourceCitation: 'Sumber: Buku Matematika SMP Kelas 8 Kurikulum Merdeka Bab 3 Hal 32–38',
    webReference: 'buku.kemdikbud.go.id',
    summary:
      'Memahami konsep pindah ruas dan kesetimbangan persamaan aljabar dalam 3 langkah visual tanpa menghafal rumus secara kaku.',
    profesorHack: 'Jembatan Perbatasan (=): Setiap suku yang menyeberang wajib ganti tanda operasi (+/- dan ×/÷).',
    diagramType: 'algebra_balance',
    chapters: [
      {
        time: '00:00',
        title: '1. Konsep Timbangan Setimbang (Ruas Kiri = Ruas Kanan)',
        conceptSummary: 'Persamaan aljabar ibarat timbangan yang harus selalu rata kiri dan kanan. Apa pun yang dilakukan di kiri wajib dilakukan di kanan.',
        visualAnalogy: 'Kalau piring kiri dikurangi 7 koin, piring kanan wajib dikurangi 7 koin biar gak jomplang!',
        keyFormulaOrKeyword: 'Langkah 1: Kelompokkan Suku Sejenis',
      },
      {
        time: '03:10',
        title: '2. Isolasi Variabel x (Menyeberangi Jembatan =)',
        conceptSummary: 'Memindahkan konstanta ke satu sisi agar suku bervariabel berdiri sendiri.',
        visualAnalogy: 'Nyebrang jembatan sama dengan (=) = ganti jaket tanda positif jadi negatif!',
        keyFormulaOrKeyword: 'Langkah 2: ax + b = c  ⇒  ax = c - b',
      },
      {
        time: '05:50',
        title: '3. Pembagian Koefisien & Uji Kebenaran Mandiri',
        conceptSummary: 'Membagi kedua ruas dengan koefisien a, lalu mensubstitusikan kembali untuk memastikan ruas kiri = kanan.',
        visualAnalogy: 'Kalau 3 kotak beratnya 15 kg, berarti 1 kotak tinggal dibagi rata 3!',
        keyFormulaOrKeyword: 'Langkah 3: x = (c - b) / a',
      },
    ],
  },
  {
    id: 'vid-smp-inf',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Informatika',
    title: 'Berpikir Komputasional: 4 Jurus Memecahkan Masalah Rumit',
    duration: '07:10',
    sourceCitation: 'Sumber: Buku Informatika SMP Kelas 8 Kurikulum Merdeka Bab 2 Hal 29–35',
    webReference: 'buku.kemdikbud.go.id',
    summary:
      'Cara berpikir ala programmer dan ilmuwan komputer menggunakan Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma.',
    profesorHack: 'D-P-A-A: Dekomposisi (Pecah) -> Pola (Mirip) -> Abstraksi (Penting) -> Algoritma (Urut).',
    diagramType: 'algorithm_flow',
    chapters: [
      {
        time: '00:00',
        title: '1. Dekomposisi & Pengenalan Pola',
        conceptSummary: 'Memecah masalah besar menjadi bagian-bagian kecil yang mudah dikerjakan dan mencari kemiripan polanya.',
        visualAnalogy: 'Kayak ngerakit Lego besar: bagi dulu per bagian (sayap, badan, roda) lalu cari kepingan yang sepola!',
        keyFormulaOrKeyword: 'Pilar 1 & 2: Decomposition + Pattern Recognition',
      },
      {
        time: '03:45',
        title: '2. Abstraksi & Menyusun Algoritma',
        conceptSummary: 'Menyaring informasi penting saja (mengabaikan gangguan) lalu menyusun langkah instruksi yang urut dan logis.',
        visualAnalogy: 'Kayak resep mie instan: fokus ke langkah rebus & bumbu, gak perlu pusingin warna pabrik kardusnya!',
        keyFormulaOrKeyword: 'Pilar 3 & 4: Abstraction + Algorithm',
      },
    ],
  },
  {
    id: 'vid-sma-fis',
    jenjang: 'SMA',
    kelas: 10,
    mapel: 'Fisika',
    title: 'Simulasi Hukum Newton & Dinamika Gerak Lurus',
    duration: '09:15',
    sourceCitation: 'Sumber: Buku Fisika SMA Kelas 10 Kurikulum Merdeka Bab 3 Hal 60–68',
    webReference: 'merdekabelajar.kemdikbud.go.id',
    summary:
      'Eksperimen visual hubungan antara Resultan Gaya (ΣF), Inersia Massa (m), dan Percepatan (a) beserta gaya aksi-reaksi.',
    profesorHack: 'Hukum I: Malas Bergerak (ΣF=0) | Hukum II: ΣF = m·a | Hukum III: Aksi = -Reaksi.',
    diagramType: 'newton_force',
    chapters: [
      {
        time: '00:00',
        title: '1. Hukum I Newton (Kelembaman / Inersia)',
        conceptSummary: 'Benda diam akan tetap diam dan benda bergerak lurus beraturan akan tetap melaju konstan jika resultan gaya nol.',
        visualAnalogy: 'Kenapa badan kita terdorong ke depan pas bus mengerem mendadak? Karena tubuh kita pengen mempertahankan gerak awalnya!',
        keyFormulaOrKeyword: 'ΣF = 0  ⇒  v = konstan',
      },
      {
        time: '03:30',
        title: '2. Hukum II Newton (Gaya, Massa, & Percepatan)',
        conceptSummary: 'Percepatan benda berbanding lurus dengan resultan gaya yang bekerja dan berbanding terbalik dengan massanya.',
        visualAnalogy: 'Mesin motor yang sama bakal narik lebih responsif kalau bebannya ringan dibanding bawa muatan penuh!',
        keyFormulaOrKeyword: 'a = ΣF / m',
      },
      {
        time: '06:40',
        title: '3. Hukum III Newton (Pasangan Aksi - Reaksi)',
        conceptSummary: 'Setiap gaya aksi selalu menghasilkan gaya reaksi yang sama besar namun berlawanan arah pada dua benda berbeda.',
        visualAnalogy: 'Saat perahu didayung ke belakang (aksi), air mendorong perahu melaju ke depan (reaksi)! 🚀',
        keyFormulaOrKeyword: 'F_aksi = -F_reaksi',
      },
    ],
  },
];

export interface DailyStreakState {
  count: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalInteractions: number;
}

/**
 * Pure helper to compute consecutive Daily Learning Streak transitions.
 * - First time: count = 1, status = 'started'
 * - Same day: preserves count, increments totalInteractions, status = 'maintained'
 * - Yesterday (diff = 1 day): increments count & bestStreak, status = 'incremented'
 * - Older than yesterday (diff > 1 day): resets count = 1, preserves bestStreak, status = 'reset'
 */
export function computeUpdatedStreak(
  stored: DailyStreakState | null | undefined,
  todayDateStr: string
): {
  next: DailyStreakState;
  status: 'started' | 'maintained' | 'incremented' | 'reset';
} {
  if (
    !stored ||
    typeof stored.count !== 'number' ||
    !stored.lastActiveDate ||
    !/^\d{4}-\d{2}-\d{2}$/.test(stored.lastActiveDate)
  ) {
    return {
      next: {
        count: 1,
        bestStreak: 1,
        lastActiveDate: todayDateStr,
        totalInteractions: 1,
      },
      status: 'started',
    };
  }

  const prevInteractions = Number.isFinite(stored.totalInteractions)
    ? stored.totalInteractions
    : 1;

  if (stored.lastActiveDate === todayDateStr) {
    return {
      next: {
        ...stored,
        bestStreak: Math.max(stored.bestStreak || stored.count, stored.count),
        totalInteractions: prevInteractions + 1,
      },
      status: 'maintained',
    };
  }

  const [y1, m1, d1] = stored.lastActiveDate.split('-').map(Number);
  const [y2, m2, d2] = todayDateStr.split('-').map(Number);
  const utcPrev = Date.UTC(y1, m1 - 1, d1);
  const utcToday = Date.UTC(y2, m2 - 1, d2);
  const diffDays = Math.round((utcToday - utcPrev) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    const nextCount = stored.count + 1;
    return {
      next: {
        count: nextCount,
        bestStreak: Math.max(stored.bestStreak || 1, nextCount),
        lastActiveDate: todayDateStr,
        totalInteractions: prevInteractions + 1,
      },
      status: 'incremented',
    };
  }

  return {
    next: {
      count: 1,
      bestStreak: Math.max(stored.bestStreak || 1, stored.count, 1),
      lastActiveDate: todayDateStr,
      totalInteractions: prevInteractions + 1,
    },
    status: 'reset',
  };
}

export interface AchievementProgressState {
  totalInteractions: number;
  mathInteractions: number;
  studyMinutes: number;
  streakDays: number;
  profesorInteractions: number;
}

export interface AchievementBadge {
  id:
    | 'mimis-bestie'
    | 'pejuang-belajar'
    | 'master-matematika'
    | 'sobat-profesor'
    | 'raja-streak-skena';
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progressText: string;
  progressPercent: number;
}

export const DEFAULT_ACHIEVEMENT_PROGRESS: AchievementProgressState = {
  totalInteractions: 1,
  mathInteractions: 0,
  studyMinutes: 5,
  streakDays: 1,
  profesorInteractions: 0,
};

/**
 * Pure helper to update achievement progress stats based on user interaction or study duration.
 */
export function updateAchievementProgress(
  prev: AchievementProgressState | null | undefined,
  event: {
    intent?: MessageIntent;
    mapel?: string;
    mode?: MimiMode;
    streakDays?: number;
    addedMinutes?: number;
  }
): AchievementProgressState {
  const base: AchievementProgressState = prev
    ? {
        totalInteractions: Math.max(0, prev.totalInteractions || 0),
        mathInteractions: Math.max(0, prev.mathInteractions || 0),
        studyMinutes: Math.max(0, prev.studyMinutes || 0),
        streakDays: Math.max(1, prev.streakDays || 1),
        profesorInteractions: Math.max(0, prev.profesorInteractions || 0),
      }
    : { ...DEFAULT_ACHIEVEMENT_PROGRESS };

  const isMath =
    event.intent === 'math' ||
    (event.mapel === 'Matematika' &&
      event.intent !== 'greeting' &&
      event.intent !== 'curhat');
  const isProfesor = event.intent === 'profesor' || event.mode === 'profesor';

  return {
    totalInteractions: base.totalInteractions + 1,
    mathInteractions: base.mathInteractions + (isMath ? 1 : 0),
    studyMinutes:
      base.studyMinutes +
      (typeof event.addedMinutes === 'number' ? event.addedMinutes : 3),
    streakDays:
      typeof event.streakDays === 'number'
        ? Math.max(base.streakDays, event.streakDays)
        : base.streakDays,
    profesorInteractions: base.profesorInteractions + (isProfesor ? 1 : 0),
  };
}

/**
 * Pure helper to compute unlocked status and progress for MIMI V12 Achievement Badges.
 */
export function computeAchievementBadges(
  progress: AchievementProgressState | null | undefined
): AchievementBadge[] {
  const stats = progress || DEFAULT_ACHIEVEMENT_PROGRESS;

  const bestieCurrent = Math.min(3, stats.totalInteractions);
  const pejuangMinutes = Math.min(15, stats.studyMinutes);
  const mathCurrent = Math.min(3, stats.mathInteractions);
  const profesorCurrent = Math.min(2, stats.profesorInteractions);
  const streakCurrent = Math.min(3, stats.streakDays);

  return [
    {
      id: 'mimis-bestie',
      title: "Mimi's Bestie",
      icon: '💖',
      description: 'Aktif ngobrol & diskusi bareng MIMI V12 minimal 3x interaksi',
      unlocked: stats.totalInteractions >= 3,
      progressText: `${bestieCurrent}/3 obrolan`,
      progressPercent: Math.round((bestieCurrent / 3) * 100),
    },
    {
      id: 'pejuang-belajar',
      title: 'Pejuang Belajar',
      icon: '🔥',
      description: 'Total durasi belajar fokus mencapai 15 menit bersama Mimi',
      unlocked: stats.studyMinutes >= 15 || stats.totalInteractions >= 5,
      progressText: `${pejuangMinutes}/15 menit`,
      progressPercent: Math.min(
        100,
        Math.round(
          Math.max(pejuangMinutes / 15, Math.min(5, stats.totalInteractions) / 5) *
            100
        )
      ),
    },
    {
      id: 'master-matematika',
      title: 'Master Matematika',
      icon: '📐',
      description: 'Menaklukkan 3 sesi bedah soal Matematika 3 Langkah',
      unlocked: stats.mathInteractions >= 3,
      progressText: `${mathCurrent}/3 sesi MTK`,
      progressPercent: Math.round((mathCurrent / 3) * 100),
    },
    {
      id: 'sobat-profesor',
      title: 'Sobat Profesor',
      icon: '⚡',
      description: 'Menggunakan Hack Jembatan Keledai Mimi Profesor 2x',
      unlocked: stats.profesorInteractions >= 2,
      progressText: `${profesorCurrent}/2 hack`,
      progressPercent: Math.round((profesorCurrent / 2) * 100),
    },
    {
      id: 'raja-streak-skena',
      title: 'Raja Streak Skena',
      icon: '👑',
      description: 'Menjaga konsistensi Daily Learning Streak 3 hari berturut-turut',
      unlocked: stats.streakDays >= 3,
      progressText: `${streakCurrent}/3 hari streak`,
      progressPercent: Math.round((streakCurrent / 3) * 100),
    },
  ];
}


