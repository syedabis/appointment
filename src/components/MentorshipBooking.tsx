"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { 
  SESSION_TRACKS, 
  MENTORS, 
  TIMEZONES,
  SessionTrack, 
  Mentor, 
  TimeSlot,
} from "@/data/mentorshipData";
import { withBasePath } from "@/lib/basePath";
import { toast, Toaster } from "sonner";
import type { VerifiedStudent, PaymentInstructions } from "@/lib/lmsEligibility";
import { getPakistanNow, getSlotStartMinutes, BOOKING_BUFFER_MINUTES } from "@/lib/pakistanTime";
import type { AvailabilityDay } from "@/app/api/availability/route";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  MessageSquare, 
  Download, 
  ExternalLink,
  Code,
  Briefcase,
  Layers,
  Search,
  Filter,
  KeyRound,
  BadgeCheck,
  Zap,
  User,
  CreditCard,
  X,
  Lock,
  Loader2,
  Building2,
  QrCode,
  Receipt,
  Check,
  AlertCircle
} from "lucide-react";

/**
 * Paid booking for non-students is switched off: only LMS-verified students can
 * book, and they book for free. The payment UI below is intentionally left in
 * place so it can be re-enabled later by flipping this to true.
 */
const ALLOW_PAID_BOOKING = false;

/** "09:30" -> "09:30 AM" — the label format the rest of the flow expects. */
function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}

type BookableSlot = TimeSlot & { slotId: string; booked: boolean };

