// npm run jingles (m2741) -- RENDER EVERY JINGLE ROW TO A WAV, from the SHIPPED text. Lifts index.html between `SC_JINGLE:START` / `:END`
// (the table AND the synth -- the same code the game plays), evaluates it in a blank headless page, renders each row through an
// OfflineAudioContext (44.1 kHz stereo) and writes audio/jingles/preview/<id>.wav (16-bit PCM), normalised to -1 dBFS peak.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), OUT = path.join(ROOT, 'audio/jingles/preview');
const req = createRequire(import.meta.url); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('no playwright'); process.exit(1); }
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), a = src.indexOf('// SC_JINGLE:START'), b = src.indexOf('// SC_JINGLE:END');
if (a < 0 || b < 0) { console.error('no SC_JINGLE markers'); process.exit(1); }
const code = src.slice(a, b);
fs.mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch(); const page = await browser.newPage();
await page.setContent('<html><body></body></html>');
const res = await page.evaluate(async code => { const note = () => {}; eval(code + '\nwindow.__J = { JINGLE, jPlay };'); const JJ = window.__J, out = [];
  for (const row of JJ.JINGLE.rows) { const sr = 44100, probe = new OfflineAudioContext(2, sr, sr), dur = JJ.jPlay(probe, probe.destination, row.id, 0) + 1.2;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * dur), sr); JJ.jPlay(ctx, ctx.destination, row.id, .05); const buf = await ctx.startRendering();
    const L = buf.getChannelData(0), R = buf.getChannelData(1); let pk = 1e-6; for (let i = 0; i < L.length; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
    const k = .89 / pk, n = L.length, dv = new DataView(new ArrayBuffer(44 + n * 4)), ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    ws(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); ws(8, 'WAVE'); ws(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true); dv.setUint32(24, sr, true); dv.setUint32(28, sr * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); ws(36, 'data'); dv.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) { dv.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i] * k)) * 32767, true); dv.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i] * k)) * 32767, true); }
    let bin = ''; const u8 = new Uint8Array(dv.buffer); for (let i = 0; i < u8.length; i += 32768) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 32768));
    out.push({ id: row.id, b64: btoa(bin), secs: +(n / sr).toFixed(2), peak: +pk.toFixed(3) }); }
  return out; }, code);
for (const r of res) { const f = path.join(OUT, r.id + '.wav'); fs.writeFileSync(f, Buffer.from(r.b64, 'base64')); console.log(r.id.padEnd(13), r.secs + ' s', 'raw peak ' + r.peak, '->', path.relative(ROOT, f)); }
await browser.close();
