"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserPlus,
  Trash2,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  CreditCard,
  Info,
  Layers,
  Terminal,
  PenTool,
  Cpu,
  Lightbulb,
  Megaphone,
  Search,
  Download,
  MessageCircle,
  QrCode,
  PartyPopper,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export interface Participant {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  college: string;
  technicalEvents: string[];
  nonTechnicalEvents: string[];
  isParticipatingAsTeam?: boolean;
  teamName?: string;
}

const TECHNICAL_EVENTS = [
  { id: "GENBUILD", label: "GENBUILD", icon: Terminal, desc: "GenAI & AI tool prototyping", isTeam: false, time: "9:00 AM to 11:00 AM" },
  { id: "UI-VERSE", label: "UI-VERSE", icon: PenTool, desc: "Design & prototype interface", isTeam: false, time: "11:00 AM to 12:00 PM" },
  { id: "LOGIC TRAP", label: "LOGIC TRAP", icon: Cpu, desc: "Faulty statement & logic solve", isTeam: true, time: "9:00 AM to 12:00 PM" },
  { id: "IDEA FORGE", label: "IDEA FORGE", icon: Lightbulb, desc: "Innovative tech concept pitch", isTeam: true, time: "9:00 AM to 12:15 PM" },
];

const NON_TECHNICAL_EVENTS = [
  { id: "BRAND BLITZ", label: "BRAND BLITZ", icon: Megaphone, desc: "Creative advertising & pitch", isTeam: true, time: "1:00 PM to 1:45 PM" },
  { id: "BID & BUILD", label: "BID & BUILD", icon: Search, desc: "Auction & product creation pitch", isTeam: true, time: "1:45 PM to 2:30 PM" },
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const DEPARTMENTS = [
  "Information Technology",
  "Computer Science and Engineering",
  "Artificial Intelligence & Data Science",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Master of Computer Applications (MCA)",
  "Other",
];

const createEmptyParticipant = (defaultCollege = ""): Participant => ({
  name: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  college: defaultCollege,
  technicalEvents: [],
  nonTechnicalEvents: [],
  isParticipatingAsTeam: false,
});

export function Registration() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [members, setMembers] = useState<Participant[]>([createEmptyParticipant()]);
  const [paymentUtr, setPaymentUtr] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [regId, setRegId] = useState("");
  const [participantIds, setParticipantIds] = useState<Record<number, string>>({});
  const [primaryParticipantId, setPrimaryParticipantId] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const ticketRef = useRef<HTMLDivElement>(null);

  const UPI_ID = "techbeta2k26@sbi";
  const FEE_PER_PERSON = 1;
  const totalAmount = members.length * FEE_PER_PERSON;

  const [forceShowTeamName, setForceShowTeamName] = useState(false);
  const [teamName, setTeamName] = useState("");

  const isTeamCompetitionChosen = members.some((m) =>
    m.technicalEvents.some((t) => t.toLowerCase().includes("logic trap") || t.toLowerCase().includes("idea forge") || t.toLowerCase().includes("team")) ||
    m.nonTechnicalEvents.some((n) => n.toLowerCase().includes("brand blitz") || n.toLowerCase().includes("bid & build") || n.toLowerCase().includes("bid and build") || n.toLowerCase().includes("team"))
  );

  const validateSingleField = (fieldKey: string, value: string): string => {
    if (fieldKey.endsWith("-name")) {
      if (!value.trim()) return "Full name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    }
    if (fieldKey.endsWith("-email")) {
      if (!value.trim()) return "Email address is required";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value.trim())) return "Enter a valid email address (e.g. name@domain.com)";
      return "";
    }
    if (fieldKey.endsWith("-phone")) {
      const clean = value.replace(/\D/g, "");
      if (!clean) return "Mobile number is required";
      if (clean.length < 10) return "Must be 10 digits";
      if (!/^[6-9]\d{9}$/.test(clean)) return "Enter a valid Indian mobile number starting with 6-9";
      return "";
    }
    if (fieldKey.endsWith("-department")) {
      if (!value.trim()) return "Department is required";
      return "";
    }
    if (fieldKey.endsWith("-year")) {
      if (!value.trim()) return "Please select your year";
      return "";
    }
    if (fieldKey.endsWith("-college")) {
      if (!value.trim()) return "College name is required";
      return "";
    }
    return "";
  };

  const handleFieldBlur = (fieldKey: string, value: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldKey]: true }));
    const error = validateSingleField(fieldKey, value);
    setFieldErrors((prev) => ({ ...prev, [fieldKey]: error }));
  };

  const resetForm = () => {
    setMembers([createEmptyParticipant()]);
    setTeamName("");
    setForceShowTeamName(false);
    setPaymentUtr("");
    setCurrentStep(1);
    setStatus("idle");
    setErrorMessage("");
    setFieldErrors({});
    setTouchedFields({});
    setRegId("");
    setParticipantIds({});
    setPrimaryParticipantId("");
    setQrDataUrl("");
  };

  useEffect(() => {
    const handleOpen = () => {
      if (status === "success") {
        resetForm();
      } else {
        setCurrentStep(1);
      }
    };
    window.addEventListener("open-registration", handleOpen);
    return () => window.removeEventListener("open-registration", handleOpen);
  }, [status]);

  useEffect(() => {
    if (status === "success" && members[0]) {
      const pId = primaryParticipantId || participantIds[0] || "TB001";
      const qrData = `${pId}|${regId}|${members[0].name}|${members[0].college}`;
      import("qrcode")
        .then((QRCode) => {
          QRCode.toDataURL(qrData, {
            width: 300,
            margin: 1,
            color: { dark: "#0f172a", light: "#ffffff" },
          })
            .then((url) => setQrDataUrl(url))
            .catch(() => {
              setQrDataUrl(
                `https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=0f172a&bgcolor=ffffff&qzone=2&data=${encodeURIComponent(qrData)}`
              );
            });
        })
        .catch(() => {
          setQrDataUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=0f172a&bgcolor=ffffff&qzone=2&data=${encodeURIComponent(qrData)}`
          );
        });
    }
  }, [status, regId, primaryParticipantId, participantIds, members]);

  // Member field update
  const updateMember = (index: number, field: keyof Participant, value: string | string[] | boolean) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    if (typeof value === "string") {
      const fieldKey = `member-${index}-${field}`;
      if (touchedFields[fieldKey]) {
        const error = validateSingleField(fieldKey, value);
        setFieldErrors((prev) => ({ ...prev, [fieldKey]: error }));
      }
    }
  };

  // Toggle Technical Event (Max 2)
  const toggleTechEvent = (memberIndex: number, eventId: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      const member = { ...updated[memberIndex] };
      const current = member.technicalEvents;

      if (current.includes(eventId)) {
        member.technicalEvents = current.filter((e) => e !== eventId);
      } else {
        if (current.length >= 2) {
          setErrorMessage(`Participant ${memberIndex + 1} can select at most 2 technical events.`);
          return prev;
        }
        member.technicalEvents = [...current, eventId];
      }
      setErrorMessage("");
      setFieldErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        delete nextErrors[`member-${memberIndex}-events`];
        return nextErrors;
      });
      updated[memberIndex] = member;
      return updated;
    });
  };

  // Toggle Non-Technical Event (Max 2)
  const toggleNonTechEvent = (memberIndex: number, eventId: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      const member = { ...updated[memberIndex] };
      const current = member.nonTechnicalEvents;

      if (current.includes(eventId)) {
        member.nonTechnicalEvents = current.filter((e) => e !== eventId);
      } else {
        if (current.length >= 2) {
          setErrorMessage(`Participant ${memberIndex + 1} can select at most 2 non-technical events.`);
          return prev;
        }
        member.nonTechnicalEvents = [...current, eventId];
      }
      setErrorMessage("");
      setFieldErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        delete nextErrors[`member-${memberIndex}-events`];
        return nextErrors;
      });
      updated[memberIndex] = member;
      return updated;
    });
  };

  // Add a team member
  const handleAddMember = () => {
    const defaultCollege = members[0]?.college || "";
    setMembers((prev) => [...prev, createEmptyParticipant(defaultCollege)]);
  };

  // Remove a member (keep at least 1)
  const handleRemoveMember = (index: number) => {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
    // Clean up member field errors
    setFieldErrors((prev) => {
      const updated: Record<string, string> = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (!k.startsWith(`member-${index}-`)) {
          updated[k] = v;
        }
      });
      return updated;
    });
  };

  // Validate Step 1 before proceeding to Payment
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    const touched: Record<string, boolean> = {};
    let firstErrorFieldId = "";

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const memberLabel = `Member ${i + 1}`;

      const nameErr = validateSingleField(`member-${i}-name`, m.name);
      if (nameErr) {
        errors[`member-${i}-name`] = nameErr;
        if (!firstErrorFieldId) firstErrorFieldId = i === 0 ? "first-participant-name" : `member-${i}-name`;
      }
      touched[`member-${i}-name`] = true;

      const emailErr = validateSingleField(`member-${i}-email`, m.email);
      if (emailErr) {
        errors[`member-${i}-email`] = emailErr;
        if (!firstErrorFieldId) firstErrorFieldId = `member-${i}-email`;
      }
      touched[`member-${i}-email`] = true;

      const phoneErr = validateSingleField(`member-${i}-phone`, m.phone);
      if (phoneErr) {
        errors[`member-${i}-phone`] = phoneErr;
        if (!firstErrorFieldId) firstErrorFieldId = `member-${i}-phone`;
      }
      touched[`member-${i}-phone`] = true;

      const deptErr = validateSingleField(`member-${i}-department`, m.department);
      if (deptErr) {
        errors[`member-${i}-department`] = deptErr;
        if (!firstErrorFieldId) firstErrorFieldId = `member-${i}-department`;
      }
      touched[`member-${i}-department`] = true;

      const yrErr = validateSingleField(`member-${i}-year`, m.year);
      if (yrErr) {
        errors[`member-${i}-year`] = yrErr;
        if (!firstErrorFieldId) firstErrorFieldId = `member-${i}-year`;
      }
      touched[`member-${i}-year`] = true;

      const collErr = validateSingleField(`member-${i}-college`, m.college);
      if (collErr) {
        errors[`member-${i}-college`] = collErr;
        if (!firstErrorFieldId) firstErrorFieldId = `member-${i}-college`;
      }
      touched[`member-${i}-college`] = true;

      if (m.technicalEvents.length === 0 && m.nonTechnicalEvents.length === 0) {
        errors[`member-${i}-events`] = `Please select at least 1 event for ${memberLabel}.`;
      } else if (m.technicalEvents.length > 2) {
        errors[`member-${i}-events`] = `${memberLabel} cannot register for more than 2 technical events.`;
      } else if (m.nonTechnicalEvents.length > 2) {
        errors[`member-${i}-events`] = `${memberLabel} cannot register for more than 2 non-technical events.`;
      }
    }

    setFieldErrors(errors);
    setTouchedFields((prev) => ({ ...prev, ...touched }));

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setErrorMessage(`Please complete all required fields`);
      if (firstErrorFieldId) {
        const el = document.getElementById(firstErrorFieldId);
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: document.getElementById("register")?.offsetTop || 0, behavior: "smooth" });
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      // Primary: html-to-image (native SVG foreignObject, fully supports Tailwind v4 CSS)
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(ticketRef.current, {
        pixelRatio: 2.5,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const { jsPDF } = await import("jspdf");

      const img = new Image();
      img.src = dataUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e: any) => reject(e);
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210; // A4 mm
      const margin = 12;
      const imgWidth = pdfWidth - margin * 2;
      const imgHeight = (img.height * imgWidth) / img.width;

      pdf.addImage(dataUrl, "PNG", margin, margin, imgWidth, imgHeight);
      const firstName = members[0]?.name?.split(" ")[0] || "Pass";
      pdf.save(`TechBETA-2026-2.0-EntryPass-${firstName}.pdf`);
      trackEvent("entry_pass_downloaded", { id: regId, memberCount: members.length });
    } catch (primaryErr) {
      console.warn("Primary PDF generation failed, attempting fallback:", primaryErr);
      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const imgWidth = 186;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 12, 12, imgWidth, imgHeight);
        const firstName = members[0]?.name?.split(" ")[0] || "Pass";
        pdf.save(`TechBETA-2026-2.0-EntryPass-${firstName}.pdf`);
      } catch (fallbackErr) {
        console.error("Canvas PDF methods failed, opening print/save dialog:", fallbackErr);
        window.print();
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("loading");
    trackEvent("registration_attempt", {
      memberCount: members.length,
      isTeam: members.length > 1,
    });

    try {
      const bodyTeamName = members.find(m => m.teamName?.trim())?.teamName?.trim() || undefined;

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: bodyTeamName,
          members,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to initialize order.");
      }

      const resLoad = await loadRazorpay();
      if (!resLoad) {
        throw new Error("Failed to load Razorpay SDK. Check your connection.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TechBETA 2026",
        description: "Symposium Registration",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setStatus("loading");
            const verifyRes = await fetch("/api/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");

            const confirmedId = verifyData.id || verifyData.teamId || "TB26-CONFIRMED";
            setRegId(confirmedId);

            const pIdMap: Record<number, string> = {};
            if (Array.isArray(verifyData.members)) {
              verifyData.members.forEach((m: { participantId?: string }, idx: number) => {
                if (m.participantId) {
                  pIdMap[idx] = m.participantId;
                }
              });
            }
            setParticipantIds(pIdMap);
            setPrimaryParticipantId(verifyData.primaryParticipantId || pIdMap[0] || "TB001");

            setStatus("success");
            trackEvent("registration_success", {
              teamId: confirmedId,
              participantId: verifyData.primaryParticipantId || pIdMap[0] || "TB001",
              memberCount: members.length,
            });
          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || "Payment verification failed.");
            setStatus("error");
          }
        },
        prefill: {
          name: members[0].name,
          email: members[0].email,
          contact: members[0].phone,
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: function () {
            setStatus("idle");
          },
        },
      };

      // @ts-ignore
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        setErrorMessage("Payment failed. Please try again.");
        setStatus("error");
      });
      paymentObject.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setStatus("error");
      trackEvent("registration_error", { error: message });
    }
  };

  return (
    <section id="register" className="w-full py-16 md:py-24 bg-slate-50 relative overflow-hidden scroll-mt-20 md:scroll-mt-24">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 transform pointer-events-none">
        <div className="h-[350px] w-[350px] rounded-full bg-gradient-to-br from-blue-400/15 to-purple-400/15 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 transform pointer-events-none">
        <div className="h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-cyan-400/15 to-blue-400/15 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Registration Portal
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Team Details
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Register your team or solo entry for TECHBETA 2026 2.0. ₹200 per participant (includes lunch, event entry & certificates).
          </p>
        </div>

        {/* Step Progress Bar */}
        {status !== "success" && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-blue-600 text-sm sm:text-base" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Step {currentStep}/2
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                  {currentStep === 1 ? "Step 1: Participant Details" : "Step 2: Payment & Review"}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {members.length} {members.length === 1 ? "Participant" : "Participants"} (₹{totalAmount})
              </div>
            </div>

            {/* Visual stepper indicator bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
                initial={{ width: "50%" }}
                animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/80">
          <AnimatePresence mode="wait">
            {/* SUCCESS VIEW */}
            {status === "success" ? (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center w-full"
              >
                {/* Animated confetti header */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="relative flex items-center justify-center mb-5"
                >
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <PartyPopper className="h-11 w-11 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  >
                    <Star className="h-4 w-4 text-yellow-900 fill-yellow-900" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h3
                    className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    You&apos;re Registered!
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 font-mono font-bold text-xs sm:text-sm mb-3 shadow-2xs">
                    <span className="text-blue-600 font-sans font-semibold">Your Participant ID:</span>
                    <span className="font-extrabold text-blue-700">{primaryParticipantId || participantIds[0] || "TB001"}</span>
                  </div>
                  <p className="text-slate-500 text-sm sm:text-base max-w-md">
                    A confirmation email with your Entry Pass and ID has been sent to{" "}
                    <span className="font-semibold text-blue-600">{members[0]?.email}</span>.
                    Check your inbox!
                  </p>
                </motion.div>

                {/* ── SUPER COOL ENTRY PASS TICKET ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-lg mb-6"
                >
                  {/* Ticket */}
                  <div ref={ticketRef} id="print-ticket" className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/25 border border-slate-200">
                    {/* Ticket header */}
                    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-6 pt-6 pb-5 relative overflow-hidden">
                      {/* decorative circles */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

                      <div className="flex items-start justify-between relative z-10">
                        <div>
                          <p className="text-[10px] text-sky-400 font-extrabold uppercase tracking-[0.25em] mb-1">
                            Official Entry Pass
                          </p>
                          <p
                            className="text-xl sm:text-2xl font-black text-white tracking-widest"
                            style={{ fontFamily: "var(--font-orbitron)" }}
                          >
                            TechBETA <span className="text-sky-400">2026 2.0</span>
                          </p>
                          <p className="text-xs text-slate-300 mt-1 font-medium">
                            Conference Hall &bull; St. Xavier&apos;s Catholic College of Engineering, Nagercoil
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                          <span className="px-3 py-1 bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            ✓ Confirmed
                          </span>
                          <span className="text-xs font-semibold text-sky-200">Oct 13, 2026 &bull; 9:00 AM</span>
                        </div>
                      </div>

                      {/* decorative dots row */}
                      <div className="flex gap-1 mt-4 relative z-10">
                        {Array.from({ length: 28 }).map((_, i) => (
                          <div key={i} className="flex-1 h-0.5 rounded-full bg-slate-700" />
                        ))}
                      </div>
                    </div>

                    {/* Ticket punch holes */}
                    <div className="relative bg-white">
                      <div className="absolute -top-3.5 left-6 w-7 h-7 rounded-full bg-slate-100 border border-slate-200" />
                      <div className="absolute -top-3.5 right-6 w-7 h-7 rounded-full bg-slate-100 border border-slate-200" />

                      {/* Ticket body: QR + Details */}
                      <div className="p-5 sm:p-6 pt-7">
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                          {/* QR Code */}
                          <div className="flex-shrink-0 flex flex-col items-center mx-auto sm:mx-0">
                            <div className="p-2.5 bg-white rounded-2xl border-2 border-slate-900 shadow-md">
                              <NextImage
                                src={
                                  qrDataUrl ||
                                  `https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=0f172a&bgcolor=ffffff&qzone=2&data=${encodeURIComponent(
                                    regId + "|" + members[0]?.name + "|" + members[0]?.college
                                  )}`
                                }
                                width={120}
                                height={120}
                                alt={`Official Entry Ticket QR code for ${members[0]?.name || 'symposium participant'}`}
                                className="block rounded-sm"
                                crossOrigin="anonymous"
                                unoptimized={!!qrDataUrl}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 mt-2.5">
                              <QrCode className="h-3.5 w-3.5 text-slate-700" />
                              <span className="text-[10px] text-slate-800 uppercase tracking-wider font-extrabold">Scan at Gate</span>
                            </div>
                          </div>

                          {/* Participant info */}
                          <div className="flex-grow min-w-0 w-full space-y-4">
                            {teamName && (
                              <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold flex items-center justify-between">
                                <span className="uppercase tracking-wider text-[10px] text-blue-700">Team Name:</span>
                                <span className="font-extrabold text-sm text-blue-900">{teamName}</span>
                              </div>
                            )}
                            {members.map((m, idx) => {
                              const pId = participantIds[idx] || (idx === 0 ? primaryParticipantId : "") || `TB${String(idx + 1).padStart(3, '0')}`;
                              return (
                                <div
                                  key={idx}
                                  className={idx > 0 ? "pt-4 border-t-2 border-dashed border-slate-200" : ""}
                                >
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    {members.length > 1 ? (
                                      <div className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider">
                                        Participant {idx + 1}
                                      </div>
                                    ) : (
                                      <div className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                                        Participant Pass
                                      </div>
                                    )}
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-mono font-black text-xs shadow-2xs">
                                      <span className="text-[10px] uppercase font-sans font-bold text-blue-100">ID:</span>
                                      <span>{pId}</span>
                                    </div>
                                  </div>

                                  {/* Name */}
                                  <div className="mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                                      Name
                                    </span>
                                    <p className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
                                      {m.name}
                                    </p>
                                  </div>

                                  {/* College Name */}
                                  <div className="mb-2.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                                      College Name
                                    </span>
                                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                                      {m.college || "St. Xavier's Catholic College of Engineering, Nagercoil"}
                                    </p>
                                  </div>

                                  {/* Technical Events */}
                                  <div className="mb-2.5">
                                    <span className="text-[11px] font-extrabold uppercase tracking-wide text-blue-950 block mb-1">
                                      Technical Events:
                                    </span>
                                    {m.technicalEvents.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {m.technicalEvents.map((ev) => (
                                          <span
                                            key={ev}
                                            className="px-2.5 py-1 bg-blue-100 text-blue-950 text-xs font-bold rounded-lg border border-blue-300 shadow-xs"
                                          >
                                            {ev}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs font-medium text-slate-500 italic">None selected</p>
                                    )}
                                  </div>

                                  {/* Non-Technical Events */}
                                  <div>
                                    <span className="text-[11px] font-extrabold uppercase tracking-wide text-purple-950 block mb-1">
                                      Non-Technical Events:
                                    </span>
                                    {m.nonTechnicalEvents.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {m.nonTechnicalEvents.map((ev) => (
                                          <span
                                            key={ev}
                                            className="px-2.5 py-1 bg-purple-100 text-purple-950 text-xs font-bold rounded-lg border border-purple-300 shadow-xs"
                                          >
                                            {ev}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs font-medium text-slate-500 italic">None selected</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Venue & Time highlight strip inside the ticket */}
                        <div className="mt-5 pt-4 border-t-2 border-slate-200 bg-slate-50/90 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 px-5 py-4 rounded-b-2xl">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-900">
                            <div className="flex items-start gap-2.5">
                              <MapPin className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block">
                                  Venue
                                </span>
                                <span className="font-extrabold text-slate-950 text-xs sm:text-sm block">
                                  Conference Hall
                                </span>
                                <span className="text-xs font-bold text-slate-800 block">
                                  St. Xavier&apos;s Catholic College of Engineering, Nagercoil
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5 sm:justify-end">
                              <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block">
                                  Reporting Time &amp; Date
                                </span>
                                <span className="font-extrabold text-slate-950 text-xs sm:text-sm block">
                                  9:00 AM Onwards
                                </span>
                                <span className="text-xs font-bold text-slate-800 block">
                                  October 13, 2026
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Perforated bottom edge */}
                      <div className="flex gap-1 mx-5 mb-0">
                        {Array.from({ length: 28 }).map((_, i) => (
                          <div key={i} className="flex-1 h-px rounded-full bg-slate-300" />
                        ))}
                      </div>

                      {/* Ticket footer strip */}
                      <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-slate-100/80 border-t border-slate-200">
                        <div className="text-xs text-slate-800 font-bold flex items-center gap-1.5">
                          <span>🍽 Lunch</span>
                          <span>&bull;</span>
                          <span>📜 Certificate</span>
                          <span>&bull;</span>
                          <span>🎟 Entry</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-slate-950">₹{totalAmount}</span>
                          <span className="text-xs font-bold text-emerald-700 ml-1.5 uppercase">PAID</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── ACTION BUTTONS ── */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mb-6"
                >
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {isDownloading ? "Generating PDF..." : "Download E-Pass PDF"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Register Another Team
                  </button>
                </motion.div>

                {/* ── WHATSAPP JOIN CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="w-full max-w-lg"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#075e54] to-[#128c7e] p-5 sm:p-6 text-white shadow-xl shadow-green-900/20">
                    {/* Background blobs */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />

                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-3 bg-white/10 rounded-2xl">
                          <MessageCircle className="h-8 w-8 text-white fill-white/20" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-black text-base sm:text-lg leading-tight">
                            Join the Official TechBETA WhatsApp Group
                          </p>
                          <p className="text-white/75 text-xs sm:text-sm mt-1.5 leading-relaxed">
                            Get live updates — event rooms, schedules, spot registrations, food coupons &amp; last-minute announcements!
                          </p>
                        </div>
                      </div>

                      <a
                        href="https://chat.whatsapp.com/DUMMY_LINK_REPLACE_ME"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2.5 w-full h-12 rounded-xl bg-white text-[#075e54] font-bold text-sm hover:bg-green-50 transition-all shadow-md"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25d366]" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                        </svg>
                        Join TechBETA WhatsApp Group
                        <ArrowRight className="h-4 w-4" />
                      </a>

                      <p className="text-center text-[11px] text-white/50 mt-3">
                        ⚠️ Don&apos;t miss it — critical event-day announcements are here only!
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Important note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm p-4 rounded-xl w-full max-w-lg mt-6"
                >
                  <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">At the venue:</span> Show the downloaded E-Pass PDF or this screen&apos;s QR code at the Registration Desk at 9:00 AM on October 13, 2026 at Conference Hall, St. Xavier&apos;s Catholic College of Engineering, Nagercoil.
                  </div>
                </motion.div>
              </motion.div>
            ) : currentStep === 1 ? (
              /* STEP 1: PARTICIPANT DETAILS */
              <motion.div
                key="step1-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                {/* Error Banner */}
                {errorMessage && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-200 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="font-medium">{errorMessage}</p>
                  </div>
                )}



                {/* Members List */}
                <div className="space-y-8">
                  {members.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="relative bg-slate-50/70 rounded-2xl p-5 sm:p-7 border border-slate-200 transition-all hover:border-slate-300"
                    >
                      {/* Member Header */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {mIdx + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              Member {mIdx + 1}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {mIdx === 0 ? "Team Lead / Primary Participant" : `Participant ${mIdx + 1}`}
                            </p>
                          </div>
                        </div>

                        {/* Remove button for member 2+ */}
                        {members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(mIdx)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Participant Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-slate-500" />
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            {touchedFields[`member-${mIdx}-name`] && !fieldErrors[`member-${mIdx}-name`] && member.name && (
                              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                                <Check className="h-3 w-3" /> Valid
                              </span>
                            )}
                          </div>
                          <input
                            id={mIdx === 0 ? "first-participant-name" : `member-${mIdx}-name`}
                            type="text"
                            required
                            value={member.name}
                            onChange={(e) => updateMember(mIdx, "name", e.target.value)}
                            onBlur={() => handleFieldBlur(`member-${mIdx}-name`, member.name)}
                            placeholder="e.g. Altrin Benser"
                            className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-500 placeholder:opacity-100 outline-none text-sm transition-all focus:ring-2 focus:ring-offset-1 ${fieldErrors[`member-${mIdx}-name`]
                              ? "border-red-400 focus:ring-red-400 bg-red-50/20"
                              : touchedFields[`member-${mIdx}-name`] && member.name
                                ? "border-green-500/70 focus:ring-green-500"
                                : "border-slate-300 focus:ring-blue-500"
                              }`}
                          />
                          {fieldErrors[`member-${mIdx}-name`] && (
                            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              {fieldErrors[`member-${mIdx}-name`]}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-slate-500" />
                              Email <span className="text-red-500">*</span>
                            </label>
                            {touchedFields[`member-${mIdx}-email`] && !fieldErrors[`member-${mIdx}-email`] && member.email && (
                              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                                <Check className="h-3 w-3" /> Valid
                              </span>
                            )}
                          </div>
                          <input
                            id={`member-${mIdx}-email`}
                            type="email"
                            required
                            value={member.email}
                            onChange={(e) => updateMember(mIdx, "email", e.target.value)}
                            onBlur={() => handleFieldBlur(`member-${mIdx}-email`, member.email)}
                            placeholder="e.g. altrin@example.com"
                            className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-500 placeholder:opacity-100 outline-none text-sm transition-all focus:ring-2 focus:ring-offset-1 ${fieldErrors[`member-${mIdx}-email`]
                              ? "border-red-400 focus:ring-red-400 bg-red-50/20"
                              : touchedFields[`member-${mIdx}-email`] && member.email
                                ? "border-green-500/70 focus:ring-green-500"
                                : "border-slate-300 focus:ring-blue-500"
                              }`}
                          />
                          {fieldErrors[`member-${mIdx}-email`] && (
                            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              {fieldErrors[`member-${mIdx}-email`]}
                            </p>
                          )}
                        </div>

                        {/* Mobile */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-slate-500" />
                              Mobile <span className="text-red-500">*</span>
                            </label>
                            {touchedFields[`member-${mIdx}-phone`] && !fieldErrors[`member-${mIdx}-phone`] && member.phone.length === 10 && (
                              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                                <Check className="h-3 w-3" /> Valid
                              </span>
                            )}
                          </div>
                          <input
                            id={`member-${mIdx}-phone`}
                            type="tel"
                            required
                            value={member.phone}
                            onChange={(e) => updateMember(mIdx, "phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                            onBlur={() => handleFieldBlur(`member-${mIdx}-phone`, member.phone)}
                            placeholder="e.g. 9876543210"
                            maxLength={10}
                            className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-500 placeholder:opacity-100 outline-none text-sm transition-all focus:ring-2 focus:ring-offset-1 ${fieldErrors[`member-${mIdx}-phone`]
                              ? "border-red-400 focus:ring-red-400 bg-red-50/20"
                              : touchedFields[`member-${mIdx}-phone`] && member.phone.length === 10
                                ? "border-green-500/70 focus:ring-green-500"
                                : "border-slate-300 focus:ring-blue-500"
                              }`}
                          />
                          {fieldErrors[`member-${mIdx}-phone`] && (
                            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              {fieldErrors[`member-${mIdx}-phone`]}
                            </p>
                          )}
                        </div>

                        {/* Department */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Layers className="h-3.5 w-3.5 text-slate-500" />
                              Department <span className="text-red-500">*</span>
                            </label>
                            {touchedFields[`member-${mIdx}-department`] && !fieldErrors[`member-${mIdx}-department`] && member.department && (
                              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                                <Check className="h-3 w-3" /> Valid
                              </span>
                            )}
                          </div>
                          <input
                            id={`member-${mIdx}-department`}
                            type="text"
                            required
                            list={`dept-list-${mIdx}`}
                            value={member.department}
                            onChange={(e) => updateMember(mIdx, "department", e.target.value)}
                            onBlur={() => handleFieldBlur(`member-${mIdx}-department`, member.department)}
                            placeholder="e.g. Information Technology"
                            className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-500 placeholder:opacity-100 outline-none text-sm transition-all focus:ring-2 focus:ring-offset-1 ${fieldErrors[`member-${mIdx}-department`]
                              ? "border-red-400 focus:ring-red-400 bg-red-50/20"
                              : touchedFields[`member-${mIdx}-department`] && member.department
                                ? "border-green-500/70 focus:ring-green-500"
                                : "border-slate-300 focus:ring-blue-500"
                              }`}
                          />
                          <datalist id={`dept-list-${mIdx}`}>
                            {DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept} />
                            ))}
                          </datalist>
                          {fieldErrors[`member-${mIdx}-department`] && (
                            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              {fieldErrors[`member-${mIdx}-department`]}
                            </p>
                          )}
                        </div>

                        {/* Select Year */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                              Select Year <span className="text-red-500">*</span>
                            </label>
                            {touchedFields[`member-${mIdx}-year`] && !fieldErrors[`member-${mIdx}-year`] && member.year && (
                              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                                <Check className="h-3 w-3" /> Valid
                              </span>
                            )}
                          </div>
                          <select
                            id={`member-${mIdx}-year`}
                            required
                            value={member.year}
                            onChange={(e) => updateMember(mIdx, "year", e.target.value)}
                            onBlur={() => handleFieldBlur(`member-${mIdx}-year`, member.year)}
                            className={`w-full h-11 px-3.5 rounded-xl border bg-white outline-none text-sm text-slate-900 font-medium transition-all focus:ring-2 focus:ring-offset-1 ${fieldErrors[`member-${mIdx}-year`]
                              ? "border-red-400 focus:ring-red-400 bg-red-50/20"
                              : touchedFields[`member-${mIdx}-year`] && member.year
                                ? "border-green-500/70 focus:ring-green-500"
                                : "border-slate-300 focus:ring-blue-500"
                              }`}
                          >
                            <option value="">Select Year</option>
                            {YEARS.map((yr) => (
                              <option key={yr} value={yr}>
                                {yr}
                              </option>
                            ))}
                          </select>
                          {fieldErrors[`member-${mIdx}-year`] && (
                            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              {fieldErrors[`member-${mIdx}-year`]}
                            </p>
                          )}
                        </div>

                        {/* College */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-slate-500" />
                              College <span className="text-red-500">*</span>
                            </label>
                            {touchedFields[`member-${mIdx}-college`] && !fieldErrors[`member-${mIdx}-college`] && member.college && (
                              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                                <Check className="h-3 w-3" /> Valid
                              </span>
                            )}
                          </div>
                          <input
                            id={`member-${mIdx}-college`}
                            type="text"
                            required
                            value={member.college}
                            onChange={(e) => updateMember(mIdx, "college", e.target.value)}
                            onBlur={() => handleFieldBlur(`member-${mIdx}-college`, member.college)}
                            placeholder="e.g. St. Xavier's Catholic College of Engineering"
                            className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-500 placeholder:opacity-100 outline-none text-sm transition-all focus:ring-2 focus:ring-offset-1 ${fieldErrors[`member-${mIdx}-college`]
                              ? "border-red-400 focus:ring-red-400 bg-red-50/20"
                              : touchedFields[`member-${mIdx}-college`] && member.college
                                ? "border-green-500/70 focus:ring-green-500"
                                : "border-slate-300 focus:ring-blue-500"
                              }`}
                          />
                          {fieldErrors[`member-${mIdx}-college`] && (
                            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              {fieldErrors[`member-${mIdx}-college`]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Important Notice Banner */}
                      <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200/90 p-3.5 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
                        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="font-medium">
                          <strong>Important:</strong> Each participant can register for a maximum of any 2 technical events and 2 non technical events.
                        </p>
                      </div>

                      {/* Event Selection Sections */}
                      <div className="space-y-5">
                        {/* Technical Events */}
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>Technical Events</span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                {member.technicalEvents.length}/2 Selected
                              </span>
                            </h4>
                            <span className="text-xs text-slate-400 font-medium">Max 2</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {TECHNICAL_EVENTS.map((evt) => {
                              const isSelected = member.technicalEvents.includes(evt.id);
                              const isDisabled = !isSelected && member.technicalEvents.length >= 2;
                              const Icon = evt.icon;

                              return (
                                <button
                                  type="button"
                                  key={evt.id}
                                  disabled={isDisabled}
                                  onClick={() => toggleTechEvent(mIdx, evt.id)}
                                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${isSelected
                                    ? "bg-blue-50/80 border-blue-500 text-blue-900 shadow-sm ring-1 ring-blue-500"
                                    : isDisabled
                                      ? "bg-slate-100/60 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed"
                                      : "bg-white border-slate-200 hover:border-blue-300 text-slate-700 hover:bg-slate-50/80"
                                    }`}
                                >
                                  <div
                                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                                      ? "bg-blue-600 text-white"
                                      : "bg-slate-100 text-slate-600"
                                      }`}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <p className="font-semibold text-xs sm:text-sm truncate">{evt.label}</p>
                                        {evt.isTeam && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                                            Team (1-2)
                                          </span>
                                        )}
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 flex items-center gap-1">
                                          <Clock className="w-2.5 h-2.5" /> {evt.time}
                                        </span>
                                      </div>
                                      {isSelected && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate">{evt.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Non Technical Events */}
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>Non Technical Events</span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                {member.nonTechnicalEvents.length}/2 Selected
                              </span>
                            </h4>
                            <span className="text-xs text-slate-400 font-medium">Max 2</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {NON_TECHNICAL_EVENTS.map((evt) => {
                              const isSelected = member.nonTechnicalEvents.includes(evt.id);
                              const isDisabled = !isSelected && member.nonTechnicalEvents.length >= 2;
                              const Icon = evt.icon;

                              return (
                                <button
                                  type="button"
                                  key={evt.id}
                                  disabled={isDisabled}
                                  onClick={() => toggleNonTechEvent(mIdx, evt.id)}
                                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${isSelected
                                    ? "bg-purple-50/80 border-purple-500 text-purple-900 shadow-sm ring-1 ring-purple-500"
                                    : isDisabled
                                      ? "bg-slate-100/60 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed"
                                      : "bg-white border-slate-200 hover:border-purple-300 text-slate-700 hover:bg-slate-50/80"
                                    }`}
                                >
                                  <div
                                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                                      ? "bg-purple-600 text-white"
                                      : "bg-slate-100 text-slate-600"
                                      }`}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <p className="font-semibold text-xs sm:text-sm truncate">{evt.label}</p>
                                        {evt.isTeam && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">
                                            Team (1-2)
                                          </span>
                                        )}
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 flex items-center gap-1">
                                          <Clock className="w-2.5 h-2.5" /> {evt.time}
                                        </span>
                                      </div>
                                      {isSelected && <Check className="h-4 w-4 text-purple-600 shrink-0" />}
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate">{evt.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {fieldErrors[`member-${mIdx}-events`] && (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                            <span>{fieldErrors[`member-${mIdx}-events`]}</span>
                          </div>
                        )}

                        {/* Event Timing Warning */}
                        <div className="mt-4 bg-orange-50 border border-orange-200 p-3 sm:p-4 rounded-xl flex items-start gap-3 shadow-xs animate-fadeIn">
                          <Info className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 shrink-0 mt-0.5" />
                          <div className="text-[12px] sm:text-sm text-orange-900 font-medium">
                            <span className="font-bold">Important:</span> Please check the timings of each event to avoid overlaps or clashes between your selected events.
                          </div>
                        </div>

                        {/* Individual / Team Selection per member */}
                        {(member.technicalEvents.some((t) => t.toLowerCase().includes("logic trap") || t.toLowerCase().includes("idea forge") || t.toLowerCase().includes("team")) ||
                          member.nonTechnicalEvents.some((n) => n.toLowerCase().includes("brand blitz") || n.toLowerCase().includes("bid & build") || n.toLowerCase().includes("bid and build") || n.toLowerCase().includes("team"))) && (
                            <div className="mt-6 p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
                              <label className="block text-[13px] font-bold text-slate-900 mb-3 uppercase tracking-wide">
                                You selected a Team Event. Are you participating as:
                              </label>
                              <div className="flex gap-6 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name={`participationMode-${mIdx}`} checked={!member.isParticipatingAsTeam} onChange={() => { updateMember(mIdx, "isParticipatingAsTeam", false); updateMember(mIdx, "teamName", ""); }} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                                  <span className="text-sm text-slate-700 font-semibold">An Individual</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name={`participationMode-${mIdx}`} checked={!!member.isParticipatingAsTeam} onChange={() => updateMember(mIdx, "isParticipatingAsTeam", true)} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                                  <span className="text-sm text-slate-700 font-semibold">A Team</span>
                                </label>
                              </div>

                              {member.isParticipatingAsTeam && (
                                <div className="pt-4 border-t border-slate-200 animate-fadeIn">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                    <label htmlFor={`teamName-${mIdx}`} className="block text-xs font-black text-blue-950 uppercase tracking-wider">
                                      Team Name (Team Competition)
                                    </label>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 w-fit">
                                      Team Competition Chosen
                                    </span>
                                  </div>
                                  <input
                                    id={`teamName-${mIdx}`}
                                    type="text"
                                    value={member.teamName || ""}
                                    onChange={(e) => updateMember(mIdx, "teamName", e.target.value)}
                                    placeholder="e.g. Code Knights, Byte Busters, Innovators..."
                                    className="w-full h-11 px-4 rounded-xl border border-blue-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium shadow-xs"
                                  />
                                  <div className="mt-3 flex items-start gap-2 bg-blue-100/80 border border-blue-300 p-2.5 rounded-lg">
                                    <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                                    <p className="text-[12px] sm:text-[13px] font-black text-blue-900 leading-tight">
                                      IMPORTANT: Please enter the EXACT SAME team name for both team members if registering as a team.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>



                {/* Bottom Action Bar: Add Team Member & Proceed to Payment */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {members.length < 4 ? (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <UserPlus className="h-4 w-4" />
                      Add Team Member
                    </button>
                  ) : (
                    <div className="text-sm font-semibold text-slate-500">
                      Maximum 4 members allowed
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="w-full px-7 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm sm:text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200/80 shadow-sm w-full">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Secured with <span className="text-[#3395FF] font-bold">Razorpay</span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* STEP 2: PAYMENT & REVIEW (STEP 2/2) */
              <motion.form
                key="step2-payment"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSubmit}
                className="space-y-6 sm:space-y-8"
              >
                {/* Error Banner */}
                {errorMessage && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-200 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="font-medium">{errorMessage}</p>
                  </div>
                )}

                {/* Order & Participant Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/90">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      Registration Summary
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Edit Details
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    {teamName && (
                      <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between text-xs font-bold text-blue-950">
                        <span className="uppercase tracking-wider text-[10px] text-blue-700">Team Name:</span>
                        <span className="font-extrabold text-sm text-blue-900">{teamName}</span>
                      </div>
                    )}
                    {members.map((m, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-900">
                            Member {idx + 1}: {m.name}
                          </span>
                          <span className="font-semibold text-slate-700">₹{FEE_PER_PERSON}</span>
                        </div>
                        <p className="text-slate-500 text-xs mb-1.5">
                          {m.department} • {m.year} • {m.college}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.technicalEvents.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                              {t}
                            </span>
                          ))}
                          {m.nonTechnicalEvents.map((nt) => (
                            <span key={nt} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-medium border border-purple-200">
                              {nt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fee Total breakdown */}
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">Total Payable ({members.length} participant{members.length > 1 ? "s" : ""})</p>
                      <p className="text-xs text-emerald-600 font-medium">Includes Buffet Lunch & Certificate</p>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{totalAmount}
                    </div>
                  </div>
                </div>

                {/* Official Razorpay Checkout */}
                <div className="bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/40 rounded-2xl p-5 sm:p-7 border border-blue-200/80">
                  <div className="text-center mb-6">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                      Pay Securely with Razorpay
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Supports UPI, Credit/Debit Cards, Net Banking & Wallets
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                      <p className="text-sm font-medium text-slate-700 mb-2">Total Amount to Pay</p>
                      <p className="text-3xl font-black text-slate-900">₹{totalAmount}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Clicking &quot;Pay & Register&quot; below will open the secure Razorpay checkout.
                      Once payment is successful, your registration will be confirmed automatically.
                    </p>
                  </div>
                </div>

                {/* Payment Important Notice */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 font-medium">
                    <span className="font-bold">Important:</span> Please make sure to come back to this page after the payment is completed. Once the payment is verified, a confirmation mail will be sent to you.
                  </div>
                </div>

                {/* Step 2 Bottom Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    disabled={status === "loading"}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Participant Details
                  </button>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm sm:text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    Pay ₹{totalAmount} & Register
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
