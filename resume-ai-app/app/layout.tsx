import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume Tailoring & ATS Optimizer",
  description:
    "Upload your resume, paste a job description, and let AI tailor your resume to maximize your ATS score. No fabrication — only smart, keyword-optimized rephrasing.",
  keywords: ["resume", "ATS", "AI", "job application", "resume tailoring", "Gemini"],
  openGraph: {
    title: "ResumeAI — AI-Powered Resume Tailoring",
    description: "Boost your ATS score with AI-powered resume tailoring.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
