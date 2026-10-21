import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { Artist } from '../db/types.js';

const router = Router();

// GET /api/artists
router.get('/', (req: Request, res: Response) => {
  try {
    let artists = db.getAllArtists();
    const { artFormId, region, verified, search } = req.query;

    if (artFormId && typeof artFormId === 'string') {
      artists = artists.filter(a => a.artFormId === artFormId);
    }
    if (region && typeof region === 'string') {
      artists = artists.filter(a => a.region.toLowerCase().includes(region.toLowerCase()) || a.state.toLowerCase().includes(region.toLowerCase()));
    }
    if (verified === 'true') {
      artists = artists.filter(a => a.verifiedStatus === 'verified');
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      artists = artists.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.lineage.traditionName.toLowerCase().includes(q)
      );
    }

    return res.json({ artists });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// GET /api/artists/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const artist = db.getArtistById(req.params.id as string);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const artForm = db.getArtFormById(artist.artFormId);
    const offerings = db.getOfferingsByArtistId(artist.id);
    const wallet = db.getArtistWallet(artist.id);

    return res.json({
      artist,
      artForm,
      offerings,
      publicStats: {
        patronsCount: artist.supportGoal?.patronsCount || 12,
        currentSupportInr: artist.supportGoal?.currentAmount || 45000,
        targetSupportInr: artist.supportGoal?.targetAmount || 100000,
        apprenticesCount: artist.lineage.whoTeachesToday ? 42 : 10
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load artist profile' });
  }
});

// POST /api/artists/apply - Respectful artist onboarding
router.post('/apply', (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name, email, phone, artFormName, region, location,
      yearsExperience, age, bio, guruName, traditionName,
      whatLearned, whatPreserved, whoTeachesToday, quote,
      portfolioUrl, audioSampleTitle, sampleAudioUrl
    } = req.body;

    if (!name || !artFormName || !location || !guruName) {
      return res.status(400).json({ error: 'Please provide all essential lineage and contact details' });
    }

    // Try to match or find existing art form
    const existingArtForm = db.getAllArtForms().find(af => 
      af.name.toLowerCase().includes(artFormName.toLowerCase())
    ) || db.getAllArtForms()[0];

    const newArtistId = `artist-${Date.now()}`;
    const newArtist: Artist = {
      id: newArtistId,
      userId: req.user ? req.user.id : `user-guest-${Date.now()}`,
      artFormId: existingArtForm.id,
      name,
      stageName: name,
      title: `Keeper of ${artFormName}`,
      bio: bio || 'Practicing and preserving generational heritage traditions.',
      region: region || 'Regional Traditions',
      state: location,
      location,
      yearsExperience: Number(yearsExperience) || 15,
      age: Number(age) || 40,
      quote: quote || 'A tradition survives when it is passed into eager hands.',
      lineage: {
        guruName,
        traditionName: traditionName || `${artFormName} Oral Lineage`,
        whatLearned: whatLearned || 'Traditional methods and compositions',
        whatPreserved: whatPreserved || 'Rare regional repertoire',
        whoTeachesToday: whoTeachesToday || 'Local community learners'
      },
      verifiedStatus: 'pending',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      portraitImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
      audioSamples: sampleAudioUrl ? [{
        id: `sample-${Date.now()}`,
        title: audioSampleTitle || 'Traditional Field Recording',
        type: 'audio',
        url: sampleAudioUrl,
        duration: '3:30',
        description: 'Uploaded by artist for verification'
      }] : [],
      videoSamples: [],
      isFeatured: false,
      createdAt: new Date().toISOString()
    };

    db.createArtist(newArtist);

    db.logAudit({
      userId: req.user ? req.user.id : 'anonymous_applicant',
      userEmail: email || (req.user ? req.user.email : 'applicant@guest'),
      role: 'artist_applicant',
      action: 'ARTIST_APPLICATION_SUBMITTED',
      entityType: 'artist',
      entityId: newArtist.id,
      details: { name: newArtist.name, artForm: artFormName, guru: guruName },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(201).json({
      message: 'Your application has been received with deep respect. Our curatorial circle reviews every oral lineage personally within 48 hours.',
      artistId: newArtist.id
    });
  } catch (err: any) {
    console.error('Artist application error:', err);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
});

// PUT /api/artists/:id
router.put('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const artist = db.getArtistById(req.params.id as string);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Only the artist owner or an admin can update
    if (req.user!.role !== 'super_admin' && req.user!.role !== 'content_admin' && req.user!.id !== artist.userId) {
      return res.status(403).json({ error: 'Unauthorized to edit this profile' });
    }

    const updated = db.updateArtist(artist.id, req.body);
    return res.json({ artist: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update artist' });
  }
});

export default router;
