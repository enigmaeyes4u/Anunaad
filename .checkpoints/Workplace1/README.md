# ANUNAAD (अनुनाद) — Living Traditions Platform

> **«Culture should not only be preserved in archives. It should continue to live through people.»**
>
> *Tagline:* **Every tradition deserves to resonate.**  
> *Secondary Tagline:* **Discover. Listen. Learn. Carry it forward.**

ANUNAAD is a cultural discovery platform and artist economy network connecting **The Keepers** (artists, musicians, dancers, craftsmen, storytellers who preserve rare, regional, or endangered traditions) with **The Curious** (learners, audiences, and cultural patrons).

---

## 💎 Zero-Cost, 100% Free & Open-Source Architecture

This codebase is built using **100% free, legal, and open-source technologies**:
- **Zero Proprietary Cloud Costs**: Uses a local file-based database store (`data/anunaad_store.json`) with ACID-like atomic writes and double-entry cryptographic hash chaining. No paid database subscriptions required.
- **Node.js, React 19, TypeScript, Vite & Tailwind CSS**: Open source under standard MIT / BSD licenses.
- **Web Audio API**: Built-in browser audio engine for real-time waveform visualizers and field recordings (0 cost).
- **Payment Sandbox / Razorpay Route Architecture**: Production-grade server-side HMAC-SHA256 signature verification and double-entry ledger calculation. Operates in sandbox/mock test mode with 0 transaction fees.

---

## 🚀 Quick Start

### 1. Run the Full Application (Frontend + Backend)
```bash
npm start
```
This runs both the backend Express server on `http://localhost:5000` and the Vite React frontend on `http://localhost:3000`.

### 2. Run Backend Only
```bash
npm run server
```

### 3. Run Frontend Only
```bash
npm run dev
```

### 4. Run Automated Integration & Security Tests
```bash
npx tsx tests/integration.test.ts
```

### 5. Build for Production
```bash
npm run build
```

---

## 🔑 Pre-Configured Test Accounts (Instant Switcher in Login)

| Role | Email | Password | Access & Features |
| :--- | :--- | :--- | :--- |
| **Learner / Patron** | `aarav@gmail.com` | `Anunaad@2026` | Enrolled workshops, live session links, saved keepers |
| **Artist Master** | `raghunath.maand@anunaad.org` | `Anunaad@2026` | Artist Wallet, payout requests, transparent ledger, offerings |
| **Super Admin** | `admin@anunaad.org` | `Anunaad@2026` (2FA: `202626`) | Verification pipeline, Website CMS, ledger, emergency controls |

---

## 🏛️ Pages & User Flows

1. **Home (`/`)**:
   - Cinematic full-bleed hero with ambient desert Maand audio preview
   - Editorial scroll statement (*"Somewhere, someone is keeping a tradition alive..."* $\rightarrow$ *"ANUNAAD connects them."*)
   - Horizontal Discovery Carousel (Maand, Pandavani, Chhau, Baul, Tholu Bommalata, Sattriya)
   - Meet The Keepers (intimate portraits, years of riyaz, personal statements)
   - Featured Master Profile & Lineage Tree (*Guru $\rightarrow$ Learned $\rightarrow$ Preserved $\rightarrow$ Apprentices*)
   - Three Immersive Blocks: **LISTEN**, **WATCH**, **LEARN**
   - Learning from the source (with transparent 80-85% artist share badge)
   - Experiences near you (Delhi NCR, Jodhpur, Bihar, Assam)
   - Interactive India Cultural Map with clickable regional cultural pins
   - Why ANUNAAD (Discover, Connect, Learn, and highlighted **CONTINUE**)
   - Preservation Manifesto: *«A tradition survives when someone learns it.»*
   - Artist Call to Action & Generation-to-generation lineage thread
   - Final Emotional Moment & Literary Footer
2. **Discover (`/discover`)**:
   - Infinite-style editorial feed with discipline filters and real-time search
   - Storytelling discovery loop (*"You may have never heard of this"* $\rightarrow$ *"Meet the person keeping this alive"*)
3. **Artists Directory (`/artists`)**:
   - Directory of living keepers filterable by state, region, and verification status
4. **Artist Profile (`/artists/:id`)**:
   - Large hero cover & portrait, Verified badge (`✓ Verified Artist`)
   - Interactive Lineage Tree, field audio recordings, offerings
   - **Support This Artist** patron contribution modal (95% artist split)
5. **Art Forms Directory (`/art-forms`)**:
   - Visual catalog across Music, Dance, Storytelling, Visual Art, Craft, and Puppetry
6. **Individual Art Form (`/art-forms/:slug`)**:
   - Deep editorial distinguishing *Historical Information*, *Community Perspectives*, and *Contemporary Practice*
7. **Learn (`/learn`)**:
   - Masterclasses, 1-on-1 mentorship, and 6-Month Intensive Apprenticeships
8. **Experiences (`/experiences`)**:
   - Intimate courtyard baithaks, candlelit shadow puppetry, and artisan studio walks
9. **About / Manifesto (`/about`)**:
   - The Ethos: *Culture is not a commodity*
   - Transparent Revenue Split table (80%-95% to artist)
10. **Join as an Artist (`/join-artist`)**:
    - Dignified, respectful practitioner onboarding application
11. **Learner Portal (`/dashboard/learner`)**:
    - Active workshops, tickets, and order history
12. **Artist Dashboard & Wallet (`/dashboard/artist`)**:
    - Available balance, pending payouts, lifetime earnings
    - Double-entry ledger with exact calculation (`₹1,000 gross -> ₹850 artist share + ₹150 platform fee`)
    - Bank payout request form via Razorpay Route
13. **Super Admin Console (`/admin`)**:
    - Platform KPIs (GMV, Artist Payouts, Net Revenue)
    - Artist Verification workflow (review lineage, issue verified badge)
    - Website CMS (edit homepage hero, tagline, announcements live)
    - Platform-wide double-entry ledger with SHA-256 integrity hashes
    - Configurable Commission Rules (workshops 80/20, lessons 85/15, tips 95/5)
    - Emergency platform toggles (maintenance mode, freeze payouts)
    - Security Audit Log

---

## 🛡️ Security & Economic Ethics

- **Server-Side Price Validation**: Final price and revenue splits are calculated server-side; client amounts are never trusted.
- **HMAC-SHA256 Signature Verification**: Payment confirmations and webhooks are cryptographically authenticated.
- **Double-Entry Financial Ledger**: Immutable hash-chained ledger prevents balance tampering.
- **Historical Integrity**: Altering platform commission settings never changes the recorded economics of past transactions.
