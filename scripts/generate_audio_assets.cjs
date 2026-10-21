const fs = require('fs');
const path = require('path');

const publicAudioDir = path.resolve(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(publicAudioDir)) {
  fs.mkdirSync(publicAudioDir, { recursive: true });
}

function createWavBuffer(sampleRate, durationSeconds, generateSample) {
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // 'fmt ' sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size for PCM
  buffer.writeUInt16LE(1, 20); // AudioFormat 1 = PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // 'data' sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sample = generateSample(t);
    // Clamp to -1.0 to 1.0
    sample = Math.max(-1.0, Math.min(1.0, sample));
    const intSample = Math.floor(sample < 0 ? sample * 32768 : sample * 32767);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}

const sampleRate = 22050;
const duration = 12; // 12 seconds seamless loop

// 1. Maand Sarangi & Tanpura (Raag Mand in C# - Sa 138.59Hz, Pa 207.65Hz, Ga 174.61Hz, Dha 233.08Hz)
const maandWav = createWavBuffer(sampleRate, duration, (t) => {
  const drone = 0.35 * Math.sin(2 * Math.PI * 138.59 * t) +
                0.20 * Math.sin(2 * Math.PI * 277.18 * t) +
                0.15 * Math.sin(2 * Math.PI * 207.65 * t);
  const phrase = Math.floor((t % 6) / 1.5);
  const notes = [138.59, 174.61, 207.65, 233.08]; // Sa, Ga, Pa, Dha
  const freq = notes[phrase];
  const sarangi = 0.25 * (
    Math.sin(2 * Math.PI * freq * t) +
    0.5 * Math.sin(2 * Math.PI * freq * 2 * t) +
    0.25 * Math.sin(2 * Math.PI * freq * 3 * t)
  );
  const vibrato = 1.0 + 0.05 * Math.sin(2 * Math.PI * 5 * t);
  return (drone + sarangi * vibrato) * 0.7;
});
fs.writeFileSync(path.join(publicAudioDir, 'maand_sarangi.wav'), maandWav);
console.log('Created: maand_sarangi.wav');

// 2. Pandavani Tambura (Chhattisgarhi epic chanting - rhythmic strum in C: Sa 130.81Hz, Pa 196Hz)
const pandavaniWav = createWavBuffer(sampleRate, duration, (t) => {
  const step = Math.floor((t * 2.5) % 4);
  const pitches = [196.00, 130.81, 130.81, 65.41]; // Pa, Sa, Sa, Kharaj Sa
  const subT = (t * 2.5) % 1;
  const strumDecay = Math.exp(-subT * 3.5);
  const strum = (Math.sin(2 * Math.PI * pitches[step] * t) + 0.4 * Math.sin(2 * Math.PI * pitches[step] * 2 * t)) * strumDecay;
  const kartal = 0.08 * Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-subT * 8);
  return (strum + kartal) * 0.8;
});
fs.writeFileSync(path.join(publicAudioDir, 'pandavani_tambura.wav'), pandavaniWav);
console.log('Created: pandavani_tambura.wav');

// 3. Chhau Drums & Shehnai (Thunderous Dhamsa drum in 7/8 rhythm and piercing horn)
const chhauWav = createWavBuffer(sampleRate, duration, (t) => {
  const beat = (t * 3.5) % 7;
  const isAccent = beat < 1 || (beat >= 2 && beat < 3) || (beat >= 4 && beat < 5);
  const drumDecay = Math.exp(-(beat % 1) * 5);
  const dhamsaFreq = isAccent ? 55 : 75; // Low bass drum
  const dhamsa = Math.sin(2 * Math.PI * dhamsaFreq * t) * drumDecay * (isAccent ? 0.7 : 0.4);
  const dhol = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-(beat % 1) * 12) * 0.2;
  const shehnai = 0.15 * (Math.sin(2 * Math.PI * 440 * t) + 0.3 * Math.sin(2 * Math.PI * 880 * t));
  return (dhamsa + dhol + shehnai) * 0.85;
});
fs.writeFileSync(path.join(publicAudioDir, 'chhau_drums.wav'), chhauWav);
console.log('Created: chhau_drums.wav');

