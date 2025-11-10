"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-bike.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-white"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Throt-All Elites
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Ride the Pinnacle of Luxury and Power
          </p>
          <Link
            href="/bikes"
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700"
          >
            Explore Bikes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}