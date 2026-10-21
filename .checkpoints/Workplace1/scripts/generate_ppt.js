import pptxgen from 'pptxgenjs';
import path from 'path';

const pptx = new pptxgen();

// Set presentation properties
pptx.title = 'ANUNAAD (अनुनाद) — Every Tradition Deserves to Resonate';
pptx.author = 'ANUNAAD Cultural Platform';
pptx.subject = 'Living Traditions & Sustainable Artist Economy Platform';
pptx.layout = 'LAYOUT_16x9';

// Define Color Palette
const COLORS = {
  parchment: 'FDFBF7',
  parchmentSubtle: 'F5F2EA',
  charcoal: '1C1B19',
  charcoalMuted: '5E5B54',
  terracotta: 'C85A32',
  saffron: 'D97724',
  forest: '2D4F38',
  white: 'FFFFFF',
  gold: 'E08D3C'
};

// Helper for standard slide header
function addSlideHeader(slide, title, category) {
  // Category / Eyebrow
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.5,
    w: 11.5,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Georgia',
    color: COLORS.terracotta,
    bold: true,
    charSpacing: 2
  });

  // Slide Title
  slide.addText(title, {
    x: 0.8,
    y: 0.75,
    w: 11.5,
    h: 0.6,
    fontSize: 24,
    fontFace: 'Georgia',
    color: COLORS.charcoal,
    bold: true
  });

  // Top accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.35,
    w: 1.5,
    h: 0.04,
    fill: { color: COLORS.terracotta },
    line: { color: COLORS.terracotta }
  });
}

// -------------------------------------------------------------
// SLIDE 1: TITLE SLIDE (Dark Cinematic Aesthetic)
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.charcoal };

  // Monogram box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.8,
    w: 1.2,
    h: 1.2,
    rectRadius: 0.2,
    fill: { color: COLORS.terracotta },
    line: { color: COLORS.terracotta }
  });

  slide.addText('A', {
    x: 0.8,
    y: 1.8,
    w: 1.2,
    h: 1.2,
    fontSize: 44,
    fontFace: 'Georgia',
    color: COLORS.white,
    bold: true,
    align: 'center',
    valign: 'middle'
  });

  // Title
  slide.addText('ANUNAAD', {
    x: 2.3,
    y: 1.7,
    w: 7.0,
    h: 0.8,
    fontSize: 48,
    fontFace: 'Georgia',
    color: COLORS.white,
    bold: true,
    charSpacing: 3
  });

  slide.addText('अनुनाद  •  Living Cultural Discovery Platform', {
    x: 2.3,
    y: 2.45,
    w: 7.0,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Georgia',
    color: COLORS.gold,
    italic: true
  });

  // Tagline
  slide.addText('«Every tradition deserves to resonate.»', {
    x: 0.8,
    y: 3.5,
    w: 11.5,
    h: 0.7,
    fontSize: 26,
    fontFace: 'Georgia',
    color: COLORS.parchment,
    italic: true
  });

  // Description
  slide.addText(
    'A contemporary editorial bridge connecting The Keepers of rare, regional, and endangered arts with curious learners, audiences, and patrons worldwide.',
    {
      x: 0.8,
      y: 4.3,
      w: 10.0,
      h: 0.8,
      fontSize: 14,
      fontFace: 'Calibri',
      color: 'D8D1C2',
      lineSpacing: 22
    }
  );

  // Footer / Meta
  slide.addText('Discover  •  Listen  •  Learn  •  Carry It Forward   |   Project Architecture & Overview', {
    x: 0.8,
    y: 6.3,
    w: 11.5,
    h: 0.4,
    fontSize: 11,
    fontFace: 'Calibri',
    color: '8E877B'
  });
}

