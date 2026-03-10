// functions/index.js
// ══════════════════════════════════════════════════════════════
//  Dendritic Cloud Functions — Backend Logic
//  Deploy: firebase deploy --only functions
//  Install: cd functions && npm install
// ══════════════════════════════════════════════════════════════

const functions = require('firebase-functions');
const admin     = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// ── 1. Send notification when a new order is placed ────────────
exports.onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, ctx) => {
    const order    = snap.data();
    const orderId  = ctx.params.orderId;
    const vendorId = order.vendorId;

    // Get vendor details
    const vendorSnap = await db.doc(`vendors/${vendorId}`).get();
    if (!vendorSnap.exists) return;
    const vendor = vendorSnap.data();

    // Log for debugging
    console.log(`New order ${orderId} for vendor ${vendor.businessName}`);

    // Update vendor stats
    await db.doc(`vendors/${vendorId}`).update({
      totalOrders: admin.firestore.FieldValue.increment(1),
      totalSales:  admin.firestore.FieldValue.increment(order.total || 0),
    });

    // ── Optional: Send email via SendGrid ──────────────────────
    // Uncomment and add SENDGRID_API_KEY to Firebase env vars:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(functions.config().sendgrid.key);
    // await sgMail.send({
    //   to:      vendor.email,
    //   from:    'orders@dendritic.co.za',
    //   subject: `New order #${orderId.slice(-6).toUpperCase()} on Dendritic!`,
    //   html:    `<h2>You have a new order!</h2><p>Order total: R${order.total}</p>`,
    // });

    // ── Optional: SMS via Africa's Talking ────────────────────
    // const AfricasTalking = require('africastalking');
    // const at = AfricasTalking({ apiKey: functions.config().at.key, username: 'dendritic' });
    // await at.SMS.send({ to: [vendor.phone], message: `Dendritic: New order R${order.total}! Log in to confirm.`, from: 'Dendritic' });

    return null;
  });

// ── 2. Auto-approve vendors after admin review ─────────────────
exports.approveVendor = functions.https.onCall(async (data, ctx) => {
  // Must be called by an admin user
  if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');

  const callerSnap = await db.doc(`admins/${ctx.auth.uid}`).get();
  if (!callerSnap.exists) throw new functions.https.HttpsError('permission-denied', 'Admins only.');

  await db.doc(`vendors/${data.vendorId}`).update({ status: 'active' });
  console.log(`Vendor ${data.vendorId} approved.`);
  return { success: true };
});

// ── 3. Scheduled: Daily sales summary to all vendors ──────────
exports.dailySalesSummary = functions.pubsub
  .schedule('0 8 * * *')  // 8am every day
  .timeZone('Africa/Johannesburg')
  .onRun(async () => {
    const vendorsSnap = await db.collection('vendors').where('status','==','active').get();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    for (const vendorDoc of vendorsSnap.docs) {
      const vendor = vendorDoc.data();
      const ordersSnap = await db.collection('orders')
        .where('vendorId','==',vendorDoc.id)
        .where('createdAt','>=',yesterday)
        .get();

      const dailyTotal  = ordersSnap.docs.reduce((s,d) => s + (d.data().total||0), 0);
      const dailyOrders = ordersSnap.size;

      console.log(`Vendor ${vendor.businessName}: ${dailyOrders} orders, R${dailyTotal} today`);
      // Email summary here using SendGrid or similar
    }
    return null;
  });

// ── 4. Clean up old cart sessions (example) ───────────────────
exports.cleanOldOrders = functions.pubsub
  .schedule('0 0 * * 0')  // weekly Sunday midnight
  .timeZone('Africa/Johannesburg')
  .onRun(async () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const old = await db.collection('orders')
      .where('status','==','delivered')
      .where('createdAt','<',cutoff)
      .get();
    const batch = db.batch();
    old.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Cleaned ${old.size} old orders.`);
    return null;
  });
