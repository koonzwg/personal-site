import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const description =
  "Design engineer working across product strategy, UX/UI, engineering, and AI — from first idea to shipped software.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL once the domain is live; Vercel's URL is the fallback.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "William Koonz — Design Engineer",
  description,
  openGraph: {
    title: "William Koonz — Design Engineer",
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@thewilliamkoonz" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Lets scroll reveals hide content only when JS is running to reveal it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
