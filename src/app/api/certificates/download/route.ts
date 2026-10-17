import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import certificatesData from '@/data/certificates.json';

interface CertificateRecord {
  id: string;
  name: string;
  college: string;
  event: string;
  folder: string;
  email: string;
  filename: string;
}

const certificates = certificatesData as CertificateRecord[];
const certificatesMap = new Map<string, CertificateRecord>();
for (const c of certificates) {
  certificatesMap.set(c.id, c);
}

const SUPABASE_STORAGE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubrtmgkdaosavcpvbzyl.supabase.co';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const isView = searchParams.get('view') === '1' || searchParams.get('view') === 'true';

    // Verify record exists in verified data
    const record = certificatesMap.get(id);
    if (!record) {
      return NextResponse.json({ error: 'Certificate not found or invalid certificate ID' }, { status: 404 });
    }

    // Clean filename for download attachment
    const safeEvent = record.event.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = record.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const downloadFilename = `TechBETA_2026_Certificate_${safeEvent}_${safeName}.png`;

    let fileBuffer: Buffer | null = null;

    // 1. Check if file is available locally on server
    const baseDir = path.resolve(process.cwd(), 'Certificates');
    const localFilePath = path.join(baseDir, record.folder, record.filename);

    if (localFilePath.startsWith(baseDir)) {
      try {
        fileBuffer = await fs.readFile(localFilePath);
      } catch {
        fileBuffer = null;
      }
    }

    // 2. If not found locally (e.g. running on Vercel), fetch from Supabase CDN
    if (!fileBuffer) {
      const cdnUrl = `${SUPABASE_STORAGE_URL}/storage/v1/object/public/certificates/${encodeURIComponent(
        record.folder
      )}/${encodeURIComponent(record.filename)}`;

      const remoteRes = await fetch(cdnUrl, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!remoteRes.ok) {
        return NextResponse.json(
          { error: 'Certificate image not yet available on cloud CDN' },
          { status: 404 }
        );
      }

      const arrayBuf = await remoteRes.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuf);
    }

    const headers = new Headers();
    headers.set('Content-Type', 'image/png');
    headers.set('Content-Length', fileBuffer.length.toString());
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    if (isView) {
      headers.set('Content-Disposition', `inline; filename="${downloadFilename}"`);
    } else {
      headers.set('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to retrieve certificate image', details: message },
      { status: 500 }
    );
  }
}
