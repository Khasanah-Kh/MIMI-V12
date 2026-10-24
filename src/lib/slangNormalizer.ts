/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Indonesian Chat Slang & Typo Normalizer for MIMI V12
 * Handles SMS/WhatsApp chat abbreviations, teen slang, missing vowels, and common mobile typos.
 */

export interface NormalizationResult {
  original: string;
  normalized: string;
  tokens: string[];
  detectedSlang: Array<{ original: string; replacement: string }>;
  wasModified: boolean;
}

// Map of common Indonesian abbreviations & chat slang to standard Indonesian
export const INDONESIAN_SLANG_MAP: Record<string, string> = {
  // Kata tanya & penghubung
  gmn: 'bagaimana',
  gmna: 'bagaimana',
  gimana: 'bagaimana',
  giman: 'bagaimana',
  crny: 'caranya',
  carany: 'caranya',
  cranya: 'caranya',
  cra: 'cara',
  knp: 'kenapa',
  knpa: 'kenapa',
  kenap: 'kenapa',
  ngapa: 'kenapa',
  knpp: 'kenapa',
  kpn: 'kapan',
  kpan: 'kapan',
  dmn: 'dimana',
  dimn: 'dimana',
  ap: 'apa',
  apaan: 'apa',
  apkh: 'apakah',
  apakah: 'apakah',
  yg: 'yang',
  yng: 'yang',
  yaitu: 'yaitu',
  krn: 'karena',
  karna: 'karena',
  krena: 'karena',
  tp: 'tapi',
  tpi: 'tapi',
  dgn: 'dengan',
  dg: 'dengan',
  sm: 'sama',
  sma: 'sama',
  dr: 'dari',
  dri: 'dari',
  utk: 'untuk',
  untk: 'untuk',
  bwt: 'buat',
  bt: 'buat',
  spy: 'supaya',
  agr: 'agar',

  // Subjek & Objek
  sy: 'aku',
  ak: 'aku',
  aq: 'aku',
  gw: 'aku',
  gua: 'aku',
  gue: 'aku',
  w: 'aku',
  km: 'kamu',
  kmu: 'kamu',
  lu: 'kamu',
  lo: 'kamu',
  loe: 'kamu',
  u: 'kamu',
  mrk: 'mereka',
  kita: 'kita',
  dy: 'dia',
  dia: 'dia',

  // Negasi & Waktu
  gk: 'tidak',
  ga: 'tidak',
  gak: 'tidak',
  g: 'tidak',
  ngga: 'tidak',
  nggak: 'tidak',
  tdk: 'tidak',
  bkn: 'bukan',
  bukan: 'bukan',
  udh: 'sudah',
  sdh: 'sudah',
  sudh: 'sudah',
  blm: 'belum',
  belom: 'belum',
  blom: 'belum',
  lg: 'lagi',
  lgi: 'lagi',
  dlu: 'dulu',
  dl: 'dulu',
  skrg: 'sekarang',
  skrang: 'sekarang',
  skr: 'sekarang',
  bsk: 'besok',
  bsok: 'besok',
  kmrn: 'kemarin',
  kmren: 'kemarin',
  hr: 'hari',
  ini: 'ini',
  td: 'tadi',
  tadi: 'tadi',

  // Kata Kerja & Aksi Belajar
  pr: 'pekerjaan rumah',
  tgs: 'tugas',
  mtk: 'matematika',
  mat: 'matematika',
  matematik: 'matematika',
  benerin: 'perbaiki',
  bnrin: 'perbaiki',
  bener: 'benar',
  bnr: 'benar',
  betul: 'benar',
  btul: 'benar',
  bntu: 'bantu',
  bntuin: 'bantu',
  bantuin: 'bantu',
  tlg: 'tolong',
  tlng: 'tolong',
  tny: 'tanya',
  nny: 'tanya',
  nnya: 'tanya',
  tanya: 'tanya',
  jwb: 'jawab',
  jwban: 'jawaban',
  jwbny: 'jawabannya',
  jawaban: 'jawaban',
  kerjain: 'kerjakan',
  ngerjain: 'kerjakan',
  ngitung: 'hitung',
  itung: 'hitung',
  itng: 'hitung',
  jelasin: 'jelaskan',
  jlasin: 'jelaskan',
  kasi: 'kasih',
  ksih: 'kasih',
  ksh: 'kasih',
  kasih: 'kasih',
  plis: 'tolong',
  please: 'tolong',

  // Keterangan Sifat & Tingkat
  bgt: 'banget',
  bngt: 'banget',
  bgtt: 'banget',
  beneran: 'sungguhan',
  bnran: 'sungguhan',
  bnyk: 'banyak',
  byk: 'banyak',
  sdkt: 'sedikit',
  dikit: 'sedikit',
  plg: 'paling',
  plng: 'paling',
  cpt: 'cepat',
  cpat: 'cepat',
  gmpng: 'gampang',
  gampang: 'gampang',
  gmpg: 'gampang',
  susah: 'sulit',
  ssh: 'sulit',
  mumet: 'pusing',
  psng: 'pusing',
  bs: 'bisa',
  bsa: 'bisa',
  kyk: 'seperti',
  kek: 'seperti',
  kya: 'seperti',
  gtu: 'begitu',
  gitu: 'begitu',
  gt: 'begitu',
  gni: 'begini',
  gini: 'begini',
  aj: 'saja',
  aja: 'saja',
  doang: 'saja',
  sh: 'sih',
  sih: 'sih',
  dong: 'dong',
  dunk: 'dong',
  dah: 'sudah',
  deh: 'deh',

  // Sapaan & Sopan Santun
  halo: 'halo',
  hai: 'hai',
  p: 'halo',
  pgi: 'pagi',
  pagi: 'pagi',
  siang: 'siang',
  sore: 'sore',
  mlm: 'malam',
  mim: 'mimi',
  mksih: 'terima kasih',
  makasih: 'terima kasih',
  mksh: 'terima kasih',
  makasi: 'terima kasih',
  thx: 'terima kasih',
  ty: 'terima kasih',
  tengkyu: 'terima kasih',

  // Curhat & Emosi
  bosen: 'bosan',
  bosan: 'bosan',
  galau: 'galau',
  galw: 'galau',
  capek: 'lelah',
  cape: 'lelah',
  cpe: 'lelah',
  mager: 'malas gerak',
  kesel: 'kesal',
  ksel: 'kesal',
  stres: 'stres',
  stress: 'stres',
  sedih: 'sedih',
  sdh2: 'sedih',
  seneng: 'senang',
  sneng: 'senang',
  bahagia: 'senang',
};

