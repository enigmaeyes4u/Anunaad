const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building high-aesthetic HTML presentation & PDF slide deck...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Legacy Responsive Web Design V8 — Presentation | Anurag Kumar</title>
<style>
  /* --- RESET & PRINT SETTINGS --- */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page {
    size: 16in 9in;
    margin: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #050811;
    color: #f8fafc;
    overflow-x: hidden;
  }

  /* --- SLIDE CONTAINER --- */
  .slide {
    width: 16in;
    height: 9in;
    position: relative;
    padding: 0.65in 0.85in 0.75in 0.85in;
    background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #111827 100%);
    page-break-after: always;
    break-after: page;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  /* Subtle background grid pattern */
  .slide::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
    z-index: 1;
  }

  .slide-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* --- HEADER STYLING --- */
  .slide-header {
    margin-bottom: 0.3in;
  }

  .category-pill {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 9999px;
    color: #38bdf8;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .slide-title {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }

  .title-accent-bar {
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #38bdf8, #818cf8);
    border-radius: 2px;
    margin-top: 8px;
  }

  /* --- FOOTER STYLING --- */
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 11px;
    color: #64748b;
    position: relative;
    z-index: 2;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .footer-tag {
    color: #94a3b8;
    font-weight: 500;
  }

  .slide-number {
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
    padding: 2px 10px;
    border-radius: 6px;
    border: 1px solid rgba(56, 189, 248, 0.2);
  }

  /* --- CARD & GRID SYSTEM --- */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35in;
    flex: 1;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.3in;
    flex: 1;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.25in;
    flex: 1;
  }

  .grid-5 {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.2in;
    flex: 1;
  }

  .card {
    background: rgba(22, 30, 49, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 0.28in;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  }

  .card-highlight {
    background: rgba(30, 41, 67, 0.85);
    border: 1px solid rgba(56, 189, 248, 0.25);
    box-shadow: 0 12px 30px -5px rgba(56, 189, 248, 0.1);
  }

  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-subtitle {
    font-size: 11px;
    font-weight: 600;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .card-desc {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.6;
  }

  /* --- CODE BLOCKS --- */
  .code-box {
    background: #060913;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 12px 16px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 11px;
    color: #38bdf8;
    line-height: 1.5;
    margin: 8px 0;
    overflow: hidden;
  }

  .code-keyword { color: #f43f5e; }
  .code-selector { color: #fbbf24; }
  .code-prop { color: #38bdf8; }
  .code-val { color: #34d399; }
  .code-comment { color: #64748b; font-style: italic; }

  /* --- TABLES --- */
  .styled-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin-top: 8px;
  }

  .styled-table th {
    background: rgba(56, 189, 248, 0.12);
    color: #38bdf8;
    font-weight: 700;
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(56, 189, 248, 0.3);
  }

  .styled-table td {
    padding: 7px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: #cbd5e1;
  }

  .styled-table tr:last-child td {
    border-bottom: none;
  }

  /* --- BADGES & PILLS --- */
  .badge-emerald {
    background: rgba(52, 211, 153, 0.15);
    color: #34d399;
    border: 1px solid rgba(52, 211, 153, 0.3);
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
  }

  .badge-sky {
    background: rgba(56, 189, 248, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
  }

  .badge-amber {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.3);
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
  }

  /* --- BROWSER CONTROLS (Only visible when viewing HTML interactively) --- */
  @media screen {
    body {
      background: #02040a;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0 80px 0;
    }
    .slide {
      margin-bottom: 30px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }
    .interactive-bar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 9999px;
      padding: 10px 24px;
      display: flex;
      gap: 18px;
      align-items: center;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    .interactive-btn {
      background: #38bdf8;
      color: #04101e;
      border: none;
      padding: 6px 16px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .interactive-btn:hover {
      background: #7dd3fc;
      transform: scale(1.05);
    }
    .interactive-counter {
      color: #f8fafc;
      font-size: 12px;
      font-weight: 600;
    }
  }

  @media print {
    .interactive-bar {
      display: none !important;
    }
  }
</style>
</head>
<body>

<!-- ============================================================== -->
<!-- SLIDE 1: TITLE & COVER SLIDE -->
<!-- ============================================================== -->
<div class="slide" id="slide-1">
  <div class="slide-content">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <div class="category-pill">Academic Certification Presentation</div>
        <div style="font-size: 15px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; margin-bottom: 4px;">
          JSS ACADEMY OF TECHNICAL EDUCATION, NOIDA
        </div>
        <div style="font-size: 12px; color: #64748b; font-weight: 600; letter-spacing: 0.5px;">
          DEPARTMENT OF INFORMATION TECHNOLOGY
        </div>
      </div>
      <div style="text-align: right;">
        <span class="badge-emerald" style="font-size: 11px; padding: 6px 14px; border-radius: 9999px;">
          ✓ VERIFIED DEVELOPER CREDENTIAL
        </span>
      </div>
    </div>

    <div style="margin: 0.4in 0;">
      <div style="font-size: 16px; font-weight: 700; color: #38bdf8; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">
        Certification Report & Technical Architecture
      </div>
      <h1 style="font-size: 46px; font-weight: 900; line-height: 1.1; margin-bottom: 14px; background: linear-gradient(135deg, #ffffff 0%, #38bdf8 60%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        Legacy Responsive Web Design V8
      </h1>
      <p style="font-size: 16px; color: #94a3b8; max-width: 85%;">
        Comprehensive Study of Modern Front-End Architecture: Semantic HTML5, CSS Cascade & Box Sizing, Flexbox, CSS Grid, Fluid Typography, and WCAG 2.2 Accessibility.
      </p>
    </div>

    <!-- Candidate Profile Card -->
    <div style="background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px; padding: 22px 28px; display: grid; grid-template-columns: 2fr 1.2fr; gap: 24px;">
      <div>
        <div style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
          Submitted By
        </div>
        <div style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 4px;">
          ANURAG KUMAR
        </div>
        <div style="font-size: 13px; color: #cbd5e1; font-weight: 500;">
          Bachelor of Technology — Information Technology
        </div>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
          JSS Academy of Technical Education, Noida
        </div>
      </div>
      <div style="border-left: 1px solid rgba(255, 255, 255, 0.1); padding-left: 24px; display: flex; flex-direction: column; justify-content: center;">
        <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
          <strong style="color: #ffffff;">Curriculum Work:</strong> Approximately 300 Hours
        </div>
        <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
          <strong style="color: #ffffff;">Completion Date:</strong> 14 October 2026
        </div>
        <div style="font-size: 10px; color: #64748b; font-style: italic;">
          Submitted in partial fulfilment of academic documentation requirements.
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span class="footer-tag">freeCodeCamp Developer Certification</span>
        <span>•</span>
        <span>Candidate: Anurag Kumar</span>
      </div>
      <span class="slide-number">Slide 1 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 2: CERTIFICATION DETAILS & VERIFICATION -->
<!-- ============================================================== -->
<div class="slide" id="slide-2">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Official Credentials</div>
      <h2 class="slide-title">Certification Details & Academic Verification</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Left: Official Record Table -->
      <div class="card card-highlight">
        <div class="card-subtitle">Credential Transcript</div>
        <div class="card-title">freeCodeCamp Official Record</div>
        <p class="card-desc" style="margin-bottom: 12px;">
          The certification was awarded upon successful completion of curriculum coursework and 5 automated capstone projects.
        </p>
        <table class="styled-table">
          <tr>
            <th style="width: 35%;">Field</th>
            <th>Transcribed Detail</th>
          </tr>
          <tr>
            <td><strong>Learner Name</strong></td>
            <td><span style="color: #ffffff; font-weight: 700;">Anurag Kumar</span></td>
          </tr>
          <tr>
            <td><strong>Certification</strong></td>
            <td><span style="color: #38bdf8;">Legacy Responsive Web Design V8</span></td>
          </tr>
          <tr>
            <td><strong>Issuing Body</strong></td>
            <td>freeCodeCamp.org</td>
          </tr>
          <tr>
            <td><strong>Completion Date</strong></td>
            <td>14 October 2026</td>
          </tr>
          <tr>
            <td><strong>Work Represented</strong></td>
            <td><span class="badge-amber">Approximately 300 Hours</span></td>
          </tr>
          <tr>
            <td><strong>Executive Signatory</strong></td>
            <td>Quincy Larson, Executive Director</td>
          </tr>
          <tr>
            <td><strong>Verification URL</strong></td>
            <td style="font-family: monospace; font-size: 9px; color: #38bdf8; word-break: break-all;">
              https://freecodecamp.org/certification/fcc-97775e43-3a55-46e0-aa41-90a285370607/responsive-web-design
            </td>
          </tr>
        </table>
      </div>

      <!-- Right: Milestone Stats -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="card" style="flex: 1; justify-content: center;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div style="font-size: 38px; font-weight: 900; color: #38bdf8;">300+</div>
            <span class="badge-sky">Intensive Training</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 4px;">Hours of Coursework & Labs</div>
          <p class="card-desc" style="margin-top: 4px;">
            Encompassed deep theoretical understanding, responsive debugging, accessibility constraints, and multi-device implementation.
          </p>
        </div>

        <div class="card" style="flex: 1; justify-content: center;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div style="font-size: 38px; font-weight: 900; color: #34d399;">5 / 5</div>
            <span class="badge-emerald">100% Pass Rate</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 4px;">Capstone Web Projects Built</div>
          <p class="card-desc" style="margin-top: 4px;">
            Passed 100% of automated functional test suites verifying semantic DOM architecture, responsive viewport constraints, and validation logic.
          </p>
        </div>

        <div class="card" style="flex: 1; justify-content: center;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div style="font-size: 20px; font-weight: 800; color: #fbbf24;">WCAG 2.2 AA</div>
            <span class="badge-amber">Standards Compliance</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 4px;">Accessibility-First Engineering</div>
          <p class="card-desc" style="margin-top: 4px;">
            Full adherence to keyboard navigation protocols, contrast ratios, and screen-reader accessibility across all deliverables.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>JSS Academy of Technical Education, Noida</span>
        <span>•</span>
        <span>B.Tech Information Technology</span>
      </div>
      <span class="slide-number">Slide 2 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 3: ABSTRACT & EXECUTIVE SUMMARY -->
<!-- ============================================================== -->
<div class="slide" id="slide-3">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Executive Summary</div>
      <h2 class="slide-title">Abstract & Foundational Web Philosophy</h2>
      <div class="title-accent-bar"></div>
    </div>

    <!-- Guiding Quote Banner -->
    <div style="background: linear-gradient(90deg, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.1)); border-left: 4px solid #38bdf8; border-radius: 0 12px 12px 0; padding: 16px 24px; margin-bottom: 20px;">
      <p style="font-size: 15px; font-style: italic; color: #f1f5f9; line-height: 1.6;">
        "The central objective of responsive design is not simply to shrink a desktop layout onto a mobile phone. Instead, a responsive interface adapts content, spacing, navigation, and layout to the available viewport while preserving readability, interaction integrity, and effortless usability."
      </p>
      <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-top: 6px; letter-spacing: 1px;">
        — ANURAG KUMAR, CERTIFICATION REPORT ABSTRACT
      </div>
    </div>

    <!-- 4 Core Pillars Grid -->
    <div class="grid-4">
      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 10px;">Pillar 01</div>
        <div class="card-title">Semantic HTML5</div>
        <p class="card-desc">
          Building a robust document skeleton using semantic tags (<tt>&lt;header&gt;</tt>, <tt>&lt;main&gt;</tt>, <tt>&lt;article&gt;</tt>) that informs search engines and assistive screen readers of true content meaning.
        </p>
      </div>

      <div class="card">
        <div class="badge-emerald" style="width: fit-content; margin-bottom: 10px;">Pillar 02</div>
        <div class="card-title">Fluid Layout Engines</div>
        <p class="card-desc">
          Moving beyond rigid fixed-pixel coordinates. Harnessing CSS Flexbox (1D) and CSS Grid (2D) for intrinsic content-driven flexibility and zero-break layouts.
        </p>
      </div>

      <div class="card">
        <div class="badge-amber" style="width: fit-content; margin-bottom: 10px;">Pillar 03</div>
        <div class="card-title">Mobile-First Logic</div>
        <p class="card-desc">
          Designing for constrained narrow screens first. Establishing lean, efficient base CSS rules and progressively enhancing the experience via <tt>min-width</tt> media queries.
        </p>
      </div>

      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 10px;">Pillar 04</div>
        <div class="card-title">Universal a11y</div>
        <p class="card-desc">
          Engineering for all humans: keyboard-only navigation (<tt>:focus-visible</tt>), 44×44px touch targets, 4.5:1 color contrast, and 200% zoom stability without horizontal overflow.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Keywords: Semantic HTML5, CSS Grid, Flexbox, Mobile-First, WCAG 2.2, Responsive Typography</span>
      </div>
      <span class="slide-number">Slide 3 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 4: CHAPTER 1 — THE PROBLEM SPACE & MOTIVATION -->
<!-- ============================================================== -->
<div class="slide" id="slide-4">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 1 — Introduction</div>
      <h2 class="slide-title">The Multi-Device Reality & Problem Statement</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Left: The Problem -->
      <div class="card" style="border-left: 3px solid #f43f5e;">
        <div class="card-subtitle" style="color: #f43f5e;">The Legacy Flaw</div>
        <div class="card-title" style="color: #f43f5e;">Fixed-Width Desktop Assumptions</div>
        <p class="card-desc" style="margin-bottom: 14px;">
          For years, websites were designed for uniform desktop monitors with fixed pixel coordinates (e.g. 960px or 1200px containers). This paradigm completely breaks on modern connected devices.
        </p>
        <ul style="font-size: 12px; color: #cbd5e1; line-height: 1.8; padding-left: 18px;">
          <li><strong style="color: #ffffff;">Horizontal Scrolling:</strong> Fixed-width containers force mobile users into clumsy two-axis scrolling.</li>
          <li><strong style="color: #ffffff;">Clipped Content & Overflows:</strong> Text and cards get cut off outside the mobile viewport boundaries.</li>
          <li><strong style="color: #ffffff;">Illegible Micro-Typography:</strong> When desktop layouts are auto-scaled, fonts shrink down to unreadable sizes.</li>
          <li><strong style="color: #ffffff;">Tap Target Frustration:</strong> Links and buttons clustered together cause accidental mis-taps on touchscreens.</li>
        </ul>
      </div>

      <!-- Right: The Responsive Solution -->
      <div class="card" style="border-left: 3px solid #34d399;">
        <div class="card-subtitle" style="color: #34d399;">The Responsive Paradigm</div>
        <div class="card-title" style="color: #34d399;">Fluidity, Hierarchy & Ergonomics</div>
        <p class="card-desc" style="margin-bottom: 14px;">
          Responsive design treats the viewport as a dynamic continuum rather than a fixed canvas. Content flows gracefully into the available space while preserving interaction dignity.
        </p>
        <ul style="font-size: 12px; color: #cbd5e1; line-height: 1.8; padding-left: 18px;">
          <li><strong style="color: #ffffff;">Universal Viewport Adaptation:</strong> Seamless display on 320px phones, 820px tablets, and 4K widescreen displays.</li>
          <li><strong style="color: #ffffff;">Single-Column Mobile Flow:</strong> Complex multi-column desktop grids gracefully stack into linear reading streams.</li>
          <li><strong style="color: #ffffff;">Touch Ergonomics:</strong> Expanding button heights to at least 44×44px for thumb-friendly mobile interaction.</li>
          <li><strong style="color: #ffffff;">Zero Information Loss:</strong> Mobile visitors access the exact same essential information without artificial gating.</li>
        </ul>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 1.1–1.3: Background, Problem Statement, and Architectural Motivation</span>
      </div>
      <span class="slide-number">Slide 4 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 5: CHAPTER 1 — METHODOLOGY & TOOLING -->
<!-- ============================================================== -->
<div class="slide" id="slide-5">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 1 — Engineering Approach</div>
      <h2 class="slide-title">Learning Methodology & Tooling Ecosystem</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-4">
      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 8px;">Stage 01</div>
        <div class="card-title">W3C & MDN Study</div>
        <div class="card-subtitle">Standards Ingestion</div>
        <p class="card-desc">
          Studied official W3C specifications and MDN Web Docs to understand exact box calculation math, stacking contexts, and selector specificity algorithms.
        </p>
        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 10px; color: #38bdf8;">
          Ref: WHATWG Living Standard
        </div>
      </div>

      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 8px;">Stage 02</div>
        <div class="card-title">VS Code & Emmet</div>
        <div class="card-subtitle">Developer Environment</div>
        <p class="card-desc">
          Configured Visual Studio Code with Emmet syntactic expansion, Prettier code formatting, and local Live Server for real-time hot reloading during CSS edits.
        </p>
        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 10px; color: #38bdf8;">
          Tools: VS Code + Git
        </div>
      </div>

      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 8px;">Stage 03</div>
        <div class="card-title">DevTools Profiling</div>
        <div class="card-subtitle">Inspection & Emulation</div>
        <p class="card-desc">
          Utilized Chromium DevTools Device Mode to emulate diverse screen densities (DPR 1x, 2x, 3x), inspect computed CSS styles, and audit layout boundaries.
        </p>
        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 10px; color: #38bdf8;">
          Tools: Edge/Chrome DevTools
        </div>
      </div>

      <div class="card">
        <div class="badge-emerald" style="width: fit-content; margin-bottom: 8px;">Stage 04</div>
        <div class="card-title">Automated CDN Tests</div>
        <div class="card-subtitle">Verification Pipeline</div>
        <p class="card-desc">
          Integrated freeCodeCamp automated test scripts into live projects to validate user stories: media query triggers, semantic element usage, and CSS Grid layout integrity.
        </p>
        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 10px; color: #34d399;">
          Result: 100% Tests Passed
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 1.7–1.8: Learning Methodology, Developer Tools, and Working Environment</span>
      </div>
      <span class="slide-number">Slide 5 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 6: CHAPTER 2 — SEMANTIC HTML & DOCUMENT STRUCTURE -->
<!-- ============================================================== -->
<div class="slide" id="slide-6">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 2 — Foundations</div>
      <h2 class="slide-title">Semantic HTML5 & Document Architecture</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Code Comparison -->
      <div class="card">
        <div class="card-subtitle">Code Architecture Comparison</div>
        <div class="card-title">Semantic Markup vs. Div Soup</div>
        
        <div style="font-size: 10px; color: #f43f5e; font-weight: 700; margin-top: 4px;">❌ Non-Semantic Anti-Pattern (Div Soup):</div>
        <div class="code-box">
<span class="code-comment">&lt;!-- Screen readers cannot understand hierarchy --&gt;</span>
&lt;<span class="code-keyword">div</span> id=<span class="code-val">"header"</span>&gt;
  &lt;<span class="code-keyword">div</span> class=<span class="code-val">"nav"</span>&gt;&lt;<span class="code-keyword">div</span> onclick=<span class="code-val">"goto()"</span>&gt;Home&lt;/<span class="code-keyword">div</span>&gt;&lt;/<span class="code-keyword">div</span>&gt;
&lt;/<span class="code-keyword">div</span>&gt;
&lt;<span class="code-keyword">div</span> class=<span class="code-val">"main-content"</span>&gt;
  &lt;<span class="code-keyword">div</span> class=<span class="code-val">"article"</span>&gt;Heading&lt;/<span class="code-keyword">div</span>&gt;
&lt;/<span class="code-keyword">div</span>&gt;
        </div>

        <div style="font-size: 10px; color: #34d399; font-weight: 700; margin-top: 8px;">✓ Modern Semantic HTML5 Standard:</div>
        <div class="code-box">
<span class="code-comment">&lt;!-- Communicates explicit roles to browser & assistive tech --&gt;</span>
&lt;<span class="code-keyword">header</span>&gt;
  &lt;<span class="code-keyword">nav</span> aria-label=<span class="code-val">"Primary"</span>&gt;
    &lt;<span class="code-keyword">a</span> href=<span class="code-val">"#home"</span>&gt;Home&lt;/<span class="code-keyword">a</span>&gt;
  &lt;/<span class="code-keyword">nav</span>&gt;
&lt;/<span class="code-keyword">header</span>&gt;
&lt;<span class="code-keyword">main</span>&gt;
  &lt;<span class="code-keyword">article</span>&gt;
    &lt;<span class="code-keyword">h1</span>&gt;Document Title&lt;/<span class="code-keyword">h1</span>&gt;
    &lt;<span class="code-keyword">section</span>&gt;...&lt;/<span class="code-keyword">section</span>&gt;
  &lt;/<span class="code-keyword">article</span>&gt;
&lt;/<span class="code-keyword">main</span>&gt;
        </div>
      </div>

      <!-- Key Semantic Rules -->
      <div class="card card-highlight">
        <div class="card-subtitle">Structural Standards</div>
        <div class="card-title">Core HTML5 Architectural Rules</div>
        <ul style="font-size: 11.5px; color: #cbd5e1; line-height: 1.8; padding-left: 18px;">
          <li>
            <strong style="color: #ffffff;">The Critical Viewport Meta Tag:</strong><br>
            <code style="color: #38bdf8; font-size: 10px;">&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code><br>
            Instructs the mobile browser engine to match viewport width 1:1 with screen pixels, preventing arbitrary downscaling.
          </li>
          <li>
            <strong style="color: #ffffff;">Strict Heading Hierarchy:</strong><br>
            Maintain an unbroken cascade from <tt>&lt;h1&gt;</tt> through <tt>&lt;h6&gt;</tt>. Never choose a heading level simply for default font size; use CSS to style visual scale.
          </li>
          <li>
            <strong style="color: #ffffff;">Buttons vs. Anchor Links:</strong><br>
            Use <tt>&lt;button&gt;</tt> for actions that manipulate UI state or submit data. Use <tt>&lt;a href="..."&gt;</tt> strictly for navigating to a new URI destination.
          </li>
          <li>
            <strong style="color: #ffffff;">Meaningful Media Attributes:</strong><br>
            Every informative <tt>&lt;img&gt;</tt> requires descriptive <tt>alt</tt> text. Purely decorative images must use empty <tt>alt=""</tt> so screen readers ignore them gracefully.
          </li>
        </ul>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 2.1–2.2: HTML and Semantic Structure, Document Head, and Landmarks</span>
      </div>
      <span class="slide-number">Slide 6 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 7: CHAPTER 2 — THE CSS BOX MODEL & SIZING RESET -->
<!-- ============================================================== -->
<div class="slide" id="slide-7">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 2 — Layout Foundations</div>
      <h2 class="slide-title">The CSS Box Model & The Border-Box Reset</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Left: Box Model Schematic -->
      <div class="card">
        <div class="card-subtitle">Anatomy of an Element</div>
        <div class="card-title">The Four Concentric Box Layers</div>
        
        <!-- Visual Nested Box Model -->
        <div style="background: rgba(245, 158, 11, 0.15); border: 2px dashed #f59e0b; border-radius: 12px; padding: 14px; text-align: center; margin-top: 10px;">
          <div style="font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 8px;">MARGIN (External Spacing)</div>
          
          <div style="background: rgba(16, 185, 129, 0.2); border: 2px solid #10b981; border-radius: 8px; padding: 12px;">
            <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 8px;">BORDER (Element Outline)</div>
            
            <div style="background: rgba(56, 189, 248, 0.2); border: 2px solid #38bdf8; border-radius: 6px; padding: 10px;">
              <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">PADDING (Internal Buffer)</div>
              
              <div style="background: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; padding: 10px; color: #ffffff; font-weight: 800; font-size: 12px;">
                CONTENT (Text, Images, Media)
              </div>
            </div>
          </div>
        </div>

        <p class="card-desc" style="margin-top: 12px;">
          Every DOM element rendered by the browser conforms to these four layers. Understanding how padding and borders interact with declared width is essential for responsive layout stability.
        </p>
      </div>

      <!-- Right: Box Sizing Fix -->
      <div class="card card-highlight">
        <div class="card-subtitle">The Universal Sizing Fix</div>
        <div class="card-title">content-box vs. border-box</div>
        
        <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px;">
          <div style="font-size: 11px; font-weight: 700; color: #f43f5e;">Default: content-box (Layout Breaking)</div>
          <p style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
            <code style="color: #ffffff;">width: 300px; padding: 20px; border: 2px;</code><br>
            Rendered Width = 300 + 40 (padding) + 4 (border) = <strong style="color: #f43f5e;">344px</strong>.<br>
            Causes parent containers to overflow and wrap unexpectedly.
          </p>
        </div>

        <div style="background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 8px; padding: 10px 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #34d399;">Modern Reset: border-box (Predictable Math)</div>
          <div class="code-box" style="margin: 6px 0;">
<span class="code-selector">*, *::before, *::after</span> {
  <span class="code-prop">box-sizing</span>: <span class="code-val">border-box</span>;
}
          </div>
          <p style="font-size: 11px; color: #cbd5e1;">
            Rendered Width = exactly <strong style="color: #34d399;">300px</strong>. Padding and borders are absorbed inward, making responsive percentage calculations mathematically airtight.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 2.4: The Box Model, Box-Sizing Strategies, and Margin Collapse</span>
      </div>
      <span class="slide-number">Slide 7 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 8: CHAPTER 2 — CSS CASCADE & FLUID TYPOGRAPHY -->
<!-- ============================================================== -->
<div class="slide" id="slide-8">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 2 — Styling Architecture</div>
      <h2 class="slide-title">The CSS Cascade Engine & Fluid Typography</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Left: Cascade & Specificity -->
      <div class="card">
        <div class="card-subtitle">Conflict Resolution Engine</div>
        <div class="card-title">Cascade & Specificity Weights</div>
        <p class="card-desc" style="margin-bottom: 10px;">
          When competing CSS rules target the same element, the cascade resolves priority through strict specificity scoring:
        </p>

        <table class="styled-table">
          <tr>
            <th>Selector Level</th>
            <th>Weight Tuple</th>
            <th>Example</th>
          </tr>
          <tr>
            <td><strong style="color: #f43f5e;">Inline Styles</strong></td>
            <td><code>(1, 0, 0, 0)</code></td>
            <td><code>style="color: blue;"</code></td>
          </tr>
          <tr>
            <td><strong style="color: #fbbf24;">ID Selectors</strong></td>
            <td><code>(0, 1, 0, 0)</code></td>
            <td><code>#main-nav</code></td>
          </tr>
          <tr>
            <td><strong style="color: #38bdf8;">Classes & Attributes</strong></td>
            <td><code>(0, 0, 1, 0)</code></td>
            <td><code>.card, [type="text"]</code></td>
          </tr>
          <tr>
            <td><strong style="color: #94a3b8;">Elements & Pseudo</strong></td>
            <td><code>(0, 0, 0, 1)</code></td>
            <td><code>h1, p, ::before</code></td>
          </tr>
        </table>

        <div style="background: rgba(56, 189, 248, 0.08); border-radius: 8px; padding: 8px 12px; margin-top: 12px; font-size: 11px; color: #94a3b8;">
          <strong style="color: #ffffff;">Best Practice:</strong> Keep selectors flat with single reusable class names to avoid painful specificity wars and eliminate the need for <tt>!important</tt>.
        </div>
      </div>

      <!-- Right: Fluid Typography -->
      <div class="card card-highlight">
        <div class="card-subtitle">Modern Font Scaling</div>
        <div class="card-title">Fluid Typography with clamp()</div>
        <p class="card-desc">
          Instead of writing disjointed media queries that abruptly jump font sizes between breakpoints, modern CSS provides dynamic mathematical interpolation:
        </p>

        <div class="code-box">
<span class="code-selector">h1</span> {
  <span class="code-comment">/* clamp(MIN, PREFERRED_SCALING, MAX) */</span>
  <span class="code-prop">font-size</span>: <span class="code-val">clamp(1.75rem, 4vw + 1rem, 3.5rem)</span>;
  <span class="code-prop">line-height</span>: <span class="code-val">1.2</span>;
}
        </div>

        <ul style="font-size: 11.5px; color: #cbd5e1; line-height: 1.8; padding-left: 18px; margin-top: 8px;">
          <li><strong style="color: #ffffff;">rem Units:</strong> Anchors font sizing to root browser preferences, preserving accessibility for users who scale default text.</li>
          <li><strong style="color: #ffffff;">Optimal Line Measure:</strong> Restricting text containers to <tt>max-width: 65ch</tt> prevents line lengths from exceeding the 45–75 character reading sweet spot.</li>
          <li><strong style="color: #ffffff;">WCAG Contrast:</strong> Text colors meet minimum 4.5:1 contrast against dark background surfaces.</li>
        </ul>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 2.3 & 2.5: CSS Cascade, Specificity, Typography Hierarchy, and Contrast</span>
      </div>
      <span class="slide-number">Slide 8 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 9: CHAPTER 3 — RESPONSIVE DESIGN & MOBILE-FIRST -->
<!-- ============================================================== -->
<div class="slide" id="slide-9">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 3 — Responsive Architecture</div>
      <h2 class="slide-title">Mobile-First Philosophy & Flexible Media</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Left: Mobile First Pipeline -->
      <div class="card">
        <div class="card-subtitle">Architectural Direction</div>
        <div class="card-title">Mobile-First vs. Desktop-First</div>
        
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; margin-top: 6px;">
          <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 4px;">Progressive Enhancement with min-width</div>
          <div class="code-box">
<span class="code-comment">/* 1. Base Styles: Mobile (320px+) */</span>
<span class="code-selector">.feature-grid</span> { <span class="code-prop">display</span>: <span class="code-val">block</span>; }

<span class="code-comment">/* 2. Tablet Enhancement (768px+) */</span>
<span class="code-keyword">@media</span> (<span class="code-prop">min-width</span>: <span class="code-val">768px</span>) {
  <span class="code-selector">.feature-grid</span> {
    <span class="code-prop">display</span>: <span class="code-val">grid</span>;
    <span class="code-prop">grid-template-columns</span>: <span class="code-val">1fr 1fr</span>;
  }
}

<span class="code-comment">/* 3. Desktop Expansion (1024px+) */</span>
<span class="code-keyword">@media</span> (<span class="code-prop">min-width</span>: <span class="code-val">1024px</span>) {
  <span class="code-selector">.feature-grid</span> {
    <span class="code-prop">grid-template-columns</span>: <span class="code-val">repeat(4, 1fr)</span>;
  }
}
          </div>
        </div>

        <p class="card-desc" style="margin-top: 8px;">
          Mobile-first code is additive and clean: you write base rules once and enhance layout complexity only when extra spatial real estate warrants it.
        </p>
      </div>

      <!-- Right: Flexible Media -->
      <div class="card card-highlight">
        <div class="card-subtitle">Media Constraint Rules</div>
        <div class="card-title">Flexible Images & Video Containers</div>
        <p class="card-desc">
          Without explicit CSS constraints, embedded high-resolution images expand to their native dimensions, blowing out layouts.
        </p>

        <div class="code-box">
<span class="code-selector">img, video, canvas, svg</span> {
  <span class="code-prop">max-width</span>: <span class="code-val">100%</span>;
  <span class="code-prop">height</span>: <span class="code-val">auto</span>;
  <span class="code-prop">display</span>: <span class="code-val">block</span>;
}

<span class="code-selector">.card-thumb</span> {
  <span class="code-prop">width</span>: <span class="code-val">100%</span>;
  <span class="code-prop">aspect-ratio</span>: <span class="code-val">16 / 9</span>;
  <span class="code-prop">object-fit</span>: <span class="code-val">cover</span>;
}
        </div>

        <ul style="font-size: 11px; color: #cbd5e1; line-height: 1.8; padding-left: 18px; margin-top: 6px;">
          <li><strong style="color: #ffffff;">max-width: 100%:</strong> Allows the image to shrink fluidly if its container is narrow, but prevents it from stretching past its native resolution.</li>
          <li><strong style="color: #ffffff;">aspect-ratio: 16 / 9:</strong> Pre-allocates vertical screen space before network image download completes, effectively eliminating Cumulative Layout Shift (CLS).</li>
        </ul>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 3.1–3.3: Responsive Web Design, Mobile-First Strategy, and Media Handling</span>
      </div>
      <span class="slide-number">Slide 9 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 10: CHAPTER 3 — CSS FLEXBOX (1D LAYOUT) -->
<!-- ============================================================== -->
<div class="slide" id="slide-10">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 3 — Modern Layouts</div>
      <h2 class="slide-title">CSS Flexbox: 1-Dimensional Linear Engine</h2>
      <div class="title-accent-bar"></div>
    </div>

    <!-- Overview Card -->
    <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 10px; padding: 12px 20px; margin-bottom: 16px;">
      <p style="font-size: 13px; color: #e2e8f0; line-height: 1.5;">
        <strong>CSS Flexbox</strong> operates along a single coordinate axis at a time: either the <em>Main Axis</em> (horizontal in row mode) or the <em>Cross Axis</em> (vertical). It is the premier layout engine for navigation headers, button clusters, form controls, and internal card alignments.
      </p>
    </div>

    <div class="grid-4">
      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 6px;">Property 01</div>
        <div class="card-title">justify-content</div>
        <div class="code-box" style="font-size: 10px;">
<span class="code-prop">justify-content</span>:<br>
  <span class="code-val">space-between</span> |<br>
  <span class="code-val">center</span> | <span class="code-val">flex-start</span>
        </div>
        <p class="card-desc">
          Distributes leftover whitespace along the main axis between items. Powers modern navigation bars with logo on the left and nav links on the right.
        </p>
      </div>

      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 6px;">Property 02</div>
        <div class="card-title">align-items</div>
        <div class="code-box" style="font-size: 10px;">
<span class="code-prop">align-items</span>:<br>
  <span class="code-val">center</span> |<br>
  <span class="code-val">stretch</span> | <span class="code-val">baseline</span>
        </div>
        <p class="card-desc">
          Positions items along the perpendicular cross axis. Solves the historical CSS dilemma of effortless vertical centering in a single line of code.
        </p>
      </div>

      <div class="card">
        <div class="badge-emerald" style="width: fit-content; margin-bottom: 6px;">Property 03</div>
        <div class="card-title">flex-wrap & gap</div>
        <div class="code-box" style="font-size: 10px;">
<span class="code-prop">flex-wrap</span>: <span class="code-val">wrap</span>;<br>
<span class="code-prop">gap</span>: <span class="code-val">1.25rem</span>;
        </div>
        <p class="card-desc">
          Enables items to break automatically onto new lines when viewport space runs out on mobile screens, with uniform row and column spacing without margin hacks.
        </p>
      </div>

      <div class="card">
        <div class="badge-amber" style="width: fit-content; margin-bottom: 6px;">Property 04</div>
        <div class="card-title">flex item sizing</div>
        <div class="code-box" style="font-size: 10px;">
<span class="code-prop">flex</span>: <span class="code-val">1 1 280px</span>;<br>
<span class="code-comment">/* grow shrink basis */</span>
        </div>
        <p class="card-desc">
          Empowers items to dynamically absorb excess space (<tt>flex-grow</tt>) or contract smoothly under spatial pressure (<tt>flex-shrink</tt>) relative to a base width.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 3.4: Flex Container Properties, Flex Item Rules, and Alignment Axes</span>
      </div>
      <span class="slide-number">Slide 10 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 11: CHAPTER 3 — CSS GRID (2D LAYOUT) -->
<!-- ============================================================== -->
<div class="slide" id="slide-11">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 3 — Modern Layouts</div>
      <h2 class="slide-title">CSS Grid: 2-Dimensional Spatial Coordination</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Left: Intrinsic Auto-Fit Grid -->
      <div class="card card-highlight">
        <div class="card-subtitle">Zero Media Query Magic</div>
        <div class="card-title">The Auto-Fit Responsive Pattern</div>
        <p class="card-desc">
          CSS Grid provides a revolutionary one-liner that builds an infinitely responsive card gallery across all viewports without writing a single media query:
        </p>

        <div class="code-box">
<span class="code-selector">.card-grid</span> {
  <span class="code-prop">display</span>: <span class="code-val">grid</span>;
  <span class="code-prop">grid-template-columns</span>:
    <span class="code-keyword">repeat</span>(<span class="code-val">auto-fit</span>, <span class="code-keyword">minmax</span>(<span class="code-val">280px</span>, <span class="code-val">1fr</span>));
  <span class="code-prop">gap</span>: <span class="code-val">1.5rem</span>;
}
        </div>

        <div style="font-size: 11px; color: #cbd5e1; line-height: 1.7; margin-top: 6px;">
          <div style="margin-bottom: 4px;">• <strong style="color: #38bdf8;">auto-fit:</strong> Automatically generates as many column tracks as can physically fit in the current container width.</div>
          <div style="margin-bottom: 4px;">• <strong style="color: #38bdf8;">minmax(280px, 1fr):</strong> Guarantees cards never narrow below 280px, but freely expand proportionally (1fr) to fill any leftover void.</div>
          <div>• <strong style="color: #34d399;">Result:</strong> 1 column on mobile, 2 columns on tablet, 3-4 columns on desktop automatically!</div>
        </div>
      </div>

      <!-- Right: Decision Matrix -->
      <div class="card">
        <div class="card-subtitle">Architectural Decision Matrix</div>
        <div class="card-title">When to Choose Flexbox vs. CSS Grid</div>

        <table class="styled-table">
          <tr>
            <th>Criterion</th>
            <th>CSS Flexbox</th>
            <th>CSS Grid</th>
          </tr>
          <tr>
            <td><strong>Dimensionality</strong></td>
            <td>1D (Row OR Column)</td>
            <td>2D (Rows AND Columns)</td>
          </tr>
          <tr>
            <td><strong>Focus</strong></td>
            <td>Content-driven flow</td>
            <td>Layout-driven structure</td>
          </tr>
          <tr>
            <td><strong>Alignment</strong></td>
            <td>Element relative to element</td>
            <td>Strict coordinate tracks</td>
          </tr>
          <tr>
            <td><strong>Optimal Use</strong></td>
            <td>Headers, navbars, tag pills</td>
            <td>Page scaffolding, dashboards</td>
          </tr>
        </table>

        <div style="background: rgba(129, 140, 248, 0.1); border-left: 3px solid #818cf8; border-radius: 4px; padding: 8px 12px; margin-top: 14px; font-size: 11px; color: #cbd5e1; font-style: italic;">
          <strong>Hybrid Synergy:</strong> Professional web engineering pairs CSS Grid for the macroscopic page skeleton with CSS Flexbox for microscopic card internals.
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 3.5–3.6: CSS Grid Engine, Fractional Tracks, and Architectural Selection Matrix</span>
      </div>
      <span class="slide-number">Slide 11 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 12: CHAPTER 4 — ACCESSIBILITY & WCAG 2.2 -->
<!-- ============================================================== -->
<div class="slide" id="slide-12">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 4 — Inclusive Design</div>
      <h2 class="slide-title">Web Accessibility (a11y) & WCAG 2.2 Principles</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-4">
      <div class="card">
        <div style="font-size: 32px; font-weight: 900; color: #38bdf8; margin-bottom: 4px;">P</div>
        <div class="card-title">Perceivable</div>
        <div class="card-subtitle">Sensory Delivery</div>
        <p class="card-desc">
          Users must be able to perceive all critical data. Requires text alternatives (<tt>alt</tt>) for visual diagrams, and strict 4.5:1 color contrast ratios between text and background surfaces.
        </p>
        <div style="margin-top: auto; padding-top: 10px; font-size: 10px; color: #38bdf8;">
          Standard: WCAG 1.4.3 Contrast
        </div>
      </div>

      <div class="card">
        <div style="font-size: 32px; font-weight: 900; color: #34d399; margin-bottom: 4px;">O</div>
        <div class="card-title">Operable</div>
        <div class="card-subtitle">Input Independence</div>
        <p class="card-desc">
          All interactive elements must be fully operable via keyboard (<tt>Tab</tt>, <tt>Shift+Tab</tt>, <tt>Enter</tt>). High-contrast <tt>:focus-visible</tt> indicators are mandatory. No keyboard traps permitted.
        </p>
        <div style="margin-top: auto; padding-top: 10px; font-size: 10px; color: #34d399;">
          Standard: WCAG 2.1 Keyboard
        </div>
      </div>

      <div class="card">
        <div style="font-size: 32px; font-weight: 900; color: #fbbf24; margin-bottom: 4px;">U</div>
        <div class="card-title">Understandable</div>
        <div class="card-subtitle">Cognitive Clarity</div>
        <p class="card-desc">
          UI navigation must be predictable and intuitive. Clear validation messages on form inputs, consistent icon signifiers, and zero sudden unexpected layout shifts during browsing.
        </p>
        <div style="margin-top: auto; padding-top: 10px; font-size: 10px; color: #fbbf24;">
          Standard: WCAG 3.3 Input Assist
        </div>
      </div>

      <div class="card">
        <div style="font-size: 32px; font-weight: 900; color: #f43f5e; margin-bottom: 4px;">R</div>
        <div class="card-title">Robust</div>
        <div class="card-subtitle">Agent Compatibility</div>
        <p class="card-desc">
          Code must strictly validate against HTML5 specifications so modern screen readers (NVDA, JAWS, VoiceOver) can reliably translate the DOM into synthetic speech and braille displays.
        </p>
        <div style="margin-top: auto; padding-top: 10px; font-size: 10px; color: #f43f5e;">
          Standard: W3C HTML5 Validation
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 4.1–4.3: Accessibility Principles, Screen Readers, and Continuous Auditing</span>
      </div>
      <span class="slide-number">Slide 12 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 13: CHAPTER 4 — ACCESSIBLE FORMS & TOUCH TARGETS -->
<!-- ============================================================== -->
<div class="slide" id="slide-13">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 4 — Interaction Details</div>
      <h2 class="slide-title">Accessible Forms & Touch Screen Ergonomics</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Form Controls Card -->
      <div class="card">
        <div class="card-subtitle">Form Architecture</div>
        <div class="card-title">Programmatic Labeling & Soft Keyboards</div>
        
        <div class="code-box">
&lt;<span class="code-keyword">div</span> class=<span class="code-val">"field-group"</span>&gt;
  &lt;<span class="code-keyword">label</span> for=<span class="code-val">"user-email"</span>&gt;Email Address&lt;/<span class="code-keyword">label</span>&gt;
  &lt;<span class="code-keyword">input</span>
    type=<span class="code-val">"email"</span>
    id=<span class="code-val">"user-email"</span>
    inputmode=<span class="code-val">"email"</span>
    autocomplete=<span class="code-val">"email"</span>
    aria-describedby=<span class="code-val">"email-hint"</span>
    required&gt;
  &lt;<span class="code-keyword">span</span> id=<span class="code-val">"email-hint"</span>&gt;We will never share your email.&lt;/<span class="code-keyword">span</span>&gt;
&lt;/<span class="code-keyword">div</span>&gt;
        </div>

        <ul style="font-size: 11px; color: #cbd5e1; line-height: 1.7; padding-left: 18px; margin-top: 6px;">
          <li><strong style="color: #ffffff;">Explicit Association:</strong> Linking <tt>&lt;label for="..."&gt;</tt> to input ID ensures screen readers announce field intent immediately upon focus.</li>
          <li><strong style="color: #ffffff;">Virtual Keyboard Triggers:</strong> Setting <tt>type="email"</tt> or <tt>inputmode="numeric"</tt> prompts mobile OS to surface specialized keypads (@ and numerals).</li>
        </ul>
      </div>

      <!-- Touch Ergonomics & Motion -->
      <div class="card card-highlight">
        <div class="card-subtitle">Physical Interaction Standards</div>
        <div class="card-title">Touch Targets & Reduced Motion</div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="font-size: 12px; font-weight: 700; color: #10b981;">Minimum 44 × 44px Touch Targets</div>
          <p style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
            Under WCAG 2.5.5, all mobile interactive zones must meet at least 44×44 CSS pixels with generous margins to prevent finger mis-clicks on capacitive touch displays.
          </p>
        </div>

        <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 12px;">
          <div style="font-size: 12px; font-weight: 700; color: #38bdf8;">prefers-reduced-motion Media Feature</div>
          <div class="code-box" style="margin: 6px 0;">
<span class="code-keyword">@media</span> (<span class="code-prop">prefers-reduced-motion</span>: <span class="code-val">reduce</span>) {
  <span class="code-selector">*</span> {
    <span class="code-prop">animation-duration</span>: <span class="code-val">0.01ms</span> !important;
    <span class="code-prop">transition-duration</span>: <span class="code-val">0.01ms</span> !important;
  }
}
          </div>
          <p style="font-size: 11px; color: #cbd5e1;">
            Respects system accessibility settings for individuals with vestibular balance disorders by silencing jarring parallax motion.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 4.4 & 4.2: Accessible Forms, Touch Ergonomics, and Reduced Motion Protocols</span>
      </div>
      <span class="slide-number">Slide 13 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 14: CHAPTER 4 — ENGINEERING WORKFLOW & VIEWPORT TESTING -->
<!-- ============================================================== -->
<div class="slide" id="slide-14">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 4 — Verification Pipeline</div>
      <h2 class="slide-title">Development Workflow & Multi-Viewport Testing</h2>
      <div class="title-accent-bar"></div>
    </div>

    <!-- 5-Stage Step Flow -->
    <div class="grid-5" style="margin-bottom: 16px;">
      <div class="card" style="padding: 16px;">
        <div style="font-size: 24px; font-weight: 900; color: #38bdf8;">01</div>
        <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0;">Planning</div>
        <p style="font-size: 10px; color: #94a3b8; line-height: 1.5;">
          Wireframe content hierarchy and establish mobile-first single column reading flow.
        </p>
      </div>

      <div class="card" style="padding: 16px;">
        <div style="font-size: 24px; font-weight: 900; color: #38bdf8;">02</div>
        <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0;">Markup</div>
        <p style="font-size: 10px; color: #94a3b8; line-height: 1.5;">
          Author semantic HTML5 skeleton with landmarks, labels, and heading structure.
        </p>
      </div>

      <div class="card" style="padding: 16px;">
        <div style="font-size: 24px; font-weight: 900; color: #38bdf8;">03</div>
        <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0;">Base CSS</div>
        <p style="font-size: 10px; color: #94a3b8; line-height: 1.5;">
          Apply border-box reset, color tokens, and fluid mobile-first typographical scale.
        </p>
      </div>

      <div class="card" style="padding: 16px;">
        <div style="font-size: 24px; font-weight: 900; color: #38bdf8;">04</div>
        <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0;">Layout</div>
        <p style="font-size: 10px; color: #94a3b8; line-height: 1.5;">
          Introduce min-width media queries, Flexbox alignments, and CSS Grid auto-fit tracks.
        </p>
      </div>

      <div class="card card-highlight" style="padding: 16px;">
        <div style="font-size: 24px; font-weight: 900; color: #34d399;">05</div>
        <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 4px 0;">Audit</div>
        <p style="font-size: 10px; color: #94a3b8; line-height: 1.5;">
          Execute multi-device emulation, 200% zoom testing, and automated Lighthouse audit.
        </p>
      </div>
    </div>

    <!-- Testing Matrix Table -->
    <div class="card">
      <div class="card-subtitle">Device Matrix</div>
      <div class="card-title" style="font-size: 14px;">Cross-Viewport Verification Matrix</div>
      <table class="styled-table" style="font-size: 10.5px;">
        <tr>
          <th>Device Category</th>
          <th>Viewport Width</th>
          <th>Target Hardware Simulated</th>
          <th>Verification Focus Areas</th>
        </tr>
        <tr>
          <td><span class="badge-sky">Mobile Small</span></td>
          <td><code>320px – 375px</code></td>
          <td>iPhone SE, Galaxy Mini</td>
          <td>Zero horizontal overflow, legible font sizes, tap target clearance</td>
        </tr>
        <tr>
          <td><span class="badge-sky">Mobile Large</span></td>
          <td><code>390px – 430px</code></td>
          <td>iPhone 14/15 Pro, Pixel 8</td>
          <td>Fluid image scaling, full width touch forms, drawer navigation</td>
        </tr>
        <tr>
          <td><span class="badge-amber">Tablet</span></td>
          <td><code>768px – 834px</code></td>
          <td>iPad Mini, iPad Air</td>
          <td>2-column grid transitions, comfortable line lengths, tablet orientation</td>
        </tr>
        <tr>
          <td><span class="badge-emerald">Desktop & 4K</span></td>
          <td><code>1280px – 3840px</code></td>
          <td>Laptops, High-Res Monitors</td>
          <td>3-4 column grid tracks, maximum width constraints (max-width: 1200px)</td>
        </tr>
      </table>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 4.5–4.6: Development Workflow, Quality Checklists, and Viewport Testing Matrix</span>
      </div>
      <span class="slide-number">Slide 14 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 15: CHAPTER 5 — CAPSTONE PROJECTS (300 HOURS) -->
<!-- ============================================================== -->
<div class="slide" id="slide-15">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 5 — Practical Implementation</div>
      <h2 class="slide-title">5 Verified freeCodeCamp Capstone Projects</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
      <div class="card" style="padding: 12px 20px; flex-direction: row; align-items: center; justify-content: space-between;">
        <div style="width: 30%;">
          <div style="font-size: 13px; font-weight: 700; color: #ffffff;">1. Responsive Survey Form</div>
          <div style="font-size: 10px; color: #38bdf8; font-family: monospace;">HTML5 Inputs + Flexbox</div>
        </div>
        <div style="width: 55%; font-size: 11px; color: #cbd5e1;">
          Engineered multi-input form with custom radio/checkbox controls, real-time client validation, and single-column mobile wrapping.
        </div>
        <div style="width: 15%; text-align: right;">
          <span class="badge-emerald">16/16 Passed</span>
        </div>
      </div>

      <div class="card" style="padding: 12px 20px; flex-direction: row; align-items: center; justify-content: space-between;">
        <div style="width: 30%;">
          <div style="font-size: 13px; font-weight: 700; color: #ffffff;">2. Tribute Page</div>
          <div style="font-size: 10px; color: #38bdf8; font-family: monospace;">Fluid Media + Semantic Story</div>
        </div>
        <div style="width: 55%; font-size: 11px; color: #cbd5e1;">
          Biographical layout featuring a fluid responsive hero banner, responsive timeline cards, and centered typography with optimal reading measure.
        </div>
        <div style="width: 15%; text-align: right;">
          <span class="badge-emerald">10/10 Passed</span>
        </div>
      </div>

      <div class="card" style="padding: 12px 20px; flex-direction: row; align-items: center; justify-content: space-between;">
        <div style="width: 30%;">
          <div style="font-size: 13px; font-weight: 700; color: #ffffff;">3. Product Landing Page</div>
          <div style="font-size: 10px; color: #38bdf8; font-family: monospace;">Fixed Nav + Video + CSS Grid</div>
        </div>
        <div style="width: 55%; font-size: 11px; color: #cbd5e1;">
          Commercial landing page with sticky responsive navigation drawer, embedded media player, and a 3-tier CSS Grid pricing matrix.
        </div>
        <div style="width: 15%; text-align: right;">
          <span class="badge-emerald">16/16 Passed</span>
        </div>
      </div>

      <div class="card" style="padding: 12px 20px; flex-direction: row; align-items: center; justify-content: space-between;">
        <div style="width: 30%;">
          <div style="font-size: 13px; font-weight: 700; color: #ffffff;">4. Technical Documentation</div>
          <div style="font-size: 10px; color: #38bdf8; font-family: monospace;">Split Layout + Scrollspy</div>
        </div>
        <div style="width: 55%; font-size: 11px; color: #cbd5e1;">
          Developer doc page with desktop fixed sidebar navigation, mobile collapsible drawer, syntax code blocks, and intra-document smooth navigation.
        </div>
        <div style="width: 15%; text-align: right;">
          <span class="badge-emerald">16/16 Passed</span>
        </div>
      </div>

      <div class="card card-highlight" style="padding: 12px 20px; flex-direction: row; align-items: center; justify-content: space-between;">
        <div style="width: 30%;">
          <div style="font-size: 13px; font-weight: 700; color: #ffffff;">5. Personal Portfolio Page</div>
          <div style="font-size: 10px; color: #34d399; font-family: monospace;">Full Production Portfolio</div>
        </div>
        <div style="width: 55%; font-size: 11px; color: #cbd5e1;">
          End-to-end portfolio showcasing hero intro, auto-fit project cards with hover interactions, accessible contact form, and social media links.
        </div>
        <div style="width: 15%; text-align: right;">
          <span class="badge-emerald">12/12 Passed</span>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 5.1–5.2: Capstone Projects, Functional Test Validation, and Architecture</span>
      </div>
      <span class="slide-number">Slide 15 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 16: CHAPTER 5 — OUTCOMES & PROBLEM-SOLVING -->
<!-- ============================================================== -->
<div class="slide" id="slide-16">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Chapter 5 — Synthesis</div>
      <h2 class="slide-title">Learning Outcomes & Problem-Solving Lessons</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Left: Core Competencies -->
      <div class="card">
        <div class="card-subtitle" style="color: #34d399;">Core Competencies Mastered</div>
        <div class="card-title">Technical Proficiencies</div>
        
        <ul style="font-size: 11.5px; color: #cbd5e1; line-height: 1.8; padding-left: 18px;">
          <li><strong style="color: #ffffff;">Device-Agnostic Mindset:</strong> Shifted from rigid fixed-width thinking to fluid layout systems that adapt organically to screen boundaries.</li>
          <li><strong style="color: #ffffff;">Semantic Structural Mastery:</strong> Proficient in authoring clean HTML5 structures that enhance search engine visibility and assistive screen readers.</li>
          <li><strong style="color: #ffffff;">Modern Layout Engine Fluency:</strong> Deep practical fluency in CSS Flexbox and Grid mathematics, eliminating fragile float hacks.</li>
          <li><strong style="color: #ffffff;">Empirical Quality Assurance:</strong> Established rigorous habits of cross-browser DevTools inspection, 200% zoom audits, and accessibility compliance.</li>
        </ul>
      </div>

      <!-- Right: Real-World Debugging Lessons -->
      <div class="card card-highlight">
        <div class="card-subtitle" style="color: #fbbf24;">Debugging Case Studies</div>
        <div class="card-title">Challenges Faced & Engineering Solutions</div>

        <div style="margin-bottom: 10px;">
          <div style="font-size: 11px; font-weight: 700; color: #ffffff;">1. Specificity Wars in Deep CSS Trees</div>
          <p style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">
            <strong style="color: #38bdf8;">Solution:</strong> Refactored styles into flat BEM-inspired class selectors, maintaining uniform low specificity and eliminating <tt>!important</tt> overrides.
          </p>
        </div>

        <div style="margin-bottom: 10px;">
          <div style="font-size: 11px; font-weight: 700; color: #ffffff;">2. Unintended Lateral Viewport Scrollbars</div>
          <p style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">
            <strong style="color: #38bdf8;">Solution:</strong> Diagnosed unconstrained elements using DevTools DOM outlines, applied universal <tt>box-sizing: border-box</tt>, and enforced <tt>max-width: 100%</tt> on all media.
          </p>
        </div>

        <div>
          <div style="font-size: 11px; font-weight: 700; color: #ffffff;">3. Breakpoint Proliferation Fatigue</div>
          <p style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">
            <strong style="color: #38bdf8;">Solution:</strong> Transitioned from guessing device pixel widths to intrinsic layouts with CSS Grid <tt>repeat(auto-fit, minmax(...))</tt> and fluid typography with <tt>clamp()</tt>.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 5.4–5.5: Learning Outcomes, Engineering Challenges, and Practical Lessons</span>
      </div>
      <span class="slide-number">Slide 16 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 17: FUTURE SCOPE & ADVANCED ROADMAP -->
<!-- ============================================================== -->
<div class="slide" id="slide-17">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Future Horizons</div>
      <h2 class="slide-title">Future Scope & Front-End Engineering Roadmap</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-4">
      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 8px;">Horizon 01</div>
        <div class="card-title">Modern JavaScript</div>
        <div class="card-subtitle">ES6+ & Dynamic Web</div>
        <p class="card-desc">
          Advancing into asynchronous JavaScript, Fetch API for backend integration, DOM event orchestration, and client-side data persistence with LocalStorage and IndexedDB.
        </p>
        <div style="margin-top: auto; padding-top: 10px; font-size: 10px; color: #38bdf8;">
          Topics: ES6+, Async/Await, Web APIs
        </div>
      </div>

      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 8px;">Horizon 02</div>
        <div class="card-title">React 19 & TypeScript</div>
        <div class="card-subtitle">Component Architecture</div>
        <p class="card-desc">
          Transitioning from static HTML/CSS files to scalable, component-driven single page applications (SPAs) with strict TypeScript typing, state management, and Vite tooling.
        </p>
        <div style="margin-top: auto; padding-top: 10px; font-size: 10px; color: #38bdf8;">
          Topics: React, Hooks, TypeScript, Vite
        </div>
      </div>

      <div class="card">
        <div class="badge-sky" style="width: fit-content; margin-bottom: 8px;">Horizon 03</div>
        <div class="card-title">Next-Gen CSS</div>
        <div class="card-subtitle">Container Queries & Subgrid</div>
        <p class="card-desc">
          Mastering modern CSS specs including <tt>@container</tt> queries (component-level responsiveness), CSS Subgrid (aligned nested matrices), and native CSS nesting.
        </p>
        <div style="margin-top: auto; padding-top: 10px; font-size: 10px; color: #38bdf8;">
          Topics: @container, subgrid, Nesting
        </div>
      </div>

      <div class="card card-highlight">
        <div class="badge-emerald" style="width: fit-content; margin-bottom: 8px;">Horizon 04</div>
        <div class="card-title">Performance & CI/CD</div>
        <div class="card-subtitle">Core Web Vitals</div>
        <p class="card-desc">
          Optimizing production metrics: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), automated regression testing, and CI/CD deployment pipelines on Vercel/GitHub Pages.
        </p>
        <div style="margin-top: auto; padding-top: 10px; font-size: 10px; color: #34d399;">
          Topics: Lighthouse, CI/CD, Web Vitals
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Section 5.6: Future Scope, Next Steps in Front-End Engineering, and Enterprise Scalability</span>
      </div>
      <span class="slide-number">Slide 17 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- SLIDE 18: CONCLUSION & REFERENCES -->
<!-- ============================================================== -->
<div class="slide" id="slide-18">
  <div class="slide-content">
    <div class="slide-header">
      <div class="category-pill">Academic Synthesis</div>
      <h2 class="slide-title">Conclusion & Formal References</h2>
      <div class="title-accent-bar"></div>
    </div>

    <div class="grid-2">
      <!-- Left: Academic Conclusion -->
      <div class="card card-highlight">
        <div class="card-subtitle">Summary of Accomplishment</div>
        <div class="card-title">Academic & Technical Conclusion</div>
        <p class="card-desc" style="margin-bottom: 12px;">
          The completion of the Legacy Responsive Web Design V8 curriculum represents approximately 300 hours of rigorous front-end engineering study and capstone development.
        </p>
        <ul style="font-size: 11px; color: #cbd5e1; line-height: 1.8; padding-left: 18px;">
          <li><strong style="color: #ffffff;">Bridging Theory & Practice:</strong> Successfully connected classroom computer science principles with real-world web presentation standards.</li>
          <li><strong style="color: #ffffff;">Human-Centered Engineering:</strong> Prioritized accessibility, usability, and visual clarity across all devices, user abilities, and network speeds.</li>
          <li><strong style="color: #ffffff;">Academic Fulfillment:</strong> Submitted in partial fulfilment of academic documentation requirements for Bachelor of Technology in Information Technology, JSS Academy of Technical Education, Noida.</li>
        </ul>
        <div style="margin-top: 16px; padding: 10px 14px; background: rgba(56, 189, 248, 0.1); border-radius: 8px; font-size: 11px; color: #38bdf8;">
          Candidate: <strong>Anurag Kumar</strong> | JSS Academy of Technical Education, Noida
        </div>
      </div>

      <!-- Right: Official References -->
      <div class="card">
        <div class="card-subtitle">Formal Citations</div>
        <div class="card-title">Standards & Documentation References</div>
        
        <div style="font-size: 10px; color: #cbd5e1; line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">
          <div>
            <strong style="color: #ffffff;">[1] freeCodeCamp:</strong> “Legacy Responsive Web Design V8 Developer Certification.” Completed 14 October 2026.<br>
            <span style="color: #38bdf8; font-family: monospace;">https://freecodecamp.org/certification/fcc-97775e43-3a55-46e0-aa41-90a285370607/responsive-web-design</span>
          </div>
          <div>
            <strong style="color: #ffffff;">[2] WHATWG:</strong> “HTML Living Standard.” Available at: <span style="color: #38bdf8; font-family: monospace;">https://html.spec.whatwg.org/</span>
          </div>
          <div>
            <strong style="color: #ffffff;">[3] W3C:</strong> “Cascading Style Sheets (CSS).” Available at: <span style="color: #38bdf8; font-family: monospace;">https://www.w3.org/Style/CSS/</span>
          </div>
          <div>
            <strong style="color: #ffffff;">[4] MDN Web Docs:</strong> “Responsive design, CSS flexible box layout, and CSS grid layout.” Available at: <span style="color: #38bdf8; font-family: monospace;">https://developer.mozilla.org/</span>
          </div>
          <div>
            <strong style="color: #ffffff;">[5] W3C WAI:</strong> “Web Content Accessibility Guidelines (WCAG) 2.2.” Available at: <span style="color: #38bdf8; font-family: monospace;">https://www.w3.org/TR/WCAG22/</span>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Department of Information Technology • JSS Academy of Technical Education, Noida</span>
      </div>
      <span class="slide-number">Slide 18 / 18</span>
    </div>
  </div>
</div>

<!-- ============================================================== -->
<!-- INTERACTIVE CONTROLS BAR (Only visible in browser screen mode) -->
<!-- ============================================================== -->
<div class="interactive-bar">
  <button class="interactive-btn" onclick="prevSlide()">◀ Previous</button>
  <span class="interactive-counter" id="slide-indicator">Slide 1 of 18</span>
  <button class="interactive-btn" onclick="nextSlide()">Next ▶</button>
  <button class="interactive-btn" style="background: rgba(255,255,255,0.1); color: #fff;" onclick="toggleFullscreen()">⛶ Fullscreen</button>
  <button class="interactive-btn" style="background: #34d399; color: #022c22;" onclick="window.print()">🖨️ Print / Save PDF</button>
</div>

<script>
  let currentSlide = 1;
  const totalSlides = 18;

  function updateIndicator() {
    const el = document.getElementById('slide-indicator');
    if (el) el.innerText = 'Slide ' + currentSlide + ' of ' + totalSlides;
  }

  function goToSlide(n) {
    if (n < 1) n = 1;
    if (n > totalSlides) n = totalSlides;
    currentSlide = n;
    const target = document.getElementById('slide-' + currentSlide);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    updateIndicator();
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
    } else if (e.key === 'Home') {
      goToSlide(1);
    } else if (e.key === 'End') {
      goToSlide(totalSlides);
    }
  });
</script>

</body>
</html>
`;

// Save HTML to Downloads and Project folder
const downloadsDir = 'C:\\Users\\HP\\Downloads';
const projectDir = path.resolve(__dirname, '..');

const htmlDownloads = path.join(downloadsDir, 'Responsive_Web_Design_V8_Presentation.html');
const htmlProject = path.join(projectDir, 'Responsive_Web_Design_V8_Presentation.html');

fs.writeFileSync(htmlDownloads, htmlContent, 'utf8');
fs.writeFileSync(htmlProject, htmlContent, 'utf8');
console.log(`HTML presentation saved to: ${htmlDownloads}`);

// --------------------------------------------------------------------------
// 2. RENDER VECTOR PDF VIA HEADLESS MICROSOFT EDGE
// --------------------------------------------------------------------------
console.log('Rendering 18-slide PDF via headless Microsoft Edge...');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const pdfDownloads = path.join(downloadsDir, 'Responsive_Web_Design_V8_Presentation.pdf');
const pdfProject = path.join(projectDir, 'Responsive_Web_Design_V8_Presentation.pdf');

try {
  const cmd = `"${edgePath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfDownloads}" "${htmlDownloads}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`PDF successfully generated at: ${pdfDownloads}`);

  // Copy PDF to project folder
  fs.copyFileSync(pdfDownloads, pdfProject);
  console.log(`PDF backup copied to: ${pdfProject}`);
} catch (err) {
  console.error('Failed to render PDF via Edge:', err.message);
}
