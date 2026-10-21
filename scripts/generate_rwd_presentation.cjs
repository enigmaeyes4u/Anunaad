const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

// --------------------------------------------------------------------------
// 1. GENERATE PPTX PRESENTATION VIA PPTXGENJS
// --------------------------------------------------------------------------
console.log('Generating PowerPoint presentation (.pptx)...');
const pptx = new pptxgen();

pptx.title = 'Legacy Responsive Web Design V8 — Certification Presentation';
pptx.author = 'Anurag Kumar (JSS Academy of Technical Education, Noida)';
pptx.subject = 'freeCodeCamp Developer Certification Presentation';
pptx.layout = 'LAYOUT_16x9';

// Color Palette
const C = {
  bgDark: '0B132B',
  surfaceDark: '1C2541',
  cardBg: '243254',
  primary: '3A86FF',
  primaryLight: '60A5FA',
  accent: '00F5D4',
  textLight: 'F8FAFC',
  textMuted: '94A3B8',
  white: 'FFFFFF',
  border: '334155',
  success: '10B981',
  warning: 'F59E0B'
};

function addSlideHeader(slide, title, category) {
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.45,
    w: 11.5,
    h: 0.28,
    fontSize: 9,
    fontFace: 'Segoe UI',
    color: C.accent,
    bold: true,
    charSpacing: 2
  });

  slide.addText(title, {
    x: 0.8,
    y: 0.72,
    w: 11.5,
    h: 0.55,
    fontSize: 22,
    fontFace: 'Segoe UI',
    color: C.textLight,
    bold: true
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.32,
    w: 1.8,
    h: 0.04,
    fill: { color: C.primary },
    line: { color: C.primary }
  });
}

function addFooter(slide, pageNum, totalPages = 18) {
  slide.addText('JSS Academy of Technical Education, Noida  |  Dept. of IT  |  Anurag Kumar', {
    x: 0.8,
    y: 7.05,
    w: 9.0,
    h: 0.3,
    fontSize: 8.5,
    fontFace: 'Segoe UI',
    color: C.textMuted
  });

  slide.addText(`Slide ${pageNum} of ${totalPages}`, {
    x: 11.0,
    y: 7.05,
    w: 1.5,
    h: 0.3,
    fontSize: 8.5,
    fontFace: 'Segoe UI',
    color: C.textMuted,
    align: 'right'
  });
}

// -------------------------------------------------------------
// SLIDE 1: TITLE SLIDE
// -------------------------------------------------------------
let s1 = pptx.addSlide();
s1.background = { color: C.bgDark };

s1.addText('JSS ACADEMY OF TECHNICAL EDUCATION, NOIDA\nDEPARTMENT OF INFORMATION TECHNOLOGY', {
  x: 1.0,
  y: 0.9,
  w: 11.3,
  h: 0.7,
  fontSize: 12,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true,
  charSpacing: 2
});

s1.addText('CERTIFICATION PRESENTATION', {
  x: 1.0,
  y: 1.8,
  w: 11.3,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.primaryLight,
  bold: true,
  charSpacing: 3
});

s1.addText('Legacy Responsive Web Design V8', {
  x: 1.0,
  y: 2.2,
  w: 11.3,
  h: 1.0,
  fontSize: 34,
  fontFace: 'Segoe UI',
  color: C.white,
  bold: true
});

s1.addText('freeCodeCamp Developer Certification  •  Comprehensive Technical & Academic Report', {
  x: 1.0,
  y: 3.25,
  w: 11.3,
  h: 0.45,
  fontSize: 13,
  fontFace: 'Segoe UI',
  color: C.textMuted
});

s1.addShape(pptx.ShapeType.roundRect, {
  x: 1.0,
  y: 4.1,
  w: 11.3,
  h: 2.3,
  fill: { color: C.surfaceDark },
  line: { color: C.border, width: 1 }
});

s1.addText([
  { text: 'Submitted by:\n', options: { fontSize: 10, color: C.accent, bold: true } },
  { text: 'ANURAG KUMAR\n', options: { fontSize: 20, color: C.white, bold: true } },
  { text: 'Bachelor of Technology — Information Technology\n', options: { fontSize: 12, color: C.primaryLight } },
  { text: 'JSS Academy of Technical Education, Noida\n\n', options: { fontSize: 11, color: C.textMuted } },
  { text: 'Certification Completion Date: 14 October 2026   |   Curriculum Work: ~300 Hours\nSubmitted in partial fulfilment of academic documentation requirements.', options: { fontSize: 10, color: C.textMuted } }
], {
  x: 1.3,
  y: 4.25,
  w: 10.7,
  h: 2.0,
  fontFace: 'Segoe UI'
});

addFooter(s1, 1);

// -------------------------------------------------------------
// SLIDE 2: CERTIFICATION DETAILS & VERIFICATION
// -------------------------------------------------------------
let s2 = pptx.addSlide();
s2.background = { color: C.bgDark };
addSlideHeader(s2, 'Official Certification Credentials & Verification', 'Credential Profile');

