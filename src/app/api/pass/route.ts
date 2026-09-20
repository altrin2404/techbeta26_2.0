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

    // Parse events
    let techEvents: string[] = [];
    let nonTechEvents: string[] = [];

    try {
      if (registration.technicalEvents) {
        techEvents = JSON.parse(registration.technicalEvents);
      }
    } catch {
      techEvents = registration.technicalEvents ? [registration.technicalEvents] : [];
    }

    try {
      if (registration.nonTechnicalEvents) {
        nonTechEvents = JSON.parse(registration.nonTechnicalEvents);
      }
    } catch {
      nonTechEvents = registration.nonTechnicalEvents ? [registration.nonTechnicalEvents] : [];
    }

    const displayId =
      registration.participantId ||
      (registration.participantNumber ? `TB${String(registration.participantNumber).padStart(3, '0')}` : 'TB001');

    return NextResponse.json({
      found: true,
      participant: {
        id: registration.id,
        participantNumber: registration.participantNumber,
        participantId: displayId,
        teamId: registration.teamId,
        teamName: registration.teamName,
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        college: registration.college,
        department: registration.department,
        year: registration.year,
        technicalEvents: techEvents,
        nonTechnicalEvents: nonTechEvents,
        paymentUtr: registration.paymentUtr,
        amount: registration.amount || 200,
        isVerified: registration.isVerified,
        isEntered: registration.isEntered,
        enteredAt: registration.enteredAt,
        createdAt: registration.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching pass data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
