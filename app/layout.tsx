import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

import { Heebo } from "next/font/google";

const heebo = Heebo({ subsets: ['hebrew'], weight: ['300', '400', '500', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: "עומרי ואופל - קפסולת החיים",
  description: "מרחב אישי המתעד את המסע של עומרי ואופל.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.className} min-h-screen flex flex-col bg-background text-foreground selection:bg-brand-gold/20 scroll-smooth`}>
        <Navbar />
        <main className="flex-grow flex flex-col pt-8 pb-16 px-4 md:px-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
