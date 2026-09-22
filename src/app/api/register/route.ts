import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { formatParticipantId } from '@/lib/idGenerator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
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

    // Update status to PAID
    await prisma.registration.updateMany({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        paymentStatus: 'PAID',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      }
    });

    const updatedRecords = await prisma.registration.findMany({
      where: { razorpayOrderId: razorpay_order_id }
    });

    // NOTE: We DO NOT send to Google Sheets / Webhook here because 
    // the requirement states manual verification in dashboard is required before email is sent.
    
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
