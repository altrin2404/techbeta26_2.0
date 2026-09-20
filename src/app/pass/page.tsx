'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  MapPin, 
  MessageCircle, 
  Printer, 
  Loader2 
} from 'lucide-react';

interface ParticipantPass {
  id: string;
  participantId: string;
  participantNumber?: number;
  teamId?: string;
  teamName?: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department?: string;
  year?: string;
  technicalEvents: string[];
  nonTechnicalEvents: string[];
  paymentUtr?: string;
  amount: number;
  isVerified: boolean;
  isEntered: boolean;
  enteredAt?: string;
  createdAt: string;
}

function PassContent() {
  const searchParams = useSearchParams();
  const idQuery = searchParams.get('id') || searchParams.get('teamId') || searchParams.get('phone') || '';
  const autoDownload = searchParams.get('download') === '1' || searchParams.get('download') === 'true';

  const [searchId, setSearchId] = useState(idQuery);
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState<ParticipantPass | null>(null);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const fetchPass = async (query: string) => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/pass?id=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.found || !data.participant) {
        throw new Error(data.error || 'No participant found matching ' + query);
      }

      setParticipant(data.participant);

      // Generate QR Code
      const QRCode = await import('qrcode');
      const p = data.participant;
      const qrPayload = `${p.participantId}|${p.teamId || ''}|${p.name}|${p.college}`;
      const url = await QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      setQrDataUrl(url);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve entry pass');
      setParticipant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idQuery) {
      fetchPass(idQuery);
    }
  }, [idQuery]);

  // Handle auto-download after pass is loaded
  useEffect(() => {
    if (autoDownload && participant && qrDataUrl && !isDownloading) {
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [participant, qrDataUrl, autoDownload]);

  const handleDownloadPDF = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      const { jsPDF } = await import('jspdf');
      const img = new Image();
      img.src = dataUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = 210;
      const margin = 12;
      const imgWidth = pdfWidth - margin * 2;
      const imgHeight = (img.height * imgWidth) / img.width;

      pdf.addImage(dataUrl, 'PNG', margin, margin, imgWidth, imgHeight);
      const safeId = participant?.participantId || 'Pass';
      pdf.save(`TechBETA-2026-EntryPass-${safeId}.pdf`);
    } catch (primaryErr) {
      console.warn('PDF html-to-image failed, falling back to window.print():', primaryErr);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to TechBETA 2026</span>
          </Link>
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/60">
            Official E-Pass Portal
          </span>
        </div>

        {/* Lookup / Search Bar if not yet searched or error */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xl space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            Search Entry Pass by Participant ID / Mobile / Team ID:
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchPass(searchId);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                placeholder="e.g. TB001, TB26-XXXX, or 10-digit mobile"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchId.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Find Pass</span>
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/50 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* ─── OFFICIAL PRINTABLE / DOWNLOADABLE ENTRY PASS BADGE ─── */}
        {participant && (
          <div className="space-y-4 animate-fadeIn">
            <div
              ref={cardRef}
              className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

              {/* Institution Header */}
              <div className="text-center pb-4 border-b border-slate-200 space-y-1 mt-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-700">
                  St. Xavier&apos;s Catholic College of Engineering
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                  TechBETA <span className="text-blue-600">2026 2.0</span>
                </h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Department of Information Technology &bull; Brigitz
                </p>
              </div>

              {/* Verified Status Banner */}
              <div className="flex items-center justify-between gap-2 py-3 border-b border-slate-100 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                  participant.isVerified
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-amber-50 text-amber-700 border border-amber-300'
                }`}>
                  {participant.isVerified ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified &bull; Confirmed Pass</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Pending Verification</span>
                    </>
                  )}
                </span>

                <span className="text-xs font-mono font-bold text-slate-500">
                  Fee: ₹{participant.amount || 200} ({participant.isVerified ? 'PAID' : 'Awaiting Verify'})
                </span>
              </div>

              {/* PROMINENT MASTER PARTICIPANT ID DISPLAY */}
              <div className="my-4 p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-400 text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 block">
                  Official Master Participant ID
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-blue-700 block">
                  {participant.participantId}
                </span>
                <p className="text-[11px] text-slate-600 font-medium">
                  Quote this ID at the campus reception and competition venues
                </p>
              </div>

              {/* QR Code and Participant Information */}
              <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                {/* QR Code */}
                <div className="flex-shrink-0 text-center space-y-1.5">
                  <div className="p-2.5 bg-white border-2 border-slate-900 rounded-2xl shadow-md inline-block">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Entry QR"
                        className="w-36 h-36 rounded-lg block"
                      />
                    ) : (
                      <div className="w-36 h-36 bg-slate-100 rounded-lg animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    Campus Gate Scan
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2.5 text-center sm:text-left min-w-0">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Participant Name
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                      {participant.name}
                    </h2>
                    {participant.teamName && (
                      <div className="text-xs font-bold text-blue-600 mt-0.5">
                        Team: {participant.teamName}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      College &amp; Department
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      {participant.college}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {participant.department || 'IT'} {participant.year ? `(${participant.year})` : ''}
                    </p>
                  </div>

                  {participant.teamId && (
                    <div className="text-[11px] font-mono text-slate-500">
                      Team Ref: <strong className="text-slate-800">{participant.teamId}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Registered Events */}
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Registered Competitions &amp; Events:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...(participant.technicalEvents || []), ...(participant.nonTechnicalEvents || [])].map((ev, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reporting Details Footer */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-800">October 13, 2026 &bull; 9:00 AM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Conference Hall, SXCCE Campus</span>
                </div>
              </div>

            </div>

            {/* ─── ACTION BUTTONS (DOWNLOAD PDF & JOIN WHATSAPP) ─── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Pass PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Entry Pass (PDF)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`TechBETA-QR-${participant.participantId}.png`}
                  className="flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all active:scale-95"
                >
                  <span>Save QR</span>
                </a>
              )}
            </div>

            {/* Official WhatsApp Group Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2 justify-center sm:justify-start">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Join Official WhatsApp Group</span>
                </h3>
                <p className="text-[11px] text-emerald-200 mt-0.5">
                  Get live competition room numbers, schedule updates &amp; food tokens.
                </p>
              </div>
              <a
                href="https://chat.whatsapp.com/DUMMY_LINK_REPLACE_ME"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
              >
                Join Group
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function PassPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
        </div>
      }
    >
      <PassContent />
    </Suspense>
  );
}
