import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omri & Opel - The Life Capsule",
  description: "A premium personal space chronicling the journey of Omri & Opel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-brand-gold/20 scroll-smooth">
        <Navbar />
        <main className="flex-grow flex flex-col pt-8 pb-16 px-4 md:px-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
