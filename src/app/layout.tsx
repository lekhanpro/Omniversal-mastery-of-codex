import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Lekhan's Omniversal Codex",
  description: "A comprehensive digital library for personal evolution, future intelligence, and high-performance skill building. Navigate your 20-domain mastery architecture.",
  keywords: ["Omniversal Codex", "Personal Evolution", "Knowledge Management", "Mastery", "Learning", "AI", "Future Intelligence"],
  authors: [{ name: "Lekhan" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Lekhan's Omniversal Codex",
    description: "A comprehensive digital library for personal evolution, future intelligence, and high-performance skill building.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lekhan's Omniversal Codex",
    description: "A comprehensive digital library for personal evolution, future intelligence, and high-performance skill building.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