// -------------------------------------------------------------
// SLIDE 2: CORE CONCEPT & PHILOSOPHY
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'The Core Philosophy & Meaning', 'Vision');

  // Big quote callout
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 1.3,
    rectRadius: 0.15,
    fill: { color: COLORS.parchmentSubtle },
    line: { color: 'E8E2D5', width: 1 }
  });

  slide.addText(
    '«Culture should not only be preserved in archives. It should continue to live through people.»',
    {
      x: 1.1,
      y: 1.75,
      w: 11.1,
      h: 1.0,
      fontSize: 20,
      fontFace: 'Georgia',
      color: COLORS.terracotta,
      bold: true,
      italic: true,
      align: 'center',
      valign: 'middle'
    }
  );

  // 2 World Pillars: The Keepers & The Curious
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 3.1,
    w: 5.6,
    h: 3.4,
    rectRadius: 0.15,
    fill: { color: COLORS.white },
    line: { color: 'E8E2D5', width: 1 }
  });

  slide.addText('THE KEEPERS (कलाकार व गुरु)', {
    x: 1.1,
    y: 3.3,
    w: 5.0,
    h: 0.4,
    fontSize: 13,
    fontFace: 'Georgia',
    color: COLORS.charcoal,
    bold: true
  });

  slide.addText(
    '• Masters, musicians, dancers, craftsmen, storytellers\n' +
    '• Guardians of rare lineages passed through generations\n' +
    '• Carrying unwritten ragas, regional epics, and sacred craft\n' +
    '• Seeking dignity, direct patronage, and eager apprentices',
    {
      x: 1.1,
      y: 3.8,
      w: 5.0,
      h: 2.4,
      fontSize: 12,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 22
    }
  );

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 3.1,
    w: 5.6,
    h: 3.4,
    rectRadius: 0.15,
    fill: { color: COLORS.white },
    line: { color: 'E8E2D5', width: 1 }
  });

  slide.addText('THE CURIOUS (जिज्ञासु व साधक)', {
    x: 7.2,
    y: 3.3,
    w: 5.0,
    h: 0.4,
    fontSize: 13,
    fontFace: 'Georgia',
    color: COLORS.charcoal,
    bold: true
  });

  slide.addText(
    '• Seekers wanting to discover authentic, rare traditions\n' +
    '• Learners seeking direct masterclasses & 1-on-1 mentorship\n' +
    '• Audiences desiring intimate baithaks & studio walks\n' +
    '• Patrons providing direct financial support to keep arts alive',
    {
      x: 7.2,
      y: 3.8,
      w: 5.0,
      h: 2.4,
      fontSize: 12,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 22
    }
  );
}

// -------------------------------------------------------------
// SLIDE 3: THE PROBLEM & OPPORTUNITY
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'The Crisis Facing Traditional Knowledge', 'Problem Analysis');

  const problems = [
    {
      num: '01',
      title: 'Silent Disappearance',
      desc: 'Rare oral compositions, puppetry, and craft skills vanish when an aging master passes away without apprentices.'
    },
    {
      num: '02',
      title: 'Archival Isolation',
      desc: 'Traditional arts are often locked in institutional storage or PDF archives instead of being actively practiced and shared.'
    },
    {
      num: '03',
      title: 'Economic Precarity',
      desc: 'Intermediaries and extractive models leave artists with pennies. Masters are forced to abandon their heritage for daily survival.'
    },
    {
      num: '04',
      title: 'Commoditization',
      desc: 'Generic corporate marketplaces reduce sacred knowledge to cheap consumer souvenirs without attribution or consent.'
    }
  ];

  problems.forEach((p, idx) => {
    const xPos = 0.8 + idx * 2.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.7,
      w: 2.75,
      h: 4.8,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: 'E8E2D5', width: 1 }
    });

    slide.addText(p.num, {
      x: xPos + 0.2,
      y: 1.9,
      w: 2.3,
      h: 0.5,
      fontSize: 22,
      fontFace: 'Georgia',
      color: COLORS.terracotta,
      bold: true
    });

    slide.addText(p.title, {
      x: xPos + 0.2,
      y: 2.5,
      w: 2.3,
      h: 0.6,
      fontSize: 14,
      fontFace: 'Georgia',
      color: COLORS.charcoal,
      bold: true
    });

    slide.addText(p.desc, {
      x: xPos + 0.2,
      y: 3.2,
      w: 2.3,
      h: 3.0,
      fontSize: 11,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 18
    });
  });
}

