/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeIndonesianSlang } from '../src/lib/slangNormalizer.ts';
import {
  classifyUserMessage,
  generateSmartMimiReply,
  buildMimiSystemPrompt,
} from '../src/lib/mimiEngine.ts';

test('normalizeIndonesianSlang correctly expands common abbreviations and typos', () => {
  const result = normalizeIndonesianSlang('mim gmn crny ngerjain mtk aljbr no 3 benerin y');
  assert.equal(result.wasModified, true);
  // Should have expanded abbreviations
  assert.ok(result.normalized.includes('bagaimana'));
  assert.ok(result.normalized.includes('caranya'));
  assert.ok(result.normalized.includes('matematika'));
  assert.ok(result.normalized.includes('aljabar'));
  assert.ok(result.normalized.includes('perbaiki'));
});

test('normalizeIndonesianSlang fixes academic typos', () => {
  const input = 'rumus pytagoras sm fotocintesis kloropil pecahn';
  const result = normalizeIndonesianSlang(input);
  assert.ok(result.normalized.includes('pythagoras'));
  assert.ok(result.normalized.includes('fotosintesis'));
  assert.ok(result.normalized.includes('klorofil'));
  assert.ok(result.normalized.includes('pecahan'));
});

test('classifyUserMessage accurately detects intent for slang greeting', () => {
  const intent1 = classifyUserMessage('pgi mim gmn kbr', 'Matematika', 'belajar');
  assert.equal(intent1, 'greeting');

  const intent2 = classifyUserMessage('p', 'Matematika', 'belajar');
  assert.equal(intent2, 'greeting');
});

test('classifyUserMessage accurately detects math intent from abbreviated/typo input', () => {
  const intent = classifyUserMessage(
    'mim gmn crny ngerjain mtk aljbr 3x+5=20 benerin y',
    'Matematika',
    'belajar'
  );
  assert.equal(intent, 'math');
});

test('classifyUserMessage accurately detects curhat intent from slang input', () => {
  const intent = classifyUserMessage(
    'mim aq bosen bgt hr ini pgn curhat...',
    'Matematika',
    'belajar'
  );
  assert.equal(intent, 'curhat');
});

test('classifyUserMessage accurately detects answer key requests with slang', () => {
  const intent = classifyUserMessage(
    'kunci jwbny dong mim bwt pr mtk ku',
    'Matematika',
    'belajar'
  );
  assert.equal(intent, 'answer_key_request');
});

test('classifyUserMessage accurately detects profesor hack with abbreviations', () => {
  const intent = classifyUserMessage(
    'ad trik cpat hafal enzim lambung mim',
    'IPA',
    'belajar'
  );
  assert.equal(intent, 'profesor');
});

test('classifyUserMessage accurately detects science/other subject with typos', () => {
  const intent = classifyUserMessage(
    'ap it fotocintesis sm knp kloropil pnting bgt',
    'IPAS',
    'belajar'
  );
  assert.equal(intent, 'other_subject');
});

test('generateSmartMimiReply handles typo & slang input smoothly and connectedly', () => {
  const replyGreeting = generateSmartMimiReply({
    userMessage: 'pgi mim gmn kbr',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    mode: 'belajar',
  });
  assert.equal(replyGreeting.intent, 'greeting');
  assert.ok(replyGreeting.reply.toLowerCase().includes('halo bestie') || replyGreeting.reply.toLowerCase().includes('hai bestie'));

  const replyMath = generateSmartMimiReply({
    userMessage: 'gmn crny mtk aljbr no 3 benerin',
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    mode: 'belajar',
  });
  assert.equal(replyMath.intent, 'math');
  assert.ok(replyMath.mathOptions !== undefined);
  assert.ok(replyMath.reply.includes('Langkah 1'));
  assert.ok(replyMath.reply.includes('Langkah 2'));
  assert.ok(replyMath.reply.includes('Langkah 3'));
});

test('buildMimiSystemPrompt includes Indonesian chat slang and typo tolerance rules', () => {
  const prompt = buildMimiSystemPrompt({
    jenjang: 'SMP',
    kelas: 8,
    mapel: 'Matematika',
    mode: 'belajar',
  });
  assert.ok(prompt.includes('KEMAMPUAN SUPER MEMAHAMI TYPO & SINGKATAN CHAT'));
  assert.ok(prompt.includes('JAWAB DENGAN NYAMBUNG & NATURAL'));
  assert.ok(prompt.includes('JANGAN MENGOREKSI ATAU MENYINDIR'));
});
