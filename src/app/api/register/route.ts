import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    const createdRecords = [];

    for (let i = 0; i < memberList.length; i++) {
      const m = memberList[i];
      if (!m.name || !m.email || !m.phone || !m.college) {
        return NextResponse.json(
          { error: `Please fill all required fields for Member ${i + 1} (${m.name || 'Participant'}).` },
          { status: 400 }
        );
      }

      const techEvents = Array.isArray(m.technicalEvents) 
        ? m.technicalEvents 
        : (m.event1 ? [m.event1] : []);
      const nonTechEvents = Array.isArray(m.nonTechnicalEvents) 
        ? m.nonTechnicalEvents 
        : (m.event2 ? [m.event2] : []);

      const primaryEvent = techEvents[0] || nonTechEvents[0] || m.event1 || "General";
      const secondaryEvent = techEvents[1] || nonTechEvents[1] || m.event2 || null;

      const record = await prisma.registration.create({
        data: {
          teamId,
          teamName: teamName || (memberList.length > 1 ? `Team ${m.name}` : null),
          name: m.name,
          email: m.email,
          phone: m.phone,
          department: m.department || null,
          year: m.year || null,
          college: m.college,
          event1: primaryEvent,
          event2: secondaryEvent,
          technicalEvents: JSON.stringify(techEvents),
          nonTechnicalEvents: JSON.stringify(nonTechEvents),
          paymentUtr: paymentUtr || m.paymentUtr || null,
          amount: 200,
        },
      });
      createdRecords.push(record);
    }

    // Google Sheets Backup Sync (Asynchronous / Non-blocking)
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (googleSheetWebhookUrl) {
      const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      const rows = createdRecords.map((r, idx) => ({
        timestamp,
        teamId,
        teamName: r.teamName || "N/A",
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

      // Fire-and-forget sync to Google Sheets
      fetch(googleSheetWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
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
        primaryId: createdRecords[0]?.id
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Something went wrong during registration.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