// -------------------------------------------------------------
// SLIDE 4: KEY LIVING TRADITIONS COVERED
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'Living Traditions Across India', 'Heritage Scope');

  const traditions = [
    { name: 'Maand', region: 'Rajasthan', type: 'Semi-Classical Vocal', note: 'Rare desert microtones & Kamaicha bowing preserved by Manganiyar lineages' },
    { name: 'Pandavani', region: 'Chhattisgarh', type: 'Epic Storytelling', note: 'Mahabharata oral ballads narrated with Tambura twirling & dramatic fury' },
    { name: 'Chhau', region: 'West Bengal / Jharkhand', type: 'Martial Dance', note: 'Colossal clay masks sculpted in Charida with acrobatic combat leaps' },
    { name: 'Baul', region: 'Bengal Delta', type: 'Mystic Music', note: 'Non-conformist egalitarian songs seeking the inner divine (Moner Manush)' },
    { name: 'Tholu Bommalata', region: 'Andhra Pradesh', type: 'Shadow Puppetry', note: '6-foot illuminated goat-hide puppets performing night-long oral epics' },
    { name: 'Sattriya', region: 'Assam', type: 'Monastic Dance', note: '500-year-old classical prayer preserved in Majuli island river Sattras' },
    { name: 'Madhubani', region: 'Mithila, Bihar', type: 'Sacred Visual Art', note: 'Intricate Kohbar frescoes painted with bamboo twigs & natural plant dyes' },
    { name: 'Rogan Art', region: 'Gujarat (Kutch)', type: 'Rare Castor Oil Craft', note: '400-year castor oil stylus painting preserved by a single family lineage' }
  ];

  traditions.forEach((t, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const xPos = 0.8 + col * 2.95;
    const yPos = 1.7 + row * 2.45;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 2.75,
      h: 2.25,
      rectRadius: 0.12,
      fill: { color: COLORS.white },
      line: { color: 'E8E2D5', width: 1 }
    });

    slide.addText(t.region.toUpperCase(), {
      x: xPos + 0.15,
      y: yPos + 0.15,
      w: 2.45,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Calibri',
      color: COLORS.saffron,
      bold: true
    });

    slide.addText(t.name, {
      x: xPos + 0.15,
      y: yPos + 0.4,
      w: 2.45,
      h: 0.4,
      fontSize: 16,
      fontFace: 'Georgia',
      color: COLORS.charcoal,
      bold: true
    });

    slide.addText(t.type, {
      x: xPos + 0.15,
      y: yPos + 0.8,
      w: 2.45,
      h: 0.25,
      fontSize: 10,
      fontFace: 'Calibri',
      color: COLORS.terracotta,
      bold: true
    });

    slide.addText(t.note, {
      x: xPos + 0.15,
      y: yPos + 1.1,
      w: 2.45,
      h: 1.0,
      fontSize: 10,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 15
    });
  });
}

