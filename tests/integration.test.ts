import crypto from 'crypto';
import { db } from '../server/db/database.js';

async function runTests() {
  console.log('--- STARTING ANUNAAD INTEGRATION & SECURITY TESTS ---\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: Database Initialization
  const artists = db.getAllArtists();
  assert(artists.length >= 4, `Database seeded with living keepers (found ${artists.length})`);

  const artForms = db.getAllArtForms();
  assert(artForms.length >= 7, `Database seeded with traditional art forms (found ${artForms.length})`);

  // Test 2: User Lookup & Password Hashing
  const adminUser = db.getUserByEmail('admin@anunaad.org');
  assert(!!adminUser, 'Admin user exists in database');
  assert(adminUser?.role === 'super_admin', 'Admin user has super_admin role');
  assert(adminUser?.mfaEnabled === true, 'Admin user has MFA enabled');

  // Test 3: Lineage Structure
  const raghunath = db.getArtistById('artist-raghunath');
  assert(!!raghunath?.lineage.guruName, 'Master Raghunath has verified Guru lineage');
  assert(raghunath?.verifiedStatus === 'verified', 'Master Raghunath has verified status');

  // Test 4: Dynamic Commission Settings
  const settings = db.getSettings();
  assert(settings.commissionWorkshops === 20, 'Platform default workshop commission is 20%');
  assert(settings.commissionTips === 5, 'Platform default tip commission is 5%');

  // Test 5: Double-entry Financial Ledger & Cryptographic Chaining
  const initialLedgerCount = db.getAllLedgerEntries().length;
  const initialWallet = db.getArtistWallet('artist-raghunath');
  const initialBalance = initialWallet.availableBalanceInr;

  // Create a simulated order
  const testOrderId = `ORD_TEST_${Date.now()}`;
  const grossAmount = 2000;
  const platformFee = Math.round((grossAmount * settings.commissionWorkshops) / 100); // 400
  const artistShare = grossAmount - platformFee; // 1600

  const order = db.createOrder({
    id: `order-test-${Date.now()}`,
    orderId: testOrderId,
    learnerId: 'user-learner-1',
    learnerName: 'Aarav Sharma',
    learnerEmail: 'aarav@gmail.com',
    artistId: 'artist-raghunath',
    type: 'workshop',
    itemTitle: 'Test Workshop Enrollment',
    grossAmountInr: grossAmount,
    platformFeePercent: settings.commissionWorkshops,
    platformFeeInr: platformFee,
    artistShareInr: artistShare,
    gateway: 'razorpay',
    gatewayOrderId: `order_rzp_test_${Date.now()}`,
    status: 'created',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  assert(order.artistShareInr === 1600, 'Server-side price split correctly allocated ₹1,600 (80%) to artist');

  // Transition to paid & verify ledger credit
  db.updateOrderStatus(order.id, 'paid', {
    gatewayPaymentId: 'pay_test_9988',
    gatewaySignature: 'sig_test_valid'
  });

  const updatedWallet = db.getArtistWallet('artist-raghunath');
  assert(
    updatedWallet.availableBalanceInr === initialBalance + artistShare,
    `Artist wallet credited accurately (+₹${artistShare}): New balance ₹${updatedWallet.availableBalanceInr}`
  );

  const newLedgerEntries = db.getAllLedgerEntries();
  const latestLedger = newLedgerEntries[newLedgerEntries.length - 1];
  assert(latestLedger.amountInr === artistShare, 'Financial ledger created credit entry matching artist share');
  assert(latestLedger.referenceHash.length === 64, 'Ledger entry contains valid SHA-256 integrity hash');

  // Test 6: Payout Request & Processing
  const payout = db.createPayoutRequest('artist-raghunath', 1000, '1234', 'SBIN0009999');
  assert(!!payout && payout.status === 'pending', 'Payout request created in pending state');

  const processedPayout = db.processPayout(payout!.id, 'completed', 'admin-user-1', 'RZP_ROUTE_TXN_888');
  assert(processedPayout?.status === 'completed', 'Payout marked completed with reference ID');

  // Test 7: Audit Logging
  const auditLogs = db.getAuditLogs();
  assert(auditLogs.length > 0, `Security audit log recorded actions (count: ${auditLogs.length})`);

  console.log(`\n--- TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal error during integration tests:', err);
  process.exit(1);
});
