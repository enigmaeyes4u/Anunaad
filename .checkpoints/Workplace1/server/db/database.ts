import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User, Artist, ArtForm, Offering, Experience, Order,
  ArtistWallet, LedgerEntry, ArtistPayout, PlatformSettings,
  AuditLog, CmsContent, VerificationStatus
} from './types.js';
import {
  SEED_USERS, SEED_ART_FORMS, SEED_ARTISTS,
  SEED_OFFERINGS, SEED_EXPERIENCES,
  DEFAULT_PLATFORM_SETTINGS, DEFAULT_CMS_CONTENT
} from './seedData.js';

interface DatabaseSchema {
  users: User[];
  artists: Artist[];
  artForms: ArtForm[];
  offerings: Offering[];
  experiences: Experience[];
  orders: Order[];
  wallets: Record<string, ArtistWallet>;
  ledger: LedgerEntry[];
  payouts: ArtistPayout[];
  settings: PlatformSettings;
  cms: CmsContent;
  auditLogs: AuditLog[];
}

class AnunaadDatabase {
  private dbPath: string;
  private data: DatabaseSchema;
  private isSaving: boolean = false;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = path.join(dataDir, 'anunaad_store.json');
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database store, reseeding clean state:', err);
      }
    }

    // Seed initial state
    const initialWallets: Record<string, ArtistWallet> = {};
    for (const artist of SEED_ARTISTS) {
      initialWallets[artist.id] = {
        artistId: artist.id,
        availableBalanceInr: 34500,
        pendingBalanceInr: 4500,
        lifetimeEarningsInr: 189000,
        lastPayoutAt: '2026-02-15T10:30:00.000Z',
        updatedAt: new Date().toISOString()
      };
    }

    const initialLedger: LedgerEntry[] = [
      {
        id: 'ledg-init-1',
        entryType: 'credit_artist_share',
        artistId: 'artist-raghunath',
        amountInr: 1199,
        balanceAfterInr: 34500,
        description: 'Workshop enrolment share for "The Soul of Desert Maand"',
        referenceHash: crypto.createHash('sha256').update('seed_raghunath_init').digest('hex'),
        createdAt: '2026-02-15T10:20:00.000Z'
      }
    ];

    const initialOrders: Order[] = [
      {
        id: 'ord-sample-1',
        orderId: 'ORD_2026_0215_9821',
        learnerId: 'user-learner-1',
        learnerName: 'Aarav Sharma',
        learnerEmail: 'aarav@gmail.com',
        artistId: 'artist-raghunath',
        offeringId: 'offer-maand-live',
        type: 'workshop',
        itemTitle: 'The Soul of Desert Maand: 4-Part Immersive Workshop',
        grossAmountInr: 1499,
        platformFeePercent: 20,
        platformFeeInr: 300,
        artistShareInr: 1199,
        gateway: 'razorpay',
        gatewayOrderId: 'order_rzp_mock_112233',
        gatewayPaymentId: 'pay_rzp_mock_998877',
        status: 'paid',
        createdAt: '2026-02-15T10:15:00.000Z',
        updatedAt: '2026-02-15T10:20:00.000Z'
      }
    ];

    const initialAudit: AuditLog[] = [
      {
        id: 'audit-init',
        userId: 'system',
        userEmail: 'system@anunaad.org',
        role: 'system',
        action: 'DATABASE_INITIALIZED',
        entityType: 'system',
        entityId: 'anunaad_core',
        details: { message: 'ANUNAAD cultural database initialized with living keeper records' },
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString()
      }
    ];

    const schema: DatabaseSchema = {
      users: SEED_USERS,
      artists: SEED_ARTISTS,
      artForms: SEED_ART_FORMS,
      offerings: SEED_OFFERINGS,
      experiences: SEED_EXPERIENCES,
      orders: initialOrders,
      wallets: initialWallets,
      ledger: initialLedger,
      payouts: [],
      settings: DEFAULT_PLATFORM_SETTINGS,
      cms: DEFAULT_CMS_CONTENT,
      auditLogs: initialAudit
    };

    this.saveDataSync(schema);
    return schema;
  }

  private saveDataSync(data: DatabaseSchema) {
    try {
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tempPath, this.dbPath);
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  private save() {
    this.saveDataSync(this.data);
  }

  // --- Users ---
  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  // --- Artists ---
  getAllArtists(): Artist[] {
    return this.data.artists;
  }

  getArtistById(id: string): Artist | undefined {
    return this.data.artists.find(a => a.id === id || a.userId === id);
  }

  getArtistsByArtForm(artFormId: string): Artist[] {
    return this.data.artists.filter(a => a.artFormId === artFormId);
  }

  createArtist(artist: Artist): Artist {
    this.data.artists.push(artist);
    if (!this.data.wallets[artist.id]) {
      this.data.wallets[artist.id] = {
        artistId: artist.id,
        availableBalanceInr: 0,
        pendingBalanceInr: 0,
        lifetimeEarningsInr: 0,
        updatedAt: new Date().toISOString()
      };
    }
    this.save();
    return artist;
  }

  updateArtist(id: string, updates: Partial<Artist>): Artist | null {
    const idx = this.data.artists.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.artists[idx] = { ...this.data.artists[idx], ...updates };
    this.save();
    return this.data.artists[idx];
  }

  verifyArtist(id: string, status: VerificationStatus, notes?: string): Artist | null {
    const artist = this.getArtistById(id);
    if (!artist) return null;
    artist.verifiedStatus = status;
    if (status === 'verified') {
      artist.verificationBadgeDate = new Date().toISOString();
    }
    if (notes) artist.verificationNotes = notes;
    this.save();
    return artist;
  }

  // --- Art Forms ---
  getAllArtForms(): ArtForm[] {
    return this.data.artForms;
  }

  getArtFormById(id: string): ArtForm | undefined {
    return this.data.artForms.find(a => a.id === id);
  }

  getArtFormBySlug(slug: string): ArtForm | undefined {
    return this.data.artForms.find(a => a.slug === slug);
  }

  createArtForm(artForm: ArtForm): ArtForm {
    this.data.artForms.push(artForm);
    this.save();
    return artForm;
  }

  updateArtForm(id: string, updates: Partial<ArtForm>): ArtForm | null {
    const idx = this.data.artForms.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.artForms[idx] = { ...this.data.artForms[idx], ...updates };
    this.save();
    return this.data.artForms[idx];
  }

  // --- Offerings (Courses, Workshops, Apprenticeships) ---
  getAllOfferings(): Offering[] {
    return this.data.offerings;
  }

  getOfferingById(id: string): Offering | undefined {
    return this.data.offerings.find(o => o.id === id);
  }

  getOfferingsByArtistId(artistId: string): Offering[] {
    return this.data.offerings.filter(o => o.artistId === artistId);
  }

  createOffering(offering: Offering): Offering {
    this.data.offerings.push(offering);
    this.save();
    return offering;
  }

  updateOffering(id: string, updates: Partial<Offering>): Offering | null {
    const idx = this.data.offerings.findIndex(o => o.id === id);
    if (idx === -1) return null;
    this.data.offerings[idx] = { ...this.data.offerings[idx], ...updates };
    this.save();
    return this.data.offerings[idx];
  }

  // --- Experiences ---
  getAllExperiences(): Experience[] {
    return this.data.experiences;
  }

  getExperienceById(id: string): Experience | undefined {
    return this.data.experiences.find(e => e.id === id);
  }

  createExperience(experience: Experience): Experience {
    this.data.experiences.push(experience);
    this.save();
    return experience;
  }

  // --- Orders & Payments ---
  getAllOrders(): Order[] {
    return this.data.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderId === id);
  }

  getOrderByGatewayOrderId(gatewayOrderId: string): Order | undefined {
    return this.data.orders.find(o => o.gatewayOrderId === gatewayOrderId);
  }

  getOrdersByLearnerId(learnerId: string): Order[] {
    return this.data.orders.filter(o => o.learnerId === learnerId);
  }

  getOrdersByArtistId(artistId: string): Order[] {
    return this.data.orders.filter(o => o.artistId === artistId);
  }

  createOrder(order: Order): Order {
    this.data.orders.push(order);
    this.save();
    return order;
  }

  updateOrderStatus(orderId: string, status: Order['status'], details?: {
    gatewayPaymentId?: string;
    gatewaySignature?: string;
    refundReason?: string;
  }): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    if (details?.gatewayPaymentId) order.gatewayPaymentId = details.gatewayPaymentId;
    if (details?.gatewaySignature) order.gatewaySignature = details.gatewaySignature;
    if (details?.refundReason) order.refundReason = details.refundReason;

    // If order transitioned to paid, execute financial ledger credit
    if (status === 'paid') {
      this.creditArtistBalance(order);
    }
    this.save();
    return order;
  }

  // --- Wallets & Double-Entry Ledger ---
  getArtistWallet(artistId: string): ArtistWallet {
    if (!this.data.wallets[artistId]) {
      this.data.wallets[artistId] = {
        artistId,
        availableBalanceInr: 0,
        pendingBalanceInr: 0,
        lifetimeEarningsInr: 0,
        updatedAt: new Date().toISOString()
      };
      this.save();
    }
    return this.data.wallets[artistId];
  }

  creditArtistBalance(order: Order): void {
    const wallet = this.getArtistWallet(order.artistId);
    wallet.availableBalanceInr += order.artistShareInr;
    wallet.lifetimeEarningsInr += order.artistShareInr;
    wallet.updatedAt = new Date().toISOString();

    const lastHash = this.data.ledger.length > 0 
      ? this.data.ledger[this.data.ledger.length - 1].referenceHash 
      : 'genesis_block';

    const newHash = crypto.createHash('sha256')
      .update(`${lastHash}_${order.id}_${order.artistShareInr}_${Date.now()}`)
      .digest('hex');

    const entry: LedgerEntry = {
      id: `ledg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entryType: order.type === 'support_tip' ? 'credit_tip' : 'credit_artist_share',
      orderId: order.id,
      artistId: order.artistId,
      amountInr: order.artistShareInr,
      balanceAfterInr: wallet.availableBalanceInr,
      description: `Payment for ${order.itemTitle} (${order.orderId})`,
      referenceHash: newHash,
      createdAt: new Date().toISOString()
    };

    this.data.ledger.push(entry);
    this.save();
  }

  getAllLedgerEntries(): LedgerEntry[] {
    return this.data.ledger;
  }

  getArtistLedgerEntries(artistId: string): LedgerEntry[] {
    return this.data.ledger.filter(l => l.artistId === artistId);
  }

  // --- Payouts ---
  createPayoutRequest(artistId: string, amount: number, bankLast4: string, ifsc: string): ArtistPayout | null {
    const wallet = this.getArtistWallet(artistId);
    if (wallet.availableBalanceInr < amount) {
      return null;
    }

    const artist = this.getArtistById(artistId);
    const payout: ArtistPayout = {
      id: `pay-${Date.now()}`,
      artistId,
      artistName: artist ? artist.name : 'Unknown Artist',
      amountInr: amount,
      bankAccountLast4: bankLast4,
      ifscCode: ifsc,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    wallet.availableBalanceInr -= amount;
    wallet.pendingBalanceInr += amount;
    wallet.updatedAt = new Date().toISOString();

    this.data.payouts.push(payout);
    this.save();
    return payout;
  }

  processPayout(payoutId: string, status: 'completed' | 'rejected', adminId: string, referenceId?: string): ArtistPayout | null {
    const payout = this.data.payouts.find(p => p.id === payoutId);
    if (!payout) return null;

    const wallet = this.getArtistWallet(payout.artistId);
    payout.status = status;
    payout.processedBy = adminId;
    payout.processedAt = new Date().toISOString();
    if (referenceId) payout.referenceId = referenceId;

    if (status === 'completed') {
      wallet.pendingBalanceInr -= payout.amountInr;
      wallet.lastPayoutAt = new Date().toISOString();

      const lastHash = this.data.ledger.length > 0 
        ? this.data.ledger[this.data.ledger.length - 1].referenceHash 
        : 'genesis_block';

      const entry: LedgerEntry = {
        id: `ledg-payout-${Date.now()}`,
        entryType: 'debit_payout',
        artistId: payout.artistId,
        amountInr: payout.amountInr,
        balanceAfterInr: wallet.availableBalanceInr,
        description: `Settlement disbursed via Razorpay Route Ref #${referenceId || payout.id}`,
        referenceHash: crypto.createHash('sha256').update(`${lastHash}_payout_${payout.id}`).digest('hex'),
        createdAt: new Date().toISOString()
      };
      this.data.ledger.push(entry);
    } else if (status === 'rejected') {
      // Return money to available balance
      wallet.pendingBalanceInr -= payout.amountInr;
      wallet.availableBalanceInr += payout.amountInr;
    }

    this.save();
    return payout;
  }

  getAllPayouts(): ArtistPayout[] {
    return this.data.payouts;
  }

  // --- Platform Settings & CMS ---
  getSettings(): PlatformSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<PlatformSettings>): PlatformSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  getCmsContent(): CmsContent {
    return this.data.cms;
  }

  updateCmsContent(updates: Partial<CmsContent>): CmsContent {
    this.data.cms = { ...this.data.cms, ...updates };
    this.save();
    return this.data.cms;
  }

  // --- Audit Logs ---
  logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const fullLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.auditLogs.unshift(fullLog);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.save();
    return fullLog;
  }

  getAuditLogs(limit: number = 100): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }
}

export const db = new AnunaadDatabase();
