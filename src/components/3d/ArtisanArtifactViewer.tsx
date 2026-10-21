import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Layers, Sun, Flame, Volume2, Hand, ZoomIn, ZoomOut, RefreshCw, Compass, Music, Play } from 'lucide-react';

interface ArtifactData {
  id: string;
  tabLabel: string;
  name: string;
  category: 'instrument' | 'craft' | 'mask' | 'puppet';
  tradition: string;
  region: string;
  masterKeeper: string;
  material: string;
  lineageAge: string;
  description: string;
  hasAudioSample: boolean;
}

const ARTIFACTS: ArtifactData[] = [
  {
    id: 'rogan',
    tabLabel: 'Rogan Kalam',
    name: 'Kutch Rogan Hand-Forged Kalam & Indigo Khadi',
    category: 'craft',
    tradition: 'Rogan Art',
    region: 'Nirona, Kutch, Gujarat',
    masterKeeper: 'Padma Shri Abdul Gafur Khatri',
    material: 'Boiled Castor-Seed Oil Paste, Hand-Forged Brass Stylus, Handloom Indigo Khadi, Natural Pigments',
    lineageAge: '400+ Years Khatri Lineage',
    description: 'The legendary brass stylus (Kalam) that spins vibrant, thread-like castor oil paste in mid-air onto raw fabric without ever touching the cloth directly. Notice the natural soapstone color dish holding raw saffron, vermillion, and emerald castor mounds.',
    hasAudioSample: false
  },
  {
    id: 'chhau',
    tabLabel: 'Chhau Mask',
    name: 'Purulia Asura Chhau Mythological Demon Mask',
    category: 'mask',
    tradition: 'Purulia Chhau Dance-Theatre',
    region: 'Charida Village, Purulia, West Bengal',
    masterKeeper: 'Guru Tarapada Mahato & Charida Mask Guild',
    material: 'Kasai River Alluvial Clay, Crimson Curved Horns with Golden Scorpions, Protruding Tongue, Jagged Fangs & Brass Nath',
    lineageAge: '300+ Years Artisan Guild',
    description: 'The authentic demon (Asura) mask of the Purulia Chhau martial dance tradition. Modeled directly from the master craft in Charida: features curved scarlet horns bearing sacred golden scorpions (Bichhi), fiery red eyes, sharp fangs, and an extended tongue with protective totem motifs.',
    hasAudioSample: true
  },
  {
    id: 'ektara',
    tabLabel: 'Baul Ektara',
    name: 'Baul Ektara Acoustic Resonator',
    category: 'instrument',
    tradition: 'Baul Mysticism',
    region: 'Birbhum & Nadia, Bengal',
    masterKeeper: 'Gouranga Das Baul',
    material: 'Seasoned Gourd Resonator, Split Bamboo Arms with Joints, Goat Parchment Face with Brass Studs, Rosewood Bridge & Steel String',
    lineageAge: '600+ Years Oral Transmission',
    description: 'The sacred one-stringed drone lute of wandering Baul mystics. Held in the right hand with a bronze ring plectrum, its resonant dried gourd vibrates with the primordial cosmic sound (Anahata Nada). Pluck the string to hear its acoustic resonance.',
    hasAudioSample: true
  },
  {
    id: 'tanpura',
    tabLabel: 'Miraj Tanpura',
    name: 'Miraj Heritage Tanpura (Tambura)',
    category: 'instrument',
    tradition: 'Hindustani Classical Riyaz',
    region: 'Miraj, Maharashtra',
    masterKeeper: 'Living Keepers of Miraj Guild',
    material: 'Special Pandharpur Gourd, Tun Wood Neck, Camel Bone Jawari Bridge with Red Silk Threads & 4 Brass/Steel Drone Strings',
    lineageAge: '350+ Years Luthier Guild',
    description: 'The foundation of all Indian classical music. Hand-crafted from giant dried gourds, its wide curved bridge creates the mesmerizing harmonic buzz (Jawari) that sustains meditation and vocal riyaz.',
    hasAudioSample: true
  },
  {
    id: 'sanjhi',
    tabLabel: 'Mathura Sanjhi',
    name: 'Mathura Sanjhi Sacred Paper Filigree Lantern',
    category: 'craft',
    tradition: 'Braj Sanjhi Art',
    region: 'Mathura & Vrindavan, Uttar Pradesh',
    masterKeeper: 'Shilp Guru Ram Soni',
    material: 'Handmade Acid-free Paper, Curved Steel Scissors (Kainchi), Glowing Candlelight Core, Botanical Pigments',
    lineageAge: '500+ Years Braj Vaishnav Lineage',
    description: 'The devotional paper-stenciling tradition of Braj, Uttar Pradesh. Hand-cut with curved scissors without pencil sketches, this illuminated hexagonal paper lantern reveals the sacred Kadamba trees, dancing peacocks, and temple arches of Vrindavan. Notice the master’s curved scissors resting on the pedestal.',
    hasAudioSample: true
  },
  {
    id: 'veena',
    tabLabel: 'Saraswati Veena',
    name: 'Thanjavur Saraswati Veena (Carnatic Divine Lute)',
    category: 'instrument',
    tradition: 'Carnatic Classical Sangeetham',
    region: 'Thanjavur, Tamil Nadu',
    masterKeeper: 'Smt. Jayanthi Kumaresh & Thanjavur Luthier Guild',
    material: 'Single-block Seasoned Jackwood (Palamaram), 24 Brass Frets in Wax Ledges, Carved Yali Dragon Scroll, Brass Auxiliary Suraikudam & Kudirai Jawari Bridge',
    lineageAge: '1000+ Years Vedic Transmission',
    description: 'The sacred divine instrument of Goddess Saraswati and the pinnacle of Indian classical string lutherie. Click directly on any of the 4 main melody strings or 3 side tala drone strings in 3D to hear their genuine Jawari resonance synthesized in real-time, or explore the 24 microtonal brass frets along the neck.',
    hasAudioSample: true
  }
];

