export type UserRole = 'learner' | 'artist' | 'content_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  mfaEnabled: boolean;
  createdAt: string;
}

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export interface ArtistLineage {
  guruName: string;
  guruLocation?: string;
  traditionName: string;
  generationCount?: number;
  whatLearned: string;
  whatPreserved: string;
  whoTeachesToday: string;
  historicalEra?: string;
}

export interface MediaSample {
  id: string;
  title: string;
  type: 'audio' | 'video';
  url: string;
  duration: string;
  description: string;
}

export interface Artist {
  id: string;
  userId: string;
  artFormId: string;
  name: string;
  stageName?: string;
  title: string;
  bio: string;
  region: string;
  state: string;
  location: string;
  yearsExperience: number;
  age: number;
  quote: string;
  lineage: ArtistLineage;
  verifiedStatus: VerificationStatus;
  verificationBadgeDate?: string;
  verificationNotes?: string;
  coverImage: string;
  portraitImage: string;
  audioSamples: MediaSample[];
  videoSamples: MediaSample[];
  payoutAccountId?: string;
  isFeatured: boolean;
  supportGoal?: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    patronsCount: number;
    description: string;
  };
  createdAt: string;
}

export interface ArtForm {
  id: string;
  slug: string;
  name: string;
  devanagari: string;
  category: 'music' | 'dance' | 'visual_art' | 'craft' | 'storytelling' | 'theatre' | 'instruments' | 'puppetry';
  region: string;
  state: string;
  heroImage: string;
  shortDesc: string;
  traditionStory: string;
  historyContext: string;
  communityPerspective: string;
  contemporaryPractice: string;
  audioSampleUrl: string;
  videoSampleUrl: string;
  tags: string[];
  createdAt: string;
}

export type OfferingType = 'workshop' | 'one_on_one' | 'course' | 'apprenticeship' | 'performance';
export type OfferingMode = 'live_online' | 'in_person' | 'hybrid';

export interface Offering {
  id: string;
  artistId: string;
  type: OfferingType;
  title: string;
  description: string;
  priceInr: number;
  durationDesc: string;
  scheduleDesc: string;
  capacity: number;
  bookedCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Welcome';
  mode: OfferingMode;
  location?: string;
  imageUrl: string;
  status: 'active' | 'completed' | 'cancelled';
  features: string[];
  createdAt: string;
}

export interface Experience {
  id: string;
  artistId: string;
  artFormId: string;
  title: string;
  category: string;
  location: string;
  city: string;
  state: string;
  dateTime: string;
  duration: string;
  priceInr: number;
  capacity: number;
  bookedCount: number;
  description: string;
  highlights: string[];
  imageUrl: string;
  createdAt: string;
}

export type OrderStatus = 'created' | 'paid' | 'refunded' | 'failed';

export interface Order {
  id: string;
  orderId: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  artistId: string;
  offeringId?: string;
  experienceId?: string;
  type: 'workshop' | 'one_on_one' | 'course' | 'apprenticeship' | 'experience' | 'support_tip';
  itemTitle: string;
  grossAmountInr: number;
  platformFeePercent: number;
  platformFeeInr: number;
  artistShareInr: number;
  gateway: 'razorpay';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  status: OrderStatus;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistWallet {
  artistId: string;
  availableBalanceInr: number;
  pendingBalanceInr: number;
  lifetimeEarningsInr: number;
  lastPayoutAt?: string;
  updatedAt: string;
}

export type LedgerEntryType = 
  | 'credit_order' 
  | 'debit_platform_fee' 
  | 'credit_artist_share' 
  | 'debit_payout' 
  | 'refund_reversal' 
  | 'credit_tip';

export interface LedgerEntry {
  id: string;
  entryType: LedgerEntryType;
  orderId?: string;
  artistId: string;
  amountInr: number;
  balanceAfterInr: number;
  description: string;
  referenceHash: string;
  createdAt: string;
}

export interface ArtistPayout {
  id: string;
  artistId: string;
  artistName: string;
  amountInr: number;
  bankAccountLast4: string;
  ifscCode: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  referenceId?: string;
  processedBy?: string;
  createdAt: string;
  processedAt?: string;
}

export interface PlatformSettings {
  commissionWorkshops: number; // e.g. 20 (%)
  commissionLessons: number;   // e.g. 15 (%)
  commissionCourses: number;   // e.g. 20 (%)
  commissionExperiences: number; // e.g. 15 (%)
  commissionTips: number;      // e.g. 5 (%)
  maintenanceMode: boolean;
  registrationsEnabled: boolean;
  payoutsEnabled: boolean;
  razorpayKeyId: string;
  razorpayMockMode: boolean;
  currency: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  role: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}

export interface CmsContent {
  heroTagline: string;
  heroSubtext: string;
  announcementBanner: string;
  featuredArtistId: string;
  featuredArtFormIds: string[];
  editorialManifesto: string;
  footerQuote: string;
}
