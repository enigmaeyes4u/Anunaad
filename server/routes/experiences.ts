import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

// GET /api/experiences
router.get('/', (req: Request, res: Response) => {
  try {
    let experiences = db.getAllExperiences();
    const { city, category, search } = req.query;

    if (city && typeof city === 'string' && city !== 'all') {
      experiences = experiences.filter(e => e.city.toLowerCase().includes(city.toLowerCase()) || e.location.toLowerCase().includes(city.toLowerCase()));
    }
    if (category && typeof category === 'string' && category !== 'all') {
      experiences = experiences.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      experiences = experiences.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }

    const enriched = experiences.map(e => {
      const artist = db.getArtistById(e.artistId);
      const artForm = db.getArtFormById(e.artFormId);
      return {
        ...e,
        artistName: artist ? artist.name : 'Master Keeper',
        artFormName: artForm ? artForm.name : 'Living Tradition'
      };
    });

    return res.json({ experiences: enriched });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// GET /api/experiences/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const experience = db.getExperienceById(req.params.id as string);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    const artist = db.getArtistById(experience.artistId);
    const artForm = db.getArtFormById(experience.artFormId);

    return res.json({
      experience,
      artist,
      artForm
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch experience details' });
  }
});

export default router;