// Helper: Generates realistic Mathura Sanjhi Paper Filigree Cutout Texture
function createSanjhiPaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm cream translucent handmade paper
  ctx.fillStyle = '#FDFBF4';
  ctx.fillRect(0, 0, 512, 512);

  // Scissor-cut negative space (rich deep cutouts)
  ctx.fillStyle = '#1C1917';

  // Temple Jali Arch border
  ctx.beginPath();
  ctx.arc(256, 180, 160, Math.PI, 0);
  ctx.lineTo(416, 480);
  ctx.lineTo(96, 480);
  ctx.closePath();
  ctx.stroke();

  // Sacred Kadamba Tree Arbor & Peacocks
  ctx.beginPath();
  ctx.arc(256, 220, 90, 0, Math.PI * 2);
  ctx.fill();

  // Fine lattice cut perforations (Jali)
  for (let y = 140; y <= 460; y += 22) {
    for (let x = 110; x <= 400; x += 22) {
      if ((x + y) % 44 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Golden edge filigree
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 472, 472);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Helper: Generates realistic Rogan Art Tree of Life Canvas Texture
function createRoganClothTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Base Indigo Dyed Khadi Fabric with woven cotton grain
  ctx.fillStyle = '#162238';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle cross-hatch fabric weave
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // 2. Outer Ornamental Rogan Border (Delicate White & Gold Dotwork)
  ctx.strokeStyle = '#E6B94D';
  ctx.lineWidth = 6;
  ctx.strokeRect(60, 60, 904, 904);

  ctx.strokeStyle = '#C85A32';
  ctx.lineWidth = 3;
  ctx.strokeRect(75, 75, 874, 874);

  // Fine Rogan perimeter dots
  ctx.fillStyle = '#FAF7F0';
  for (let x = 60; x <= 964; x += 24) {
    ctx.beginPath();
    ctx.arc(x, 60, 3.5, 0, Math.PI * 2);
    ctx.arc(x, 964, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 60; y <= 964; y += 24) {
    ctx.beginPath();
    ctx.arc(60, y, 3.5, 0, Math.PI * 2);
    ctx.arc(964, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Central Sacred Tree of Life (Kalpavriksha) & Peacock Floral Medallion
  const cx = 512;
  const cy = 512;

  // Concentric radiating petals
  const petals = 16;
  for (let p = 0; p < petals; p++) {
    const angle = (p / petals) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Golden Castor Oil Petal
    ctx.fillStyle = p % 2 === 0 ? '#E6B94D' : '#C85A32';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(35, 120, 0, 220);
    ctx.quadraticCurveTo(-35, 120, 0, 0);
    ctx.fill();

    // Saffron contour line
    ctx.strokeStyle = '#FAF7F0';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dotted embroidery ridge on petal
    ctx.fillStyle = '#FFFFFF';
    for (let d = 40; d <= 200; d += 25) {
      ctx.beginPath();
      ctx.arc(0, d, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Emerald green accent outer leaves
  for (let p = 0; p < petals; p++) {
    const angle = ((p + 0.5) / petals) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = '#2D6643';
    ctx.beginPath();
    ctx.arc(0, 270, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#E6B94D';
    ctx.beginPath();
    ctx.arc(0, 270, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Central Sun Medallion Core
  ctx.fillStyle = '#C85A32';
  ctx.beginPath();
  ctx.arc(cx, cy, 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E6B94D';
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FAF7F0';
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();

  // 4 Corner Traditional Paisleys (Kalka / Buti)
  const corners = [
    [180, 180, Math.PI * 0.25],
    [844, 180, Math.PI * 0.75],
    [844, 844, Math.PI * 1.25],
    [180, 844, Math.PI * 1.75]
  ];

  corners.forEach(([kx, ky, rot]) => {
    ctx.save();
    ctx.translate(kx, ky);
    ctx.rotate(rot);

    ctx.fillStyle = '#E6B94D';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(40, -50, 80, 20, 0, 90);
    ctx.bezierCurveTo(-80, 20, -40, -50, 0, 0);
    ctx.fill();

    ctx.strokeStyle = '#FAF7F0';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Helper: Generates realistic Purulia Chhau Crown Peacock Feather Texture
function createPeacockFeatherTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Emerald shimmering background with natural feather barbs
  ctx.fillStyle = '#183D29';
  ctx.fillRect(0, 0, 512, 512);

  // Radiating fine feather barbules
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.25)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 512; i += 6) {
    ctx.beginPath();
    ctx.moveTo(256, 480);
    ctx.lineTo(i, 80);
    ctx.stroke();
  }

  // Outer bronze-gold halo ring
  const gradOuter = ctx.createRadialGradient(256, 260, 70, 256, 260, 160);
  gradOuter.addColorStop(0, '#D97706');
  gradOuter.addColorStop(0.7, '#CA8A04');
  gradOuter.addColorStop(1, 'rgba(24, 61, 41, 0)');
  ctx.fillStyle = gradOuter;
  ctx.beginPath();
  ctx.arc(256, 260, 160, 0, Math.PI * 2);
  ctx.fill();

  // Vibrant Turquoise-Cerulean blue ring
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.arc(256, 255, 110, 0, Math.PI * 2);
  ctx.fill();

  // Royal Sapphire oval
  ctx.fillStyle = '#1E3A8A';
  ctx.beginPath();
  ctx.ellipse(256, 250, 85, 75, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner Velvet-Black Eye Pupil with Indigo Sheen
  ctx.fillStyle = '#09090B';
  ctx.beginPath();
  ctx.ellipse(256, 245, 55, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Center iridescence glint
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(245, 235, 8, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Helper: Generates realistic Goat Parchment Drumhead Texture
function createParchmentTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm aged parchment tone
  ctx.fillStyle = '#F5EFE1';
  ctx.fillRect(0, 0, 512, 512);

  // Organic leather grain variations
  ctx.fillStyle = 'rgba(180, 150, 110, 0.08)';
  for (let i = 0; i < 3000; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const s = Math.random() * 4 + 1;
    ctx.beginPath();
    ctx.arc(rx, ry, s, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tanned leather circumference border ring
  ctx.strokeStyle = '#8C4D24';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.stroke();

  // 16 Laced leather eyelets
  ctx.fillStyle = '#5C2D0C';
  for (let i = 0; i < 16; i++) {
    const theta = (i / 16) * Math.PI * 2;
    const ex = 256 + Math.cos(theta) * 238;
    const ey = 256 + Math.sin(theta) * 238;
    ctx.beginPath();
    ctx.arc(ex, ey, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// ==========================================
// SARASWATI VEENA ACOUSTIC & PHYSICAL SPECIFICATIONS
// ==========================================
export interface VeenaStringSpec {
  index: number;
  name: string;
  swara: string;
  noteLabel: string;
  baseFreq: number;
  type: 'steel' | 'brass' | 'wound' | 'tala';
  wireColor: number;
  wireRadius: number;
  baseZ: number;
  baseY: number;
  description: string;
}

const VEENA_STRINGS: VeenaStringSpec[] = [
  {
    index: 0,
    name: 'Sarani (1st Playing String)',
    swara: 'Madhya Sa',
    noteLabel: 'Shadjam (C4 - 261.6 Hz)',
    baseFreq: 261.63,
    type: 'steel',
    wireColor: 0xF0F0F0,
    wireRadius: 0.009,
    baseZ: 0.09,
    baseY: -0.835,
    description: '1st Melody String (High-tensile Steel, closest to fingers)'
  },
  {
    index: 1,
    name: 'Panchamam (2nd Playing String)',
    swara: 'Mandra Pa',
    noteLabel: 'Panchamam (G3 - 196.0 Hz)',
    baseFreq: 196.00,
    type: 'brass',
    wireColor: 0xD4AF37,
    wireRadius: 0.012,
    baseZ: 0.03,
    baseY: -0.835,
    description: '2nd Melody String (Golden Brass wire)'
  },
  {
    index: 2,
    name: 'Mandaram (3rd Playing String)',
    swara: 'Mandra Sa',
    noteLabel: 'Mandra Shadjam (C3 - 130.8 Hz)',
    baseFreq: 130.81,
    type: 'steel',
    wireColor: 0xCCCCCC,
    wireRadius: 0.015,
    baseZ: -0.03,
    baseY: -0.835,
    description: '3rd Melody String (Heavy Steel wire)'
  },
  {
    index: 3,
    name: 'Anumandaram (4th Playing String)',
    swara: 'Anu-mandra Pa',
    noteLabel: 'Anumandra Pa (G2 - 98.0 Hz)',
    baseFreq: 98.00,
    type: 'wound',
    wireColor: 0xB8860B,
    wireRadius: 0.021,
    baseZ: -0.09,
    baseY: -0.835,
    description: '4th Bass String (Heavy Wound Brass/Copper coil)'
  },
  {
    index: 4,
    name: 'Tala 1 (Pakka Sarani)',
    swara: 'Madhya Sa',
    noteLabel: 'Tala Shadjam (C4 - 261.6 Hz)',
    baseFreq: 261.63,
    type: 'tala',
    wireColor: 0xFFFFFF,
    wireRadius: 0.0075,
    baseZ: 0.16,
    baseY: -0.865,
    description: 'Side Drone String 1 (Rhythm / Talam)'
  },
  {
    index: 5,
    name: 'Tala 2 (Pakka Panchamam)',
    swara: 'Madhya Pa',
    noteLabel: 'Tala Panchamam (G4 - 392.0 Hz)',
    baseFreq: 392.00,
    type: 'tala',
    wireColor: 0xD4AF37,
    wireRadius: 0.0075,
    baseZ: 0.20,
    baseY: -0.865,
    description: 'Side Drone String 2 (Rhythm / Talam)'
  },
  {
    index: 6,
    name: 'Tala 3 (Tara Sarani)',
    swara: 'Tara Sa',
    noteLabel: 'Tara Shadjam (C5 - 523.3 Hz)',
    baseFreq: 523.25,
    type: 'tala',
    wireColor: 0xFFFFFF,
    wireRadius: 0.0065,
    baseZ: 0.24,
    baseY: -0.865,
    description: 'Side Drone String 3 (High Rhythm chime)'
  }
];

const CARNATIC_SARANI_SWARAS = [
  { fret: 0, swara: 'Sa', noteLabel: 'Shadjam (C4)', freq: 261.63 },
  { fret: 1, swara: 'Ri1', noteLabel: 'Suddha Rishabham (C#4)', freq: 277.18 },
  { fret: 2, swara: 'Ri2', noteLabel: 'Chatusruti Rishabham (D4)', freq: 293.66 },
  { fret: 3, swara: 'Ga2', noteLabel: 'Sadharana Gandharam (D#4)', freq: 311.13 },
  { fret: 4, swara: 'Ga3', noteLabel: 'Antara Gandharam (E4)', freq: 329.63 },
  { fret: 5, swara: 'Ma1', noteLabel: 'Suddha Madhyamam (F4)', freq: 349.23 },
  { fret: 6, swara: 'Ma2', noteLabel: 'Prati Madhyamam (F#4)', freq: 369.99 },
  { fret: 7, swara: 'Pa', noteLabel: 'Panchamam (G4)', freq: 392.00 },
  { fret: 8, swara: 'Dha1', noteLabel: 'Suddha Dhaivatam (G#4)', freq: 415.30 },
  { fret: 9, swara: 'Dha2', noteLabel: 'Chatusruti Dhaivatam (A4)', freq: 440.00 },
  { fret: 10, swara: 'Ni2', noteLabel: 'Kaisiki Nishadam (A#4)', freq: 466.16 },
  { fret: 11, swara: 'Ni3', noteLabel: 'Kakali Nishadam (B4)', freq: 493.88 },
  { fret: 12, swara: 'Tara Sa', noteLabel: 'Tara Shadjam (C5)', freq: 523.25 }
];

// Helper: Generates authentic Jackwood soundboard with Lotus Rosette Soundhole
function createVeenaFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm lustrous Jackwood (Artocarpus heterophyllus) grain
  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
  grad.addColorStop(0, '#8E4112');
  grad.addColorStop(0.6, '#6B2C07');
  grad.addColorStop(1, '#4A1D03');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle wood grain streaks
  ctx.strokeStyle = 'rgba(40, 15, 2, 0.25)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 512; i += 8) {
    ctx.beginPath();
    ctx.moveTo(0, i + Math.sin(i * 0.1) * 4);
    ctx.bezierCurveTo(150, i + 8, 350, i - 8, 512, i + 3);
    ctx.stroke();
  }

  // Central Sacred Rosette Soundhole (Carved Ivory / Bone Lotus Inlay)
  ctx.save();
  ctx.translate(256, 256);

  // Outer concentric inlay circles
  ctx.strokeStyle = '#F5EEDB';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.stroke();

  // Fine pearl bead dots along outer ring
  ctx.fillStyle = '#FDFBF7';
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
    const bx = Math.cos(a) * 105;
    const by = Math.sin(a) * 105;
    ctx.beginPath();
    ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 12-Petal Lotus Carved Soundhole filigree
  ctx.fillStyle = '#220E03';
  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#F5EEDB';
  for (let p = 0; p < 12; p++) {
    const ang = (p / 12) * Math.PI * 2;
    ctx.save();
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.ellipse(40, 0, 22, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Central brass stud
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Perimeter ivory rim filigree
  ctx.strokeStyle = '#F5EEDB';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 492, 492);

  return new THREE.CanvasTexture(canvas);
}

// Helper: Real-time Physical Acoustic Synthesis for Saraswati Veena
function playVeenaAcousticNote(
  freq: number,
  stringType: 'steel' | 'brass' | 'wound' | 'tala' = 'steel',
  pluckStrength: number = 1.0
) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Initial Metallic Plectrum Wire Transient (Meetu click)
    const clickOsc = ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(3200, now);
    clickOsc.frequency.exponentialRampToValueAtTime(800, now + 0.025);

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(stringType === 'brass' ? 2400 : 3800, now);
    clickFilter.Q.setValueAtTime(4.0, now);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.24 * pluckStrength, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.04);

    // 2. Harmonic Jawari Additive Profile
    const harmonicProfiles: Record<string, { multipliers: number[]; weights: number[]; decay: number }> = {
      steel: {
        multipliers: [1, 2, 3, 4, 5, 6, 7, 8],
        weights: [0.95, 0.70, 0.55, 0.38, 0.28, 0.18, 0.12, 0.08],
        decay: 4.2
      },
      brass: {
        multipliers: [1, 2, 3, 4, 5, 6],
        weights: [1.0, 0.75, 0.45, 0.30, 0.20, 0.10],
        decay: 3.8
      },
      wound: {
        multipliers: [1, 2, 3, 4, 5, 6, 7],
        weights: [1.1, 0.85, 0.60, 0.42, 0.25, 0.15, 0.09],
        decay: 4.8
      },
      tala: {
        multipliers: [1, 2, 3, 4, 5],
        weights: [0.85, 0.55, 0.40, 0.25, 0.15],
        decay: 2.2
      }
    };

    const profile = harmonicProfiles[stringType] || harmonicProfiles.steel;
    const duration = profile.decay;

    // Master Gain for this pluck
    const masterStringGain = ctx.createGain();
    masterStringGain.gain.setValueAtTime(0.0001, now);
    masterStringGain.gain.linearRampToValueAtTime(0.38 * pluckStrength, now + 0.006);
    masterStringGain.gain.exponentialRampToValueAtTime(0.22 * pluckStrength, now + 0.12);
    masterStringGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Jackwood Kudam Resonator Formant Body Filter
    const bodyFilter1 = ctx.createBiquadFilter();
    bodyFilter1.type = 'peaking';
    bodyFilter1.frequency.setValueAtTime(320, now);
    bodyFilter1.Q.setValueAtTime(3.2, now);
    bodyFilter1.gain.setValueAtTime(5.5, now);

    const bodyFilter2 = ctx.createBiquadFilter();
    bodyFilter2.type = 'peaking';
    bodyFilter2.frequency.setValueAtTime(1750, now);
    bodyFilter2.Q.setValueAtTime(2.8, now);
    bodyFilter2.gain.setValueAtTime(3.8, now);

    // Non-linear Waveshaping Curve (Curved brass plate Jawari buzz)
    const shaper = ctx.createWaveShaper();
    const n_samples = 256;
    const curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = (1.5 * x) / (1 + 0.5 * Math.abs(x));
    }
    shaper.curve = curve;
    shaper.oversample = '2x';

    masterStringGain.connect(shaper);
    shaper.connect(bodyFilter1);
    bodyFilter1.connect(bodyFilter2);
    bodyFilter2.connect(ctx.destination);

    // Additive harmonics with micro-gamaka deflection
    profile.multipliers.forEach((mult, idx) => {
      const hFreq = freq * mult;
      if (hFreq > 14000) return;

      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';

      const initialBend = freq * (idx === 0 ? 0.008 : 0.004);
      osc.frequency.setValueAtTime(hFreq + initialBend, now);
      osc.frequency.exponentialRampToValueAtTime(hFreq, now + 0.07);

      const harmonicGain = ctx.createGain();
      const hWeight = profile.weights[idx];
      const hDuration = Math.max(0.6, duration / Math.sqrt(mult));

      harmonicGain.gain.setValueAtTime(0.0001, now);
      harmonicGain.gain.linearRampToValueAtTime(hWeight, now + 0.005);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + hDuration);

      osc.connect(harmonicGain);
      harmonicGain.connect(masterStringGain);

      osc.start(now);
      osc.stop(now + hDuration + 0.1);
    });
  } catch {}
}

interface ArtisanArtifactViewerProps {
  onLearnMore?: (traditionId: string) => void;
}

export const ArtisanArtifactViewer: React.FC<ArtisanArtifactViewerProps> = ({ onLearnMore }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('rogan');
  const [lightingMode, setLightingMode] = useState<'candlelight' | 'studio'>('candlelight');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isPlucking, setIsPlucking] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(6.5);
  const [activeVeenaNote, setActiveVeenaNote] = useState<{
    stringName: string;
    swara: string;
    noteLabel: string;
    freq: number;
  } | null>(null);
  const [hoveredVeenaString, setHoveredVeenaString] = useState<string | null>(null);

  const selectedArtifact = ARTIFACTS.find(a => a.id === selectedArtifactId) || ARTIFACTS[0];

  const configRef = useRef({
    artifactId: 'rogan',
    lightingMode: 'candlelight' as 'candlelight' | 'studio',
    autoRotate: true,
    isWireframe: false,
    zoomLevel: 6.5,
    stringPluckTime: 0,
    veenaPluckTimes: [0, 0, 0, 0, 0, 0, 0],
    playVeenaStringFn: null as ((index: number, hitX?: number) => void) | null,
    drag: {
      isDragging: false,
      startX: 0,
      startY: 0,
      mouseDownX: 0,
      mouseDownY: 0,
      rotX: 0.12,
      rotY: 0.3,
      velX: 0,
      velY: 0
    }
  });

  useEffect(() => {
    configRef.current.artifactId = selectedArtifactId;
  }, [selectedArtifactId]);

  useEffect(() => {
    configRef.current.lightingMode = lightingMode;
  }, [lightingMode]);

  useEffect(() => {
    configRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    configRef.current.isWireframe = isWireframe;
  }, [isWireframe]);

  useEffect(() => {
    configRef.current.zoomLevel = zoomLevel;
  }, [zoomLevel]);

  // Web Audio Pluck for instruments
  const pluckInstrument = () => {
    configRef.current.stringPluckTime = performance.now();
    setIsPlucking(true);
    setTimeout(() => setIsPlucking(false), 800);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (selectedArtifactId === 'ektara') {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.Q.setValueAtTime(4.0, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.35, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.9);

      } else if (selectedArtifactId === 'tanpura') {
        const notes = [196.00, 261.63, 261.63, 130.81];
        notes.forEach((freq, idx) => {
          const t = now + idx * 0.18;
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1200, t);
          filter.Q.setValueAtTime(3.0, t);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.2, t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 3.5);
        });

      } else if (selectedArtifactId === 'chhau') {
        // Dramatic Purulia Chhau Dhaamsa (Giant Kettle Drum) & Dhol martial rhythm
        const dholTimes = [0, 0.16, 0.32, 0.48, 0.64, 0.82];
        dholTimes.forEach((dt, i) => {
          const t = now + dt;
          const osc = ctx.createOscillator();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(i === 0 ? 55 : 130 + (i % 2) * 45, t);
          osc.frequency.exponentialRampToValueAtTime(32, t + 0.28);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(i === 0 ? 0.48 : 0.26, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 0.34);
        });

      } else if (selectedArtifactId === 'sanjhi') {
        // Braj Mandir Evening Aarti: Sacred bronze temple bells & meditative harmonics
        const bellTones = [528, 792, 1056, 1584];
        bellTones.forEach((freq, idx) => {
          const t = now + idx * 0.14;
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.3 / (idx + 1), t + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 4.0);
        });

      } else if (selectedArtifactId === 'veena') {
        // Traditional Carnatic Saraswati Veena Tanam phrase across strings & Tala
        const arpeggio = [
          { sIdx: 3, freq: 98.00, delay: 0 },
          { sIdx: 2, freq: 130.81, delay: 0.20 },
          { sIdx: 1, freq: 196.00, delay: 0.40 },
          { sIdx: 0, freq: 261.63, delay: 0.60 },
          { sIdx: 0, freq: 329.63, delay: 0.82 },
          { sIdx: 0, freq: 392.00, delay: 1.04 },
          { sIdx: 0, freq: 523.25, delay: 1.28 },
          { sIdx: 4, freq: 261.63, delay: 1.54 },
          { sIdx: 5, freq: 392.00, delay: 1.68 },
          { sIdx: 6, freq: 523.25, delay: 1.82 }
        ];
        arpeggio.forEach(note => {
          setTimeout(() => {
            configRef.current.veenaPluckTimes[note.sIdx] = performance.now();
            playVeenaAcousticNote(note.freq, VEENA_STRINGS[note.sIdx].type, 1.0);
            setActiveVeenaNote({
              stringName: VEENA_STRINGS[note.sIdx].name,
              swara: VEENA_STRINGS[note.sIdx].swara,
              noteLabel: `${Math.round(note.freq)} Hz`,
              freq: note.freq
            });
          }, note.delay * 1000);
        });
      }
    } catch {}
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x141311, 0.025);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.3, configRef.current.zoomLevel);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // Warm Temple Lighting (Spotlight, Candle Diya, Rim Light)
    const ambientLight = new THREE.AmbientLight(0xFDFBF7, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFF1DC, 3.0);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const candleLight = new THREE.PointLight(0xD97724, 4.0, 14);
    candleLight.position.set(-2.5, 1.2, 3.2);
    scene.add(candleLight);

    const rimLight = new THREE.DirectionalLight(0xE6B94D, 1.6);
    rimLight.position.set(0, -2, -4);
    scene.add(rimLight);

    // Root Anchor Group
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);

    // Golden Pedestal Platform
    const pedestalGeo = new THREE.CylinderGeometry(2.35, 2.65, 0.22, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x181715,
      roughness: 0.45,
      metalness: 0.85
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = -2.2;
    pedestalMesh.receiveShadow = true;
    scene.add(pedestalMesh);

    const inlayGeo = new THREE.TorusGeometry(2.36, 0.03, 16, 64);
    const inlayMat = new THREE.MeshStandardMaterial({ color: 0xE6B94D, metalness: 0.96, roughness: 0.12 });
    const inlayMesh = new THREE.Mesh(inlayGeo, inlayMat);
    inlayMesh.rotation.x = Math.PI / 2;
    inlayMesh.position.y = -2.08;
    scene.add(inlayMesh);

    // Dynamic Textures
    const roganTexture = createRoganClothTexture();
    const peacockTexture = createPeacockFeatherTexture();
    const parchmentTexture = createParchmentTexture();
    const sanjhiTexture = createSanjhiPaperTexture();
    const veenaFaceTexture = createVeenaFaceTexture();

    // Raycast & Interactive Strings for Veena
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const veenaHitTargets: THREE.Mesh[] = [];
    const veenaStringMeshes: THREE.Mesh[] = [];

    // Map of High-Realism Procedural 3D Models
    const models: Record<string, THREE.Group> = {};

    // ==========================================
    // 1. HYPER-REALISTIC KUTCH ROGAN BRASS KALAM & FABRIC
    // ==========================================
    const roganGroup = new THREE.Group();
    {
      // A. Handloom Indigo Khadi Canvas
      const clothGeo = new THREE.BoxGeometry(2.7, 0.08, 2.7);
      const clothMat = new THREE.MeshStandardMaterial({
        map: roganTexture,
        roughness: 0.85,
        metalness: 0.05
      });
      const cloth = new THREE.Mesh(clothGeo, clothMat);
      cloth.position.y = -2.04;
      cloth.receiveShadow = true;
      roganGroup.add(cloth);

      // B. Traditional Terracotta Color Palette Dish
      const dishGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.12, 24);
      const dishMat = new THREE.MeshStandardMaterial({ color: 0x8C4A26, roughness: 0.7 });
      const dish = new THREE.Mesh(dishGeo, dishMat);
      dish.position.set(-0.85, -1.94, 0.85);
      roganGroup.add(dish);

      // Three Mounds of Boiled Castor-Oil Paste in Dish
      const pasteColors = [0xE6B94D, 0xC85A32, 0x2D6643];
      const offsets = [
        [-0.1, 0.08, -0.06],
        [0.12, 0.08, -0.04],
        [0.0, 0.08, 0.1]
      ];
      pasteColors.forEach((col, idx) => {
        const pGeo = new THREE.SphereGeometry(0.1, 16, 12);
        pGeo.scale(1.2, 0.7, 1.2);
        const pMat = new THREE.MeshPhysicalMaterial({
          color: col,
          roughness: 0.15,
          metalness: 0.3,
          clearcoat: 0.8
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.set(-0.85 + offsets[idx][0], -1.94 + offsets[idx][1], 0.85 + offsets[idx][2]);
        roganGroup.add(pMesh);
      });

      // C. Hand-Forged Brass Kalam (Stylus)
      const kalamSubGroup = new THREE.Group();

      // Top brass ball finial
      const topBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.2 })
      );
      topBall.position.y = 1.6;
      kalamSubGroup.add(topBall);

      // Upper knurled brass rod
      const rodUpper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.05, 1.2, 16),
        new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.2 })
      );
      rodUpper.position.y = 1.0;
      kalamSubGroup.add(rodUpper);

      // Rosewood ergonomic grip
      const grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.07, 0.9, 16),
        new THREE.MeshStandardMaterial({ color: 0x3E1F11, roughness: 0.4 })
      );
      grip.position.y = 0.05;
      kalamSubGroup.add(grip);

      // Lower needle section tapering to razor-fine point
      const needle = new THREE.Mesh(
        new THREE.ConeGeometry(0.05, 1.4, 24),
        new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.98, roughness: 0.12 })
      );
      needle.rotation.x = Math.PI;
      needle.position.y = -1.0;
      kalamSubGroup.add(needle);

      // Bead of golden castor oil paste on needle tip
      const droplet = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 12),
        new THREE.MeshPhysicalMaterial({ color: 0xE6B94D, roughness: 0.1, clearcoat: 1.0 })
      );
      droplet.position.y = -1.7;
      kalamSubGroup.add(droplet);

      // Orient Kalam in hand-painting pose over the fabric
      kalamSubGroup.rotation.z = Math.PI / 4.5;
      kalamSubGroup.rotation.x = Math.PI / 8;
      kalamSubGroup.position.set(0.35, -0.1, 0.2);
      roganGroup.add(kalamSubGroup);

      // D. Viscous Castor-Oil Pigment Thread (Mid-air suspended golden spiral)
      const curvePts: THREE.Vector3[] = [];
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const angle = t * Math.PI * 6;
        const r = 0.08 + Math.sin(t * Math.PI) * 0.35;
        curvePts.push(new THREE.Vector3(
          0.05 + Math.cos(angle) * r,
          -1.98 + t * 1.5,
          0.05 + Math.sin(angle) * r
        ));
      }
      const curve = new THREE.CatmullRomCurve3(curvePts);
      const threadGeo = new THREE.TubeGeometry(curve, 96, 0.032, 12, false);
      const threadMat = new THREE.MeshPhysicalMaterial({
        color: 0xE6B94D,
        emissive: 0xD97724,
        emissiveIntensity: 0.3,
        roughness: 0.12,
        clearcoat: 0.95
      });
      const threadMesh = new THREE.Mesh(threadGeo, threadMat);
      roganGroup.add(threadMesh);
    }
    models['rogan'] = roganGroup;
    artifactGroup.add(roganGroup);

    // ==========================================
    // 2. AUTHENTIC PURULIA CHHAU ASURA DEMON MASK (FROM MASTER PHOTO)
    // ==========================================
    const chhauGroup = new THREE.Group();
    let chhauMaskTex: THREE.Texture | null = null;
    {
      // Museum display pedestal pillar
      const standGeo = new THREE.CylinderGeometry(0.12, 0.35, 1.4, 20);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x1E1C19, roughness: 0.6, metalness: 0.7 });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.set(0, -1.45, 0);
      chhauGroup.add(stand);

      // Brass mounting cradle
      const collarGeo = new THREE.TorusGeometry(0.42, 0.04, 12, 32);
      const collarMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.2 });
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, -0.75, 0);
      chhauGroup.add(collar);

      // Load authentic mask texture from user photograph
      const chhauLoader = new THREE.TextureLoader();
      chhauMaskTex = chhauLoader.load('/assets/images/chhau_mask_authentic.webp');
      chhauMaskTex.colorSpace = THREE.SRGBColorSpace;

      // A. Front Curved Mask Shell (10" x 8" proportion: 2.4w x 3.0h)
      const maskGeo = new THREE.PlaneGeometry(2.4, 3.0, 48, 48);
      const pos = maskGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Organic facial curvature
        const zCurve = -Math.pow(x / 1.15, 2) * 0.44;
        const yCurve = -Math.pow(y / 1.45, 2) * 0.16;
        // Nose bridge protrusion in center
        const noseDist = Math.hypot(x, y + 0.1);
        const noseBump = Math.max(0, 1 - noseDist / 0.45) * 0.2;
        // Forehead brow contour
        const browBump = Math.max(0, 1 - Math.hypot(x, y - 0.35) / 0.8) * 0.09;
        pos.setZ(i, zCurve + yCurve + noseBump + browBump);
      }
      maskGeo.computeVertexNormals();

      const maskMat = new THREE.MeshStandardMaterial({
        map: chhauMaskTex,
        transparent: true,
        alphaTest: 0.08,
        roughness: 0.42,
        metalness: 0.15,
        side: THREE.FrontSide
      });
      const maskMesh = new THREE.Mesh(maskGeo, maskMat);
      maskMesh.position.set(0, -0.05, 0);
      maskMesh.castShadow = true;
      chhauGroup.add(maskMesh);

      // B. Hollow Reverse Clay/Burlap Shell (Visible on 360° back rotation)
      const backGeo = maskGeo.clone();
      const backMat = new THREE.MeshStandardMaterial({
        color: 0x362115, // raw unglazed earthen clay & papier-mâché backing
        roughness: 0.88,
        metalness: 0.05,
        side: THREE.BackSide
      });
      const backMesh = new THREE.Mesh(backGeo, backMat);
      backMesh.position.set(0, -0.05, -0.015);
      chhauGroup.add(backMesh);

      // Dancer sight eye-holes (cutouts visible from inside/outside)
      [-0.42, 0.42].forEach(ex => {
        const eyeHole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16),
          new THREE.MeshBasicMaterial({ color: 0x050505 })
        );
        eyeHole.rotation.x = Math.PI / 2;
        eyeHole.position.set(ex, 0.16, -0.06);
        chhauGroup.add(eyeHole);
      });

      // Red Braided Dance Head-Tie Straps (Draped from ear temples)
      [-1.15, 1.15].forEach(sideX => {
        const tieCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sideX, -0.1, -0.15),
          new THREE.Vector3(sideX * 1.05, -0.4, -0.35),
          new THREE.Vector3(sideX * 0.9, -0.9, -0.45),
          new THREE.Vector3(sideX * 0.7, -1.3, -0.4)
        ]);
        const tieGeo = new THREE.TubeGeometry(tieCurve, 24, 0.035, 8, false);
        const tieMat = new THREE.MeshStandardMaterial({ color: 0xE11D48, roughness: 0.7 });
        const tieMesh = new THREE.Mesh(tieGeo, tieMat);
        chhauGroup.add(tieMesh);
      });

      // C. Protruding 3D Crimson Horns with Golden Scorpions
      const createHorn = (isLeft: boolean) => {
        const sign = isLeft ? -1 : 1;
        const hornPts = [
          new THREE.Vector3(sign * 0.65, 0.82, -0.08),
          new THREE.Vector3(sign * 0.92, 1.15, 0.02),
          new THREE.Vector3(sign * 1.15, 1.38, 0.08),
          new THREE.Vector3(sign * 1.28, 1.55, 0.12)
        ];
        const hornCurve = new THREE.CatmullRomCurve3(hornPts);
        const hornGeo = new THREE.TubeGeometry(hornCurve, 32, 0.16, 16, false);
        const hornMat = new THREE.MeshPhysicalMaterial({
          color: 0xE11D48, // vibrant scarlet red lacquer
          roughness: 0.35,
          metalness: 0.15,
          clearcoat: 0.6
        });
        const hornMesh = new THREE.Mesh(hornGeo, hornMat);
        hornMesh.castShadow = true;
        chhauGroup.add(hornMesh);

        // Golden Scorpion Motif on horn face
        const scorpionGeo = new THREE.BoxGeometry(0.08, 0.22, 0.04);
        const scorpionMat = new THREE.MeshStandardMaterial({
          color: 0xD4AF37,
          metalness: 0.95,
          roughness: 0.2
        });
        const scorpion = new THREE.Mesh(scorpionGeo, scorpionMat);
        scorpion.position.set(sign * 0.95, 1.25, 0.16);
        scorpion.rotation.z = sign * -Math.PI / 6;
        chhauGroup.add(scorpion);
      };
      createHorn(true);
      createHorn(false);

      // D. Protruding 3D Crimson Tongue with Golden Scorpion
      const tonguePts = [
        new THREE.Vector3(0, -0.42, 0.12),
        new THREE.Vector3(0, -0.72, 0.28),
        new THREE.Vector3(0, -0.98, 0.22)
      ];
      const tongueCurve = new THREE.CatmullRomCurve3(tonguePts);
      const tongueGeo = new THREE.TubeGeometry(tongueCurve, 32, 0.22, 16, false);
      const tongueMat = new THREE.MeshPhysicalMaterial({
        color: 0xE11D48,
        roughness: 0.25,
        clearcoat: 0.85
      });
      const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
      tongueMesh.scale.set(1.15, 1.0, 0.35);
      chhauGroup.add(tongueMesh);

      // Golden Scorpion on Tongue
      const tongueScorpionGeo = new THREE.BoxGeometry(0.12, 0.28, 0.04);
      const tongueScorpionMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.2 });
      const tongueScorpion = new THREE.Mesh(tongueScorpionGeo, tongueScorpionMat);
      tongueScorpion.position.set(0, -0.74, 0.32);
      tongueScorpion.rotation.x = Math.PI / 12;
      chhauGroup.add(tongueScorpion);

      // E. 3D Sharp Jagged White Fangs (Over the tongue)
      for (let t = -4; t <= 4; t++) {
        if (t === 0) continue;
        const fangGeo = new THREE.ConeGeometry(0.045, 0.22, 8);
        const fangMat = new THREE.MeshStandardMaterial({ color: 0xFDFBF7, roughness: 0.3 });
        const fang = new THREE.Mesh(fangGeo, fangMat);
        fang.rotation.x = Math.PI;
        fang.position.set(t * 0.08, -0.44 - Math.abs(t) * 0.02, 0.18);
        chhauGroup.add(fang);
      }

      // F. 3D Golden Brass Nose Ring (Nath) on left nostril
      const nathGeo = new THREE.TorusGeometry(0.12, 0.024, 12, 32);
      const nathMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.98, roughness: 0.15 });
      const nath = new THREE.Mesh(nathGeo, nathMat);
      nath.position.set(-0.25, -0.16, 0.24);
      nath.rotation.y = Math.PI / 6;
      chhauGroup.add(nath);

      // G. 3D Large Circular Kundal Ear Plugs (with Golden face medallion)
      [-1.12, 1.12].forEach(ex => {
        const kundalGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 32);
        const kundalMat = new THREE.MeshStandardMaterial({
          color: 0x14141E,
          roughness: 0.4
        });
        const kundal = new THREE.Mesh(kundalGeo, kundalMat);
        kundal.rotation.x = Math.PI / 2;
        kundal.position.set(ex, -0.42, -0.08);
        chhauGroup.add(kundal);

        const rimGeo = new THREE.TorusGeometry(0.35, 0.03, 12, 32);
        const rimMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.15 });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.position.set(ex, -0.42, -0.04);
        chhauGroup.add(rim);

        const raysGeo = new THREE.TorusGeometry(0.42, 0.02, 8, 48);
        const rays = new THREE.Mesh(raysGeo, rimMat);
        rays.position.set(ex, -0.42, -0.06);
        chhauGroup.add(rays);
      });

      // H. 3D Forehead Sun Medallion (Central Third-Eye Halo)
      const sunGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 32);
      const sunMat = new THREE.MeshStandardMaterial({ color: 0x14141E, roughness: 0.3 });
      const sunMedallion = new THREE.Mesh(sunGeo, sunMat);
      sunMedallion.rotation.x = Math.PI / 2;
      sunMedallion.position.set(0, 0.65, 0.12);
      chhauGroup.add(sunMedallion);

      const sunRimGeo = new THREE.TorusGeometry(0.3, 0.025, 12, 32);
      const sunRim = new THREE.Mesh(sunRimGeo, new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95 }));
      sunRim.position.set(0, 0.65, 0.14);
      chhauGroup.add(sunRim);
    }
    models['chhau'] = chhauGroup;
    artifactGroup.add(chhauGroup);

    // ==========================================
    // 3. ADVANCED PROCEDURAL BAUL EKTARA
    // ==========================================
    const ektaraGroup = new THREE.Group();
    let ektaraStringMesh: THREE.Mesh | null = null;
    {
      // Dried Gourd Resonator (Tumba)
      const gourdGeo = new THREE.SphereGeometry(1.2, 36, 28);
      gourdGeo.scale(1.05, 1.35, 1.0);
      const gourdMat = new THREE.MeshStandardMaterial({
        color: 0x7E3E1B,
        roughness: 0.38,
        metalness: 0.15
      });
      const gourd = new THREE.Mesh(gourdGeo, gourdMat);
      gourd.position.y = -0.55;
      ektaraGroup.add(gourd);

      // Goat Parchment Face with Texture
      const faceGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 36);
      const faceMat = new THREE.MeshStandardMaterial({
        map: parchmentTexture,
        roughness: 0.68,
        metalness: 0.05
      });
      const face = new THREE.Mesh(faceGeo, faceMat);
      face.rotation.x = Math.PI / 2;
      face.position.set(0, -0.55, 0.96);
      ektaraGroup.add(face);

      // Brass Rivets
      for (let i = 0; i < 16; i++) {
        const theta = (i / 16) * Math.PI * 2;
        const rivet = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.2 })
        );
        rivet.position.set(Math.cos(theta) * 0.82, -0.55 + Math.sin(theta) * 0.82, 0.98);
        ektaraGroup.add(rivet);
      }

      // Split Bamboo Twin Arms (Danda)
      const tineGeo = new THREE.CylinderGeometry(0.065, 0.065, 3.4, 20);
      const bambooMat = new THREE.MeshStandardMaterial({ color: 0xE6B562, roughness: 0.32, metalness: 0.12 });
      
      const leftTine = new THREE.Mesh(tineGeo, bambooMat);
      leftTine.position.set(-0.48, 1.05, 0);
      leftTine.rotation.z = -0.05;
      ektaraGroup.add(leftTine);

      const rightTine = new THREE.Mesh(tineGeo, bambooMat);
      rightTine.position.set(0.48, 1.05, 0);
      rightTine.rotation.z = 0.05;
      ektaraGroup.add(rightTine);

      // Bamboo Joints
      [-0.1, 0.9, 1.9].forEach(yPos => {
        const ringL = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.015, 8, 16), bambooMat);
        ringL.position.set(-0.48, yPos, 0);
        ringL.rotation.x = Math.PI / 2;
        ektaraGroup.add(ringL);

        const ringR = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.015, 8, 16), bambooMat);
        ringR.position.set(0.48, yPos, 0);
        ringR.rotation.x = Math.PI / 2;
        ektaraGroup.add(ringR);
      });

      // Rosewood Lotus Headpiece & Brass Tuning Peg
      const head = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 0.5, 16),
        new THREE.MeshStandardMaterial({ color: 0x4A2511, roughness: 0.4 })
      );
      head.position.set(0, 2.7, 0);
      ektaraGroup.add(head);

      const peg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.035, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.18 })
      );
      peg.rotation.z = Math.PI / 2;
      peg.position.set(0, 2.35, 0);
      ektaraGroup.add(peg);

      // Dark Rosewood Bridge (Ghorat)
      const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.14, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x331808, roughness: 0.5 })
      );
      bridge.position.set(0, -0.55, 1.02);
      ektaraGroup.add(bridge);

      // Steel String
      const stringGeo = new THREE.CylinderGeometry(0.012, 0.012, 2.95, 8);
      const stringMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        emissive: 0xE6B94D,
        emissiveIntensity: 0.2,
        metalness: 0.98,
        roughness: 0.05
      });
      ektaraStringMesh = new THREE.Mesh(stringGeo, stringMat);
      ektaraStringMesh.position.set(0, 0.9, 0.08);
      ektaraGroup.add(ektaraStringMesh);
    }
    models['ektara'] = ektaraGroup;
    artifactGroup.add(ektaraGroup);

    // ==========================================
    // 4. CLASSICAL MIRAJ TANPURA (TAMBURA)
    // ==========================================
    const tanpuraGroup = new THREE.Group();
    let tanpuraStrings: THREE.Mesh[] = [];
    {
      const tumbaGeo = new THREE.SphereGeometry(1.4, 36, 28);
      tumbaGeo.scale(1.15, 1.25, 0.95);
      const tumba = new THREE.Mesh(
        tumbaGeo,
        new THREE.MeshStandardMaterial({ color: 0x8A421D, roughness: 0.35, metalness: 0.2 })
      );
      tumba.position.y = -0.7;
      tanpuraGroup.add(tumba);

      const tabli = new THREE.Mesh(
        new THREE.CylinderGeometry(1.0, 1.0, 0.06, 36),
        new THREE.MeshStandardMaterial({ color: 0xB3622A, roughness: 0.45 })
      );
      tabli.rotation.x = Math.PI / 2;
      tabli.position.set(0, -0.7, 0.92);
      tanpuraGroup.add(tabli);

      const medal = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.02, 16, 48),
        new THREE.MeshStandardMaterial({ color: 0xFDFBF7, roughness: 0.2 })
      );
      medal.position.set(0, -0.7, 0.96);
      tanpuraGroup.add(medal);

      const dandi = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 3.8, 24),
        new THREE.MeshStandardMaterial({ color: 0x5C2E14, roughness: 0.3, metalness: 0.15 })
      );
      dandi.position.set(0, 1.15, 0);
      tanpuraGroup.add(dandi);

      const jawari = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.12, 0.15),
        new THREE.MeshStandardMaterial({ color: 0xFAF6EB, roughness: 0.4 })
      );
      jawari.position.set(0, -0.7, 0.98);
      tanpuraGroup.add(jawari);

      const pegMat = new THREE.MeshStandardMaterial({ color: 0x331808, roughness: 0.5 });
      [
        { pos: [-0.3, 2.6, 0], rot: [0, 0, Math.PI / 2] },
        { pos: [0.3, 2.75, 0], rot: [0, 0, -Math.PI / 2] },
        { pos: [0, 2.9, 0.25], rot: [Math.PI / 2, 0, 0] },
        { pos: [0, 2.45, 0.25], rot: [Math.PI / 2, 0, 0] }
      ].forEach(p => {
        const pMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.025, 0.5, 12), pegMat);
        pMesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
        pMesh.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
        tanpuraGroup.add(pMesh);
      });

      const stringPositions = [-0.12, -0.04, 0.04, 0.12];
      stringPositions.forEach((x, idx) => {
        const sMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 3.4, 8),
          new THREE.MeshStandardMaterial({
            color: idx === 0 ? 0xD4AF37 : 0xFFFFFF,
            emissive: 0xE6B94D,
            emissiveIntensity: 0.15,
            metalness: 0.98
          })
        );
        sMesh.position.set(x, 1.0, 0.16);
        tanpuraGroup.add(sMesh);
        tanpuraStrings.push(sMesh);
      });
    }
    models['tanpura'] = tanpuraGroup;
    artifactGroup.add(tanpuraGroup);

    // ==========================================
    // 5. MATHURA SANJHI SACRED PAPER LANTERN (UTTAR PRADESH)
    // ==========================================
    const sanjhiGroup = new THREE.Group();
    {
      // A. Hexagonal Paper Lantern Base Frame (Carved Tun-wood)
      const baseFrameGeo = new THREE.CylinderGeometry(1.22, 1.28, 0.12, 6);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x3E2314, roughness: 0.5 });
      const baseFrame = new THREE.Mesh(baseFrameGeo, woodMat);
      baseFrame.position.y = -1.98;
      sanjhiGroup.add(baseFrame);

      // B. Hexagonal Paper Stencil Cylinder (6 Panels with delicate paper filigree texture)
      const lanternGeo = new THREE.CylinderGeometry(1.15, 1.18, 2.4, 6, 1, true);
      const lanternMat = new THREE.MeshStandardMaterial({
        map: sanjhiTexture,
        roughness: 0.55,
        metalness: 0.05,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.94
      });
      const lanternMesh = new THREE.Mesh(lanternGeo, lanternMat);
      lanternMesh.position.y = -0.75;
      lanternMesh.castShadow = true;
      sanjhiGroup.add(lanternMesh);

      // C. Six Corner Bamboo Struts
      for (let i = 0; i < 6; i++) {
        const th = (i / 6) * Math.PI * 2;
        const strutGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.45, 8);
        const strutMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.2 });
        const strut = new THREE.Mesh(strutGeo, strutMat);
        strut.position.set(Math.cos(th) * 1.18, -0.75, Math.sin(th) * 1.18);
        sanjhiGroup.add(strut);
      }

      // D. Hexagonal Wooden Roof Canopy & Brass Finial
      const roofGeo = new THREE.ConeGeometry(1.26, 0.65, 6);
      const roof = new THREE.Mesh(roofGeo, woodMat);
      roof.position.y = 0.72;
      sanjhiGroup.add(roof);

      const finialGeo = new THREE.TorusGeometry(0.12, 0.03, 12, 24);
      const finialMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.98, roughness: 0.15 });
      const finial = new THREE.Mesh(finialGeo, finialMat);
      finial.position.set(0, 1.12, 0);
      sanjhiGroup.add(finial);

      // E. Internal Glowing Temple Diya (Candle Core)
      const diyaGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.12, 16);
      const diyaMat = new THREE.MeshStandardMaterial({ color: 0x8C4A26, roughness: 0.8 });
      const diya = new THREE.Mesh(diyaGeo, diyaMat);
      diya.position.set(0, -1.88, 0);
      sanjhiGroup.add(diya);

      // Glowing flame mesh inside
      const flameGeo = new THREE.ConeGeometry(0.06, 0.22, 12);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(0, -1.72, 0);
      sanjhiGroup.add(flame);

      // Dedicated internal flickering lantern point light
      const lanternLight = new THREE.PointLight(0xF59E0B, 4.5, 8);
      lanternLight.position.set(0, -0.75, 0);
      sanjhiGroup.add(lanternLight);

      // F. Master's Curved Brass Scissors (Kainchi) resting beside lantern on pedestal
      const scissorGroup = new THREE.Group();
      [-0.14, 0.14].forEach((sOff, idx) => {
        const bladeGeo = new THREE.BoxGeometry(0.04, 0.015, 0.8);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.18 });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.rotation.y = idx === 0 ? 0.15 : -0.15;
        blade.position.set(sOff, 0, 0);
        scissorGroup.add(blade);

        const ringGeo = new THREE.TorusGeometry(0.1, 0.02, 12, 24);
        const ring = new THREE.Mesh(ringGeo, bladeMat);
        ring.position.set(sOff * 1.5, 0, 0.45);
        scissorGroup.add(ring);
      });
      const pivotGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12);
      const pivot = new THREE.Mesh(pivotGeo, new THREE.MeshStandardMaterial({ color: 0x222222 }));
      scissorGroup.add(pivot);

      scissorGroup.position.set(1.4, -2.04, 0.6);
      scissorGroup.rotation.y = Math.PI / 4;
      sanjhiGroup.add(scissorGroup);
    }
    models['sanjhi'] = sanjhiGroup;
    artifactGroup.add(sanjhiGroup);

    // ==========================================
    // 6. THANJAVUR SARASWATI VEENA (CARNATIC DIVINE FRETTED LUTE)
    // ==========================================
    const veenaGroup = new THREE.Group();
    veenaGroup.position.set(0, 0.45, 0);
    veenaGroup.rotation.x = -0.42;
    veenaGroup.rotation.z = 0.08;
    {
      const jackwoodMat = new THREE.MeshStandardMaterial({
        color: 0x8C3F10,
        roughness: 0.32,
        metalness: 0.15
      });
      const darkWoodMat = new THREE.MeshStandardMaterial({
        color: 0x361608,
        roughness: 0.5
      });
      const polishedBrassMat = new THREE.MeshStandardMaterial({
        color: 0xE6B94D,
        metalness: 0.98,
        roughness: 0.12
      });
      const ivoryTrimMat = new THREE.MeshStandardMaterial({
        color: 0xFDFBF4,
        roughness: 0.35
      });

      // Warm spotlight illuminating the Veena's frets and strings
      const veenaSpot = new THREE.PointLight(0xFFE8B3, 3.2, 8);
      veenaSpot.position.set(0, 1.6, 2.2);
      veenaGroup.add(veenaSpot);

      // A. Main Kudam Resonator Bowl (Carved from mature Jackwood)
      const kudamGeo = new THREE.SphereGeometry(1.0, 32, 24);
      kudamGeo.scale(1.15, 0.88, 0.86);
      const kudamBowl = new THREE.Mesh(kudamGeo, jackwoodMat);
      kudamBowl.position.set(-1.25, -1.35, 0);
      kudamBowl.castShadow = true;
      kudamBowl.receiveShadow = true;
      veenaGroup.add(kudamBowl);

      // Soundboard Face Plate (Palagai) with sacred Lotus Rosette
      const faceGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.06, 32);
      const faceMat = new THREE.MeshStandardMaterial({
        map: veenaFaceTexture,
        roughness: 0.45,
        metalness: 0.05
      });
      const faceMesh = new THREE.Mesh(faceGeo, faceMat);
      faceMesh.position.set(-1.25, -0.92, 0);
      faceMesh.receiveShadow = true;
      veenaGroup.add(faceMesh);

      // Ivory Outer Perimeter Rim
      const rimGeo = new THREE.TorusGeometry(0.79, 0.025, 16, 48);
      const rimMesh = new THREE.Mesh(rimGeo, ivoryTrimMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.set(-1.25, -0.89, 0);
      veenaGroup.add(rimMesh);

      // Tailpiece (Nagapasham)
      const tailGeo = new THREE.BoxGeometry(0.18, 0.24, 0.22);
      const tailMesh = new THREE.Mesh(tailGeo, darkWoodMat);
      tailMesh.position.set(-2.28, -1.3, 0);
      veenaGroup.add(tailMesh);

      // 4 Brass Langar anchor rings at tailpiece
      for (let r = 0; r < 4; r++) {
        const rz = -0.06 + r * 0.04;
        const ringGeo = new THREE.TorusGeometry(0.025, 0.007, 12, 20);
        const ring = new THREE.Mesh(ringGeo, polishedBrassMat);
        ring.position.set(-2.36, -1.25, rz);
        ring.rotation.y = Math.PI / 2;
        veenaGroup.add(ring);
      }

      // B. Kudirai Main Bridge with Arched Brass Jawari Plate
      const bridgeBaseGeo = new THREE.BoxGeometry(0.24, 0.16, 0.32);
      const bridgeBase = new THREE.Mesh(bridgeBaseGeo, darkWoodMat);
      bridgeBase.position.set(-1.12, -0.84, 0);
      veenaGroup.add(bridgeBase);

      const jawariGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.34, 16, 1, false, 0, Math.PI);
      const jawariPlate = new THREE.Mesh(jawariGeo, polishedBrassMat);
      jawariPlate.rotation.z = Math.PI / 2;
      jawariPlate.rotation.x = Math.PI / 2;
      jawariPlate.position.set(-1.12, -0.74, 0);
      veenaGroup.add(jawariPlate);

      // Side Tala Kudirai (Arched brass side bridge for the 3 drone strings)
      const sideKudiraiGeo = new THREE.CylinderGeometry(0.024, 0.034, 0.18, 12);
      const sideKudirai = new THREE.Mesh(sideKudiraiGeo, polishedBrassMat);
      sideKudirai.position.set(-1.12, -0.76, 0.20);
      sideKudirai.rotation.x = Math.PI / 6;
      veenaGroup.add(sideKudirai);

      // C. Long Jackwood Dandi (Neck)
      const neckGeo = new THREE.BoxGeometry(2.4, 0.16, 0.34);
      const neckMesh = new THREE.Mesh(neckGeo, jackwoodMat);
      neckMesh.position.set(0.42, -0.92, 0);
      neckMesh.castShadow = true;
      veenaGroup.add(neckMesh);

      // Black wax ledges along neck edges
      [-0.14, 0.14].forEach(zPos => {
        const waxGeo = new THREE.BoxGeometry(2.1, 0.06, 0.045);
        const waxMat = new THREE.MeshStandardMaterial({ color: 0x141210, roughness: 0.85 });
        const waxMesh = new THREE.Mesh(waxGeo, waxMat);
        waxMesh.position.set(0.45, -0.835, zPos);
        veenaGroup.add(waxMesh);
      });

      // D. 24 Hand-Forged Brass Frets (Mettu) with Acoustic Exponential Spacing
      for (let f = 0; f < 24; f++) {
        const fretX = -0.55 + 2.02 * (1 - Math.pow(2, -f / 18));
        if (fretX > 1.48) break;
        const fretGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.28, 8);
        const fretMesh = new THREE.Mesh(fretGeo, polishedBrassMat);
        fretMesh.rotation.x = Math.PI / 2;
        fretMesh.position.set(fretX, -0.815, 0.0);
        veenaGroup.add(fretMesh);
      }

      // E. Carved Yali (Vyala Beast) Dragon Head Scroll
      const yaliGroup = new THREE.Group();
      const yHeadGeo = new THREE.ConeGeometry(0.18, 0.42, 16);
      const yHead = new THREE.Mesh(yHeadGeo, jackwoodMat);
      yHead.rotation.z = -Math.PI / 3;
      yHead.position.set(1.75, -0.92, 0);
      yaliGroup.add(yHead);

      const snoutGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.35, 12);
      const snout = new THREE.Mesh(snoutGeo, jackwoodMat);
      snout.rotation.z = Math.PI / 4;
      snout.position.set(1.95, -1.15, 0);
      yaliGroup.add(snout);

      const jawGeo = new THREE.BoxGeometry(0.12, 0.06, 0.14);
      const jaw = new THREE.Mesh(jawGeo, jackwoodMat);
      jaw.position.set(2.02, -1.28, 0);
      yaliGroup.add(jaw);

      [-0.04, 0.04].forEach(fz => {
        const fangGeo = new THREE.ConeGeometry(0.02, 0.08, 8);
        const fang = new THREE.Mesh(fangGeo, ivoryTrimMat);
        fang.rotation.x = Math.PI;
        fang.position.set(2.05, -1.22, fz);
        yaliGroup.add(fang);
      });

      [-0.07, 0.07].forEach(ez => {
        const eyeGeo = new THREE.SphereGeometry(0.035, 12, 12);
        const eyeMat = new THREE.MeshStandardMaterial({
          color: 0xDC2626,
          emissive: 0x991B1B,
          emissiveIntensity: 0.65,
          roughness: 0.1,
          metalness: 0.3
        });
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(1.86, -0.95, ez);
        yaliGroup.add(eye);
      });

      [-0.05, 0.05].forEach(hz => {
        const hornGeo = new THREE.ConeGeometry(0.04, 0.24, 12);
        const horn = new THREE.Mesh(hornGeo, polishedBrassMat);
        horn.rotation.z = -Math.PI / 4;
        horn.position.set(1.78, -0.74, hz);
        yaliGroup.add(horn);
      });
      veenaGroup.add(yaliGroup);

      // F. Suraikudam (Auxiliary Gourd Resonator beneath upper neck)
      const suraiGroup = new THREE.Group();
      const suraiGeo = new THREE.SphereGeometry(0.44, 24, 20);
      const suraiMat = new THREE.MeshStandardMaterial({
        color: 0x8C3F10,
        roughness: 0.5,
        metalness: 0.12
      });
      const suraiMesh = new THREE.Mesh(suraiGeo, suraiMat);
      suraiMesh.position.set(1.15, -1.48, 0);
      suraiGroup.add(suraiMesh);

      const bracketGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.22, 16);
      const bracket = new THREE.Mesh(bracketGeo, polishedBrassMat);
      bracket.position.set(1.15, -1.20, 0);
      suraiGroup.add(bracket);
      veenaGroup.add(suraiGroup);

      // G. Birudai Tuning Pegs
      [
        { pos: [1.60, -0.84, -0.22], rot: [Math.PI / 2, 0, 0] },
        { pos: [1.72, -0.84, -0.22], rot: [Math.PI / 2, 0, 0] },
        { pos: [1.60, -0.84, 0.22], rot: [-Math.PI / 2, 0, 0] },
        { pos: [1.72, -0.84, 0.22], rot: [-Math.PI / 2, 0, 0] }
      ].forEach(p => {
        const pegGeo = new THREE.CylinderGeometry(0.028, 0.016, 0.34, 12);
        const pegMesh = new THREE.Mesh(pegGeo, darkWoodMat);
        pegMesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
        pegMesh.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
        veenaGroup.add(pegMesh);

        const knobGeo = new THREE.SphereGeometry(0.04, 12, 12);
        const knob = new THREE.Mesh(knobGeo, polishedBrassMat);
        knob.position.set(p.pos[0], p.pos[1], p.pos[2] > 0 ? 0.36 : -0.36);
        veenaGroup.add(knob);
      });

      // 3 Side Tala Pegs along player's side of neck
      [0.65, 0.85, 1.05].forEach(px => {
        const tPegGeo = new THREE.CylinderGeometry(0.02, 0.012, 0.22, 12);
        const tPeg = new THREE.Mesh(tPegGeo, darkWoodMat);
        tPeg.position.set(px, -0.84, 0.22);
        tPeg.rotation.x = -Math.PI / 2;
        veenaGroup.add(tPeg);
      });

      // H. 7 Interactive 3D Strings + Precision Raycast Colliders
      VEENA_STRINGS.forEach((sInfo, idx) => {
        const isTala = idx >= 4;
        const startX = -1.12;
        const endX = isTala ? (0.65 + (idx - 4) * 0.2) : 1.58;
        const strLen = endX - startX;
        const midX = (startX + endX) / 2;

        // Visible String Mesh
        const strGeo = new THREE.CylinderGeometry(sInfo.wireRadius, sInfo.wireRadius, strLen, 8);
        const strMat = new THREE.MeshStandardMaterial({
          color: sInfo.wireColor,
          metalness: 0.98,
          roughness: 0.12,
          emissive: 0x000000,
          emissiveIntensity: 0
        });
        const strMesh = new THREE.Mesh(strGeo, strMat);
        strMesh.rotation.z = Math.PI / 2;
        strMesh.position.set(midX, sInfo.baseY, sInfo.baseZ);
        veenaGroup.add(strMesh);
        veenaStringMeshes.push(strMesh);

        // Invisible Raycast Hit Target Collider
        const hitGeo = new THREE.CylinderGeometry(0.07, 0.07, strLen, 8);
        const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.001, depthWrite: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.rotation.z = Math.PI / 2;
        hitMesh.position.set(midX, sInfo.baseY, sInfo.baseZ);
        hitMesh.userData = {
          isVeenaString: true,
          stringIndex: idx,
          stringName: sInfo.name,
          noteLabel: sInfo.noteLabel,
          baseFreq: sInfo.baseFreq,
          swara: sInfo.swara,
          type: sInfo.type
        };
        veenaGroup.add(hitMesh);
        veenaHitTargets.push(hitMesh);
      });
    }
    models['veena'] = veenaGroup;
    artifactGroup.add(veenaGroup);

    // Initial visibility state
    Object.keys(models).forEach(key => {
      models[key].visible = (key === configRef.current.artifactId);
    });

    // Precision Plucking Dispatcher for Veena
    const triggerVeenaPluck = (stringIdx: number, hitPointX?: number) => {
      const sInfo = VEENA_STRINGS[stringIdx];
      if (!sInfo) return;

      let freq = sInfo.baseFreq;
      let label = sInfo.noteLabel;
      let swara = sInfo.swara;

      if (stringIdx === 0 && typeof hitPointX === 'number') {
        if (hitPointX > -0.55 && hitPointX < 1.45) {
          const ratio = (hitPointX - (-0.55)) / (1.45 - (-0.55));
          const fretIdx = Math.min(12, Math.max(0, Math.round(ratio * 12)));
          const cSwara = CARNATIC_SARANI_SWARAS[fretIdx];
          if (cSwara) {
            freq = cSwara.freq;
            label = cSwara.noteLabel;
            swara = cSwara.swara;
          }
        }
      }

      configRef.current.veenaPluckTimes[stringIdx] = performance.now();
      playVeenaAcousticNote(freq, sInfo.type, 1.0);
      setActiveVeenaNote({
        stringName: sInfo.name,
        swara: swara,
        noteLabel: label,
        freq: Math.round(freq * 10) / 10
      });
    };

    configRef.current.playVeenaStringFn = triggerVeenaPluck;

    // Mouse drag handlers with Precision 3D Raycasting
    const handleMouseDown = (e: MouseEvent) => {
      configRef.current.drag.isDragging = true;
      configRef.current.drag.startX = e.clientX;
      configRef.current.drag.startY = e.clientY;
      configRef.current.drag.mouseDownX = e.clientX;
      configRef.current.drag.mouseDownY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (configRef.current.drag.isDragging) {
        const deltaX = e.clientX - configRef.current.drag.startX;
        const deltaY = e.clientY - configRef.current.drag.startY;
        configRef.current.drag.velY = deltaX * 0.005;
        configRef.current.drag.velX = deltaY * 0.005;
        configRef.current.drag.rotY += configRef.current.drag.velY;
        configRef.current.drag.rotX += configRef.current.drag.velX;
        configRef.current.drag.startX = e.clientX;
        configRef.current.drag.startY = e.clientY;
      } else if (configRef.current.artifactId === 'veena' && container) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(veenaHitTargets, false);
        if (intersects.length > 0) {
          container.style.cursor = 'pointer';
          const hit = intersects[0].object;
          const uData = hit.userData;
          if (uData && typeof uData.stringIndex === 'number') {
            setHoveredVeenaString(`${uData.stringName} (${uData.swara})`);
            if (veenaStringMeshes[uData.stringIndex]) {
              const sm = veenaStringMeshes[uData.stringIndex];
              (sm.material as THREE.MeshStandardMaterial).emissive.setHex(0xE6B94D);
              (sm.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.45;
            }
          }
        } else {
          container.style.cursor = 'grab';
          setHoveredVeenaString(null);
          veenaStringMeshes.forEach((sm, idx) => {
            if (performance.now() - (configRef.current.veenaPluckTimes[idx] || 0) > 1200) {
              (sm.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
            }
          });
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const movedDist = Math.hypot(
        e.clientX - configRef.current.drag.mouseDownX,
        e.clientY - configRef.current.drag.mouseDownY
      );
      configRef.current.drag.isDragging = false;

      // If clicked without dragging on the Veena
      if (movedDist < 6 && configRef.current.artifactId === 'veena' && container) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(veenaHitTargets, false);
        if (intersects.length > 0) {
          const hit = intersects[0];
          const uData = hit.object.userData;
          if (uData && typeof uData.stringIndex === 'number') {
            triggerVeenaPluck(uData.stringIndex, hit.point.x);
          }
        }
      }
    };

    // Touch support for tablets and mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        configRef.current.drag.isDragging = true;
        configRef.current.drag.startX = touch.clientX;
        configRef.current.drag.startY = touch.clientY;
        configRef.current.drag.mouseDownX = touch.clientX;
        configRef.current.drag.mouseDownY = touch.clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const dist = Math.hypot(
          touch.clientX - configRef.current.drag.mouseDownX,
          touch.clientY - configRef.current.drag.mouseDownY
        );
        configRef.current.drag.isDragging = false;
        if (dist < 10 && configRef.current.artifactId === 'veena' && container) {
          const rect = container.getBoundingClientRect();
          mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(veenaHitTargets, false);
          if (intersects.length > 0) {
            const hit = intersects[0];
            const uData = hit.object.userData;
            if (uData && typeof uData.stringIndex === 'number') {
              triggerVeenaPluck(uData.stringIndex, hit.point.x);
            }
          }
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Zoom wheel
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.003;
      const nextZoom = THREE.MathUtils.clamp(camera.position.z + delta, 4.2, 9.5);
      camera.position.z = nextZoom;
      setZoomLevel(nextZoom);
    };
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 60FPS Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const { artifactId, lightingMode, autoRotate, stringPluckTime } = configRef.current;

      // Swap active model visibility
      Object.keys(models).forEach(key => {
        models[key].visible = (key === artifactId);
      });

      // Lighting mode adjustments
      if (lightingMode === 'candlelight') {
        const flicker = Math.sin(elapsed * 12) * 0.4 + Math.cos(elapsed * 19) * 0.25;
        candleLight.intensity = 3.8 + flicker;
        keyLight.intensity = 1.4;
      } else {
        candleLight.intensity = 1.0;
        keyLight.intensity = 3.2;
      }

      // Smooth inertia rotation
      if (!configRef.current.drag.isDragging) {
        configRef.current.drag.rotY += configRef.current.drag.velY;
        configRef.current.drag.rotX += configRef.current.drag.velX;
        configRef.current.drag.velY *= 0.94;
        configRef.current.drag.velX *= 0.94;

        if (autoRotate) {
          configRef.current.drag.rotY += 0.004;
        }
      }

      artifactGroup.rotation.y = configRef.current.drag.rotY;
      artifactGroup.rotation.x = configRef.current.drag.rotX;

      // String Pluck Harmonic Sine Wave Vibration
      const timeSincePluck = (performance.now() - stringPluckTime) / 1000;
      if (timeSincePluck < 0.8) {
        const vibrate = Math.sin(timeSincePluck * 90) * 0.04 * (1 - timeSincePluck / 0.8);
        if (ektaraStringMesh) {
          ektaraStringMesh.position.x = vibrate;
        }
        tanpuraStrings.forEach((str, i) => {
          str.position.z = 0.16 + Math.sin(timeSincePluck * 80 + i) * 0.03 * (1 - timeSincePluck / 0.8);
        });
      }

      // Veena 7-String Physical Vibration & Dynamic Resonance Glow
      if (configRef.current.artifactId === 'veena') {
        veenaStringMeshes.forEach((sMesh, i) => {
          const sPluck = configRef.current.veenaPluckTimes[i] || 0;
          const timeSince = (performance.now() - sPluck) / 1000;
          if (timeSince < 1.4) {
            const decay = Math.max(0, 1 - timeSince / 1.4);
            const vibFreq = VEENA_STRINGS[i].baseFreq > 220 ? 120 : 80;
            const yOffset = Math.sin(timeSince * vibFreq) * 0.022 * decay;
            sMesh.position.y = VEENA_STRINGS[i].baseY + yOffset;
            const mat = sMesh.material as THREE.MeshStandardMaterial;
            mat.emissive.setHex(0xE6B94D);
            mat.emissiveIntensity = 0.9 * decay;
          } else {
            sMesh.position.y = VEENA_STRINGS[i].baseY;
            const mat = sMesh.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = 0;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();

      // Free WebGL memory
      pedestalGeo.dispose();
      pedestalMat.dispose();
      inlayGeo.dispose();
      inlayMat.dispose();
      roganTexture.dispose();
      peacockTexture.dispose();
      parchmentTexture.dispose();
      sanjhiTexture.dispose();
      veenaFaceTexture.dispose();
      if (chhauMaskTex) (chhauMaskTex as THREE.Texture).dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleZoom = (dir: 'in' | 'out') => {
    setZoomLevel(prev => THREE.MathUtils.clamp(prev + (dir === 'in' ? -0.8 : 0.8), 4.2, 9.5));
  };

  const handleReset = () => {
    configRef.current.drag.rotX = 0.12;
    configRef.current.drag.rotY = 0.3;
    configRef.current.drag.velX = 0;
    configRef.current.drag.velY = 0;
    setZoomLevel(6.5);
  };

  return (
    <div className="bg-[#141311] border border-[#3A3630] rounded-3xl overflow-hidden shadow-2xl text-[#FDFBF7]">
      
      {/* Pavilion Header */}
      <div className="p-6 sm:p-8 border-b border-[#2C2924] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6B94D] animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6B94D]">
              3D Interactive Living Heritage Pavilion
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            Living Relics of Indian Craft & Riyaz
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A296] mt-1 font-light">
            Rotate 360°, switch to candlelight, and inspect authentic textures and sacred tools.
          </p>
        </div>

        {/* Artifact Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {ARTIFACTS.map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedArtifactId(a.id)}
              className={`py-2 px-3.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                selectedArtifactId === a.id
                  ? 'bg-[#C85A32] text-white font-semibold shadow-md scale-105'
                  : 'bg-black/40 hover:bg-black/70 text-[#D8D1C2] border border-[#3A3630]'
              }`}
            >
              {a.tabLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas & Curatorial Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        
        {/* 3D Canvas Viewport (7 Cols) */}
        <div className="lg:col-span-7 relative h-[420px] sm:h-[520px] lg:h-auto bg-gradient-to-b from-[#1C1A17] to-[#141311]">
          
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            title="Drag to rotate 360°"
          />

          {/* Veena 3D Interaction Hints & Real-time Swara Indicator */}
          {selectedArtifactId === 'veena' && (
            <div className="absolute top-4 left-4 z-10 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E6B94D]/30 text-[10px] font-mono text-[#FDFBF7] flex items-center gap-1.5 pointer-events-none shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#E6B94D]" />
              <span>Hover & click any 3D string or fret directly to pluck authentic notes</span>
            </div>
          )}

          {selectedArtifactId === 'veena' && activeVeenaNote && (
            <div className="absolute bottom-12 left-4 z-10 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E6B94D]/50 shadow-2xl flex items-center gap-3 animate-fade-in">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E6B94D] animate-ping" />
              <div>
                <div className="text-[10px] font-mono uppercase text-[#E6B94D] font-bold tracking-wider">
                  Resonating: {activeVeenaNote.stringName} ({activeVeenaNote.swara})
                </div>
                <div className="text-xs font-serif font-bold text-white flex items-center gap-2">
                  <span>{activeVeenaNote.noteLabel}</span>
                  <span className="text-[10px] font-mono text-[#D8D1C2]">[{activeVeenaNote.freq} Hz]</span>
                </div>
              </div>
              <div className="flex items-end gap-0.5 h-4 ml-1">
                <span className="w-1 bg-[#E6B94D] rounded-full animate-bounce" style={{ height: '70%', animationDuration: '400ms' }} />
                <span className="w-1 bg-[#E6B94D] rounded-full animate-bounce" style={{ height: '100%', animationDuration: '300ms' }} />
                <span className="w-1 bg-[#E6B94D] rounded-full animate-bounce" style={{ height: '40%', animationDuration: '500ms' }} />
                <span className="w-1 bg-[#E6B94D] rounded-full animate-bounce" style={{ height: '85%', animationDuration: '350ms' }} />
              </div>
            </div>
          )}

          {selectedArtifactId === 'veena' && hoveredVeenaString && !activeVeenaNote && (
            <div className="absolute bottom-12 left-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-[11px] text-[#E6B94D] font-mono flex items-center gap-2 shadow-lg">
              <Hand className="w-3.5 h-3.5 animate-pulse text-[#E6B94D]" />
              <span>Click string: {hoveredVeenaString}</span>
            </div>
          )}

          {/* Interactive Drag Hint */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#D8D1C2] pointer-events-none">
            <Hand className="w-3 h-3 text-[#E6B94D]" />
            <span>Click & drag 360° • Mouse wheel zooms</span>
          </div>

          {/* Viewport Control Bar */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-[#3A3630]">
            
            {/* Pluck / Acoustic Play Button if artifact has sound */}
            {selectedArtifact.hasAudioSample && (
              <button
                type="button"
                onClick={pluckInstrument}
                title={
                  selectedArtifact.id === 'chhau'
                    ? 'Play Chhau War Drum Cadence'
                    : selectedArtifact.id === 'sanjhi'
                    ? 'Ring Braj Temple Bells'
                    : selectedArtifact.id === 'veena'
                    ? 'Strum Saraswati Veena Tanam'
                    : 'Pluck Drone String'
                }
                className={`py-1 px-2.5 rounded-xl text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPlucking
                    ? 'bg-[#E6B94D] text-[#141311] scale-110 shadow-lg'
                    : 'bg-[#C85A32] text-white hover:bg-[#B34D28]'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {selectedArtifact.id === 'chhau'
                    ? 'War Drum'
                    : selectedArtifact.id === 'sanjhi'
                    ? 'Braj Aarti'
                    : selectedArtifact.id === 'veena'
                    ? 'Strum Tanam'
                    : 'Pluck String'}
                </span>
              </button>
            )}

            {/* Candlelight vs Studio */}
            <button
              type="button"
              onClick={() => setLightingMode(lightingMode === 'candlelight' ? 'studio' : 'candlelight')}
              title={`Switch Lighting Mode (Current: ${lightingMode})`}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                lightingMode === 'candlelight'
                  ? 'bg-[#E6B94D]/20 text-[#E6B94D] border border-[#E6B94D]/40'
                  : 'text-[#A8A296] hover:text-white'
              }`}
            >
              {lightingMode === 'candlelight' ? <Flame className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            {/* Auto Rotate Toggle */}
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto-Rotation"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                autoRotate ? 'text-[#E6B94D]' : 'text-[#8E877B] hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>

            {/* Zoom Controls */}
            <button
              type="button"
              onClick={() => handleZoom('in')}
              title="Zoom In"
              className="p-1.5 rounded-xl text-[#A8A296] hover:text-white cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom('out')}
              title="Zoom Out"
              className="p-1.5 rounded-xl text-[#A8A296] hover:text-white cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset View"
              className="p-1.5 rounded-xl text-[#A8A296] hover:text-white cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

        {/* Curatorial Provenance Sheet (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#181714] border-t lg:border-t-0 lg:border-l border-[#2C2924] flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#E6B94D] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#E6B94D]" />
                {selectedArtifact.tradition} • {selectedArtifact.region}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 leading-snug">
                {selectedArtifact.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#D8D1C2] leading-relaxed font-light">
              {selectedArtifact.description}
            </p>

            {/* Metadata Grid */}
            <div className="space-y-3 pt-3 border-t border-[#2C2924] text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#8E877B] uppercase font-mono text-[10px] shrink-0">Living Master:</span>
                <span className="font-semibold text-white text-right">{selectedArtifact.masterKeeper}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#8E877B] uppercase font-mono text-[10px] shrink-0">Sacred Material:</span>
                <span className="text-[#D8D1C2] text-right text-[11px]">{selectedArtifact.material}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#8E877B] uppercase font-mono text-[10px] shrink-0">Lineage Age:</span>
                <span className="font-mono text-[#E6B94D] text-right font-bold">{selectedArtifact.lineageAge}</span>
              </div>
            </div>

            {/* Dedicated Interactive Console for Saraswati Veena */}
            {selectedArtifact.id === 'veena' && (
              <div className="p-4 rounded-2xl bg-[#201D19] border border-[#E6B94D]/30 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#E6B94D] font-serif font-bold text-xs">
                    <Music className="w-4 h-4 text-[#E6B94D]" />
                    <span>Carnatic 7-String & Swara Console</span>
                  </div>
                  <button
                    type="button"
                    onClick={pluckInstrument}
                    className="px-2.5 py-1 bg-[#E6B94D] text-[#141311] hover:bg-[#F3C966] font-mono font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Strum Tanam</span>
                  </button>
                </div>

                {/* 4 Main Melody Strings */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#A8A296] tracking-wider block">
                    4 Main Playing Strings (Meetu):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {VEENA_STRINGS.slice(0, 4).map(s => (
                      <button
                        key={s.index}
                        type="button"
                        onClick={() => configRef.current.playVeenaStringFn?.(s.index)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          activeVeenaNote?.stringName === s.name
                            ? 'bg-[#E6B94D]/25 border-[#E6B94D] text-white shadow-md scale-[1.02]'
                            : 'bg-black/40 border-[#3A3630] hover:border-[#E6B94D]/60 text-[#D8D1C2]'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-[#E6B94D] font-bold">{s.name.split(' ')[0]}</span>
                        <span className="text-xs font-serif font-semibold">{s.swara}</span>
                        <span className="text-[9px] text-[#8E877B]">{Math.round(s.baseFreq)} Hz</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Side Tala Strings */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-[#A8A296] tracking-wider block">
                    3 Side Drone Strings (Pakka Sarani / Talam):
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {VEENA_STRINGS.slice(4).map(s => (
                      <button
                        key={s.index}
                        type="button"
                        onClick={() => configRef.current.playVeenaStringFn?.(s.index)}
                        className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                          activeVeenaNote?.stringName === s.name
                            ? 'bg-[#E6B94D]/25 border-[#E6B94D] text-white shadow-md scale-[1.02]'
                            : 'bg-black/40 border-[#3A3630] hover:border-[#E6B94D]/60 text-[#D8D1C2]'
                        }`}
                      >
                        <span className="text-[9px] font-mono text-[#E6B94D] block font-semibold">{s.swara}</span>
                        <span className="text-[9px] text-[#8E877B] block">{Math.round(s.baseFreq)} Hz</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sarani Fretboard Swaras */}
                <div className="space-y-1.5 pt-2 border-t border-[#3A3630]">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#E6B94D] tracking-wider">
                    <span>Sarani Swara Scale:</span>
                    <span className="text-[9px] text-[#8E877B] normal-case">Click to fret note</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {CARNATIC_SARANI_SWARAS.map(sw => (
                      <button
                        key={sw.fret}
                        type="button"
                        onClick={() => {
                          configRef.current.veenaPluckTimes[0] = performance.now();
                          playVeenaAcousticNote(sw.freq, 'steel', 1.0);
                          setActiveVeenaNote({
                            stringName: 'Sarani (1st Playing String)',
                            swara: sw.swara,
                            noteLabel: sw.noteLabel,
                            freq: sw.freq
                          });
                        }}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                          activeVeenaNote?.noteLabel === sw.noteLabel
                            ? 'bg-[#E6B94D] text-[#141311] border-[#E6B94D] font-bold shadow-md scale-105'
                            : 'bg-black/50 border-[#3A3630] hover:border-[#E6B94D] text-[#D8D1C2]'
                        }`}
                        title={`${sw.noteLabel} (${sw.freq} Hz)`}
                      >
                        {sw.swara}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-[#A8A296] leading-relaxed italic pt-1">
                  💡 Notice: In addition to the buttons above, you can hover and click directly on any string or fret in the 3D scene to trigger its vibration!
                </p>
              </div>
            )}

            {/* Acoustic Callout for Other Instruments, Martial Masks & Temple Bells */}
            {selectedArtifact.hasAudioSample && selectedArtifact.id !== 'veena' && (
              <div className="p-4 rounded-2xl bg-[#262420] border border-[#E6B94D]/20 text-xs space-y-2">
                <div className="flex items-center justify-between text-[#E6B94D] font-medium">
                  <span className="flex items-center gap-1.5 font-serif font-bold">
                    <Volume2 className="w-4 h-4" /> {
                      selectedArtifact.id === 'chhau'
                        ? 'Chhau Dhaamsa & Dhol Rhythm'
                        : selectedArtifact.id === 'sanjhi'
                        ? 'Braj Mandir Aarti Bells'
                        : 'Real-time Acoustic Drone'
                    }
                  </span>
                  <button
                    type="button"
                    onClick={pluckInstrument}
                    className="px-3 py-1 bg-[#E6B94D] text-[#141311] hover:bg-[#F3C966] font-mono font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    {
                      selectedArtifact.id === 'chhau'
                        ? 'Play War Drum'
                        : selectedArtifact.id === 'sanjhi'
                        ? 'Ring Aarti Bells'
                        : 'Pluck Sound'
                    }
                  </button>
                </div>
                <p className="text-[11px] text-[#A8A296] leading-relaxed">
                  {selectedArtifact.id === 'chhau'
                    ? 'Click Play War Drum to trigger the resonant Dhaamsa kettle drum and syncopated Dhol rolls of the Purulia Asura warrior dance.'
                    : selectedArtifact.id === 'sanjhi'
                    ? 'Click Ring Aarti Bells to hear the meditative evening temple bronze bells (528Hz Braj Aarti resonance) echoing through Vrindavan.'
                    : 'Click Pluck Sound to trigger genuine Web Audio harmonic resonance and observe the drone string oscillating physically in 3D.'}
                </p>
              </div>
            )}

          </div>

          {/* Action to learn more */}
          <div className="pt-4 border-t border-[#2C2924]">
            <button
              type="button"
              onClick={() => onLearnMore?.(selectedArtifact.id)}
              className="w-full py-3 px-4 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span>Explore Masterclasses in this Tradition →</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
