import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToneCast — Make your inbox worth listening to",
  description:
    "ToneCast transforms everyday emails into polished, personality-filled performances — right inside Gmail.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
