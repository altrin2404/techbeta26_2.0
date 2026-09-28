import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rateLimit';

function maskEmail(email?: string | null): string {
  if (!email || !email.includes('@')) return '';
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `${user[0]}*@${domain}`;
  }
  const prefix = user.slice(0, 2);
  const asterisks = '*'.repeat(Math.min(5, Math.max(3, user.length - 2)));
  return `${prefix}${asterisks}@${domain}`;
}

function maskPhone(phone?: string | null): string {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 5) return '*****';
  return clean.slice(0, 5) + '*****';
}

export async function GET(request: Request) {
  try {
    // 1. Rate Limiting: 15 requests per minute per IP
    const rateLimit = checkRateLimit(request, { limit: 15, windowMs: 60 * 1000, keyPrefix: 'pass' });
    if (!rateLimit.allowed) {
      const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000));
      return NextResponse.json(
        { error: 'Too many pass lookup requests. Please wait a minute and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('id') || searchParams.get('teamId') || searchParams.get('phone') || searchParams.get('email');

    if (!query) {
      return NextResponse.json({ error: 'Participant ID, Team ID, Phone or Email required' }, { status: 400 });
    }

    const cleanQuery = query.trim();

    if (cleanQuery.length > 80) {
      return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 });
    }

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

    const mapRegToPass = (reg: (typeof allRegistrations)[number]) => {
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
        email: maskEmail(reg.email),
        phone: maskPhone(reg.phone),
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

    const primaryReg =
      allRegistrations.find(
        (r) =>
          (r.participantId && r.participantId.toLowerCase() === cleanQuery.toLowerCase()) ||
          r.phone === cleanQuery ||
          r.id === cleanQuery ||
          r.email.toLowerCase() === cleanQuery.toLowerCase()
      ) || allRegistrations[0];

    const mappedMembers = allRegistrations.map(mapRegToPass);
    const primaryMatched = mapRegToPass(primaryReg);

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
