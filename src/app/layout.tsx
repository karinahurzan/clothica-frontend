import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import "modern-normalize/modern-normalize.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const nutinoSans = Nunito_Sans({
  variable: "--font-nutino-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clothica",
  description: "Clothica — це місце, де комфорт поєднується зі стилем.",
  openGraph: {
    title: "Clothica",
    description: "Clothica — це місце, де комфорт поєднується зі стилем.",
    images: [
      {
        url: "https://clothica-front.vercel.app/images/hero/hero-desktop@2x.jpg",
        width: 1200,
        height: 630,
        alt: "Welcome to Clothica",
      },
    ],
    url: "https://clothica-front.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ua">
      <body
        className={`${nutinoSans.variable} antialiased mr-0! flex min-h-screen justify-center items-center flex-col bg-scheme-4-background font-sans text-scheme-4-text`}
      >
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
