import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "../store/ReduxProvider";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

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
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
      className="font-sans h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
