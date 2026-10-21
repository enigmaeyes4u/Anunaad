import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { AuthenticatedRequest, JWT_SECRET, requireAuth } from '../middleware/auth.js';
import { User } from '../db/types.js';

const router = Router();

// Sanitize user object to never leak passwordHash
function sanitizeUser(user: User) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// POST /api/auth/register
router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = db.getSettings();
    if (!settings.registrationsEnabled) {
      return res.status(403).json({ error: 'Registrations are temporarily paused by platform administration' });
    }

    const { name, email, password, role = 'learner', phone, bio, artFormId, title, region, state } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name,
      email,
      passwordHash,
      role: role === 'artist' ? 'artist' : 'learner',
      phone: phone || '',
      bio: bio || '',
      mfaEnabled: false,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    // If registered as artist, create artist profile linked to their chosen art form
    if (role === 'artist') {
      const selectedArtFormId = artFormId || 'art-rogan';
      const matchedArtForm = db.getArtFormById(selectedArtFormId) || db.getAllArtForms().find(af => af.id === selectedArtFormId || af.slug === selectedArtFormId);

      const artistTitle = title || (matchedArtForm ? `Practitioner of ${matchedArtForm.name}` : 'Traditional Living Master');
      const artistRegion = region || (matchedArtForm ? matchedArtForm.region : 'Kutch Peninsula');
      const artistState = state || (matchedArtForm ? matchedArtForm.state : 'Gujarat');
      const artistCover = matchedArtForm?.heroImage || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop';
      const sampleAudio = matchedArtForm?.audioSampleUrl || '/audio/rogan_ambient.wav';
      const sampleVideo = matchedArtForm?.videoSampleUrl || 'https://www.youtube.com/embed/qTSTJ9XQAwY';

      db.createArtist({
        id: `artist-${Date.now()}`,
        userId: newUser.id,
        artFormId: matchedArtForm ? matchedArtForm.id : 'art-rogan',
        name: newUser.name,
        title: artistTitle,
        bio: bio || `Preserving the living transmission and authentic practices of ${matchedArtForm ? matchedArtForm.name : 'regional art'}.`,
        region: artistRegion,
        state: artistState,
        location: `${artistRegion}, ${artistState}`,
        yearsExperience: 15,
        age: 40,
        quote: 'Knowledge lives when given to others.',
        lineage: {
          guruName: 'Generational Masters & Family Lineage',
          traditionName: matchedArtForm ? `${matchedArtForm.name} Lineage` : 'Living Traditional Lineage',
          whatLearned: 'Generational techniques and oral lore',
          whatPreserved: 'Authentic heritage repertoire',
          whoTeachesToday: 'Devoted apprentices and students'
        },
        verifiedStatus: 'pending',
        coverImage: artistCover,
        portraitImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        audioSamples: sampleAudio ? [
          {
            id: `sample-audio-${Date.now()}`,
            title: `${matchedArtForm ? matchedArtForm.name : 'Heritage'} Archival Recording`,
            type: 'audio',
            url: sampleAudio,
            duration: '3:30',
            description: 'Archival demonstration audio'
          }
        ] : [],
        videoSamples: sampleVideo ? [
          {
            id: `sample-video-${Date.now()}`,
            title: `${matchedArtForm ? matchedArtForm.name : 'Heritage'} Living Technique`,
            type: 'video',
            url: sampleVideo,
            duration: '6:15',
            description: 'Living technique demonstration video'
          }
        ] : [],
        isFeatured: false,
        createdAt: new Date().toISOString()
      });
    }

    db.logAudit({
      userId: newUser.id,
      userEmail: newUser.email,
      role: newUser.role,
      action: 'USER_REGISTERED',
      entityType: 'user',
      entityId: newUser.id,
      details: { role: newUser.role, name: newUser.name },
      ipAddress: req.ip || '127.0.0.1'
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, mfaCode } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      db.logAudit({
        userId: user.id,
        userEmail: user.email,
        role: user.role,
        action: 'FAILED_LOGIN_ATTEMPT',
        entityType: 'user',
        entityId: user.id,
        details: { reason: 'Password mismatch' },
        ipAddress: req.ip || '127.0.0.1'
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check MFA if enabled (e.g. for super_admin)
    if (user.mfaEnabled && user.role === 'super_admin') {
      if (!mfaCode) {
        return res.status(200).json({
          requiresMfa: true,
          message: 'Two-Factor Authentication required for Super Admin portal access.',
          email: user.email
        });
      }
      // Demo MFA code verification (accepts '202626' or '123456')
      if (mfaCode !== '202626' && mfaCode !== '123456') {
        return res.status(401).json({ error: 'Invalid 2FA code. Please check your authenticator.' });
      }
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    db.logAudit({
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      details: { role: user.role },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json({ user: sanitizeUser(req.user) });
});

export default router;
