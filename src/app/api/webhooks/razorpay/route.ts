import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { formatParticipantId } from '@/lib/idGenerator';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('[Razorpay Webhook Error] RAZORPAY_WEBHOOK_SECRET is not configured.');
      return NextResponse.json({ error: 'Webhook secret not configured on server' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    // 1. Verify HMAC SHA256 Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('[Razorpay Webhook] Invalid signature received.');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event;

    // 2. Handle successful payment events
    if (eventType === 'order.paid' || eventType === 'payment.captured') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id;

      if (!razorpayOrderId) {
        console.warn('[Razorpay Webhook] No order ID found in webhook payload.');
        return NextResponse.json({ status: 'ignored', message: 'No order ID in payload' }, { status: 200 });
      }

      // Find registrations for this order
      const registrations = await prisma.registration.findMany({
        where: { razorpayOrderId },
      });

      if (registrations.length === 0) {
        console.warn(`[Razorpay Webhook] No registrations found for order ${razorpayOrderId}`);
        return NextResponse.json({ status: 'not_found', orderId: razorpayOrderId }, { status: 200 });
      }

      // Check if already finalized to ensure idempotency
      const unfinalized = registrations.filter((r) => r.paymentStatus !== 'PAID');

      if (unfinalized.length > 0) {
        await prisma.$transaction(
          unfinalized.map((reg) =>
            prisma.registration.update({
              where: { id: reg.id },
              data: {
                paymentStatus: 'PAID',
                razorpayPaymentId: razorpayPaymentId || reg.razorpayPaymentId,
                participantId: reg.participantId || formatParticipantId(reg.participantNumber || 1),
              },
            })
          )
        );

        console.log(`[Razorpay Webhook] Successfully finalized ${unfinalized.length} registrations for order ${razorpayOrderId}`);
      }

      // Optional: Sync to Google Sheets if webhook URL configured
      const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
      if (sheetsWebhookUrl && sheetsWebhookUrl.startsWith('https://')) {
        try {
          const allRegs = await prisma.registration.findMany({ where: { razorpayOrderId } });
          const rowsToSync = allRegs.map((reg, idx) => ({
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            participantId: reg.participantId,
            teamId: reg.teamId,
            teamName: reg.teamName,
            memberNumber: idx + 1,
            name: reg.name,
            email: reg.email,
            phone: reg.phone,
            department: reg.department,
            year: reg.year,
            college: reg.college,
            technicalEvents: reg.technicalEvents,
            nonTechnicalEvents: reg.nonTechnicalEvents,
            paymentUtr: reg.razorpayPaymentId || razorpayPaymentId,
            amount: reg.amount,
          }));

          fetch(sheetsWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', rows: rowsToSync }),
          }).catch((err) => console.warn('[Sheets Sync Background Error]:', err));
        } catch (syncErr) {
          console.warn('[Sheets Sync Prep Error]:', syncErr);
        }
      }

      return NextResponse.json({ status: 'success', event: eventType, orderId: razorpayOrderId });
    }

    // Acknowledge other event types (e.g. payment.failed) with HTTP 200 so Razorpay does not retry
    return NextResponse.json({ status: 'acknowledged', event: eventType });
  } catch (error) {
    console.error('[Razorpay Webhook Processing Error]:', error);
    return NextResponse.json({ error: 'Internal webhook error' }, { status: 500 });
  }
}
