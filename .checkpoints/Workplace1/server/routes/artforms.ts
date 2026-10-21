import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

// GET /api/artforms
router.get('/', (req: Request, res: Response) => {
  try {
    let artForms = db.getAllArtForms();
    const { category, region, search } = req.query;

    if (category && typeof category === 'string' && category !== 'all') {
      artForms = artForms.filter(af => af.category === category);
    }
    if (region && typeof region === 'string') {
      artForms = artForms.filter(af => af.region.toLowerCase().includes(region.toLowerCase()) || af.state.toLowerCase().includes(region.toLowerCase()));
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      artForms = artForms.filter(af => 
        af.name.toLowerCase().includes(q) || 
        af.devanagari.includes(q) ||
        af.shortDesc.toLowerCase().includes(q) ||
        af.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return res.json({ artForms });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch art forms' });
  }
});

// GET /api/artforms/:idOrSlug
router.get('/:idOrSlug', (req: Request, res: Response) => {
  try {
    const idOrSlug = req.params.idOrSlug as string;
    const artForm = db.getArtFormById(idOrSlug) || db.getArtFormBySlug(idOrSlug);
    if (!artForm) {
      return res.status(404).json({ error: 'Art form not found' });
    }

    const artists = db.getArtistsByArtForm(artForm.id);
    const offerings = db.getAllOfferings().filter(o => 
      artists.some(a => a.id === o.artistId)
    );
    const experiences = db.getAllExperiences().filter(e => e.artFormId === artForm.id);

    return res.json({
      artForm,
      artists,
      offerings,
      experiences
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load art form details' });
  }
});

export default router;
