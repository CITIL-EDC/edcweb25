import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDC - Entrepreneurship Development Cell",
  description: "Official Website for the Entrepreneurship Development Cell, CIT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
