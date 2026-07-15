import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WiseBill AI — AI Spend Auditor",
    template: "%s | WiseBill AI",
  },
  description:
    "Find out how much your team is overpaying for AI tools. WiseBill AI audits your Cursor, Copilot, Claude, ChatGPT, and Gemini subscriptions and surfaces real savings in under 60 seconds.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "WiseBill AI",
    title: "WiseBill AI — AI Spend Auditor",
    description:
      "Find out how much your team is overpaying for AI tools — free audit in 60 seconds.",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WiseBill AI — AI Spend Auditor",
    description:
      "Find out how much your team is overpaying for AI tools — free audit in 60 seconds.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
