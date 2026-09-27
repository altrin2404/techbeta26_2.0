import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatParticipantId } from '@/lib/idGenerator';
import Razorpay from 'razorpay';


export async function POST(request: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });

    const body = await request.json();
    const { teamName, members } = body;

    const memberList = Array.isArray(members) && members.length > 0 
      ? members 
      : [body];

    if (!memberList.length) {
      return NextResponse.json({ error: 'At least one participant is required.' }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    for (let i = 0; i < memberList.length; i++) {
      const m = memberList[i];
      const memberLabel = `Member ${i + 1}${m.name ? ` (${m.name})` : ''}`;

      if (!m.name || typeof m.name !== 'string' || m.name.trim().length < 2) {
        return NextResponse.json({ error: `Please enter a valid full name for ${memberLabel}.` }, { status: 400 });
      }
      const cleanEmail = typeof m.email === 'string' ? m.email.trim() : '';
      if (!cleanEmail || !emailRegex.test(cleanEmail)) {
        return NextResponse.json({ error: `Please enter a valid email address for ${memberLabel}.` }, { status: 400 });
      }
      const cleanPhone = typeof m.phone === 'string' ? m.phone.trim().replace(/\D/g, '') : '';
      if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        return NextResponse.json({ error: `Please enter a valid 10-digit mobile number for ${memberLabel}.` }, { status: 400 });
      }
      if (!m.college || typeof m.college !== 'string' || !m.college.trim()) {
        return NextResponse.json({ error: `Please enter the college name for ${memberLabel}.` }, { status: 400 });
      }
      
      const techEvents = Array.isArray(m.technicalEvents) ? m.technicalEvents : (m.event1 ? [m.event1] : []);
      const nonTechEvents = Array.isArray(m.nonTechnicalEvents) ? m.nonTechnicalEvents : (m.event2 ? [m.event2] : []);

      if (techEvents.length === 0 && nonTechEvents.length === 0) {
        return NextResponse.json({ error: `Please select at least 1 technical or non-technical event for ${memberLabel}.` }, { status: 400 });
      }
      if (techEvents.length > 2) {
        return NextResponse.json({ error: `${memberLabel} cannot select more than 2 technical events.` }, { status: 400 });
      }
      if (nonTechEvents.length > 2) {
        return NextResponse.json({ error: `${memberLabel} cannot select more than 2 non-technical events.` }, { status: 400 });
      }
    }

    // 1. Create Razorpay Order
    const amountPerPerson = 250;
    const totalAmount = memberList.length * amountPerPerson;
    const amountInPaise = totalAmount * 100;
    
    // Create order using Razorpay SDK
    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    
    const order = await razorpay.orders.create(orderOptions);
    
    if (!order || !order.id) {
      return NextResponse.json({ error: "Failed to create payment order." }, { status: 500 });
    }

    const timestamp = Date.now().toString().slice(-4);
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const teamId = `TB26-${timestamp}-${randomHex}`;

    const totalExisting = await prisma.registration.count();
    if (totalExisting === 0) {
      try {
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Registration_participantNumber_seq" RESTART WITH 1;`);
      } catch (e) {
        console.error('Sequence restart attempt:', e);
      }
    }

    const createdRecords = await prisma.$transaction(async (tx) => {
      const records = [];
      for (let i = 0; i < memberList.length; i++) {
        const m = memberList[i];
        const techEvents = Array.isArray(m.technicalEvents) ? m.technicalEvents : (m.event1 ? [m.event1] : []);
        const nonTechEvents = Array.isArray(m.nonTechnicalEvents) ? m.nonTechnicalEvents : (m.event2 ? [m.event2] : []);

        const primaryEvent = techEvents[0] || nonTechEvents[0] || m.event1 || "General";
        const secondaryEvent = techEvents[1] || nonTechEvents[1] || m.event2 || null;

        const record = await tx.registration.create({
          data: {
            teamId,
            teamName: m.teamName ? m.teamName.trim() : null,
            name: m.name.trim(),
            email: m.email.trim().toLowerCase(),
            phone: m.phone.trim().replace(/\D/g, ''),
            department: m.department ? m.department.trim() : null,
            year: m.year ? m.year.trim() : null,
            college: m.college.trim(),
            event1: primaryEvent,
            event2: secondaryEvent,
            technicalEvents: JSON.stringify(techEvents),
            nonTechnicalEvents: JSON.stringify(nonTechEvents),
            amount: amountPerPerson,
            paymentStatus: "INITIALIZED",
            razorpayOrderId: order.id,
          },
        });

        records.push(record);
      }
      return records;
    });

    return NextResponse.json(
      { 
        message: 'Order initialized', 
        orderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        teamId,
        memberCount: createdRecords.length,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[API /create-order Internal Error]:', error);
    return NextResponse.json(
      { error: 'Order could not be created at this moment. Please try again later.' },
      { status: 500 }
    );
  }
}
