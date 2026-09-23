import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('id') || searchParams.get('teamId') || searchParams.get('phone') || searchParams.get('email');

    if (!query) {
      return NextResponse.json({ error: 'Participant ID, Team ID, Phone or Email required' }, { status: 400 });
    }

    const cleanQuery = query.trim();

    // Check by participantId (e.g. TB001)
    let registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { participantId: { equals: cleanQuery, mode: 'insensitive' } },
          { id: cleanQuery },
          { teamId: { equals: cleanQuery, mode: 'insensitive' } },
          { phone: cleanQuery },
          { email: { equals: cleanQuery, mode: 'insensitive' } },
        ],
      },
    });

    // If query is a plain number like "1", try matching participantNumber = 1 or participantId = "TB001"
    if (!registration && /^\d+$/.test(cleanQuery)) {
      const num = parseInt(cleanQuery, 10);
      const formatted = `TB${String(num).padStart(3, '0')}`;
      registration = await prisma.registration.findFirst({
        where: {
          OR: [
            { participantNumber: num },
            { participantId: { equals: formatted, mode: 'insensitive' } },
          ],
        },
      });
    }

    if (!registration) {
      return NextResponse.json({ found: false, error: 'No registration found for: ' + cleanQuery }, { status: 404 });
    }

    // Check if registration belongs to a team or multi-member order
    let allRegistrations = [registration];
    if (registration.teamId) {
      const teamList = await prisma.registration.findMany({
        where: { teamId: registration.teamId },
        orderBy: { participantNumber: 'asc' },
      });
      if (teamList.length > 0) {
        allRegistrations = teamList;
      }
    } else if (registration.razorpayOrderId) {
      const orderList = await prisma.registration.findMany({
        where: { razorpayOrderId: registration.razorpayOrderId },
        orderBy: { participantNumber: 'asc' },
      });
      if (orderList.length > 0) {
        allRegistrations = orderList;
      }
    }

    const mapRegToPass = (reg: typeof registration) => {
      let techEvents: string[] = [];
      let nonTechEvents: string[] = [];

      try {
        if (reg.technicalEvents) {
          techEvents = JSON.parse(reg.technicalEvents);
        }
      } catch {
        techEvents = reg.technicalEvents ? [reg.technicalEvents] : [];
      }

      try {
        if (reg.nonTechnicalEvents) {
          nonTechEvents = JSON.parse(reg.nonTechnicalEvents);
        }
      } catch {
        nonTechEvents = reg.nonTechnicalEvents ? [reg.nonTechnicalEvents] : [];
      }

      const displayId =
        reg.participantId ||
        (reg.participantNumber ? `TB${String(reg.participantNumber).padStart(3, '0')}` : 'TB001');

      return {
        id: reg.id,
        participantNumber: reg.participantNumber,
        participantId: displayId,
        teamId: reg.teamId,
        teamName: reg.teamName,
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        college: reg.college,
        department: reg.department,
        year: reg.year,
        technicalEvents: techEvents,
        nonTechnicalEvents: nonTechEvents,
        paymentUtr: reg.paymentUtr,
        amount: reg.amount || 200,
        isVerified: reg.isVerified,
        isEntered: reg.isEntered,
        enteredAt: reg.enteredAt,
        createdAt: reg.createdAt,
      };
    };

    const mappedMembers = allRegistrations.map(mapRegToPass);
    const primaryMatched =
      mappedMembers.find(
        (m) =>
          m.participantId.toLowerCase() === cleanQuery.toLowerCase() ||
          m.phone === cleanQuery ||
          m.id === cleanQuery ||
          m.email.toLowerCase() === cleanQuery.toLowerCase()
      ) || mappedMembers[0];

    return NextResponse.json({
      found: true,
      participant: primaryMatched,
      members: mappedMembers,
    });
  } catch (error) {
    console.error('Error fetching pass data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
