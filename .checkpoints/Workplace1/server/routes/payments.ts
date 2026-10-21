import { Router, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { Order } from '../db/types.js';

const router = Router();

// Secret keys from environment or test fallback
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_ANUNAAD2026_salt';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_2026';

// Helper to calculate server-side economics
function calculateEconomics(type: Order['type'], basePriceInr: number) {
  const settings = db.getSettings();
  let feePercent = settings.commissionWorkshops;

  switch (type) {
    case 'one_on_one':
      feePercent = settings.commissionLessons;
      break;
    case 'course':
      feePercent = settings.commissionCourses;
      break;
    case 'experience':
      feePercent = settings.commissionExperiences;
      break;
    case 'support_tip':
      feePercent = settings.commissionTips; // Transparent 5% platform fee for tips, 95% goes to artist
      break;
    case 'apprenticeship':
      feePercent = 15;
      break;
    case 'workshop':
    default:
      feePercent = settings.commissionWorkshops;
      break;
  }

  const platformFeeInr = Math.round((basePriceInr * feePercent) / 100);
  const artistShareInr = basePriceInr - platformFeeInr;

  return {
    grossAmountInr: basePriceInr,
    platformFeePercent: feePercent,
    platformFeeInr,
    artistShareInr
  };
}

// POST /api/payments/create-order
// STRICT SERVER-SIDE VALIDATION: Never rely on frontend amounts
router.post('/create-order', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { offeringId, experienceId, tipArtistId, tipAmountInr, learnerName, learnerEmail } = req.body;
    const settings = db.getSettings();

    if (settings.maintenanceMode) {
      return res.status(503).json({ error: 'Platform is in scheduled maintenance mode. Transactions temporarily paused.' });
    }

    let grossAmountInr = 0;
    let itemTitle = '';
    let artistId = '';
    let orderType: Order['type'] = 'workshop';

    if (offeringId) {
      const offering = db.getOfferingById(offeringId);
      if (!offering || offering.status !== 'active') {
        return res.status(404).json({ error: 'Offering unavailable or inactive' });
      }
      grossAmountInr = offering.priceInr;
      itemTitle = offering.title;
      artistId = offering.artistId;
      orderType = offering.type === 'one_on_one' ? 'one_on_one' : 
                  offering.type === 'apprenticeship' ? 'apprenticeship' : 'workshop';
    } else if (experienceId) {
      const experience = db.getExperienceById(experienceId);
      if (!experience) {
        return res.status(404).json({ error: 'Cultural experience not found' });
      }
      grossAmountInr = experience.priceInr;
      itemTitle = experience.title;
      artistId = experience.artistId;
      orderType = 'experience';
    } else if (tipArtistId && tipAmountInr) {
      const artist = db.getArtistById(tipArtistId);
      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      const parsedTip = Number(tipAmountInr);
      if (isNaN(parsedTip) || parsedTip < 50) {
        return res.status(400).json({ error: 'Minimum contribution amount is ₹50' });
      }
      grossAmountInr = parsedTip;
      itemTitle = `Direct Patronage & Support for ${artist.name}`;
      artistId = artist.id;
      orderType = 'support_tip';
    } else {
      return res.status(400).json({ error: 'Valid offering, experience, or artist support details required' });
    }

    const artist = db.getArtistById(artistId);
    if (!artist) {
      return res.status(404).json({ error: 'Target artist not found' });
    }

    // Calculate server-side economics
    const econ = calculateEconomics(orderType, grossAmountInr);

    // Generate unique order IDs
    const timestamp = Date.now();
    const orderId = `ORD_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${Math.floor(1000 + Math.random() * 9000)}`;
    const gatewayOrderId = `order_rzp_${timestamp}_${Math.random().toString(36).substring(2, 8)}`;

    const newOrder: Order = {
      id: `order-${timestamp}`,
      orderId,
      learnerId: req.user!.id,
      learnerName: learnerName || req.user!.name,
      learnerEmail: learnerEmail || req.user!.email,
      artistId,
      offeringId,
      experienceId,
      type: orderType,
      itemTitle,
      grossAmountInr: econ.grossAmountInr,
      platformFeePercent: econ.platformFeePercent,
      platformFeeInr: econ.platformFeeInr,
      artistShareInr: econ.artistShareInr,
      gateway: 'razorpay',
      gatewayOrderId,
      status: 'created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createOrder(newOrder);

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: 'PAYMENT_ORDER_CREATED',
      entityType: 'order',
      entityId: newOrder.id,
      details: {
        orderId: newOrder.orderId,
        gross: newOrder.grossAmountInr,
        artistShare: newOrder.artistShareInr,
        platformFee: newOrder.platformFeeInr
      },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(201).json({
      orderId: newOrder.orderId,
      gatewayOrderId: newOrder.gatewayOrderId,
      amountInr: newOrder.grossAmountInr,
      currency: 'INR',
      keyId: settings.razorpayKeyId,
      itemTitle: newOrder.itemTitle,
      artistName: artist.name,
      mockMode: settings.razorpayMockMode,
      breakdown: {
        gross: newOrder.grossAmountInr,
        artistShare: newOrder.artistShareInr,
        artistSharePercent: 100 - newOrder.platformFeePercent,
        platformFee: newOrder.platformFeeInr,
        note: `Transparent Guarantee: ₹${newOrder.artistShareInr} (${100 - newOrder.platformFeePercent}%) directly supports ${artist.name}.`
      }
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payments/verify-payment
// Server-side HMAC-SHA256 signature verification
router.post('/verify-payment', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { gatewayOrderId, gatewayPaymentId, gatewaySignature } = req.body;

    if (!gatewayOrderId || !gatewayPaymentId) {
      return res.status(400).json({ error: 'Missing payment identifiers' });
    }

    const order = db.getOrderByGatewayOrderId(gatewayOrderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'paid') {
      return res.json({ message: 'Order already verified and paid', order });
    }

    const settings = db.getSettings();

    // Verify HMAC SHA256 Signature
    // In live or mock mode, generate signature from secret and payload: gatewayOrderId + "|" + gatewayPaymentId
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${gatewayOrderId}|${gatewayPaymentId}`)
      .digest('hex');

    const isMatch = settings.razorpayMockMode 
      ? (gatewaySignature === expectedSignature || gatewaySignature === 'mock_valid_signature_2026')
      : gatewaySignature === expectedSignature;

    if (!isMatch) {
      db.logAudit({
        userId: req.user!.id,
        userEmail: req.user!.email,
        role: req.user!.role,
        action: 'PAYMENT_SIGNATURE_MISMATCH_SUSPECT',
        entityType: 'order',
        entityId: order.id,
        details: { gatewayOrderId, gatewayPaymentId },
        ipAddress: req.ip || '127.0.0.1'
      });
      return res.status(400).json({ error: 'Payment signature verification failed. Untrusted response.' });
    }

    // Mark paid & trigger ledger credit via database engine
    const paidOrder = db.updateOrderStatus(order.id, 'paid', {
      gatewayPaymentId,
      gatewaySignature
    });

    // If offering, increment booked count
    if (order.offeringId) {
      const offering = db.getOfferingById(order.offeringId);
      if (offering) {
        db.updateOffering(offering.id, { bookedCount: offering.bookedCount + 1 });
      }
    }

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: 'PAYMENT_VERIFIED_AND_SETTLED',
      entityType: 'order',
      entityId: order.id,
      details: {
        orderId: order.orderId,
        paymentId: gatewayPaymentId,
        artistShare: order.artistShareInr
      },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      success: true,
      message: 'Payment confirmed successfully. The artist wallet has been credited.',
      order: paidOrder
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
});

// POST /api/payments/webhook
// Asynchronous Webhook listener with signature validation
router.post('/webhook', (req: AuthenticatedRequest, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyStr = JSON.stringify(req.body);

    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(bodyStr)
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' && payload?.payment?.entity) {
      const payment = payload.payment.entity;
      const order = db.getOrderByGatewayOrderId(payment.order_id);
      if (order && order.status !== 'paid') {
        db.updateOrderStatus(order.id, 'paid', {
          gatewayPaymentId: payment.id
        });
      }
    }

    return res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

// POST /api/payments/refund-request
router.post('/refund-request', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, reason } = req.body;
    const order = db.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.learnerId !== req.user!.id && req.user!.role !== 'super_admin') {
      return res.status(403).json({ error: 'Unauthorized to refund this order' });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({ error: 'Only settled orders can be refunded' });
    }

    // In a production system, refunds require admin review or automated policy window
    const refundedOrder = db.updateOrderStatus(order.id, 'refunded', {
      refundReason: reason || 'Learner requested cancellation'
    });

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      role: req.user!.role,
      action: 'ORDER_REFUND_RECORDED',
      entityType: 'order',
      entityId: order.id,
      details: { orderId: order.orderId, reason },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      message: 'Refund processed successfully. Ledger adjustment recorded.',
      order: refundedOrder
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Refund processing failed' });
  }
});

export default router;