s2.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 6.8,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s2.addText('Official Credential Record', {
  x: 1.1,
  y: 1.8,
  w: 6.2,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

const certTable = [
  [
    { text: 'Field', options: { bold: true, color: C.white, fill: C.cardBg } },
    { text: 'Credential Record Details', options: { bold: true, color: C.white, fill: C.cardBg } }
  ],
  [{ text: 'Learner Name', options: { color: C.textLight } }, { text: 'Anurag Kumar', options: { bold: true, color: C.white } }],
  [{ text: 'Certification', options: { color: C.textLight } }, { text: 'Legacy Responsive Web Design V8', options: { color: C.accent } }],
  [{ text: 'Issuing Body', options: { color: C.textLight } }, { text: 'freeCodeCamp.org', options: { color: C.textLight } }],
  [{ text: 'Completion Date', options: { color: C.textLight } }, { text: '14 October 2026', options: { color: C.textLight } }],
  [{ text: 'Work Represented', options: { color: C.textLight } }, { text: 'Approximately 300 Hours', options: { color: C.warning } }],
  [{ text: 'Authorized Signatory', options: { color: C.textLight } }, { text: 'Quincy Larson, Executive Director', options: { color: C.textLight } }],
  [{ text: 'Verification Code', options: { color: C.textLight } }, { text: 'fcc-97775e43-3a55-46e0-aa41-90a285370607', options: { fontSize: 8, color: C.primaryLight } }]
];

s2.addTable(certTable, {
  x: 1.1,
  y: 2.25,
  w: 6.2,
  h: 4.1,
  fontSize: 9.5,
  fontFace: 'Segoe UI',
  colW: [2.0, 4.2],
  border: { color: C.border, pt: 0.5 },
  fill: C.surfaceDark
});

const metrics = [
  { label: '300 Hours', sub: 'Extensive coursework covering HTML5, CSS3, modern layout architectures & accessibility' },
  { label: '5 Core Projects', sub: 'Built full production-grade capstone web applications passing 100% of automated tests' },
  { label: 'Verified Online', sub: 'Publicly verifiable through freeCodeCamp.org encrypted credential database' }
];

metrics.forEach((m, i) => {
  s2.addShape(pptx.ShapeType.roundRect, {
    x: 8.0,
    y: 1.6 + i * 1.75,
    w: 4.5,
    h: 1.55,
    fill: { color: C.surfaceDark },
    line: { color: C.border }
  });

  s2.addText(m.label, {
    x: 8.25,
    y: 1.75 + i * 1.75,
    w: 4.0,
    h: 0.35,
    fontSize: 16,
    fontFace: 'Segoe UI',
    color: C.primaryLight,
    bold: true
  });

  s2.addText(m.sub, {
    x: 8.25,
    y: 2.15 + i * 1.75,
    w: 4.0,
    h: 0.85,
    fontSize: 9.5,
    fontFace: 'Segoe UI',
    color: C.textMuted
  });
});

addFooter(s2, 2);

// -------------------------------------------------------------
// SLIDE 3: ABSTRACT & EXECUTIVE SUMMARY
// -------------------------------------------------------------
let s3 = pptx.addSlide();
s3.background = { color: C.bgDark };
addSlideHeader(s3, 'Executive Summary & Core Web Design Philosophy', 'Overview');

s3.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 11.7,
  h: 1.25,
  fill: { color: C.surfaceDark },
  line: { color: C.primary, width: 1.5 }
});

s3.addText('Core Philosophy: "Responsive design is not simply shrinking a desktop layout onto a mobile phone. Instead, a responsive interface adapts content, spacing, navigation, and layout to the available viewport while preserving readability and effortless interaction."', {
  x: 1.1,
  y: 1.75,
  w: 11.1,
  h: 0.95,
  fontSize: 12,
  fontFace: 'Georgia',
  color: C.textLight,
  italic: true
});

const abstractCards = [
  {
    title: '1. Semantic Foundation',
    desc: 'Using HTML5 semantic elements (<header>, <nav>, <main>, <article>, <footer>) to provide machine-readable structure for browsers and assistive technologies.'
  },
  {
    title: '2. Modern Layout Engines',
    desc: 'Moving past brittle float/table layouts to CSS Flexbox (1D) and CSS Grid (2D) layout systems with fluid auto-fit calculations.'
  },
  {
    title: '3. Mobile-First Mindset',
    desc: 'Establishing lean mobile baselines first, then progressively enhancing the experience for larger viewports using min-width media queries.'
  },
  {
    title: '4. Universal Accessibility',
    desc: 'Rigorous compliance with WCAG 2.2 AA standards: keyboard navigable controls, high contrast ratios, and screen-reader accessibility.'
  }
];

abstractCards.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.8 + col * 6.0;
  const y = 3.1 + row * 1.85;

  s3.addShape(pptx.ShapeType.roundRect, {
    x: x,
    y: y,
    w: 5.7,
    h: 1.65,
    fill: { color: C.surfaceDark },
    line: { color: C.border }
  });

  s3.addText(c.title, {
    x: x + 0.3,
    y: y + 0.2,
    w: 5.1,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Segoe UI',
    color: C.accent,
    bold: true
  });

  s3.addText(c.desc, {
    x: x + 0.3,
    y: y + 0.55,
    w: 5.1,
    h: 0.95,
    fontSize: 9.5,
    fontFace: 'Segoe UI',
    color: C.textMuted
  });
});

addFooter(s3, 3);

// -------------------------------------------------------------
// SLIDE 4: CHAPTER 1 — PROBLEM STATEMENT & MOTIVATION
// -------------------------------------------------------------
let s4 = pptx.addSlide();
s4.background = { color: C.bgDark };
addSlideHeader(s4, 'Chapter 1: The Multi-Device Reality & Motivation', 'Foundations');

s4.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s4.addText('The Problem with Fixed-Width Design', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.warning,
  bold: true
});

s4.addText([
  { text: '• Device Fragmentation: ', options: { bold: true, color: C.white } },
  { text: 'Users access websites from 320px smartphones, 768px tablets, 1440px laptops, and 4K desktop screens.\n\n', options: { color: C.textMuted } },
  { text: '• Horizontal Scrolling: ', options: { bold: true, color: C.white } },
  { text: 'Fixed pixel widths (e.g. 1200px) force mobile users to pan horizontally, creating a broken experience.\n\n', options: { color: C.textMuted } },
  { text: '• Illegible Typography: ', options: { bold: true, color: C.white } },
  { text: 'Non-scalable text becomes unreadable without painful manual pinch-to-zoom.\n\n', options: { color: C.textMuted } },
  { text: '• Touch Frustration: ', options: { bold: true, color: C.white } },
  { text: 'Tiny, closely-packed links designed for mouse cursors are nearly impossible to tap accurately on touchscreens.', options: { color: C.textMuted } }
], {
  x: 1.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 10,
  fontFace: 'Segoe UI'
});

