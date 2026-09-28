import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { formatParticipantId } from '@/lib/idGenerator';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting: max 20 verification attempts per minute per IP
    const rateLimit = checkRateLimit(request, { limit: 20, windowMs: 60 * 1000, keyPrefix: 'register' });
    if (!rateLimit.allowed) {
      const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000));
      return NextResponse.json(
        { error: 'Too many verification attempts. Please wait a minute and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('[API /register] RAZORPAY_KEY_SECRET is missing in environment.');
      return NextResponse.json({ error: 'Server payment configuration missing.' }, { status: 500 });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
    }

    // Find the registrations for this order
    const registrations = await prisma.registration.findMany({
      where: { razorpayOrderId: razorpay_order_id }
    });

    if (registrations.length === 0) {
      return NextResponse.json({ error: 'Registration records not found for this order.' }, { status: 404 });
    }

    // Update status to PAID and assign participantId
    await prisma.$transaction(
      registrations.map((reg) =>
        prisma.registration.update({
          where: { id: reg.id },
          data: {
            paymentStatus: 'PAID',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            participantId: reg.participantId || formatParticipantId(reg.participantNumber || 1),
          },
        })
      )
    );

    const updatedRecords = await prisma.registration.findMany({
      where: { razorpayOrderId: razorpay_order_id }
    });

    // Optional: Sync newly paid registrations to Google Sheets backup
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheetsWebhookUrl && sheetsWebhookUrl.startsWith('https://')) {
      try {
        const rowsToSync = updatedRecords.map((reg, idx) => ({
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
          paymentUtr: reg.razorpayPaymentId || razorpay_payment_id,
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
    return NextResponse.json(
      { 
        message: 'Payment verified and registration complete', 
        id: updatedRecords[0].teamId,
        teamId: updatedRecords[0].teamId,
        memberCount: updatedRecords.length,
        primaryId: updatedRecords[0].id,
        primaryParticipantId: updatedRecords[0].participantId || 'TB001',
        members: updatedRecords.map((r, idx) => ({
          name: r.name,
          participantId: r.participantId || `TB${String(idx + 1).padStart(3, '0')}`,
          email: r.email,
        })),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('[API /register Internal Error]:', error);
    return NextResponse.json(
      { error: 'Payment verification failed at this moment. Please try again later.' },
      { status: 500 }
    );
  }
}
