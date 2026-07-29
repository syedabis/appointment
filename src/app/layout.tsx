import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1-on-1 AI & Data Science Mentorship | DataCrumbs",
  description: "Select your time slot and mentor for 1-on-1 AI, Machine Learning, n8n automation, and resume roasting sessions. Engineered by DataCrumbs.",
  keywords: ["DataCrumbs mentorship", "AI 1-on-1", "Data Science slot booking", "n8n automation review", "resume roast AI", "mock interview AI"],
  authors: [{ name: "DataCrumbs Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#080c14] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
