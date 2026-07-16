import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${ibmPlexSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