s4.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s4.addText('Certification Objectives & Motivation', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

s4.addText([
  { text: '• Universal Viewport Adaptation: ', options: { bold: true, color: C.white } },
  { text: 'Ensure identical information availability and aesthetic balance regardless of screen dimensions.\n\n', options: { color: C.textMuted } },
  { text: '• Semantic & Accessible Markup: ', options: { bold: true, color: C.white } },
  { text: 'Construct clean document outlines that support screen readers, search engines, and keyboard navigation.\n\n', options: { color: C.textMuted } },
  { text: '• Modern Layout Mastery: ', options: { bold: true, color: C.white } },
  { text: 'Harness CSS Flexbox and Grid to build dynamic, content-driven layouts that self-adjust without breaking.\n\n', options: { color: C.textMuted } },
  { text: '• Repeatable Engineering Workflow: ', options: { bold: true, color: C.white } },
  { text: 'Establish an empirical 5-stage pipeline: Planning -> Semantic HTML -> Mobile CSS -> Breakpoints -> Auditing.', options: { color: C.textMuted } }
], {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 10,
  fontFace: 'Segoe UI'
});

addFooter(s4, 4);

// -------------------------------------------------------------
// SLIDE 5: CHAPTER 1 — LEARNING METHODOLOGY & TOOLS
// -------------------------------------------------------------
let s5 = pptx.addSlide();
s5.background = { color: C.bgDark };
addSlideHeader(s5, 'Learning Methodology & Developer Tooling Ecosystem', 'Methodology');

const tools = [
  { step: '1. Theoretical Study', title: 'Standards & Specs', desc: 'Studied official W3C, WHATWG HTML Living Standard, and MDN Web Docs to understand element behaviors and styling cascade rules.' },
  { step: '2. Sandbox Coding', title: 'VS Code Environment', desc: 'Employed Visual Studio Code with Emmet abbreviations, Prettier code formatter, and local live development server for rapid iteration.' },
  { step: '3. Browser Inspection', title: 'Chromium DevTools', desc: 'Inspected DOM nodes, monitored the CSS Box Model visualizer, debugged computed styles, and simulated responsive devices.' },
  { step: '4. Capstone Testing', title: 'Automated Test Suites', desc: 'Engineered 5 full projects tested against freeCodeCamp automated CDN test runner to ensure 100% user story validation.' }
];

tools.forEach((t, i) => {
  s5.addShape(pptx.ShapeType.roundRect, {
    x: 0.8 + i * 2.95,
    y: 1.6,
    w: 2.8,
    h: 5.1,
    fill: { color: C.surfaceDark },
    line: { color: C.border }
  });

  s5.addText(t.step, {
    x: 1.0 + i * 2.95,
    y: 1.85,
    w: 2.4,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Segoe UI',
    color: C.accent,
    bold: true
  });

  s5.addText(t.title, {
    x: 1.0 + i * 2.95,
    y: 2.15,
    w: 2.4,
    h: 0.5,
    fontSize: 13,
    fontFace: 'Segoe UI',
    color: C.white,
    bold: true
  });

  s5.addText(t.desc, {
    x: 1.0 + i * 2.95,
    y: 2.8,
    w: 2.4,
    h: 3.5,
    fontSize: 9.5,
    fontFace: 'Segoe UI',
    color: C.textMuted
  });
});

addFooter(s5, 5);

// -------------------------------------------------------------
// SLIDE 6: CHAPTER 2 — SEMANTIC HTML & DOCUMENT STRUCTURE
// -------------------------------------------------------------
let s6 = pptx.addSlide();
s6.background = { color: C.bgDark };
addSlideHeader(s6, 'Chapter 2: Semantic HTML5 & Document Architecture', 'Core HTML');

s6.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s6.addText('Semantic HTML vs. Generic Containers', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 13,
  fontFace: 'Segoe UI',
  color: C.primaryLight,
  bold: true
});

s6.addText([
  { text: 'Non-Semantic Anti-Pattern:\n', options: { bold: true, color: C.warning } },
  { text: '<div class="header">\n  <div class="nav-links">...</div>\n</div>\n<div class="main-body">\n  <div class="article-post">...</div>\n</div>\n\n', options: { fontFace: 'Courier New', fontSize: 9, color: C.textMuted } },
  { text: 'Modern Semantic Architecture:\n', options: { bold: true, color: C.success } },
  { text: '<header>\n  <nav aria-label="Main Navigation">...</nav>\n</header>\n<main>\n  <article>\n    <h1>Article Title</h1>\n    <section>...</section>\n  </article>\n  <aside>Related Info</aside>\n</main>\n<footer>...</footer>', options: { fontFace: 'Courier New', fontSize: 9, color: C.accent } }
], {
  x: 1.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontFace: 'Segoe UI'
});