// 4. Baul Ektara & Ananda Lahari (Mystic wandering Baul rhythmic drone in D - Sa 146.83Hz, Pa 220Hz)
const baulWav = createWavBuffer(sampleRate, duration, (t) => {
  const beat = (t * 2) % 1; // 120 bpm pulse
  const pluckDecay = Math.exp(-beat * 4);
  const ektara = (Math.sin(2 * Math.PI * 146.83 * t) + 0.3 * Math.sin(2 * Math.PI * 293.66 * t)) * pluckDecay;
  const drone = 0.3 * Math.sin(2 * Math.PI * 220 * t) + 0.15 * Math.sin(2 * Math.PI * 146.83 * t);
  const bell = 0.05 * Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-beat * 6);
  return (drone * 0.45 + ektara * 0.5 + bell) * 0.75;
});
fs.writeFileSync(path.join(publicAudioDir, 'baul_ektara.wav'), baulWav);
console.log('Created: baul_ektara.wav');

// 5. Tholu Bommalata Puppetry (Deccan shadow puppetry bells, bronze kartal, and mridangam rhythm)
const tholuWav = createWavBuffer(sampleRate, duration, (t) => {
  const pulse = (t * 2.8) % 1;
  const cymbal = 0.15 * (Math.sin(2 * Math.PI * 2100 * t) + Math.sin(2 * Math.PI * 3300 * t)) * Math.exp(-pulse * 6);
  const mridangam = 0.35 * Math.sin(2 * Math.PI * 98 * t) * Math.exp(-pulse * 4);
  const drone = 0.2 * Math.sin(2 * Math.PI * 196 * t);
  return (cymbal + mridangam + drone) * 0.75;
});
fs.writeFileSync(path.join(publicAudioDir, 'tholu_puppetry.wav'), tholuWav);
console.log('Created: tholu_puppetry.wav');

// 6. Sattriya Flute & Khol (Assamese sacred Vaishnavite Borgeet atmosphere in G - Sa 196Hz)
const sattriyaWav = createWavBuffer(sampleRate, duration, (t) => {
  const phrase = Math.floor((t % 8) / 2);
  const ragaPitches = [196.00, 220.00, 246.94, 261.63]; // Sa, Re, Ga, Ma
  const freq = ragaPitches[phrase];
  const flute = 0.4 * (
    Math.sin(2 * Math.PI * freq * t) +
    0.2 * Math.sin(2 * Math.PI * freq * 2 * t)
  ) * (1.0 + 0.04 * Math.sin(2 * Math.PI * 4 * t));
  const tanpura = 0.25 * Math.sin(2 * Math.PI * 196 * t) + 0.15 * Math.sin(2 * Math.PI * 293.66 * t);
  return (flute + tanpura) * 0.75;
});
fs.writeFileSync(path.join(publicAudioDir, 'sattriya_flute.wav'), sattriyaWav);
console.log('Created: sattriya_flute.wav');

// 7. Madhubani Folk Bansuri (Mithila courtyard bamboo bansuri and gentle harmonium)
const madhubaniWav = createWavBuffer(sampleRate, duration, (t) => {
  const phrase = Math.floor((t % 6) / 1.5);
  const notes = [261.63, 293.66, 329.63, 392.00]; // C4, D4, E4, G4 (Maithili folk scale)
  const bansuri = 0.35 * (Math.sin(2 * Math.PI * notes[phrase] * t) + 0.15 * Math.sin(2 * Math.PI * notes[phrase] * 2 * t)) * (1.0 + 0.06 * Math.sin(2 * Math.PI * 4.5 * t));
  const harmonium = 0.2 * (Math.sin(2 * Math.PI * 130.81 * t) + Math.sin(2 * Math.PI * 196 * t));
  return (bansuri + harmonium) * 0.75;
});
fs.writeFileSync(path.join(publicAudioDir, 'madhubani_folk.wav'), madhubaniWav);
console.log('Created: madhubani_folk.wav');

// 8. Rogan Art Ambient (Kutch desert wind, meditative Santoor strums, and delicate brass stylus ring)
const roganWav = createWavBuffer(sampleRate, duration, (t) => {
  const pulse = (t * 1.5) % 1;
  const santoorNotes = [220.00, 277.18, 329.63, 440.00];
  const idx = Math.floor((t % 4));
  const santoor = 0.3 * Math.sin(2 * Math.PI * santoorNotes[idx] * t) * Math.exp(-pulse * 2.5);
  const windDrone = 0.2 * (Math.sin(2 * Math.PI * 110 * t) + 0.1 * Math.sin(2 * Math.PI * 165 * t));
  const stylusChime = 0.04 * Math.sin(2 * Math.PI * 2800 * t) * Math.exp(-pulse * 8);
  return (santoor + windDrone + stylusChime) * 0.75;
});
fs.writeFileSync(path.join(publicAudioDir, 'rogan_ambient.wav'), roganWav);
console.log('Created: rogan_ambient.wav');

console.log('All 8 distinct cultural audio tracks successfully generated in public/audio/');