// Common subject typos and academic keywords
export const ACADEMIC_TYPO_MAP: Record<string, string> = {
  // Matematika
  pytagoras: 'pythagoras',
  pitagoras: 'pythagoras',
  pytagors: 'pythagoras',
  pythagors: 'pythagoras',
  aljbr: 'aljabar',
  aljabr: 'aljabar',
  aljbrr: 'aljabar',
  persaman: 'persamaan',
  persmaan: 'persamaan',
  prsamaan: 'persamaan',
  pecahn: 'pecahan',
  pcahan: 'pecahan',
  pcahn: 'pecahan',
  trigo: 'trigonometri',
  trigonometi: 'trigonometri',
  logritma: 'logaritma',
  logaritme: 'logaritma',
  eksponn: 'eksponen',
  ekspon: 'eksponen',
  matrik: 'matriks',
  lingkrn: 'lingkaran',
  lingkarn: 'lingkaran',
  sgtiga: 'segitiga',
  sgitiga: 'segitiga',
  persegi: 'persegi',
  volum: 'volume',
  keliling: 'keliling',
  kliling: 'keliling',
  kll: 'keliling',
  rumus: 'rumus',
  rmus: 'rumus',
  rms: 'rumus',

  // IPA & IPAS
  fotosintesa: 'fotosintesis',
  fotocintesis: 'fotosintesis',
  fotosintsis: 'fotosintesis',
  fotosintesi: 'fotosintesis',
  kloropil: 'klorofil',
  klorofil: 'klorofil',
  klrofil: 'klorofil',
  tumbhan: 'tumbuhan',
  tumbhn: 'tumbuhan',
  pncernaan: 'pencernaan',
  pencernan: 'pencernaan',
  prnapasan: 'pernapasan',
  pernapasn: 'pernapasan',
  ekosistm: 'ekosistem',
  ekosistem: 'ekosistem',
  mitoss: 'mitosis',
  mitosis: 'mitosis',

  // IPS & Lainnya
  pancasila: 'pancasila',
  pancasla: 'pancasila',
  pncasila: 'pancasila',
  ekonmi: 'ekonomi',
  eknomi: 'ekonomi',
  biolgi: 'biologi',
  fisik: 'fisika',
  fisika: 'fisika',
  bhs: 'bahasa',
  inggris: 'inggris',
  ingris: 'inggris',
  bindo: 'bahasa indonesia',
  bing: 'bahasa inggris',
};

/**
 * Normalizes an Indonesian chat sentence by expanding abbreviations and correcting common typos.
 */
export function normalizeIndonesianSlang(text: string): NormalizationResult {
  if (!text || typeof text !== 'string') {
    return {
      original: '',
      normalized: '',
      tokens: [],
      detectedSlang: [],
      wasModified: false,
    };
  }

  const raw = text.trim();
  // Tokenize preserving spaces & punctuation
  const tokenRegex = /([a-zA-Z0-9_]+|[^\s\w]+|\s+)/g;
  const parts = raw.match(tokenRegex) || [];

  const detectedSlang: Array<{ original: string; replacement: string }> = [];
  const normalizedParts = parts.map((part) => {
    // Only process alphanumeric tokens
    if (!/^[a-zA-Z0-9_]+$/.test(part)) {
      return part;
    }

    const lower = part.toLowerCase();

    // Check academic typo map first
    if (ACADEMIC_TYPO_MAP[lower]) {
      const replacement = ACADEMIC_TYPO_MAP[lower];
      detectedSlang.push({ original: part, replacement });
      return replacement;
    }

    // Check general Indonesian slang map
    if (INDONESIAN_SLANG_MAP[lower]) {
      const replacement = INDONESIAN_SLANG_MAP[lower];
      detectedSlang.push({ original: part, replacement });
      return replacement;
    }

    return part;
  });

  const normalized = normalizedParts.join('');

  return {
    original: raw,
    normalized,
    tokens: normalized.split(/\s+/).filter(Boolean),
    detectedSlang,
    wasModified: detectedSlang.length > 0,
  };
}

/**
 * Generates an expanded context prompt note for Gemini or fallback intent classifiers.
 * E.g., if user writes "gmn crny mtk aljbr no 3 benerin ya",
 * this clarifies the exact intention: "bagaimana caranya matematika aljabar nomor 3 tolong perbaiki ya".
 */
export function buildSlangEnrichedContext(userMessage: string): string {
  const { normalized, detectedSlang, wasModified } = normalizeIndonesianSlang(userMessage);
  if (!wasModified) {
    return userMessage;
  }
  const slangSummary = detectedSlang
    .slice(0, 6)
    .map((s) => `"${s.original}" -> "${s.replacement}"`)
    .join(', ');

  return `${userMessage} (Makna/Terjemahan Singkatan: "${normalized}" [${slangSummary}])`;
}