s6.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s6.addText('Key Principles & Document Head', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 13,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

s6.addText([
  { text: '• The Indispensable Viewport Meta Tag:\n', options: { bold: true, color: C.white } },
  { text: '<meta name="viewport" content="width=device-width, initial-scale=1.0">\nPrevents mobile browsers from assuming a 980px desktop width and downscaling.\n\n', options: { color: C.textMuted } },
  { text: '• Strict Heading Hierarchy:\n', options: { bold: true, color: C.white } },
  { text: 'A single <h1> per page for the document title, followed by logically nested <h2>, <h3>. Headings reflect content hierarchy, not desired visual font-size.\n\n', options: { color: C.textMuted } },
  { text: '• Button vs. Link Distinction:\n', options: { bold: true, color: C.white } },
  { text: 'Use <button> for page actions, modals, and submissions. Use <a href="..."> strictly for navigating to a new URL destination.\n\n', options: { color: C.textMuted } },
  { text: '• Informative Media:\n', options: { bold: true, color: C.white } },
  { text: 'Every <img> must have an alt attribute: informative descriptions for content, empty alt="" for decorative images.', options: { color: C.textMuted } }
], {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 9.5,
  fontFace: 'Segoe UI'
});

addFooter(s6, 6);

// -------------------------------------------------------------
// SLIDE 7: CHAPTER 2 — THE CSS BOX MODEL & SIZING RESET
// -------------------------------------------------------------
let s7 = pptx.addSlide();
s7.background = { color: C.bgDark };
addSlideHeader(s7, 'The CSS Box Model & Universal Sizing Strategy', 'Box Model');

s7.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s7.addText('Anatomy of the CSS Box Model', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

const boxLayers = [
  { name: 'MARGIN (Outer Layer)', desc: 'Transparent exterior space separating the element from adjacent sibling elements.', color: 'F59E0B' },
  { name: 'BORDER (Perimeter)', desc: 'Structural boundary surrounding the padding. Can have width, style, and color.', color: '10B981' },
  { name: 'PADDING (Internal Spacing)', desc: 'Clear breathing room between the content area and the outer border.', color: '3A86FF' },
  { name: 'CONTENT (Core Area)', desc: 'The actual payload: text, imagery, video, or nested child elements.', color: '8B5CF6' }
];

boxLayers.forEach((layer, i) => {
  s7.addShape(pptx.ShapeType.rect, {
    x: 1.1,
    y: 2.4 + i * 1.0,
    w: 5.1,
    h: 0.85,
    fill: { color: C.cardBg },
    line: { color: layer.color, width: 1.5 }
  });

  s7.addText(layer.name, {
    x: 1.25,
    y: 2.45 + i * 1.0,
    w: 4.8,
    h: 0.25,
    fontSize: 9.5,
    fontFace: 'Segoe UI',
    color: layer.color,
    bold: true
  });

  s7.addText(layer.desc, {
    x: 1.25,
    y: 2.72 + i * 1.0,
    w: 4.8,
    h: 0.5,
    fontSize: 8.5,
    fontFace: 'Segoe UI',
    color: C.textLight
  });
});

s7.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s7.addText('The "Border-Box" Revolution', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.primaryLight,
  bold: true
});

s7.addText([
  { text: '• The Legacy Problem: content-box (Default)\n', options: { bold: true, color: C.warning } },
  { text: 'width: 300px + padding: 20px + border: 2px\n=> Total Rendered Width = 344px!\nThis leads to layout wrapping and unintended horizontal scrollbars.\n\n', options: { fontSize: 9.5, color: C.textMuted } },
  { text: '• Modern Universal Reset: border-box\n', options: { bold: true, color: C.success } },
  { text: '*, *::before, *::after {\n  box-sizing: border-box;\n}\nWith border-box, declared width = 300px includes padding & border. Sizing becomes predictable, intuitive, and mathematically sound.\n\n', options: { fontFace: 'Courier New', fontSize: 9, color: C.accent } },
  { text: '• Consistent Spacing Scale Tokens:\n', options: { bold: true, color: C.white } },
  { text: 'Define systematic spacing increments (4px, 8px, 16px, 24px, 32px, 48px) to establish harmonious rhythm throughout the interface.', options: { fontSize: 9.5, color: C.textMuted } }
], {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontFace: 'Segoe UI'
});

addFooter(s7, 7);

// -------------------------------------------------------------
// SLIDE 8: CHAPTER 2 — CSS CASCADE & FLUID TYPOGRAPHY
// -------------------------------------------------------------
let s8 = pptx.addSlide();
s8.background = { color: C.bgDark };
addSlideHeader(s8, 'The CSS Cascade Engine & Fluid Typography', 'Styling Logic');

s8.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s8.addText('Cascade Resolution & Specificity Weights', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 13,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

const specWeights = [
  { level: '1. Inline Styles', score: '(1, 0, 0, 0)', example: 'style="color: red;" (Highest precedence)' },
  { level: '2. ID Selectors', score: '(0, 1, 0, 0)', example: '#main-nav, #hero-banner' },
  { level: '3. Class, Attribute, Pseudo', score: '(0, 0, 1, 0)', example: '.card, [type="text"], :hover' },
  { level: '4. Element & Pseudo-element', score: '(0, 0, 0, 1)', example: 'h1, p, nav, ::before' }
];

specWeights.forEach((sw, i) => {
  s8.addShape(pptx.ShapeType.rect, {
    x: 1.1,
    y: 2.35 + i * 1.0,
    w: 5.1,
    h: 0.85,
    fill: { color: C.cardBg },
    line: { color: C.border }
  });

  s8.addText(`${sw.level} — Weight: ${sw.score}`, {
    x: 1.25,
    y: 2.42 + i * 1.0,
    w: 4.8,
    h: 0.25,
    fontSize: 9.5,
    fontFace: 'Segoe UI',
    color: C.primaryLight,
    bold: true
  });

  s8.addText(sw.example, {
    x: 1.25,
    y: 2.7 + i * 1.0,
    w: 4.8,
    h: 0.45,
    fontSize: 8.5,
    fontFace: 'Courier New',
    color: C.textLight
  });
});

s8.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s8.addText('Fluid Typography & Relative Units', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 13,
  fontFace: 'Segoe UI',
  color: C.primaryLight,
  bold: true
});

s8.addText([
  { text: '• Relative Units: rem vs. em:\n', options: { bold: true, color: C.white } },
  { text: 'rem (Root EM) scales based on the user\'s root font size (usually 16px). Respects user browser preferences. em scales relative to parent font size.\n\n', options: { fontSize: 9.5, color: C.textMuted } },
  { text: '• Modern Fluid Typography with clamp():\n', options: { bold: true, color: C.accent } },
  { text: 'font-size: clamp(1.25rem, 2.5vw, 2.75rem);\nEliminates clunky jumpy media queries by continuously calculating font size between minimum and maximum bounds.\n\n', options: { fontFace: 'Courier New', fontSize: 9, color: C.accent } },
  { text: '• Optimal Legibility Metrics:\n', options: { bold: true, color: C.white } },
  { text: 'Line length: 45 to 75 characters per line (max-width: 65ch).\nLine height: 1.5 to 1.6 for comfortable body reading.\n\n', options: { fontSize: 9.5, color: C.textMuted } },
  { text: '• WCAG 2.2 Contrast:\n', options: { bold: true, color: C.white } },
  { text: 'Minimum 4.5:1 contrast ratio for normal text; 3:1 for large text.', options: { fontSize: 9.5, color: C.textMuted } }
], {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontFace: 'Segoe UI'
});

addFooter(s8, 8);

// -------------------------------------------------------------
// SLIDE 9: CHAPTER 3 — RESPONSIVE DESIGN & MOBILE-FIRST
// -------------------------------------------------------------
let s9 = pptx.addSlide();
s9.background = { color: C.bgDark };
addSlideHeader(s9, 'Chapter 3: Mobile-First Strategy & Flexible Media', 'Responsive Logic');

s9.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s9.addText('The Mobile-First Architecture', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

s9.addText([
  { text: '• Designing for Narrow Constraints First:\n', options: { bold: true, color: C.white } },
  { text: 'Start with base CSS for small screens. Focus on the core content, linear single-column layout, and clear typography.\n\n', options: { color: C.textMuted } },
  { text: '• Progressive Enhancement with min-width:\n', options: { bold: true, color: C.primaryLight } },
  { text: '/* Base styles (Mobile) */\n.grid { display: block; }\n\n/* Tablet Enhancement */\n@media (min-width: 768px) {\n  .grid { display: grid; grid-template-columns: 1fr 1fr; }\n}\n\n/* Desktop Enhancement */\n@media (min-width: 1024px) {\n  .grid { grid-template-columns: repeat(4, 1fr); }\n}\n', options: { fontFace: 'Courier New', fontSize: 8.5, color: C.accent } },
  { text: '• Key Advantage: Eliminates bloated CSS where mobile rules try to override complex desktop layouts.', options: { color: C.textMuted } }
], {
  x: 1.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 9.5,
  fontFace: 'Segoe UI'
});

s9.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s9.addText('Flexible Images & Media Handling', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.primaryLight,
  bold: true
});

s9.addText([
  { text: '• The Golden Rule of Responsive Images:\n', options: { bold: true, color: C.white } },
  { text: 'img, video, canvas, svg {\n  max-width: 100%;\n  height: auto;\n  display: block;\n}\nAllows visual media to scale down fluidly with its parent container while maintaining its natural aspect ratio.\n\n', options: { fontFace: 'Courier New', fontSize: 9, color: C.accent } },
  { text: '• Aspect Ratio & object-fit:\n', options: { bold: true, color: C.white } },
  { text: 'object-fit: cover ensures images fill thumbnail card containers without distortion or stretching.\naspect-ratio: 16 / 9 reserves layout space before media loads, preventing Cumulative Layout Shift (CLS).\n\n', options: { color: C.textMuted } },
  { text: '• High-DPI Displays:\n', options: { bold: true, color: C.white } },
  { text: 'Utilizing <picture> and srcset for serving optimized image resolutions according to device pixel ratio.', options: { color: C.textMuted } }
], {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 9.5,
  fontFace: 'Segoe UI'
});

addFooter(s9, 9);

// -------------------------------------------------------------
// SLIDE 10: CHAPTER 3 — CSS FLEXBOX (1D LAYOUT)
// -------------------------------------------------------------
let s10 = pptx.addSlide();
s10.background = { color: C.bgDark };
addSlideHeader(s10, 'Modern Layout Systems: CSS Flexbox (1-Dimensional)', 'Flexbox Engine');

s10.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 11.7,
  h: 0.8,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s10.addText('CSS Flexbox is an axis-based layout system engineered for arranging items along a single dimension (either a row or a column). It excels at space distribution, component alignment, and dynamic wrapping.', {
  x: 1.1,
  y: 1.75,
  w: 11.1,
  h: 0.5,
  fontSize: 10.5,
  fontFace: 'Segoe UI',
  color: C.textLight
});

const flexCards = [
  {
    title: 'Main Axis Alignment',
    code: 'justify-content:',
    vals: 'flex-start | center | space-between | space-evenly',
    desc: 'Controls how items are spaced horizontally (in row mode) or vertically (in column mode).'
  },
  {
    title: 'Cross Axis Alignment',
    code: 'align-items:',
    vals: 'stretch | center | flex-start | flex-end | baseline',
    desc: 'Aligns items perpendicular to the main axis. Solves perfect vertical centering effortlessly.'
  },
  {
    title: 'Wrapping & Gaps',
    code: 'flex-wrap: wrap;  gap: 1rem;',
    vals: 'Prevents overflow on narrow screens',
    desc: 'Allows child elements to drop naturally into subsequent rows without explicit media queries.'
  },
  {
    title: 'Item Flex Sizing',
    code: 'flex: 1 1 250px;',
    vals: 'flex-grow | flex-shrink | flex-basis',
    desc: 'Dictates whether an item expands to fill free space, shrinks under pressure, or starts at a base width.'
  }
];

flexCards.forEach((fc, i) => {
  s10.addShape(pptx.ShapeType.roundRect, {
    x: 0.8 + i * 2.95,
    y: 2.6,
    w: 2.8,
    h: 4.1,
    fill: { color: C.surfaceDark },
    line: { color: C.border }
  });

  s10.addText(fc.title, {
    x: 1.0 + i * 2.95,
    y: 2.8,
    w: 2.4,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Segoe UI',
    color: C.accent,
    bold: true
  });

  s10.addText(fc.code, {
    x: 1.0 + i * 2.95,
    y: 3.25,
    w: 2.4,
    h: 0.3,
    fontSize: 9.5,
    fontFace: 'Courier New',
    color: C.primaryLight,
    bold: true
  });

  s10.addText(fc.vals, {
    x: 1.0 + i * 2.95,
    y: 3.6,
    w: 2.4,
    h: 0.45,
    fontSize: 8.5,
    fontFace: 'Courier New',
    color: C.warning
  });

  s10.addText(fc.desc, {
    x: 1.0 + i * 2.95,
    y: 4.2,
    w: 2.4,
    h: 2.3,
    fontSize: 9,
    fontFace: 'Segoe UI',
    color: C.textMuted
  });
});

addFooter(s10, 10);

// -------------------------------------------------------------
// SLIDE 11: CHAPTER 3 — CSS GRID (2D LAYOUT)
// -------------------------------------------------------------
let s11 = pptx.addSlide();
s11.background = { color: C.bgDark };
addSlideHeader(s11, 'Modern Layout Systems: CSS Grid (2-Dimensional)', 'Grid Engine');

s11.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s11.addText('CSS Grid: 2D Spatial Control', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

s11.addText([
  { text: '• The Holy Grail of Responsive Cards:\n', options: { bold: true, color: C.white } },
  { text: '.card-container {\n  display: grid;\n  grid-template-columns:\n    repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}\n\n', options: { fontFace: 'Courier New', fontSize: 9, color: C.accent } },
  { text: '• Why this line of CSS is revolutionary:\n', options: { bold: true, color: C.primaryLight } },
  { text: '1. auto-fit: Fits as many columns as will physically fit in the available width.\n2. minmax(280px, 1fr): Cards will NEVER shrink below 280px, but will expand equally (1fr) to fill leftover whitespace.\n3. Zero Media Queries: Automatically transitions from 1 column on mobile to 2, 3, or 4 columns on desktop!', options: { fontSize: 9.5, color: C.textMuted } }
], {
  x: 1.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontFace: 'Segoe UI'
});

s11.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s11.addText('Flexbox vs. Grid: Architecture Decision Matrix', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 13,
  fontFace: 'Segoe UI',
  color: C.primaryLight,
  bold: true
});

const matrixTable = [
  [
    { text: 'Feature', options: { bold: true, color: C.white, fill: C.cardBg } },
    { text: 'CSS Flexbox', options: { bold: true, color: C.accent, fill: C.cardBg } },
    { text: 'CSS Grid', options: { bold: true, color: C.primaryLight, fill: C.cardBg } }
  ],
  [{ text: 'Dimensions', options: { color: C.white } }, { text: '1-Dimensional (Row OR Col)' }, { text: '2-Dimensional (Rows & Cols)' }],
  [{ text: 'Primary Focus', options: { color: C.white } }, { text: 'Content-driven flow' }, { text: 'Layout-driven structure' }],
  [{ text: 'Overlap', options: { color: C.white } }, { text: 'Difficult without absolute' }, { text: 'Native via grid areas' }],
  [{ text: 'Best For', options: { color: C.white } }, { text: 'Navbars, buttons, media items' }, { text: 'Page shells, photo grids' }]
];

s11.addTable(matrixTable, {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 2.4,
  fontSize: 8.5,
  fontFace: 'Segoe UI',
  colW: [1.2, 1.95, 1.95],
  border: { color: C.border, pt: 0.5 },
  fill: C.surfaceDark
});

s11.addText('Hybrid Best Practice: Use CSS Grid to define the overarching page skeleton and gallery structures, and use CSS Flexbox inside individual cards and headers to align icons, text, and actions.', {
  x: 7.1,
  y: 4.9,
  w: 5.1,
  h: 1.5,
  fontSize: 9.5,
  fontFace: 'Georgia',
  color: C.textLight,
  italic: true
});

addFooter(s11, 11);

// -------------------------------------------------------------
// SLIDE 12: CHAPTER 4 — ACCESSIBILITY & WCAG 2.2
// -------------------------------------------------------------
let s12 = pptx.addSlide();
s12.background = { color: C.bgDark };
addSlideHeader(s12, 'Chapter 4: Web Accessibility (a11y) & WCAG 2.2', 'Accessibility');

const a11yPillars = [
  {
    letter: 'P',
    title: 'Perceivable',
    desc: 'Information must be presentable in ways users can perceive. High contrast text (>=4.5:1), text alternatives (alt="") for visual graphics, and clear visual boundaries.'
  },
  {
    letter: 'O',
    title: 'Operable',
    desc: 'All interactive controls must be operable via keyboard (Tab, Shift+Tab, Enter, Space). Visible :focus-visible outlines are strictly mandatory. No keyboard traps.'
  },
  {
    letter: 'U',
    title: 'Understandable',
    desc: 'Interface behavior must be predictable. Clear error identification on forms, logical reading sequence, and avoiding abrupt layout jumps during interaction.'
  },
  {
    letter: 'R',
    title: 'Robust',
    desc: 'Content must be robust enough to be interpreted by a wide range of user agents, assistive technologies (screen readers like NVDA/VoiceOver), and evolving browser engines.'
  }
];

a11yPillars.forEach((p, i) => {
  s12.addShape(pptx.ShapeType.roundRect, {
    x: 0.8 + i * 2.95,
    y: 1.6,
    w: 2.8,
    h: 5.1,
    fill: { color: C.surfaceDark },
    line: { color: C.border }
  });

  s12.addText(p.letter, {
    x: 1.0 + i * 2.95,
    y: 1.85,
    w: 2.4,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Segoe UI',
    color: C.accent,
    bold: true
  });

  s12.addText(p.title, {
    x: 1.0 + i * 2.95,
    y: 2.5,
    w: 2.4,
    h: 0.35,
    fontSize: 13,
    fontFace: 'Segoe UI',
    color: C.white,
    bold: true
  });

  s12.addText(p.desc, {
    x: 1.0 + i * 2.95,
    y: 2.95,
    w: 2.4,
    h: 3.4,
    fontSize: 9.5,
    fontFace: 'Segoe UI',
    color: C.textMuted
  });
});

addFooter(s12, 12);

// -------------------------------------------------------------
// SLIDE 13: CHAPTER 4 — ACCESSIBLE FORMS & TOUCH TARGETS
// -------------------------------------------------------------
let s13 = pptx.addSlide();
s13.background = { color: C.bgDark };
addSlideHeader(s13, 'Accessible Input Controls & Touch Ergonomics', 'Forms & Touch');

s13.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s13.addText('Accessible Form Engineering', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.primaryLight,
  bold: true
});

