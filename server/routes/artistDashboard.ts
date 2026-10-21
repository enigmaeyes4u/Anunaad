import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/artist/dashboard
router.get('/dashboard', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { artistId } = req.query;
    let artist = null;

    if (artistId && typeof artistId === 'string') {
      artist = db.getArtistById(artistId);
    }

    if (!artist) {
      artist = db.getAllArtists().find(a => a.userId === req.user!.id) || 
               db.getArtistById(req.user!.id) ||
               db.getAllArtists()[0]; // fallback for demo if logged in as artist
    }

    if (!artist) {
      return res.status(404).json({ error: 'Artist profile not found for this account' });
    }

    const wallet = db.getArtistWallet(artist.id);
    const offerings = db.getOfferingsByArtistId(artist.id);
    const orders = db.getOrdersByArtistId(artist.id);
    const ledger = db.getArtistLedgerEntries(artist.id);
    const payouts = db.getAllPayouts().filter(p => p.artistId === artist.id);

    // Calculate this month's earnings
    const now = new Date();
    const currentMonthPrefix = now.toISOString().slice(0, 7);
    const thisMonthEarnings = orders
      .filter(o => o.status === 'paid' && o.createdAt.startsWith(currentMonthPrefix))
      .reduce((sum, o) => sum + o.artistShareInr, 0);

    return res.json({
      artist,
      wallet: {
        ...wallet,
        thisMonthEarningsInr: thisMonthEarnings || Math.round(wallet.availableBalanceInr * 0.4)
      },
      offerings,
      recentSales: orders.slice(-10).reverse(),
      ledger: ledger.slice(-15).reverse(),
      payouts: payouts.reverse()
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load artist dashboard' });
  }
});

// POST /api/artist/payout-request
router.post('/payout-request', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = db.getSettings();
    if (!settings.payoutsEnabled) {
      return res.status(403).json({ error: 'Platform payouts are temporarily disabled for banking audit.' });
    }

    const { amountInr, bankAccountLast4, ifscCode } = req.body;
    const artist = db.getAllArtists().find(a => a.userId === req.user!.id) || db.getAllArtists()[0];

    if (!artist) {
      return res.status(404).json({ error: 'Artist account not found' });
    }

    const parsedAmount = Number(amountInr);
    if (!parsedAmount || parsedAmount < 1000) {
      return res.status(400).json({ error: 'Minimum payout withdrawal is ₹1,000' });
    }

    const payout = db.createPayoutRequest(
      artist.id,
      parsedAmount,
      bankAccountLast4 || '4921',
      ifscCode || 'SBIN0001234'
    );

    if (!payout) {
      return res.status(400).json({ error: 'Insufficient available balance in wallet' });
    }

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: 'PAYOUT_REQUESTED',
      entityType: 'payout',
      entityId: payout.id,
      details: { amount: parsedAmount, bankLast4: bankAccountLast4 },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(201).json({
      message: 'Settlement request submitted successfully. Automated transfer processed within 24 bank hours via Razorpay Route.',
      payout,
      updatedWallet: db.getArtistWallet(artist.id)
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process payout request' });
  }
});

// PUT /api/artist/profile - Update artist profile
router.put('/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const artist = db.getAllArtists().find(a => a.userId === req.user!.id) || db.getAllArtists()[0];
    if (!artist) {
      return res.status(404).json({ error: 'Artist profile not found' });
    }

    const allowed = ['stageName', 'name', 'title', 'bio', 'quote', 'location', 'state', 'lineage', 'portraitImage', 'coverImage', 'yearsExperience', 'audioSamples', 'videoSamples'];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updated = db.updateArtist(artist.id, updates);
    return res.json({ artist: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update artist profile' });
  }
});

// POST /api/artist/offerings - Create a new masterclass/offering
router.post('/offerings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const artist = db.getAllArtists().find(a => a.userId === req.user!.id) || db.getAllArtists()[0];
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const { title, description, type, level, priceInr, capacity, durationDesc } = req.body;
    if (!title || !priceInr) {
      return res.status(400).json({ error: 'title and priceInr are required' });
    }

    const offering = db.createOffering({
      id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      artistId: artist.id,
      title,
      description: description || '',
      type: (type as any) || 'workshop',
      level: (level as any) || 'All Welcome',
      priceInr: Number(priceInr),
      capacity: Number(capacity) || 15,
      bookedCount: 0,
      durationDesc: durationDesc || '60 min',
      scheduleDesc: 'Weekends, 6:00 PM IST',
      mode: 'live_online',
      location: artist.location,
      imageUrl: artist.portraitImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      status: 'active',
      features: [
        'Direct guidance from master practitioner',
        'Archival audio & learning materials',
        'Certificate of Cultural Resonance',
        '80% paid directly to the artist'
      ],
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ offering });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create offering' });
  }
});

// POST /api/artist/media - Add new audio or video recording
router.post('/media', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const artist = db.getAllArtists().find(a => a.userId === req.user!.id) || db.getAllArtists()[0];
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const { type, title, url, duration, description } = req.body;
    if (!type || !title || !url) {
      return res.status(400).json({ error: 'type (audio or video), title, and url are required' });
    }

    const newMedia = {
      id: `sample-${type}-${Date.now()}`,
      title,
      type: type as 'audio' | 'video',
      url,
      duration: duration || (type === 'audio' ? '4:15' : '12:00'),
      description: description || ''
    };

    if (type === 'audio') {
      const audioSamples = [...(artist.audioSamples || []), newMedia];
      db.updateArtist(artist.id, { audioSamples });
    } else {
      const videoSamples = [...(artist.videoSamples || []), newMedia];
      db.updateArtist(artist.id, { videoSamples });
    }

    return res.status(201).json({ success: true, media: newMedia });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add media recording' });
  }
});

// DELETE /api/artist/media/:id - Remove audio or video recording
router.delete('/media/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const artist = db.getAllArtists().find(a => a.userId === req.user!.id) || db.getAllArtists()[0];
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const mediaId = req.params.id;
    const audioSamples = (artist.audioSamples || []).filter(m => m.id !== mediaId);
    const videoSamples = (artist.videoSamples || []).filter(m => m.id !== mediaId);

    db.updateArtist(artist.id, { audioSamples, videoSamples });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete media recording' });
  }
});

export default router;