// -------------------------------------------------------------
// SLIDE 5: USER EXPERIENCE & THE DISCOVERY LOOP
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'The Storytelling Discovery Loop', 'User Experience');

  const steps = [
    {
      step: 'STEP 1',
      title: 'Curious Encounter',
      sub: '«You may have never heard of this.»',
      desc: 'Users encounter rare acoustic soundbites, high-res field imagery, and unwritten cultural stories in an infinite editorial feed.'
    },
    {
      step: 'STEP 2',
      title: 'Human Connection',
      sub: '«Meet the person keeping it alive.»',
      desc: 'Direct connection to the living keeper: oral lineage tree, master’s philosophy, and generational transmission timeline.'
    },
    {
      step: 'STEP 3',
      title: 'Active Transmission',
      sub: '«Learn from the source.»',
      desc: 'Enrollment in live interactive masterclasses, 1-on-1 vocal riyaz, or immersive 6-month guru-shishya apprenticeships.'
    },
    {
      step: 'STEP 4',
      title: 'Sustainable Patronage',
      sub: '«Support & carry forward.»',
      desc: 'Direct patron contributions (95% to artist), intimate courtyard baithaks, and verifiable economic empowerment.'
    }
  ];

  steps.forEach((s, idx) => {
    const xPos = 0.8 + idx * 2.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 2.75,
      h: 4.6,
      rectRadius: 0.15,
      fill: { color: idx === 3 ? COLORS.parchmentSubtle : COLORS.white },
      line: { color: idx === 3 ? COLORS.terracotta : 'E8E2D5', width: idx === 3 ? 1.5 : 1 }
    });

    slide.addText(s.step, {
      x: xPos + 0.2,
      y: 2.0,
      w: 2.3,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Calibri',
      color: COLORS.terracotta,
      bold: true
    });

    slide.addText(s.title, {
      x: xPos + 0.2,
      y: 2.35,
      w: 2.3,
      h: 0.5,
      fontSize: 16,
      fontFace: 'Georgia',
      color: COLORS.charcoal,
      bold: true
    });

    slide.addText(s.sub, {
      x: xPos + 0.2,
      y: 2.9,
      w: 2.3,
      h: 0.5,
      fontSize: 11,
      fontFace: 'Georgia',
      color: COLORS.saffron,
      italic: true
    });

    slide.addText(s.desc, {
      x: xPos + 0.2,
      y: 3.5,
      w: 2.3,
      h: 2.6,
      fontSize: 11,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 18
    });
  });
}

// -------------------------------------------------------------
// SLIDE 6: THE ARTIST-FIRST ECONOMY & SPLITS
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'The Artist-First Economic Model', 'Economic Ethics');

  // Left explanation card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.7,
    w: 4.2,
    h: 4.7,
    rectRadius: 0.15,
    fill: { color: COLORS.white },
    line: { color: 'E8E2D5', width: 1 }
  });

  slide.addText('Core Economic Principle', {
    x: 1.1,
    y: 1.9,
    w: 3.6,
    h: 0.4,
    fontSize: 15,
    fontFace: 'Georgia',
    color: COLORS.charcoal,
    bold: true
  });

  slide.addText(
    '«When you learn, experience, buy or support through ANUNAAD, the majority of what you pay goes directly to the people who keep these traditions alive.»\n\n' +
    '• Server-Side Calculation: Never relying on client inputs\n' +
    '• Complete Fee Transparency: Never hiding deductions\n' +
    '• Artist Wallet: Clear breakdown of gross, platform fee, and net balance\n' +
    '• Razorpay Route Integration: Marketplace split-payment ready',
    {
      x: 1.1,
      y: 2.4,
      w: 3.6,
      h: 3.8,
      fontSize: 11,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 20
    }
  );

  // Right Table of Revenue Splits
  const tableData = [
    [
      { text: 'Offering Type', options: { bold: true, fill: '1C1B19', color: 'FFFFFF' } },
      { text: 'Artist Share', options: { bold: true, fill: '1C1B19', color: '93C9A6' } },
      { text: 'Platform Fee', options: { bold: true, fill: '1C1B19', color: 'D8D1C2' } },
      { text: 'Settlement Purpose', options: { bold: true, fill: '1C1B19', color: 'FFFFFF' } }
    ],
    [
      { text: 'Direct Support / Tips' },
      { text: '95%', options: { bold: true, color: '2D4F38' } },
      { text: '5%' },
      { text: 'Pure patron contribution for instruments & living costs' }
    ],
    [
      { text: 'One-on-One Mentorship' },
      { text: '85%', options: { bold: true, color: '2D4F38' } },
      { text: '15%' },
      { text: 'Direct hourly oral transmission and private riyaz' }
    ],
    [
      { text: 'Interactive Masterclasses' },
      { text: '80%', options: { bold: true, color: '2D4F38' } },
      { text: '20%' },
      { text: 'Multi-part live video cohorts & practice audio loops' }
    ],
    [
      { text: '6-Month Apprenticeships' },
      { text: '85%', options: { bold: true, color: '2D4F38' } },
      { text: '15%' },
      { text: 'Cohort fellowship including residential baithaks' }
    ],
    [
      { text: 'Baithaks & Gatherings' },
      { text: '85%', options: { bold: true, color: '2D4F38' } },
      { text: '15%' },
      { text: 'Intimate acoustic courtyard seats & village walks' }
    ]
  ];

  slide.addTable(tableData, {
    x: 5.3,
    y: 1.7,
    w: 7.2,
    h: 4.7,
    fontSize: 10,
    fontFace: 'Calibri',
    border: { pt: 0.5, color: 'E8E2D5' },
    fill: COLORS.white
  });
}