s13.addText([
  { text: '• Programmatic Label Association:\n', options: { bold: true, color: C.white } },
  { text: '<label for="user-email">Email Address</label>\n<input type="email" id="user-email" required>\nEvery form field must have an explicit label so screen readers announce field intent immediately.\n\n', options: { fontFace: 'Courier New', fontSize: 9, color: C.accent } },
  { text: '• Mobile Virtual Keyboard Optimization:\n', options: { bold: true, color: C.white } },
  { text: 'Using input types (email, tel, number) triggers device-specific soft keyboards, eliminating user data-entry friction.\n\n', options: { color: C.textMuted } },
  { text: '• Accessible Error Feedback:\n', options: { bold: true, color: C.white } },
  { text: 'Never rely on color alone to indicate invalid fields. Use clear text prompts coupled with aria-describedby for assistive readers.', options: { color: C.textMuted } }
], {
  x: 1.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 9.5,
  fontFace: 'Segoe UI'
});

s13.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s13.addText('Touch Ergonomics & Responsive Zoom', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

s13.addText([
  { text: '• Minimum 44x44px Touch Targets:\n', options: { bold: true, color: C.white } },
  { text: 'Mobile tap targets must be at least 44x44 CSS pixels with adequate padding between clickable elements to prevent accidental miss-clicks.\n\n', options: { color: C.textMuted } },
  { text: '• 200% Zoom Tolerance:\n', options: { bold: true, color: C.white } },
  { text: 'Under WCAG guidelines, a page must scale to 200% zoom without triggering horizontal scrollbars or clipping text.\n\n', options: { color: C.textMuted } },
  { text: '• Motion Sensitivity (Vestibular Disorders):\n', options: { bold: true, color: C.white } },
  { text: '@media (prefers-reduced-motion: reduce) {\n  * {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}\nRespects user OS preferences by disabling jarring motion.', options: { fontFace: 'Courier New', fontSize: 8.5, color: C.accent } }
], {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 9.5,
  fontFace: 'Segoe UI'
});

addFooter(s13, 13);

// -------------------------------------------------------------
// SLIDE 14: CHAPTER 4 — ENGINEERING WORKFLOW & VIEWPORT TESTING
// -------------------------------------------------------------
let s14 = pptx.addSlide();
s14.background = { color: C.bgDark };
addSlideHeader(s14, 'Development Workflow & Cross-Viewport Testing', 'Engineering Pipeline');

const stages = [
  { num: '01', title: 'Content & Architecture', desc: 'Identify core message, wireframe content hierarchy, and plan mobile-first reading order.' },
  { num: '02', title: 'Semantic Markup', desc: 'Write clean, valid HTML5 with proper tags, accessible labels, and heading structure.' },
  { num: '03', title: 'Base Mobile CSS', desc: 'Apply global box-sizing: border-box reset, color tokens, and fluid single-column styles.' },
  { num: '04', title: 'Responsive Breakpoints', desc: 'Introduce min-width media queries, Flexbox alignments, and CSS Grid auto-fit tracks.' },
  { num: '05', title: 'Verification & Audit', desc: 'Perform multi-device emulation (320px to 4K), 200% zoom check, and Lighthouse audits.' }
];

stages.forEach((st, i) => {
  s14.addShape(pptx.ShapeType.roundRect, {
    x: 0.8 + i * 2.35,
    y: 1.6,
    w: 2.25,
    h: 5.1,
    fill: { color: C.surfaceDark },
    line: { color: C.border }
  });

  s14.addText(st.num, {
    x: 1.0 + i * 2.35,
    y: 1.85,
    w: 1.85,
    h: 0.45,
    fontSize: 22,
    fontFace: 'Segoe UI',
    color: C.primaryLight,
    bold: true
  });

  s14.addText(st.title, {
    x: 1.0 + i * 2.35,
    y: 2.4,
    w: 1.85,
    h: 0.65,
    fontSize: 12,
    fontFace: 'Segoe UI',
    color: C.white,
    bold: true
  });

  s14.addText(st.desc, {
    x: 1.0 + i * 2.35,
    y: 3.15,
    w: 1.85,
    h: 3.2,
    fontSize: 9,
    fontFace: 'Segoe UI',
    color: C.textMuted
  });
});

addFooter(s14, 14);

// -------------------------------------------------------------
// SLIDE 15: CHAPTER 5 — CAPSTONE PROJECTS (300 HOURS)
// -------------------------------------------------------------
let s15 = pptx.addSlide();
s15.background = { color: C.bgDark };
addSlideHeader(s15, 'Chapter 5: Capstone Projects Built & Verified', 'Practical Projects');

const projects = [
  { name: '1. Responsive Survey Form', tech: 'HTML5 Form Controls, CSS Flexbox', desc: 'Engineered a multi-input interactive survey with custom styled radios/checkboxes, input validation, and single-column mobile wrapping.' },
  { name: '2. Tribute Page', tech: 'Fluid Media, Semantic Storytelling', desc: 'Biographical tribute featuring an responsive fluid hero image, timeline card grid, and centered typography with optimal reading measure.' },
  { name: '3. Product Landing Page', tech: 'Fixed Navbar, Video Embed, CSS Grid', desc: 'Commercial landing page with sticky responsive navigation drawer, embedded media, and 3-tier responsive pricing cards.' },
  { name: '4. Technical Documentation', tech: 'Split Sidebar, Scrollspy, Code Blocks', desc: 'Developer doc page with desktop sticky sidebar navigation, mobile collapsible menu, formatted syntax blocks, and smooth intra-page links.' },
  { name: '5. Personal Portfolio Page', tech: 'Complete Responsive Web Presence', desc: 'Production portfolio showcasing project grid with hover micro-interactions, responsive contact form, and accessible social links.' }
];

projects.forEach((pj, i) => {
  s15.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6 + i * 1.02,
    w: 11.7,
    h: 0.92,
    fill: { color: C.surfaceDark },
    line: { color: C.border }
  });

  s15.addText(pj.name, {
    x: 1.1,
    y: 1.68 + i * 1.02,
    w: 3.8,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Segoe UI',
    color: C.accent,
    bold: true
  });

  s15.addText(pj.tech, {
    x: 1.1,
    y: 2.0 + i * 1.02,
    w: 3.8,
    h: 0.45,
    fontSize: 8.5,
    fontFace: 'Courier New',
    color: C.primaryLight
  });

  s15.addText(pj.desc, {
    x: 5.1,
    y: 1.68 + i * 1.02,
    w: 7.1,
    h: 0.75,
    fontSize: 9,
    fontFace: 'Segoe UI',
    color: C.textLight
  });
});

