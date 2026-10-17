import { NextRequest, NextResponse } from 'next/server';
import certificatesData from '@/data/certificates.json';

export interface CertificateRecord {
  id: string;
  name: string;
  college: string;
  event: string;
  eventType: string;
  folder: string;
  email: string;
  filename: string;
  fileSize: number;
  verified: boolean;
}

const certificates = certificatesData as CertificateRecord[];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('email') || searchParams.get('name') || '';
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      // Return general summary metadata
      const uniqueEvents = Array.from(new Set(certificates.map((c) => c.event)));
      return NextResponse.json({
        totalCertificates: certificates.length,
        events: uniqueEvents,
        message: 'Provide a query parameter (q or email) to search for certificates.'
      });
    }

    // Match by email or participant name
    let matches: CertificateRecord[] = [];

    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normQuery = normalize(cleanQuery);

    if (cleanQuery.includes('@')) {
      // Direct email lookup
      matches = certificates.filter((c) => c.email.toLowerCase().trim() === cleanQuery);
    } else {
      // Name lookup:
      // 1. Exact alphanumeric match priority (handles Anamika S vs Anamika.S, etc.)
      const exact = certificates.filter((c) => normalize(c.name) === normQuery);
      if (exact.length > 0) {
        matches = exact;
      } else {
        // 2. Substring match (e.g. typing "Janeha" matches "Janeha J")
        matches = certificates.filter((c) => {
          const normName = normalize(c.name);
          return normName.includes(normQuery) || (normQuery.length >= 3 && normName.startsWith(normQuery));
        });
      }
    }

    if (matches.length === 0) {
      return NextResponse.json(
        {
          found: false,
          count: 0,
          error: `No certificate found matching "${query}". Please check the spelling of your Name or Email ID.`
        },
        { status: 404 }
      );
    }

    // Sort certificates by event name
    matches.sort((a, b) => a.event.localeCompare(b.event));

    // Get primary participant information from the first match
    const primary = matches[0];

    // Privacy safeguard: mask email so public scrapers cannot harvest full emails
    const maskEmail = (email: string) => {
      const parts = email.split('@');
      if (parts.length !== 2) return email;
      const [user, domain] = parts;
      if (user.length <= 3) return `${user.charAt(0)}***@${domain}`;
      return `${user.slice(0, 2)}***${user.slice(-2)}@${domain}`;
    };

    const SUPABASE_STORAGE_URL =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubrtmgkdaosavcpvbzyl.supabase.co';

    return NextResponse.json({
      found: true,
      count: matches.length,
      participant: {
        name: primary.name,
        college: primary.college,
        email: maskEmail(primary.email)
      },
      certificates: matches.map((c) => ({
        id: c.id,
        name: c.name,
        college: c.college,
        event: c.event,
        eventType: c.eventType,
        viewUrl: `${SUPABASE_STORAGE_URL}/storage/v1/object/public/certificates/${encodeURIComponent(
          c.folder
        )}/${encodeURIComponent(c.filename)}`,
        downloadUrl: `/api/certificates/download?id=${c.id}`,
        fileSize: c.fileSize,
        verified: true
      }))
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown internal error';
    return NextResponse.json(
      { found: false, error: 'Internal server error while searching certificates', details: errorMessage },
      { status: 500 }
    );
  }
}