// -------------------------------------------------------------
// SLIDE 7: THREE ROLE-BASED PORTALS
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'Role-Based Ecosystem (Learner, Artist, Admin)', 'System Architecture');

  const roles = [
    {
      role: 'LEARNER PORTAL',
      sub: 'The Curious Audience',
      color: COLORS.saffron,
      bullets: [
        'Enrolled Workshops & Cohorts with live video join links',
        'Saved Keepers & Cultural Heritage Watchlist',
        'Transparent Payment Invoices & Razorpay receipts',
        'Direct inquiry channel with artists without phone disclosure',
        'Personal cultural collection and certificates'
      ]
    },
    {
      role: 'ARTIST DASHBOARD & WALLET',
      sub: 'The Living Keepers',
      color: COLORS.terracotta,
      bullets: [
        'Artist Wallet (Available balance, pending bank settlements)',
        'Transparent double-entry calculation for every order',
        'One-click bank payout request via Razorpay Route',
        'Course, workshop, and apprenticeship schedule creator',
        'Verified Artist badge management (✓ Verified Artist)'
      ]
    },
    {
      role: 'SUPER ADMIN & CMS CONSOLE',
      sub: 'Platform Owners & Curators',
      color: COLORS.forest,
      bullets: [
        'Live Platform KPIs (GMV, Artist Payouts, Net Commission)',
        'Artist Verification Pipeline (review lineage, approve/reject)',
        'Live Website CMS (update hero text, banners without code)',
        'Dynamic Commission Engine (80/20, 95/5 configurable)',
        'OWASP Audit Trail & Emergency Platform Kill Switches'
      ]
    }
  ];

  roles.forEach((r, idx) => {
    const xPos = 0.8 + idx * 3.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.7,
      w: 3.75,
      h: 4.8,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: r.color, width: 1.5 }
    });

    slide.addText(r.role, {
      x: xPos + 0.2,
      y: 1.9,
      w: 3.35,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Georgia',
      color: r.color,
      bold: true
    });

    slide.addText(r.sub, {
      x: xPos + 0.2,
      y: 2.3,
      w: 3.35,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      italic: true
    });

    slide.addShape(pptx.ShapeType.rect, {
      x: xPos + 0.2,
      y: 2.65,
      w: 3.35,
      h: 0.02,
      fill: { color: 'E8E2D5' }
    });

    const bulletText = r.bullets.map(b => `• ${b}`).join('\n\n');
    slide.addText(bulletText, {
      x: xPos + 0.2,
      y: 2.8,
      w: 3.35,
      h: 3.5,
      fontSize: 10.5,
      fontFace: 'Calibri',
      color: COLORS.charcoal,
      lineSpacing: 18
    });
  });
}

