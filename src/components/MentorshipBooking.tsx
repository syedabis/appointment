"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  SESSION_TRACKS, 
  MENTORS, 
  TIME_SLOTS, 
  TIMEZONES,
  SessionTrack, 
  Mentor, 
  TimeSlot,
  fetchStudentByRollNo,
  EnrolledStudent
} from "@/data/mentorshipData";
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
  Check
} from "lucide-react";

export const MentorshipBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"easypaisa" | "card" | "bank">("easypaisa");
  const [trxId, setTrxId] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Selection states
  const [selectedTrack, setSelectedTrack] = useState<SessionTrack>(SESSION_TRACKS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MENTORS[0]);
  
  // Date & Time selection states
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("PKT");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Student Roll Number & Verification state
  const [rollNoInput, setRollNoInput] = useState<string>("");
  const [verifiedStudent, setVerifiedStudent] = useState<EnrolledStudent | null>(null);
  const [fetchError, setFetchError] = useState<string>("");

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

  // Dates generator (Next 14 days)
  const [availableDates, setAvailableDates] = useState<{ dayName: string; dayNum: number; fullDate: string; isWeekend: boolean }[]>([]);

  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      const fullDate = `${dayName}, ${monthName} ${dayNum}`;
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      dates.push({ dayName, dayNum, fullDate, isWeekend });
    }
    setAvailableDates(dates);
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[1].fullDate); // Default to tomorrow
    }
  }, []);

  // Filtered mentors list based on selected category
  const filteredMentors = MENTORS.filter(m => {
    if (selectedCategory === "all") return true;
    return m.category === selectedCategory;
  });

  // Roll Number auto-fetch logic
  const handleFetchStudentData = (rollNoToFetch?: string) => {
    const query = rollNoToFetch || rollNoInput;
    if (!query.trim()) {
      setFetchError("Please enter your Student Roll No or ID.");
      return;
    }

    const student = fetchStudentByRollNo(query);
    if (student) {
      setVerifiedStudent(student);
      setFetchError("");
      setStudentDetails(prev => ({
        ...prev,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        status: student.status,
        portfolioUrl: student.portfolioUrl,
        focusAreas: student.focusAreas.length > 0 ? student.focusAreas : prev.focusAreas
      }));
    } else {
      setVerifiedStudent(null);
      setFetchError("Roll No not found. Please enter details manually or check format.");
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

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentDetails.fullName || !studentDetails.email) {
      alert("Please fill in your name and email address.");
      return;
    }

    // Launch Fee Submission Payment Modal
    setShowPaymentModal(true);
  };

  const executeFinalPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      const randomId = "DC-101-" + Math.floor(100000 + Math.random() * 900000);
      setBookingId(randomId);
      setIsSubmitted(true);
      setCurrentStep(4);

      // Trigger celebratory confetti effect
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.6 }
      });
    }, 1200);
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
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Reserve Your 1-on-1 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">Mentorship Session</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
            Enrolled DataCrumbs students can enter their Roll No to auto-fill their profile & apply their free 1-on-1 mentorship pass instantly!
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

              return (
                <button
                  key={step.num}
                  disabled={isSubmitted || step.num > currentStep + 1}
                  onClick={() => !isSubmitted && setCurrentStep(step.num)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-400 shadow-lg shadow-emerald-500/10"
                      : isCompleted
                      ? "bg-emerald-50 dark:bg-slate-900 border-emerald-400 dark:border-emerald-500/40 text-slate-900 dark:text-slate-300 hover:border-emerald-500"
                      : "bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                    isActive
                      ? "bg-emerald-500 text-slate-950"
                      : isCompleted
                      ? "bg-emerald-200 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                  const isSelected = selectedTrack.id === track.id;
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
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${track.badgeColor}`}>
                          {track.tag}
                        </span>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          {track.duration}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          {track.title}
                          {isSelected && !isClosed && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          {isClosed && <span className="text-[10px] uppercase font-extrabold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40 px-2 py-0.5 rounded">Closed</span>}
                        </h4>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{track.description}</p>
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 space-y-1.5 mb-4">
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
                  Selected Track: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedTrack.title}</span> ({selectedTrack.duration})
                </div>
                {selectedTrack.isClosed ? (
                  <div className="flex items-center gap-3">
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
                  Available Dates (Next 14 Days)
                </label>
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
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">Duration: <strong className="text-emerald-600 dark:text-emerald-400">{selectedTrack.duration}</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot, index) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? "bg-emerald-500/20 border-emerald-500 text-slate-900 dark:text-white shadow-md shadow-emerald-500/10"
                            : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
                            <span className="text-sm font-bold">{slot.time}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{slot.period} Slot</span>
                        </div>

                        {slot.isPopular && (
                          <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/30">
                            Popular
                          </span>
                        )}
                        {slot.isFastFilling && (
                          <span className="text-[9px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-500/30">
                            Fast Filling
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
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
                  Are you an enrolled DataCrumbs student? Enter your Roll No below to auto-fetch your data & activate your free pass.
                </p>
              </div>

              {/* ENROLLED STUDENT ROLL NO AUTO-FETCH BOX */}
              <div className="bg-emerald-50/80 dark:bg-gradient-to-r dark:from-emerald-950/40 dark:via-slate-900 dark:to-cyan-950/40 border border-emerald-300 dark:border-emerald-500/30 rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Enrolled Student Roll No Auto-Fetch
                  </label>
                  <span className="text-[10px] text-cyan-800 dark:text-cyan-300 font-medium bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/30">
                    Fast Auto-Fill
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Enter Student Roll No (e.g. DC-2024-8841)"
                      value={rollNoInput}
                      onChange={(e) => {
                        setRollNoInput(e.target.value);
                        if (e.target.value.length >= 7) {
                          handleFetchStudentData(e.target.value);
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-emerald-400 dark:border-emerald-500/50 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors uppercase font-mono font-bold shadow-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFetchStudentData()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 whitespace-nowrap flex items-center justify-center gap-2 transition-all"
                  >
                    <Zap className="w-4 h-4 text-slate-950" />
                    Fetch Profile Data
                  </button>
                </div>

                {/* Pre-saved Student Roll No Sample Pills */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Quick Test Roll Nos:</span>
                  {[
                    { roll: "DC-2024-8841", label: "Ali Raza" },
                    { roll: "DC-2024-1052", label: "Fatima Noor" },
                    { roll: "DC-2024-9932", label: "Muhammad Bilal" },
                    { roll: "DC-2024-4410", label: "Sarah Ahmed" }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.roll}
                      onClick={() => {
                        setRollNoInput(item.roll);
                        handleFetchStudentData(item.roll);
                      }}
                      className="bg-white dark:bg-slate-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-800 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-[10px] transition-colors shadow-sm"
                    >
                      {item.roll} ({item.label})
                    </button>
                  ))}
                </div>

                {/* Verification Status Banner */}
                {verifiedStudent && (
                  <div className="bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-400 dark:border-emerald-500/50 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-900 dark:text-slate-200 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse" />
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <span>{verifiedStudent.fullName}</span>
                          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded">
                            ENROLLED VERIFIED ✓
                          </span>
                        </div>
                        <p className="text-emerald-800 dark:text-emerald-300/90 text-[11px] font-medium">
                          {verifiedStudent.cohort} • <strong className="text-slate-900 dark:text-white">Free 1-on-1 Mentorship Pass Applied!</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-500/40 hidden sm:inline shadow-sm">
                      ID: {verifiedStudent.rollNo}
                    </span>
                  </div>
                )}

                {fetchError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">⚠️ {fetchError}</p>
                )}
              </div>

              {/* Booking Summary Box */}
              <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400 block font-medium">Session Track:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">{selectedTrack.title}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
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

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Email Address <span className="text-emerald-600 dark:text-emerald-400">*</span></span>
                    {verifiedStudent && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Auto-filled</span>}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ali.raza@example.com"
                    value={studentDetails.email}
                    onChange={(e) => setStudentDetails({ ...studentDetails, email: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors shadow-sm"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>WhatsApp Number (for instant reminder)</span>
                    {verifiedStudent && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Auto-filled</span>}
                  </label>
                  <input
                    type="tel"
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
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>GitHub / Portfolio / Resume Link (Optional but Recommended)</span>
                    {verifiedStudent?.portfolioUrl && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Auto-filled</span>}
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
                <div className="sm:col-span-2 space-y-1.5">
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
                  Select Focus Topics for This Meeting:
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
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  Confirm & Reserve 1-on-1 Slot
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
              <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#0a1120] border border-emerald-300 dark:border-emerald-500/40 rounded-3xl p-6 text-left space-y-4 shadow-2xl relative overflow-hidden">
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
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono block">Roll: {verifiedStudent.rollNo}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block font-medium">Assigned Mentor</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">{selectedMentor.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block font-medium">Session Track</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{selectedTrack.title}</span>
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
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=DataCrumbs+Mentorship+with+${encodeURIComponent(selectedMentor.name)}&details=1-on-1+Session+Track:+${encodeURIComponent(selectedTrack.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <CalendarIcon className="w-4 h-4 text-slate-950" />
                  Add to Google Calendar
                </a>

                <a
                  href={`https://wa.me/923292020497?text=Hi!+I+just+booked+my+1-on-1+mentorship+slot+(Booking+ID:+${bookingId}${verifiedStudent ? `,+Roll+No:+${verifiedStudent.rollNo}` : ""})+with+${encodeURIComponent(selectedMentor.name)}+for+${encodeURIComponent(selectedDate)}`}
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
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
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
                  <span className="text-slate-900 dark:text-white font-bold">{selectedTrack.title}</span>
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
                    {verifiedStudent ? "Rs 0 (Student Pass)" : selectedTrack.price}
                  </span>
                </div>
              </div>

              {/* Verified Student Notice */}
              {verifiedStudent ? (
                <div className="bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-400 dark:border-emerald-500/40 rounded-2xl p-4 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    <BadgeCheck className="w-5 h-5" />
                    <span>DataCrumbs Student Free Pass Verified!</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    Your Roll No <strong className="text-slate-900 dark:text-white">{verifiedStudent.rollNo}</strong> includes 100% free mentorship sessions. No fee payment required.
                  </p>
                </div>
              ) : (
                <>
                  {/* Payment Method Selector Tabs */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("easypaisa")}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === "easypaisa"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-md"
                            : "bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span>EasyPaisa / JazzCash</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bank")}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === "bank"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-md"
                            : "bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        <span>Bank IBFT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === "card"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-md"
                            : "bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span>Debit / Credit Card</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Details Box */}
                  {paymentMethod === "easypaisa" && (
                    <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 font-medium">
                        <span>EasyPaisa / JazzCash Number:</span>
                        <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-mono font-bold">0329-2020497</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 font-medium">
                        <span>Account Title:</span>
                        <strong className="text-slate-900 dark:text-white font-bold">DataCrumbs Labs</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Send <strong>Rs 1,500</strong> to the number above via EasyPaisa/JazzCash app and enter your Transaction ID below.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 font-medium">
                        <span>Bank Name:</span>
                        <strong className="text-cyan-700 dark:text-cyan-400 font-bold">Meezan Bank Ltd</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 font-medium">
                        <span>Account Title:</span>
                        <strong className="text-slate-900 dark:text-white font-bold">DataCrumbs Labs</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 font-medium">
                        <span>IBAN / Account #:</span>
                        <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">PK92MEZN0001000123456789</strong>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-700 dark:text-slate-400 font-medium block mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4242 •••• •••• 4242"
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-700 dark:text-slate-400 font-medium block mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            placeholder="12/28"
                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-700 dark:text-slate-400 font-medium block mb-1">CVC / CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction ID Input for EasyPaisa/Bank */}
                  {paymentMethod !== "card" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Enter Payment TRX ID / Reference Number</span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Instant Verification</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TRX-9824105829"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-600 outline-none shadow-sm"
                      />
                    </div>
                  )}
                </>
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
                    <span>Verifying Fee Payment & Reserving Slot...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-slate-950" />
                    <span>{verifiedStudent ? "Confirm Free Slot Reservation" : "Submit Fee & Confirm 1-on-1 Session"}</span>
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
