import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Inter, JetBrains_Mono, Spline_Sans_Mono, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"], // Medium weight
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-spline-sans-mono",
  subsets: ["latin"],
  weight: ["400"], // Regular weight
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, SemiBold, Bold
});

const generalSans = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Variable.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-VariableItalic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

const epoch = localFont({
  src: "../public/fonts/Epoch.otf",
  variable: "--font-epoch",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Team EDC",
  description: "The Official Website of Team EDC",
  icons: {
    icon: "/edc_logo.png",
    shortcut: "/edc_logo.png",
    apple: "/edc_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${generalSans.variable} ${epoch.variable} ${dancingScript.variable} ${inter.variable} ${jetBrainsMono.variable} ${splineSansMono.variable} ${instrumentSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