addFooter(s15, 15);

// -------------------------------------------------------------
// SLIDE 16: CHAPTER 5 — OUTCOMES & PROBLEM SOLVING
// -------------------------------------------------------------
let s16 = pptx.addSlide();
s16.background = { color: C.bgDark };
addSlideHeader(s16, 'Technical Outcomes & Problem-Solving Lessons', 'Outcomes');

s16.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s16.addText('Core Engineering Competencies Mastered', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.success,
  bold: true
});

s16.addText([
  { text: '• Device-Agnostic Mindset: ', options: { bold: true, color: C.white } },
  { text: 'Developed an instinct for fluid layouts that adapt organically to content constraints rather than arbitrary device dimensions.\n\n', options: { color: C.textMuted } },
  { text: '• Semantic & Structural Rigor: ', options: { bold: true, color: C.white } },
  { text: 'Ability to construct clean, accessible HTML structures that render reliably across diverse browsers and screen readers.\n\n', options: { color: C.textMuted } },
  { text: '• Modern Layout Fluency: ', options: { bold: true, color: C.white } },
  { text: 'Complete fluency in CSS Grid and Flexbox layout calculations, eliminating archaic float hacks and fragile absolute positioning.\n\n', options: { color: C.textMuted } },
  { text: '• Empirical Quality Assurance: ', options: { bold: true, color: C.white } },
  { text: 'Established habits of proactive browser debugging, viewport testing, and accessibility auditing before shipping code.', options: { color: C.textMuted } }
], {
  x: 1.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 9.5,
  fontFace: 'Segoe UI'
});

