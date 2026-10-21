import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// Apply requireAdmin to all admin endpoints
router.use(requireAdmin);

// GET /api/admin/metrics
router.get('/metrics', (req: AuthenticatedRequest, res: Response) => {
  try {
    const artists = db.getAllArtists();
    const orders = db.getAllOrders();
    const offerings = db.getAllOfferings();
    const payouts = db.getAllPayouts();

    const paidOrders = orders.filter(o => o.status === 'paid');
    const grossVolumeInr = paidOrders.reduce((sum, o) => sum + o.grossAmountInr, 0);
    const anunaadRevenueInr = paidOrders.reduce((sum, o) => sum + o.platformFeeInr, 0);
    const artistEarningsInr = paidOrders.reduce((sum, o) => sum + o.artistShareInr, 0);
    const totalPayoutsDisbursedInr = payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amountInr, 0);

    const verifiedArtistsCount = artists.filter(a => a.verifiedStatus === 'verified').length;
    const pendingArtistsCount = artists.filter(a => a.verifiedStatus === 'pending' || a.verifiedStatus === 'under_review').length;

    return res.json({
      metrics: {
        grossVolumeInr,
        anunaadRevenueInr,
        artistEarningsInr,
        totalPayoutsDisbursedInr,
        totalArtistsCount: artists.length,
        verifiedArtistsCount,
        pendingArtistsCount,
        activeOfferingsCount: offerings.filter(o => o.status === 'active').length,
        totalOrdersCount: orders.length,
        paidOrdersCount: paidOrders.length
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to compute admin metrics' });
  }
});

// GET /api/admin/artists
router.get('/artists', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.query;
    let artists = db.getAllArtists();
    if (status && typeof status === 'string' && status !== 'all') {
      artists = artists.filter(a => a.verifiedStatus === status);
    }
    return res.json({ artists });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch artists for moderation' });
  }
});

// POST /api/admin/artists/:id/verify
router.post('/artists/:id/verify', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    if (!['verified', 'rejected', 'under_review', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    const artist = db.verifyArtist(req.params.id as string, status, notes);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: `ARTIST_STATUS_${status.toUpperCase()}`,
      entityType: 'artist',
      entityId: artist.id,
      details: { artistName: artist.name, status, notes },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      message: `Artist status updated to ${status}.`,
      artist
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Verification update failed' });
  }
});

// GET /api/admin/ledger
router.get('/ledger', (req: AuthenticatedRequest, res: Response) => {
  try {
    const ledger = db.getAllLedgerEntries();
    return res.json({ ledger: ledger.slice(-50).reverse() });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load financial ledger' });
  }
});

// GET /api/admin/payouts
router.get('/payouts', (req: AuthenticatedRequest, res: Response) => {
  try {
    const payouts = db.getAllPayouts();
    return res.json({ payouts: payouts.reverse() });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch payouts' });
  }
});

// POST /api/admin/payouts/:id/process (Super Admin only)
router.post('/payouts/:id/process', requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, referenceId } = req.body;
    if (!['completed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be completed or rejected' });
    }

    const payout = db.processPayout(
      req.params.id as string,
      status,
      req.user!.id,
      referenceId || `RZP_TXN_${Date.now()}`
    );

    if (!payout) {
      return res.status(404).json({ error: 'Payout record not found' });
    }

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: `PAYOUT_${status.toUpperCase()}`,
      entityType: 'payout',
      entityId: payout.id,
      details: { amount: payout.amountInr, referenceId },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({ message: `Payout marked as ${status}`, payout });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process payout' });
  }
});

// GET /api/admin/settings
router.get('/settings', (req: AuthenticatedRequest, res: Response) => {
  return res.json({ settings: db.getSettings() });
});

// PUT /api/admin/settings (Super Admin only)
router.put('/settings', requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: 'PLATFORM_SETTINGS_UPDATED',
      entityType: 'settings',
      entityId: 'global_config',
      details: req.body,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      message: 'Platform settings updated. Historical records preserved with original transaction commission.',
      settings: updated
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

// GET /api/admin/cms
router.get('/cms', (req: AuthenticatedRequest, res: Response) => {
  return res.json({ cms: db.getCmsContent() });
});

// PUT /api/admin/cms
router.put('/cms', (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateCmsContent(req.body);

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: 'CMS_CONTENT_UPDATED',
      entityType: 'cms',
      entityId: 'homepage',
      details: req.body,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      message: 'Website content updated successfully.',
      cms: updated
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update CMS content' });
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = db.getAuditLogs(100);
    return res.json({ auditLogs: logs });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
});

export default router;
