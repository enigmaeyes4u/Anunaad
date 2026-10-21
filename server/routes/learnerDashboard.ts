import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/learner/dashboard
router.get('/dashboard', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = db.getOrdersByLearnerId(req.user!.id);
    
    // Enrich orders with item and artist details
    const bookings = orders.map(o => {
      const artist = db.getArtistById(o.artistId);
      const offering = o.offeringId ? db.getOfferingById(o.offeringId) : null;
      const experience = o.experienceId ? db.getExperienceById(o.experienceId) : null;

      return {
        ...o,
        artistName: artist ? artist.name : 'Master Artist',
        artistLocation: artist ? artist.location : 'India',
        artistPortrait: artist ? artist.portraitImage : '',
        schedule: offering?.scheduleDesc || experience?.dateTime || 'Scheduled',
        joinUrl: o.status === 'paid' ? 'https://meet.jit.si/anunaad-transmission-room-2026' : null
      };
    });

    // Curate saved traditions/artists for learner
    const allArtists = db.getAllArtists();
    const savedKeepers = allArtists.slice(0, 3);

    return res.json({
      user: {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        bio: req.user!.bio
      },
      bookings,
      savedKeepers,
      stats: {
        enrolledCount: bookings.filter(b => b.status === 'paid').length,
        totalContributedInr: bookings.filter(b => b.status === 'paid').reduce((s, b) => s + b.grossAmountInr, 0)
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch learner dashboard' });
  }
});

export default router;