s16.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s16.addText('Key Challenges & Engineering Solutions', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.warning,
  bold: true
});

s16.addText([
  { text: '• Challenge 1: CSS Specificity Wars\n', options: { bold: true, color: C.white } },
  { text: 'Solution: Maintained flat selector hierarchies using reusable BEM-inspired class selectors, completely avoiding deep nested element selectors and !important overrides.\n\n', options: { color: C.textMuted } },
  { text: '• Challenge 2: Unintended Horizontal Overflow\n', options: { bold: true, color: C.white } },
  { text: 'Solution: Diagnosed root causes using DevTools outline scripts, applied max-width: 100% constraints on media, and set overflow-x: clip.\n\n', options: { color: C.textMuted } },
  { text: '• Challenge 3: Breakpoint Proliferation\n', options: { bold: true, color: C.white } },
  { text: 'Solution: Shifted from device-specific media queries to content-driven breakpoints and intrinsic CSS Grid repeat(auto-fit, minmax(...)) patterns.', options: { color: C.textMuted } }
], {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 9.5,
  fontFace: 'Segoe UI'
});

addFooter(s16, 16);

// -------------------------------------------------------------
// SLIDE 17: FUTURE SCOPE & ADVANCED ROADMAP
// -------------------------------------------------------------
let s17 = pptx.addSlide();
s17.background = { color: C.bgDark };
addSlideHeader(s17, 'Future Scope & Front-End Engineering Roadmap', 'Roadmap');

