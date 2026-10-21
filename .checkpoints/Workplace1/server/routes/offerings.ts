import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { Offering } from '../db/types.js';

const router = Router();

// GET /api/offerings
router.get('/', (req: Request, res: Response) => {
  try {
    let offerings = db.getAllOfferings();
    const { type, artistId, level, search } = req.query;

    if (type && typeof type === 'string' && type !== 'all') {
      offerings = offerings.filter(o => o.type === type);
    }
    if (artistId && typeof artistId === 'string') {
      offerings = offerings.filter(o => o.artistId === artistId);
    }
    if (level && typeof level === 'string' && level !== 'all') {
      offerings = offerings.filter(o => o.level === level);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      offerings = offerings.filter(o => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
    }

    // Attach artist details to each offering
    const enriched = offerings.map(o => {
      const artist = db.getArtistById(o.artistId);
      return {
        ...o,
        artistName: artist ? artist.name : 'Master Keeper',
        artistLocation: artist ? artist.location : 'India',
        artistPortrait: artist ? artist.portraitImage : ''
      };
    });

    return res.json({ offerings: enriched });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch offerings' });
  }
});

// GET /api/offerings/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const offering = db.getOfferingById(req.params.id as string);
    if (!offering) {
      return res.status(404).json({ error: 'Offering not found' });
    }
    const artist = db.getArtistById(offering.artistId);
    const settings = db.getSettings();

    // Determine commission rate
    let commissionPercent = settings.commissionWorkshops;
    if (offering.type === 'one_on_one') commissionPercent = settings.commissionLessons;
    if (offering.type === 'apprenticeship') commissionPercent = 15;

    const platformShare = Math.round((offering.priceInr * commissionPercent) / 100);
    const artistShare = offering.priceInr - platformShare;

    return res.json({
      offering,
      artist,
      economics: {
        priceInr: offering.priceInr,
        commissionPercent,
        platformFeeInr: platformShare,
        artistShareInr: artistShare,
        disclaimer: 'Transparent Cultural Economy: 80% to 85% of what you pay is disbursed directly to the artist.'
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch offering' });
  }
});

// POST /api/offerings (Artist or Admin)
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      artistId, type, title, description, priceInr, durationDesc,
      scheduleDesc, capacity, level, mode, location, imageUrl, features
    } = req.body;

    if (!title || !priceInr || !artistId) {
      return res.status(400).json({ error: 'Title, price, and artist ID are required' });
    }

    const artist = db.getArtistById(artistId);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Permission check
    if (req.user!.role !== 'super_admin' && req.user!.role !== 'content_admin' && req.user!.id !== artist.userId) {
      return res.status(403).json({ error: 'Unauthorized to add offerings for this artist' });
    }

    const newOffering: Offering = {
      id: `offer-${Date.now()}`,
      artistId,
      type: type || 'workshop',
      title,
      description: description || '',
      priceInr: Number(priceInr),
      durationDesc: durationDesc || '2 hours',
      scheduleDesc: scheduleDesc || 'Upcoming schedule',
      capacity: Number(capacity) || 25,
      bookedCount: 0,
      level: level || 'All Welcome',
      mode: mode || 'live_online',
      location: location || '',
      imageUrl: imageUrl || artist.coverImage,
      status: 'active',
      features: features || ['Direct learning from the master', 'Certificate of participation'],
      createdAt: new Date().toISOString()
    };

    db.createOffering(newOffering);

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: 'OFFERING_CREATED',
      entityType: 'offering',
      entityId: newOffering.id,
      details: { title: newOffering.title, price: newOffering.priceInr },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(201).json({ offering: newOffering });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create offering' });
  }
});

export default router;