function periodOf(hhmm: string): TimeSlot["period"] {
  const hour = Number(hhmm.split(":")[0]);
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

export const MentorshipBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"easypaisa" | "card" | "bank">("easypaisa");
  const [trxId, setTrxId] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Selection states
  const [selectedTrack, setSelectedTrack] = useState<SessionTrack | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MENTORS[0]);

  // Date & Time selection states
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("PKT");
  const [selectedSlot, setSelectedSlot] = useState<BookableSlot | null>(null);

  // Student Roll Number & Verification state
  const [emailInput, setEmailInput] = useState<string>("");
  const [verifiedStudent, setVerifiedStudent] = useState<VerifiedStudent | null>(null);
  const [fetchError, setFetchError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  /** What this email will be charged, returned by the LMS after verification. */
  const [quote, setQuote] = useState<{
    isStudent: boolean;
    free: boolean;
    amountPkr: number;
    freeAvailableFrom: string | null;
    payment: PaymentInstructions | null;
  } | null>(null);
  /** Receipt the visitor uploads when the session is not free. */
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Student details state
  const [studentDetails, setStudentDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "Student / Fresh Graduate",
    portfolioUrl: "",
    goals: "",
    focusAreas: [] as string[]
  });

  // Form submission status
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");

  // Availability comes from the LMS admin panel — it is the single source of
  // truth for which dates and times are bookable.
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(true);
  const [availabilityError, setAvailabilityError] = useState<string>("");
  const [nextEligibleDate, setNextEligibleDate] = useState<string | null>(null);

  // Pakistan wall-clock, refreshed so slots expire while the page sits open.
  const [pakistanNow, setPakistanNow] = useState<{ dateKey: string; minutes: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = getPakistanNow();
      setPakistanNow({
        dateKey: `${now.year}-${String(now.month).padStart(2, "0")}-${String(now.day).padStart(2, "0")}`,
        minutes: now.minutesSinceMidnight,
      });
    };
    tick();
    const timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(withBasePath("/api/availability"), { cache: "no-store" });
        const data = await response.json();
        if (cancelled) return;
        if (!response.ok) {
          setAvailabilityError("Could not load available dates. Please refresh or try again shortly.");
          return;
        }
        setAvailability(Array.isArray(data.days) ? data.days : []);
        setNextEligibleDate(data.nextEligibleDate ?? null);
      } catch {
        if (!cancelled) setAvailabilityError("Could not load available dates. Please check your connection.");
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Drop days whose every slot has already passed, then build the date strip.
  const availableDates = useMemo(() => {
    if (!pakistanNow) return [];
    const cutoff = pakistanNow.minutes + BOOKING_BUFFER_MINUTES;

    return availability
      .map((day) => {
        const usable = day.times.filter((t) =>
          day.date > pakistanNow.dateKey
            ? true
            : day.date === pakistanNow.dateKey
            ? getSlotStartMinutes(t.startTime) >= cutoff
            : false
        );
        const [y, m, d] = day.date.split("-").map(Number);
        const dt = new Date(Date.UTC(y, m - 1, d));
        return {
          isoDate: day.date,
          dayName: dt.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
          dayNum: dt.getUTCDate(),
          fullDate: `${dt.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}, ${dt.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })} ${dt.getUTCDate()}`,
          isToday: day.date === pakistanNow.dateKey,
          times: usable,
        };
      })
      .filter((day) => day.times.length > 0);
  }, [availability, pakistanNow]);

  // Default to the first day that actually has slots.
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].fullDate);
    }
  }, [availableDates, selectedDate]);

  const visibleSlots: BookableSlot[] = useMemo(() => {
    const day = availableDates.find((d) => d.fullDate === selectedDate);
    if (!day) return [];
    return day.times.map((t) => ({
      slotId: t.slotId,
      booked: t.booked,
      time: `${to12h(t.startTime)} - ${to12h(t.endTime)}`,
      period: periodOf(t.startTime),
      isPopular: t.label?.toLowerCase() === "popular" || undefined,
      isFastFilling: t.label?.toLowerCase() === "fast filling" || undefined,
    }));
  }, [availableDates, selectedDate]);

  // If the chosen slot just expired, or the date changed, drop the stale selection
  // so the user cannot advance with a slot that is no longer offered.
  useEffect(() => {
    if (selectedSlot && !visibleSlots.some(slot => slot.time === selectedSlot.time)) {
      setSelectedSlot(null);
    }
  }, [visibleSlots, selectedSlot]);

  // Filtered mentors list based on selected category
  const filteredMentors = MENTORS.filter(m => {
    if (selectedCategory === "all") return true;
    return m.category === selectedCategory;
  });

  // Looks the email up against the LMS through our own server route, so the
  // LMS key stays server-side and the student list cannot be enumerated.
  const handleVerifyStudent = async (): Promise<boolean> => {
    const email = emailInput.trim();
    // Blur fires on an empty or half-typed field too — stay quiet until there
    // is something worth looking up.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;

    setIsVerifying(true);
    setFetchError("");

    try {
      const response = await fetch(withBasePath("/api/verify-student"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (!response.ok) {
        setVerifiedStudent(null);
        setFetchError(result.error || "Could not verify this email. Please try again.");
        return false;
      }

      // Everyone can book now. The answer is a price, not a yes/no — a student
      // with a free session left pays nothing, everyone else pays per session.
      setQuote({
        isStudent: !!result.isStudent,
        free: !!result.free,
        amountPkr: result.amountPkr ?? 0,
        freeAvailableFrom: result.freeAvailableFrom ?? null,
        payment: result.payment ?? null,
      });

      setVerifiedStudent(
        result.student ?? { fullName: "", email, phone: "", cohort: "" }
      );
      setStudentDetails(prev => ({
        ...prev,
        fullName: result.student?.fullName || prev.fullName,
        email: result.student?.email || email,
        phone: result.student?.phone || prev.phone
      }));
      return true;
    } catch {
      setVerifiedStudent(null);
      setFetchError("Network problem while verifying. Please check your connection and try again.");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      const bookingElem = document.getElementById("booking-container");
      bookingElem?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentDetails.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    const email = studentDetails.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // The lookup normally runs on blur, but someone can submit before it has
    // finished (or without ever leaving the field). Price must be known before
    // the modal opens, otherwise it would show a free pass to a paying visitor.
    if (!quote) {
      const priced = await handleVerifyStudent();
      if (!priced) {
        toast.error("We could not check your email. Please try again.");
        return;
      }
    }

    if (!studentDetails.phone.trim()) {
      toast.error("Please enter your WhatsApp number so we can send your session reminder.");
      return;
    }

    // These pills are buttons, not checkboxes, so `required` cannot apply.
    if (studentDetails.focusAreas.length === 0) {
      toast.error("Please select at least one focus topic for this meeting.");
      return;
    }

    // Confirmation summary. No fee is due for verified students; the payment
    // options behind ALLOW_PAID_BOOKING stay switched off for now.
    setShowPaymentModal(true);
  };

  const executeFinalPayment = async () => {
    if (quote && !quote.free && !receiptFile) {
      toast.error(`Please upload your payment receipt for Rs ${quote.amountPkr}.`);
      return;
    }

    setIsProcessingPayment(true);
    setSubmitError("");

    try {
      const payload = JSON.stringify({
          slotId: selectedSlot?.slotId,
          trackTitle: selectedTrack?.title,
          mentorName: selectedMentor.name,
          date: selectedDate,
          slot: selectedSlot?.time,
          timezone: selectedTimezone,
          fullName: studentDetails.fullName,
          email: studentDetails.email,
          phone: studentDetails.phone,
          careerStatus: studentDetails.status,
          portfolioUrl: studentDetails.portfolioUrl,
          goals: studentDetails.goals,
          focusAreas: studentDetails.focusAreas
        // Identity, cohort, amount and payment method are set by the server
        // from the LMS lookup — sending them from here would be untrusted.
      });

      // A paid booking carries the receipt, so it has to go as multipart.
      let response: Response;
      if (quote && !quote.free && receiptFile) {
        const form = new FormData();
        form.append("payload", payload);
        form.append("receipt", receiptFile);
        response = await fetch(withBasePath("/api/bookings"), { method: "POST", body: form });
      } else {
        response = await fetch(withBasePath("/api/bookings"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not record your booking. Please try again.");
      }

      setBookingId(result.bookingId);
      setShowPaymentModal(false);
      setIsSubmitted(true);
      setCurrentStep(4);

      // Trigger celebratory confetti effect
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (error) {
      // The sheet is the only record of a booking, so never show a confirmation
      // we could not actually save — keep the modal open so the user can retry.
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleFocusAreaToggle = (area: string) => {
    setStudentDetails(prev => {
      const exists = prev.focusAreas.includes(area);
      if (exists) {
        return { ...prev, focusAreas: prev.focusAreas.filter(a => a !== area) };
      } else {
        return { ...prev, focusAreas: [...prev.focusAreas, area] };
      }
    });
  };

  return (
    <section id="booking-section" className="py-16 bg-slate-50 dark:bg-[#080c14] relative">
      <Toaster position="top-center" richColors closeButton />
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="booking-container">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Interactive 1-on-1 Mentorship Scheduler</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reserve Your 1-on-1 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">Mentorship Session</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
            Enrolled DataCrumbs students can verify with their LMS email to auto-fill their profile & apply their free 1-on-1 mentorship pass instantly!
          </p>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
            {[
              { num: 1, label: "Session Track", icon: Layers },
              { num: 2, label: "Date & Time Slot", icon: CalendarIcon },
              { num: 3, label: "Student Intake", icon: FileText }
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num || isSubmitted;

              // Step 1 is always unlocked
              // Step 2 is unlocked ONLY if user has selected a valid non-closed track
              // Step 3 is unlocked ONLY if user has selected a track AND selected a time slot
              const isUnlocked =
                step.num === 1 ||
                (step.num === 2 && selectedTrack !== null && !selectedTrack.isClosed) ||
                (step.num === 3 && selectedTrack !== null && !selectedTrack.isClosed && selectedSlot !== null);

              const isDisabled = isSubmitted || !isUnlocked;

              return (
                <button
                  key={step.num}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setCurrentStep(step.num)}
                  title={!isUnlocked ? "Please select a session track first to unlock this step" : ""}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-400 shadow-lg shadow-emerald-500/10"
                      : isCompleted
                      ? "bg-emerald-50 dark:bg-slate-900 border-emerald-400 dark:border-emerald-500/40 text-slate-900 dark:text-slate-300 hover:border-emerald-500 cursor-pointer"
                      : isUnlocked
                      ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400 cursor-pointer"
                      : "bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                    isActive
                      ? "bg-emerald-500 text-slate-950"
                      : isCompleted
                      ? "bg-emerald-200 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400"
                      : isUnlocked
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      : "bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : step.num}
                  </div>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN FORM CONTAINER */}
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          {/* STEP 1: SELECT SESSION TRACK */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Step 1: Choose Your 1-on-1 Session Track
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">What is the primary goal of your 1-on-1 meeting?</p>
                </div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/30 w-fit mt-2 sm:mt-0">
                  Select 1 Track
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SESSION_TRACKS.map((track) => {
                  const isSelected = selectedTrack?.id === track.id;
                  const isClosed = track.isClosed;
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        if (!isClosed) {
                          setSelectedTrack(track);
                        }
                      }}
                      className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                        isClosed
                          ? "bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800 opacity-80 cursor-not-allowed"
                          : isSelected
                          ? "bg-emerald-50/60 dark:bg-slate-900/90 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.01] cursor-pointer"
                          : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/70 shadow-sm cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4 h-7">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${track.badgeColor}`}>
                          {track.tag}
                        </span>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs font-medium shrink-0">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          {track.duration}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="min-h-[56px] flex items-start justify-between gap-2">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                            {track.title}
                          </h4>
                          {isSelected && !isClosed && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {isClosed && (
                            <span className="text-[10px] uppercase font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 px-2 py-0.5 rounded shrink-0 mt-0.5">
                              Closed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium min-h-[64px]">
                          {track.description}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 space-y-1.5 mb-4 min-h-[140px] flex flex-col justify-start">
                        {track.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-slate-300 font-medium">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isClosed ? "text-slate-400 dark:text-slate-600" : "text-emerald-600 dark:text-emerald-400"}`} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Fee:</span>
                        <span className={`font-bold ${isClosed ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {isClosed
                            ? "Free (Registration Closed)"
                            : verifiedStudent
                            ? "FREE (Included in Bootcamp Pass)"
                            : track.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">
                  {selectedTrack ? (
                    <span>Selected Track: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedTrack.title}</span> ({selectedTrack.duration})</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">⚠️ Select a track card above to unlock next steps</span>
                  )}
                </div>

                {!selectedTrack ? (
                  <button
                    disabled
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-sm cursor-not-allowed ml-auto"
                  >
                    Select 1 Track Above to Continue
                  </button>
                ) : selectedTrack.isClosed ? (
                  <div className="flex items-center gap-3 ml-auto">
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Mock Interview registration is closed. Select Track 1 or 2.</span>
                    <button
                      disabled
                      className="px-8 py-3.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed"
                    >
                      Registration Closed
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 ml-auto"
                  >
                    Select Date & Time Slot
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SLOT PICKER */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Step 2: Select Date, Time Zone & Slot
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">All times will automatically adjust to your selected time zone.</p>
                </div>

                <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium shrink-0">Timezone:</span>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className="bg-transparent text-xs text-emerald-700 dark:text-emerald-400 font-bold outline-none cursor-pointer"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.code} value={tz.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lead Mentor Banner */}
              <div className="bg-emerald-50/80 dark:bg-slate-900/90 border border-emerald-300 dark:border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedMentor.avatar}
                    alt={selectedMentor.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500/50 shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedMentor.name}</span>
                      <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                        Lead Mentor
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{selectedMentor.role} • {selectedMentor.company}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium text-right hidden sm:block">
                  <span>Rating: </span>
                  <strong className="text-slate-900 dark:text-white font-bold">⭐ {selectedMentor.rating}</strong> ({selectedMentor.reviewsCount}+ sessions)
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Available Dates
                </label>

                {availabilityLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading available dates...
                  </div>
                )}

                {!availabilityLoading && availabilityError && (
                  <div className="rounded-2xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-500/10 p-5 text-center">
                    <p className="text-sm font-bold text-rose-800 dark:text-rose-300">{availabilityError}</p>
                  </div>
                )}

                {!availabilityLoading && !availabilityError && availableDates.length === 0 && (
                  <div className="rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-6 text-center space-y-1">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                      No sessions are open right now
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-200/80 font-medium">
                      New slots are added regularly — please check back soon.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                  {availableDates.map((item, idx) => {
                    const isSelected = selectedDate === item.fullDate;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(item.fullDate)}
                        className={`flex flex-col items-center justify-center min-w-[85px] p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20 scale-105"
                            : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm"
                        }`}
                      >
                        <span className="text-[11px] uppercase tracking-wider opacity-80">{item.dayName}</span>
                        <span className="text-2xl font-black my-0.5">{item.dayNum}</span>
                        <span className="text-[9px] font-medium opacity-75">{item.fullDate.split(", ")[1]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Select Available Time Slot for {selectedDate} ({selectedTimezone})
                  </label>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">Duration: <strong className="text-emerald-600 dark:text-emerald-400">{selectedTrack?.duration}</strong></span>
                </div>

                {visibleSlots.length === 0 ? (
                  <div className="rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-6 text-center space-y-1">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                      No slots left on this date
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-200/80 font-medium">
                      Please pick another date above.
                    </p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {visibleSlots.map((slot, index) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        key={index}
                        disabled={slot.booked}
                        onClick={() => !slot.booked && setSelectedSlot(slot)}
                        title={slot.booked ? "Already booked by another student" : ""}
                        className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                          slot.booked
                            ? "bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-emerald-500/20 border-emerald-500 text-slate-900 dark:text-white shadow-md shadow-emerald-500/10"
                            : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${slot.booked ? "text-slate-300 dark:text-slate-700" : isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
                            <span className={`text-sm font-bold ${slot.booked ? "line-through" : ""}`}>{slot.time}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{slot.period} Slot</span>
                        </div>

                        {slot.booked && (
                          <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                            Booked
                          </span>
                        )}
                        {!slot.booked && slot.isPopular && (
                          <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/30">
                            Popular
                          </span>
                        )}
                        {!slot.booked && slot.isFastFilling && (
                          <span className="text-[9px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-500/30">
                            Fast Filling
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                )}
              </div>

              {selectedSlot && (
                <div className="bg-emerald-50 dark:bg-slate-900/90 border border-emerald-400 dark:border-emerald-500/40 rounded-xl p-4 flex items-center justify-between text-xs text-slate-800 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span>Selected Slot: </span>
                      <strong className="text-slate-900 dark:text-white font-bold">{selectedDate} @ {selectedSlot.time} ({selectedTimezone})</strong>
                    </div>
                  </div>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Mentor: {selectedMentor.name}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-800 text-sm font-semibold flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  disabled={!selectedSlot}
                  onClick={handleNextStep}
                  className={`px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                    selectedSlot
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-emerald-500/20 hover:scale-105 cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Proceed to Intake Form
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: STUDENT INTAKE & ROLL NO AUTO-FETCH FORM */}
          {currentStep === 3 && (
            <form onSubmit={handleConfirmBooking} className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Step 4: Student Information & Meeting Preparation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Enter your email to continue. Enrolled DataCrumbs students book free; everyone else pays the session fee.
                </p>
              </div>

              {/* STUDENT EMAIL VERIFICATION BOX */}
              <div className="bg-emerald-50/80 dark:bg-slate-900/70 border border-emerald-300 dark:border-emerald-500/25 rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Verify Your Email
                    </label>
                    {/* Said before they type, so someone who is not a student
                        does not have to fail a verification to find out. */}
                    <p className="text-[11px] text-slate-700 dark:text-slate-400 font-medium mt-1">
                      Students enrolled in our AI &amp; Data Science Bootcamp get one free session. Everyone else is welcome to book at the standard session fee.
                    </p>
                  </div>
                  <span className="text-[10px] text-cyan-800 dark:text-cyan-300 font-medium bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/30 shrink-0">
                    Required
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email (e.g. you@example.com)"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      // One email now — the form no longer has its own field,
                      // so this is the address that gets priced and booked.
                      setStudentDetails((prev) => ({ ...prev, email: e.target.value.trim() }));
                      // Any edit invalidates the previous answer.
                      if (verifiedStudent) setVerifiedStudent(null);
                      if (quote) setQuote(null);
                      if (fetchError) setFetchError("");
                    }}
                    onBlur={() => handleVerifyStudent()}
                    className="w-full bg-white dark:bg-slate-900 border border-emerald-400 dark:border-emerald-500/50 focus:border-emerald-500 rounded-xl px-4 py-3 pr-32 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors shadow-sm"
                  />
                  {/* Status sits inside the field — the lookup runs on its own,
                      so there is no button for the visitor to remember to press. */}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold flex items-center gap-1.5 pointer-events-none">
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
                        <span className="text-slate-500 dark:text-slate-400">Checking...</span>
                      </>
                    ) : quote ? (
                      quote.free ? (
                        <span className="text-emerald-700 dark:text-emerald-400">Free session</span>
                      ) : (
                        <span className="text-amber-700 dark:text-amber-400">Rs {quote.amountPkr}</span>
                      )
                    ) : null}
                  </span>
                </div>

                {/* Just the price here — the bank details and receipt upload
                    live in the confirmation modal, so this box stays short. */}
                {quote && !quote.free && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-3 animate-fadeIn">
                    <CreditCard className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                      <strong>Session fee: Rs {quote.amountPkr}.</strong>{" "}
                      {quote.isStudent
                        ? `Your free session is used — the next one is available from ${quote.freeAvailableFrom}.`
                        : "Free sessions are for enrolled DataCrumbs students."}{" "}
                      Fill the form below and you&apos;ll pay at the last step.
                    </p>
                  </div>
                )}

                {/* Verification Status Banner */}
                {verifiedStudent && quote?.free && (
                  <div className="bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-400 dark:border-emerald-500/50 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-900 dark:text-slate-200 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <span>{verifiedStudent.fullName}</span>
                          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded">
                            VERIFIED ✓
                          </span>
                        </div>
                        <p className="text-emerald-800 dark:text-emerald-300/90 text-[11px] font-medium">
                          {verifiedStudent.cohort} • <strong className="text-slate-900 dark:text-white">Free 1-on-1 Mentorship Pass Applied!</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-500/40 hidden sm:inline shadow-sm">
                      {verifiedStudent.email}
                    </span>
                  </div>
                )}

                {/* Visible before any attempt, so an outsider sees the paid route
                    immediately instead of discovering it through an error. */}
                {!verifiedStudent && !fetchError && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-emerald-200 dark:border-slate-800 pt-3">
                    Not enrolled with us? You can still book — you&apos;ll just pay the session
                    fee at the last step. Need help?{" "}
                    <a
                      href="https://wa.me/923292020497"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                    >
                      Message us on WhatsApp
                    </a>.
                  </p>
                )}

                {fetchError && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/50 p-3 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium leading-relaxed text-rose-800 dark:text-rose-200">
                      {fetchError}
                    </p>
                  </div>
                )}
              </div>

              {/* Booking Summary Box */}
              <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400 block font-medium">Session Track:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">{selectedTrack?.title}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 block font-medium">Mentor:</span>
                  <span className="text-slate-900 dark:text-white font-bold text-sm">{selectedMentor.name}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 block font-medium">Date & Slot:</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold text-sm">{selectedDate} @ {selectedSlot?.time}</span>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Full Name <span className="text-emerald-600 dark:text-emerald-400">*</span></span>
                    {verifiedStudent && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Auto-filled</span>}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Raza"
                    value={studentDetails.fullName}
                    onChange={(e) => setStudentDetails({ ...studentDetails, fullName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors shadow-sm"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>WhatsApp Number <span className="text-emerald-600 dark:text-emerald-400">*</span></span>
                    {verifiedStudent && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Auto-filled</span>}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567"
                    value={studentDetails.phone}
                    onChange={(e) => setStudentDetails({ ...studentDetails, phone: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors shadow-sm"
                  />
                </div>

                {/* Current Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Current Career Status
                  </label>
                  <select
                    value={studentDetails.status}
                    onChange={(e) => setStudentDetails({ ...studentDetails, status: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition-colors shadow-sm"
                  >
                    <option value="Student / Fresh Graduate">Student / Fresh Graduate</option>
                    <option value="Transitioning into AI / Data Science">Transitioning into AI / Data Science</option>
                    <option value="Working Software / ML Engineer">Working Software / ML Engineer</option>
                    <option value="Freelancer looking for clients">Freelancer looking for clients</option>
                  </select>
                </div>

                {/* GitHub / Portfolio Link */}
                <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>GitHub / Portfolio / Resume Link (Optional but Recommended)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://github.com/yourusername/ai-project or Google Drive link"
                    value={studentDetails.portfolioUrl}
                    onChange={(e) => setStudentDetails({ ...studentDetails, portfolioUrl: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors shadow-sm"
                  />
                </div>

                {/* Goals & Questions */}
                <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    What specific question or code repo do you want to review in this session?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. I need help optimizing my LangChain RAG retrieval pipeline and formatting my resume for AI roles..."
                    value={studentDetails.goals}
                    onChange={(e) => setStudentDetails({ ...studentDetails, goals: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors resize-none shadow-sm"
                  />
                </div>

              </div>

              {/* Primary AI Focus Areas Checkboxes */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Focus Topics for This Meeting: <span className="text-emerald-600 dark:text-emerald-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "LinkedIn & ATS Resume Roast", "GitHub Portfolio Polish", "Career Advisory & Roadmap",
                    "AI & n8n Blueprint", "Mock Technical Interview", "System Architecture Review"
                  ].map((topic, i) => {
                    const checked = studentDetails.focusAreas.includes(topic);
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleFocusAreaToggle(topic)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          checked
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-400 font-semibold"
                            : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm"
                        }`}
                      >
                        {checked ? "✓ " : "+ "}{topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Navigation Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-800 text-sm font-semibold flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl font-black text-base shadow-xl transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-emerald-500/25 hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  {quote && !quote.free ? `Continue to Payment · Rs ${quote.amountPkr}` : "Confirm & Reserve 1-on-1 Slot"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: CONFIRMATION & CALENDAR PASS */}
          {currentStep === 4 && isSubmitted && (
            <div className="text-center max-w-2xl mx-auto py-6 space-y-8 animate-fadeIn">
              
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                  BOOKING CONFIRMED • ID: {bookingId}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Your 1-on-1 Session is Reserved!</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  A Google Meet link and calendar invitation have been sent to <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{studentDetails.email}</strong>.
                </p>
              </div>

              {/* TICKET PASS DISPLAY */}
              <div className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 rounded-3xl p-6 text-left space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full" />
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">DataCrumbs Mentorship Pass</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">
                    Confirmed {verifiedStudent ? "• Enrolled Student" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block font-medium">Student Name</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-1">
                      {studentDetails.fullName}
                      {verifiedStudent && <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </span>
                    {verifiedStudent && (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono block">{verifiedStudent.email}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block font-medium">Assigned Mentor</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">{selectedMentor.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block font-medium">Session Track</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{selectedTrack?.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block font-medium">Date & Time</span>
                    <span className="text-cyan-700 dark:text-cyan-400 font-bold">{selectedDate} @ {selectedSlot?.time} ({selectedTimezone})</span>
                  </div>
                </div>

                {verifiedStudent && (
                  <div className="bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 rounded-xl p-2.5 text-[11px] text-emerald-900 dark:text-emerald-300 font-medium flex items-center justify-between">
                    <span>Program Cohort: <strong>{verifiedStudent.cohort}</strong></span>
                    <span className="text-slate-950 font-bold bg-emerald-500 px-2 py-0.5 rounded text-[10px]">
                      FREE PASS APPLIED
                    </span>
                  </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span>Location: <strong>Google Meet (Link in Email)</strong></span>
                  <span>Mentor Review Status: <strong className="text-emerald-700 dark:text-emerald-400">Pending Code Prep</strong></span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=DataCrumbs+Mentorship+with+${encodeURIComponent(selectedMentor.name)}&details=1-on-1+Session+Track:+${encodeURIComponent(selectedTrack?.title || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <CalendarIcon className="w-4 h-4 text-slate-950" />
                  Add to Google Calendar
                </a>

                <a
                  href={`https://wa.me/923292020497?text=Hi!+I+just+booked+my+1-on-1+mentorship+slot+(Booking+ID:+${bookingId})+with+${encodeURIComponent(selectedMentor.name)}+for+${encodeURIComponent(selectedDate)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Confirm via WhatsApp (+92 329 2020497)
                </a>
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmitError("");
                  setTrxId("");
                  setCurrentStep(1);
                }}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline font-medium pt-4"
              >
                Book another session or change details
              </button>

            </div>
          )}

        </div>
      </div>

      {/* FEE SUBMISSION PAYMENT MODAL POPUP */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Fee Submission & Payment</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Complete payment to confirm your 1-on-1 session</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

              {/* Order Summary Box */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-emerald-300 dark:border-emerald-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>Selected Session Track</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedTrack?.title}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>Assigned Mentor</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{selectedMentor.name} (15 Mins)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>Date & Slot</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">{selectedDate} @ {selectedSlot?.time || "09:30 AM - 09:45 AM"}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-1">
                  <span className="text-slate-800 dark:text-slate-300 font-bold">Total Amount Due:</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {quote && !quote.free ? `Rs ${quote.amountPkr}` : "Rs 0 (Student Pass)"}
                  </span>
                </div>
              </div>

              {/* Free session — nothing to pay. */}
              {(!quote || quote.free) ? (
                <div className="bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-400 dark:border-emerald-500/40 rounded-2xl p-4 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    <BadgeCheck className="w-5 h-5" />
                    <span>DataCrumbs Student Free Pass Verified!</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    Your enrolled account <strong className="text-slate-900 dark:text-white">{verifiedStudent?.email}</strong> includes a free mentorship session. No fee payment required.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Where to send the money */}
                  <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2.5">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Step 1 — Transfer Rs {quote.amountPkr}
                    </p>

                    {quote.payment?.bank.title && (
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            {quote.payment.bank.name || "Bank"}
                          </span>
                          <span className="text-slate-900 dark:text-white font-bold">
                            {quote.payment.bank.title}
                          </span>
                        </div>
                        {quote.payment.bank.accountNumber && (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Account</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px] break-all text-right">
                              {quote.payment.bank.accountNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {quote.payment?.wallet.number && (
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">EasyPaisa / JazzCash / NayaPay</span>
                          <span className="text-slate-900 dark:text-white font-bold">
                            {quote.payment.wallet.title}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Number</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                            {quote.payment.wallet.number}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Receipt */}
                  <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2.5">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Step 2 — Upload your receipt
                    </p>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                      <li>The screenshot must show the <strong>account title</strong>.</li>
                      <li>It must show <strong>exactly Rs {quote.amountPkr}</strong> — not more, not less.</li>
                      <li>It must show the <strong>date and time</strong> of the transfer.</li>
                      <li>Receipts older than {quote.payment?.windowHours ?? 24} hours are not accepted.</li>
                    </ul>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                      className="w-full text-xs text-slate-700 dark:text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-slate-950 file:text-xs file:font-bold cursor-pointer"
                    />
                    {receiptFile && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                        Ready to submit: {receiptFile.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Booking Save Failure Notice */}
              {submitError && (
                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/40 rounded-2xl p-4 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400 text-sm">
                    <X className="w-4 h-4" />
                    <span>Booking could not be saved</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{submitError}</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Your slot is not reserved yet. Press the button again to retry, or message us on{" "}
                    <a
                      href="https://wa.me/923292020497"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      WhatsApp
                    </a>.
                  </p>
                </div>
              )}

              {/* Submit Payment Action Button */}
              <button
                type="button"
                onClick={executeFinalPayment}
                disabled={isProcessingPayment}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span>{quote && !quote.free ? "Checking your receipt..." : "Reserving your slot..."}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-slate-950" />
                    <span>{quote && !quote.free ? `Verify Payment & Confirm Slot` : "Confirm Free Slot Reservation"}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Encrypted 256-bit Secure Transaction • DataCrumbs Guaranteed</span>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
};
