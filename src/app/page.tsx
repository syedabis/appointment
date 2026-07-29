"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MentorshipBooking } from "@/components/MentorshipBooking";
import { MentorsGrid } from "@/components/MentorsGrid";
import { WhyMentorship } from "@/components/WhyMentorship";
import { Testimonials } from "@/components/Testimonials";
import { AlumniNetwork } from "@/components/AlumniNetwork";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-section");
    bookingSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      <Header onBookClick={scrollToBooking} />
      <Hero onStartBooking={scrollToBooking} />
      <MentorshipBooking />
      <MentorsGrid onSelectMentor={() => scrollToBooking()} />
      <WhyMentorship />
      <Testimonials />
      <AlumniNetwork />
      <FaqSection />
      <Footer />
    </main>
  );
}