// -------------------------------------------------------------
// SLIDE 8: PRODUCTION-READY SECURITY & PAYMENT INTEGRITY
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'Security, Ledger Integrity & Payments', 'Technical Engineering');

  const techFeatures = [
    {
      title: 'Never Trust the Client',
      desc: 'All pricing, fee cuts, and artist shares are calculated server-side. The frontend cannot tamper with monetary amounts.'
    },
    {
      title: 'HMAC-SHA256 Signatures',
      desc: 'Every Razorpay payment confirmation and webhook is cryptographically authenticated with SHA256 secrets before marking orders paid.'
    },
    {
      title: 'Double-Entry Immutable Ledger',
      desc: 'Financial transactions are stored with cryptographic reference hashes. Past transactions never change when admin alters commission rules.'
    },
    {
      title: 'Zero Card Data Storage',
      desc: 'PCI-DSS compliance: No credit card numbers, CVVs, or UPI PINs touch ANUNAAD servers. Handled strictly by PCI-certified gateway.'
    },
    {
      title: 'Role-Based Middleware & MFA',
      desc: 'Strict Express JWT auth guards with Super Admin 2FA enforcement, preventing cross-user profile or wallet access.'
    },
    {
      title: 'OWASP Security Headers & Audit',
      desc: 'Equipped with X-Frame-Options, XSS protection, Content-Type sniffing prevention, and complete audit logging of admin operations.'
    }
  ];

  techFeatures.forEach((f, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const xPos = 0.8 + col * 3.95;
    const yPos = 1.7 + row * 2.45;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 3.75,
      h: 2.25,
      rectRadius: 0.12,
      fill: { color: COLORS.white },
      line: { color: 'E8E2D5', width: 1 }
    });

    slide.addText(f.title, {
      x: xPos + 0.2,
      y: yPos + 0.2,
      w: 3.35,
      h: 0.4,
      fontSize: 13,
      fontFace: 'Georgia',
      color: COLORS.charcoal,
      bold: true
    });

    slide.addText(f.desc, {
      x: xPos + 0.2,
      y: yPos + 0.65,
      w: 3.35,
      h: 1.4,
      fontSize: 10.5,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 16
    });
  });
}

// -------------------------------------------------------------
// SLIDE 9: ZERO-COST & 100% OPEN-SOURCE ARCHITECTURE
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'Zero-Cost, 100% Free Open-Source Architecture', 'Engineering Feasibility');

  // Big Callout Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.7,
    w: 11.7,
    h: 1.2,
    rectRadius: 0.15,
    fill: { color: 'EDF5F0' },
    line: { color: '2D4F38', width: 1.5 }
  });

  slide.addText(
    '✓ 100% Free & Legal Open-Source Stack  •  Zero Paid Cloud Subscriptions  •  Runs Locally on Any Computer',
    {
      x: 1.0,
      y: 1.75,
      w: 11.3,
      h: 1.1,
      fontSize: 14,
      fontFace: 'Georgia',
      color: COLORS.forest,
      bold: true,
      align: 'center',
      valign: 'middle'
    }
  );

  const stackItems = [
    { title: 'Frontend UI', tech: 'React 19 + TypeScript + Vite + Tailwind CSS v4', benefit: 'Blazing fast load times, warm editorial typography, zero paid themes' },
    { title: 'Backend REST API', tech: 'Node.js Express + JWT + OWASP Security', benefit: 'Lightweight, portable, standard REST contracts with zero lock-in' },
    { title: 'Database & Ledger', tech: 'File-backed ACID JSON Store with WAL Mode', benefit: 'Requires no paid cloud Postgres/Supabase instance; zero monthly cost' },
    { title: 'Sound Engine', tech: 'Native HTML5 Web Audio API', benefit: 'Real-time waveform bars & acoustic field recordings with zero 3rd-party charges' },
    { title: 'Interactive Map', tech: 'Custom Vector SVG Geographical Component', benefit: 'Zero Google Maps API billing or tracking; lightweight subcontinental pins' },
    { title: 'Payments Sandbox', tech: 'Razorpay Route Architecture with Mock Testing', benefit: 'Full signature validation without needing live credit card charges' }
  ];

  stackItems.forEach((s, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 0.8 + col * 5.95;
    const yPos = 3.1 + row * 1.15;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.75,
      h: 1.0,
      rectRadius: 0.1,
      fill: { color: COLORS.white },
      line: { color: 'E8E2D5', width: 1 }
    });

    slide.addText(`${s.title}: `, {
      x: xPos + 0.2,
      y: yPos + 0.12,
      w: 1.8,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Georgia',
      color: COLORS.charcoal,
      bold: true
    });

    slide.addText(s.tech, {
      x: xPos + 1.8,
      y: yPos + 0.12,
      w: 3.75,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Calibri',
      color: COLORS.terracotta,
      bold: true
    });

    slide.addText(s.benefit, {
      x: xPos + 0.2,
      y: yPos + 0.48,
      w: 5.35,
      h: 0.45,
      fontSize: 9.5,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted
    });
  });
}

