import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatParticipantId } from '@/lib/idGenerator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamName, members, paymentUtr } = body;

    // Support both multi-member team array or single participant object
    const memberList = Array.isArray(members) && members.length > 0 
      ? members 
      : [body];

    if (!memberList.length) {
      return NextResponse.json(
        { error: 'At least one participant is required.' },
        { status: 400 }
      );
    }

    // Generate readable team / registration reference code
    const timestamp = Date.now().toString().slice(-4);
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const teamId = `TB26-${timestamp}-${randomHex}`;

    // Validate payment UTR
    const cleanUtr = typeof paymentUtr === "string" ? paymentUtr.trim() : "";
    if (!cleanUtr || cleanUtr.length < 10) {
      return NextResponse.json(
        { error: 'A valid UPI Transaction Reference ID / UTR (at least 10-12 characters) is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    for (let i = 0; i < memberList.length; i++) {
      const m = memberList[i];
      const memberLabel = `Member ${i + 1}${m.name ? ` (${m.name})` : ''}`;

      if (!m.name || typeof m.name !== 'string' || m.name.trim().length < 2) {
        return NextResponse.json(
          { error: `Please enter a valid full name for ${memberLabel}.` },
          { status: 400 }
        );
      }

      const cleanEmail = typeof m.email === 'string' ? m.email.trim() : '';
      if (!cleanEmail || !emailRegex.test(cleanEmail)) {
        return NextResponse.json(
          { error: `Please enter a valid email address for ${memberLabel}.` },
          { status: 400 }
        );
      }

      const cleanPhone = typeof m.phone === 'string' ? m.phone.trim().replace(/\D/g, '') : '';
      if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { error: `Please enter a valid 10-digit mobile number for ${memberLabel}.` },
          { status: 400 }
        );
      }

      if (!m.college || typeof m.college !== 'string' || !m.college.trim()) {
        return NextResponse.json(
          { error: `Please enter the college name for ${memberLabel}.` },
          { status: 400 }
        );
      }

      const techEvents = Array.isArray(m.technicalEvents) 
        ? m.technicalEvents 
        : (m.event1 ? [m.event1] : []);
      const nonTechEvents = Array.isArray(m.nonTechnicalEvents) 
        ? m.nonTechnicalEvents 
        : (m.event2 ? [m.event2] : []);

      if (techEvents.length === 0 && nonTechEvents.length === 0) {
        return NextResponse.json(
          { error: `Please select at least 1 technical or non-technical event for ${memberLabel}.` },
          { status: 400 }
        );
      }

      if (techEvents.length > 2) {
        return NextResponse.json(
          { error: `${memberLabel} cannot select more than 2 technical events.` },
          { status: 400 }
        );
      }

      if (nonTechEvents.length > 2) {
        return NextResponse.json(
          { error: `${memberLabel} cannot select more than 2 non-technical events.` },
          { status: 400 }
        );
      }
    }

    // If database has 0 registrations (e.g. after wiping test participants), ensure sequence starts at 1
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
        const techEvents = Array.isArray(m.technicalEvents) 
          ? m.technicalEvents 
          : (m.event1 ? [m.event1] : []);
        const nonTechEvents = Array.isArray(m.nonTechnicalEvents) 
          ? m.nonTechnicalEvents 
          : (m.event2 ? [m.event2] : []);

        const primaryEvent = techEvents[0] || nonTechEvents[0] || m.event1 || "General";
        const secondaryEvent = techEvents[1] || nonTechEvents[1] || m.event2 || null;

        const record = await tx.registration.create({
          data: {
            teamId,
            teamName: teamName ? teamName.trim() : (memberList.length > 1 ? `Team ${m.name}` : null),
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
            paymentUtr: cleanUtr,
            amount: 200,
          },
        });

        // Compute internal participant ID from autoincremented sequence number
        const participantId = formatParticipantId(record.participantNumber || 1);
        const updated = await tx.registration.update({
          where: { id: record.id },
          data: { participantId },
        });

        records.push(updated);
      }
      return records;
    });

    // Google Sheets Backup Sync (Asynchronous / Non-blocking)
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (googleSheetWebhookUrl) {
      const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      const rows = createdRecords.map((r, idx) => ({
        timestamp,
        teamId: r.participantId || formatParticipantId(r.participantNumber || idx + 1),
        participantId: r.participantId || formatParticipantId(r.participantNumber || idx + 1),
        teamName: r.teamName || (teamName ? teamName.trim() : (memberList.length > 1 ? 'Team' : 'Individual')),
        memberNumber: idx + 1,
        name: r.name,
        email: r.email,
        phone: r.phone,
        department: r.department || "",
        year: r.year || "",
        college: r.college,
        technicalEvents: JSON.parse(r.technicalEvents || "[]").join(", "),
        nonTechnicalEvents: JSON.parse(r.nonTechnicalEvents || "[]").join(", "),
        paymentUtr: r.paymentUtr || "N/A",
        amount: r.amount || 200,
      }));

      // Fire-and-forget sync to Google Sheets backup (pending verification, NO email sent yet)
      fetch(googleSheetWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "register",
          rows 
        }),
      }).catch((err) => {
        console.error("Google Sheets backup sync failed:", err);
      });
    }

    return NextResponse.json(
      { 
        message: 'Registration successful', 
        id: teamId,
        teamId,
        memberCount: createdRecords.length,
        primaryId: createdRecords[0]?.id,
        primaryParticipantId: createdRecords[0]?.participantId || 'TB001',
        members: createdRecords.map((r, idx) => ({
          name: r.name,
          participantId: r.participantId || `TB${String(idx + 1).padStart(3, '0')}`,
          email: r.email,
        })),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Log complete error details on the server only (never leak to browser network response)
    console.error('[API /register Internal Error]:', error);
    return NextResponse.json(
      { error: 'Registration could not be completed at this moment. Please verify your details or try again later.' },
      { status: 500 }
    );
  }
}
