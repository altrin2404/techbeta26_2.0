"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Search,
  Download,
  Eye,
  Building,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

interface CertificateItem {
  id: string;
  name: string;
  college: string;
  event: string;
  eventType: string;
  viewUrl: string;
  downloadUrl: string;
  fileSize: number;
  verified: boolean;
}

interface SearchResponse {
  found: boolean;
  count: number;
  participant?: {
    name: string;
    college: string;
    email: string;
  };
  certificates?: CertificateItem[];
  error?: string;
}

function ClaimCertificatesContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("q") || searchParams.get("email") || "";

  const [emailQuery, setEmailQuery] = useState(urlParam);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<CertificateItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchCertificates = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/certificates?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.found) {
        setError(data.error || "No certificate records found matching your query.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to connect to the certificate verification server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlParam) {
      fetchCertificates(urlParam);
    }
  }, [urlParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCertificates(emailQuery);
  };

  const triggerDownload = (item: CertificateItem) => {
    setDownloadingId(item.id);
    const link = document.createElement("a");
    link.href = item.downloadUrl;
    link.download = `TechBETA_2026_Certificate_${item.event.replace(/\s+/g, "_")}_${item.name.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingId(null), 1000);
  };

  return (
    <section
      id="claim-certificates"
      style={{ transform: "translateZ(0)" }}
      className="w-full py-14 md:py-20 bg-gradient-to-b from-[#f8fafe] via-white to-blue-50/40 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="h-3.5 w-3.5 text-blue-600" />
            <span>Participation Certificates Ready</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Claim Your <span className="text-blue-700">Certificates</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Enter your name or registered email address to download your certificate
          </p>
        </div>

        {/* Search Box Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/90 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500" />

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  id="claim-email-input"
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                  placeholder="Enter your registered Name or Email ID..."
                  className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                  required
                />
                {emailQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmailQuery("");
                      setResult(null);
                      setError(null);
                    }}
                    className="absolute right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !emailQuery.trim()}
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-slate-900/15 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-white" />
                    <span>Find My Certificate</span>
                  </>
                )}
              </button>
            </form>

            {/* Help / Contact Note */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>If your certificate is not found or has incorrect details, please contact: </span>
              <a href="tel:9385675451" className="font-semibold text-blue-700 hover:underline">9385675451</a>
              <span>, </span>
              <a href="tel:8300870670" className="font-semibold text-blue-700 hover:underline">8300870670</a>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-rose-900">Certificate Record Not Found</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
                <p className="mt-2 text-xs text-slate-600">
                  If your certificate is not found or has incorrect details, please contact:{" "}
                  <a href="tel:9385675451" className="font-bold text-blue-700 underline">9385675451</a>,{" "}
                  <a href="tel:8300870670" className="font-bold text-blue-700 underline">8300870670</a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results Display */}
        {result && result.participant && result.certificates && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto mt-10 space-y-6"
          >
            {/* Participant Profile Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/20 shrink-0">
                  {result.participant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {result.participant.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{result.participant.college || "St. Xavier's Catholic College of Engineering"}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{result.participant.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800">
                  {result.count} {result.count === 1 ? "Certificate" : "Certificates"} Available
                </div>
              </div>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="group rounded-3xl bg-white border border-slate-200/90 hover:border-teal-400 p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${cert.eventType === "Technical"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                          >
                            {cert.eventType}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">TechBETA 2026 2.0</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mt-1 group-hover:text-blue-700 transition-colors">
                          {cert.event}
                        </h4>
                      </div>
                    </div>

                    {/* Preview Thumbnail */}
                    <div
                      onClick={() => setSelectedPreview(cert)}
                      className="relative aspect-[1.414/1] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 group-hover:border-teal-400 transition-all cursor-pointer shadow-inner"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.viewUrl}
                        alt={`${cert.name} - ${cert.event}`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <span className="px-3 py-1.5 rounded-xl bg-white/95 text-xs font-bold text-slate-900 shadow-lg flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>Preview Full Screen</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => triggerDownload(cert)}
                      disabled={downloadingId === cert.id}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                    >
                      {downloadingId === cert.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-white" />
                          <span>Download Certificate</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedPreview(cert)}
                      className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
                      title="Enlarge preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Modal Lightbox for Fullscreen Certificate Inspection */}
        <AnimatePresence>
          {selectedPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
              onClick={() => setSelectedPreview(null)}
            >
              <div
                className="relative max-w-4xl w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {selectedPreview.event} — {selectedPreview.name}
                    </h3>
                    <p className="text-xs text-slate-400">TechBETA 2026 2.0 Participation Certificate</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerDownload(selectedPreview)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setSelectedPreview(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="relative max-h-[75vh] flex items-center justify-center overflow-auto rounded-xl bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPreview.viewUrl}
                    alt={selectedPreview.name}
                    className="max-h-[72vh] w-auto object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function ClaimCertificates() {
  return (
    <Suspense fallback={null}>
      <ClaimCertificatesContent />
    </Suspense>
  );
}
