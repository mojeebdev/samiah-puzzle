import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy 27th Birthday!",
  description: "A special puzzle game for a special person.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}