import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Throt-All Elites | Luxury Motorbikes",
  description: "Explore the finest collection of luxury motorbikes at Throt-All Elites.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />

        <Script
          src="https://embed.tawk.to/6992a97c3a5ba51c3b88d17a/1jhiec4fo"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
