export type UserRole = 'learner' | 'artist' | 'content_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
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

export interface Offering {
  id: string;
  artistId: string;
  artistName?: string;
  artistLocation?: string;
  artistPortrait?: string;
  type: 'workshop' | 'one_on_one' | 'course' | 'apprenticeship' | 'performance';
  title: string;
  description: string;
  priceInr: number;
  durationDesc: string;
  scheduleDesc: string;
  capacity: number;
  bookedCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Welcome';
  mode: 'live_online' | 'in_person' | 'hybrid';
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
  artistName?: string;
  artFormName?: string;
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

export interface Order {
  id: string;
  orderId: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  artistId: string;
  offeringId?: string;
  experienceId?: string;
  type: string;
  itemTitle: string;
  grossAmountInr: number;
  platformFeePercent: number;
  platformFeeInr: number;
  artistShareInr: number;
  status: 'created' | 'paid' | 'refunded' | 'failed';
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistWallet {
  artistId: string;
  availableBalanceInr: number;
  pendingBalanceInr: number;
  lifetimeEarningsInr: number;
  thisMonthEarningsInr?: number;
  lastPayoutAt?: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  entryType: string;
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
  createdAt: string;
  processedAt?: string;
}

export interface PlatformSettings {
  commissionWorkshops: number;
  commissionLessons: number;
  commissionCourses: number;
  commissionExperiences: number;
  commissionTips: number;
  maintenanceMode: boolean;
  registrationsEnabled: boolean;
  payoutsEnabled: boolean;
  razorpayKeyId: string;
  razorpayMockMode: boolean;
  currency: string;
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