// -------------------------------------------------------------
// SLIDE 10: CULTURAL ETHICS & CONSENT
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'Cultural Ethics & Non-Extractive Practice', 'Guiding Principles');

  const principles = [
    {
      title: 'Culture is Not a Commodity',
      desc: 'Traditional knowledge is an ensouled transmission, not an intellectual property dataset to be packaged and sold without roots.'
    },
    {
      title: 'Keeper Authority & Ownership',
      desc: 'Artists retain 100% control over what is recorded, what can be shared publicly, and what remains private within their gurukulas.'
    },
    {
      title: 'Community Attribution',
      desc: 'Every art form clearly credits its historical roots, community origins, and the specific guru lineage that preserved it.'
    },
    {
      title: 'Multi-Perspective Editorial',
      desc: 'Every art form page explicitly distinguishes Archival Historical Context, Community Oral Lore, and Contemporary Practice.'
    }
  ];

  principles.forEach((p, idx) => {
    const xPos = 0.8 + idx * 2.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.7,
      w: 2.75,
      h: 4.8,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: 'E8E2D5', width: 1 }
    });

    slide.addText(`ETHIC 0${idx + 1}`, {
      x: xPos + 0.2,
      y: 1.95,
      w: 2.35,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Calibri',
      color: COLORS.forest,
      bold: true
    });

    slide.addText(p.title, {
      x: xPos + 0.2,
      y: 2.35,
      w: 2.35,
      h: 0.6,
      fontSize: 15,
      fontFace: 'Georgia',
      color: COLORS.charcoal,
      bold: true
    });

    slide.addText(p.desc, {
      x: xPos + 0.2,
      y: 3.1,
      w: 2.35,
      h: 3.0,
      fontSize: 11,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 18
    });
  });
}