const futureTracks = [
  {
    step: 'Phase 1: Dynamic Interactivity',
    title: 'JavaScript & Web APIs',
    desc: 'Mastering modern ES6+ features, asynchronous Fetch API for dynamic backend integration, DOM event handling, and local client storage.'
  },
  {
    step: 'Phase 2: Component Architecture',
    title: 'React 19 & TypeScript',
    desc: 'Transitioning from static pages to scalable component architectures, state management, strict type safety, and modern build tooling (Vite).'
  },
  {
    step: 'Phase 3: Next-Gen CSS',
    title: 'Container Queries & Subgrid',
    desc: 'Leveraging CSS @container queries for component-level responsiveness independent of viewport size, native CSS nesting, and CSS subgrid.'
  },
  {
    step: 'Phase 4: Web Performance',
    title: 'Core Web Vitals & CI/CD',
    desc: 'Optimizing Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), automated accessibility regression testing, and CI/CD pipelines.'
  }
];

futureTracks.forEach((ft, i) => {
  s17.addShape(pptx.ShapeType.roundRect, {
    x: 0.8 + i * 2.95,
    y: 1.6,
    w: 2.8,
    h: 5.1,
    fill: { color: C.surfaceDark },
    line: { color: C.border }
  });

  s17.addText(ft.step, {
    x: 1.0 + i * 2.95,
    y: 1.85,
    w: 2.4,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Segoe UI',
    color: C.accent,
    bold: true
  });

  s17.addText(ft.title, {
    x: 1.0 + i * 2.95,
    y: 2.15,
    w: 2.4,
    h: 0.5,
    fontSize: 13,
    fontFace: 'Segoe UI',
    color: C.white,
    bold: true
  });

  s17.addText(ft.desc, {
    x: 1.0 + i * 2.95,
    y: 2.8,
    w: 2.4,
    h: 3.5,
    fontSize: 9.5,
    fontFace: 'Segoe UI',
    color: C.textMuted
  });
});

addFooter(s17, 17);

// -------------------------------------------------------------
// SLIDE 18: CONCLUSION & REFERENCES
// -------------------------------------------------------------
let s18 = pptx.addSlide();
s18.background = { color: C.bgDark };
addSlideHeader(s18, 'Conclusion & Formal Academic References', 'Conclusion');

s18.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s18.addText('Academic & Professional Conclusion', {
  x: 1.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.accent,
  bold: true
});

s18.addText([
  { text: '• 300 Hours Completed: ', options: { bold: true, color: C.white } },
  { text: 'The completion of the Legacy Responsive Web Design V8 curriculum represents approximately 300 hours of intensive study, design, and coding.\n\n', options: { color: C.textMuted } },
  { text: '• Core Achievement: ', options: { bold: true, color: C.white } },
  { text: 'Bridged theoretical computer science concepts with modern front-end web engineering, creating interfaces that are universally readable, accessible, and performant.\n\n', options: { color: C.textMuted } },
  { text: '• Academic Fulfillment: ', options: { bold: true, color: C.white } },
  { text: 'Prepared in partial fulfilment of academic documentation requirements for Bachelor of Technology in Information Technology, JSS Academy of Technical Education, Noida.', options: { color: C.textMuted } }
], {
  x: 1.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontSize: 10,
  fontFace: 'Segoe UI'
});

s18.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.6,
  w: 5.7,
  h: 5.1,
  fill: { color: C.surfaceDark },
  line: { color: C.border }
});

s18.addText('Formal Standards & References', {
  x: 7.1,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Segoe UI',
  color: C.primaryLight,
  bold: true
});

s18.addText([
  { text: '[1] freeCodeCamp.org: ', options: { bold: true, color: C.white } },
  { text: 'Legacy Responsive Web Design V8 Developer Certification. Completed 14 October 2026.\nURL: freecodecamp.org/certification/fcc-97775e43-3a55-46e0-aa41-90a285370607/responsive-web-design\n\n', options: { fontSize: 8.5, color: C.textMuted } },
  { text: '[2] WHATWG: ', options: { bold: true, color: C.white } },
  { text: 'HTML Living Standard — html.spec.whatwg.org\n\n', options: { fontSize: 8.5, color: C.textMuted } },
  { text: '[3] W3C: ', options: { bold: true, color: C.white } },
  { text: 'Cascading Style Sheets (CSS) Specifications — w3.org/Style/CSS\n\n', options: { fontSize: 8.5, color: C.textMuted } },
  { text: '[4] W3C Web Accessibility Initiative (WAI): ', options: { bold: true, color: C.white } },
  { text: 'Web Content Accessibility Guidelines (WCAG) 2.2 — w3.org/TR/WCAG22\n\n', options: { fontSize: 8.5, color: C.textMuted } },
  { text: '[5] MDN Web Docs: ', options: { bold: true, color: C.white } },
  { text: 'Mozilla Developer Network Guides on Responsive Design, CSS Flexbox & CSS Grid.', options: { fontSize: 8.5, color: C.textMuted } }
], {
  x: 7.1,
  y: 2.3,
  w: 5.1,
  h: 4.2,
  fontFace: 'Segoe UI'
});

addFooter(s18, 18);

// -------------------------------------------------------------
// SAVE PPTX TO DOWNLOADS & PROJECT FOLDER
// -------------------------------------------------------------
const downloadsDir = 'C:\\Users\\HP\\Downloads';
const projectDir = path.resolve(__dirname, '..');

const pptxTargetDownloads = path.join(downloadsDir, 'Responsive_Web_Design_V8_Presentation.pptx');
const pptxTargetProject = path.join(projectDir, 'Responsive_Web_Design_V8_Presentation.pptx');

pptx.writeFile({ fileName: pptxTargetDownloads }).then(() => {
  console.log(`PowerPoint successfully written to: ${pptxTargetDownloads}`);
  try {
    fs.copyFileSync(pptxTargetDownloads, pptxTargetProject);
    console.log(`PowerPoint backup copied to: ${pptxTargetProject}`);
  } catch (e) {
    console.error('Could not copy to project folder:', e.message);
  }
}).catch(err => {
  console.error('Error writing PPTX:', err);
});
