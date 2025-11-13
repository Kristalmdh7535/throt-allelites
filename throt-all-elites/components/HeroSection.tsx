// components/HeroSection.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: "url('/images/hero-bike.jpg')" }}
    >
      <div className="hero-overlay">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-content"
        >
          <h1 className="hero-title">Throt-All Elites</h1>
          <p className="hero-subtitle">Ride the Pinnacle of Luxury and Power</p>
          <Link href="/bikes" className="hero-cta">
            Explore Bikes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}