// -------------------------------------------------------------
// SLIDE 11: ROADMAP & FUTURE IMPACT
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.parchment };
  addSlideHeader(slide, 'Project Roadmap & Social Impact', 'Future Growth');

  const phases = [
    {
      phase: 'PHASE 1 (LAUNCHED)',
      title: 'Living Core Platform',
      bullets: [
        'Complete 14-section homepage & infinite Discover feed',
        'Initial 8 living traditions & verified master keepers',
        'Audio player bar & interactive regional India map',
        'Double-entry wallet ledger & Razorpay Route sandbox',
        'Super Admin CMS & verification approval pipeline'
      ]
    },
    {
      phase: 'PHASE 2 (NEXT 6 MONTHS)',
      title: 'Regional Field Expansion',
      bullets: [
        'Onboarding 50+ living masters across northeast & tribal zones',
        'Field recording fellowship for endangered oral instruments',
        'Native Android/iOS mobile experience for remote masters',
        'Multi-lingual oral interviews in Maithili, Bengali, Marwari',
        'Community baithaks hosted in historic heritage havelis'
      ]
    },
    {
      phase: 'PHASE 3 (LONG TERM)',
      title: 'Institutional & Global Bridges',
      bullets: [
        'Partnerships with Sangeet Natak Akademi & cultural foundations',
        'Apprenticeship scholarship fund sponsored by cultural patrons',
        'Living archive replication across South Asian diaspora',
        'Fair-trade artisan direct marketplace for handmade instruments'
      ]
    }
  ];

  phases.forEach((p, idx) => {
    const xPos = 0.8 + idx * 3.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.7,
      w: 3.75,
      h: 4.8,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: idx === 0 ? COLORS.terracotta : 'E8E2D5', width: idx === 0 ? 1.5 : 1 }
    });

    slide.addText(p.phase, {
      x: xPos + 0.2,
      y: 1.9,
      w: 3.35,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Calibri',
      color: idx === 0 ? COLORS.terracotta : COLORS.saffron,
      bold: true
    });

    slide.addText(p.title, {
      x: xPos + 0.2,
      y: 2.25,
      w: 3.35,
      h: 0.5,
      fontSize: 16,
      fontFace: 'Georgia',
      color: COLORS.charcoal,
      bold: true
    });

    slide.addShape(pptx.ShapeType.rect, {
      x: xPos + 0.2,
      y: 2.8,
      w: 3.35,
      h: 0.02,
      fill: { color: 'E8E2D5' }
    });

    const bText = p.bullets.map(b => `• ${b}`).join('\n\n');
    slide.addText(bText, {
      x: xPos + 0.2,
      y: 2.95,
      w: 3.35,
      h: 3.3,
      fontSize: 10.5,
      fontFace: 'Calibri',
      color: COLORS.charcoalMuted,
      lineSpacing: 18
    });
  });
}

// -------------------------------------------------------------
// SLIDE 12: CLOSING SLIDE (Emotional & Poetic)
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.charcoal };

  slide.addText('ANUNAAD  |  अनुनाद', {
    x: 0.8,
    y: 1.5,
    w: 11.5,
    h: 0.5,
    fontSize: 14,
    fontFace: 'Georgia',
    color: COLORS.gold,
    bold: true,
    charSpacing: 2
  });

  slide.addText(
    '«Some traditions disappear quietly.\n' +
    'Some find another voice.\n' +
    'Be the person who listens.»',
    {
      x: 0.8,
      y: 2.3,
      w: 11.5,
      h: 2.0,
      fontSize: 32,
      fontFace: 'Georgia',
      color: COLORS.parchment,
      italic: true,
      lineSpacing: 46
    }
  );

  slide.addText('Every tradition deserves to resonate.', {
    x: 0.8,
    y: 4.6,
    w: 11.5,
    h: 0.5,
    fontSize: 18,
    fontFace: 'Georgia',
    color: COLORS.terracotta,
    bold: true
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 5.3,
    w: 11.5,
    h: 0.02,
    fill: { color: '3A3630' }
  });

  slide.addText(
    'Platform URL: http://localhost:3000   •   Backend API: http://localhost:5000   •   Email: admin@anunaad.org\n' +
    'Built with 100% Free & Open-Source Software   •   Zero Proprietary Cloud Costs',
    {
      x: 0.8,
      y: 5.6,
      w: 11.5,
      h: 0.8,
      fontSize: 11,
      fontFace: 'Calibri',
      color: 'A8A296',
      lineSpacing: 18
    }
  );
}

// Save presentation
const outputPath = path.resolve(process.cwd(), 'ANUNAAD_Presentation.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`\n======================================================`);
    console.log(`  SUCCESS: PowerPoint Presentation created!`);
    console.log(`  File saved to: ${outputPath}`);
    console.log(`======================================================\n`);
  })
  .catch(err => {
    console.error('Error generating presentation:', err);
    process.exit(1);
  });
