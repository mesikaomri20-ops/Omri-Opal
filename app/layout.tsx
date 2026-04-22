import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מרכז בקרה - משקיע ערך",
  description: "המוח שלך לניתוח השקעות ללא בולשיט",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased h-screen overflow-hidden flex flex-col bg-brand-dark text-foreground">
        {children}
      </body>
    </html>
  );
}
