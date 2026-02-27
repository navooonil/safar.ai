import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { TripProvider } from "@/context/TripContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Safar.ai | Your Intelligent Travel Planner",
  description: "AI-powered travel planning, minus the overwhelming choices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${caveat.variable} antialiased font-[family-name:var(--font-inter)]`}>
        <TripProvider>
          {children}
        </TripProvider>
      </body>
    </html>
  );
}
