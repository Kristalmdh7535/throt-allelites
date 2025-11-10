"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bike } from "../types/Bike";

export default function FeaturedBikes() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bikes") // Remaining to replace with actual backend URL.
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch bikes");
        }
        return res.json();
      })
      .then((data) => setBikes(data))
      .catch((err) => {
        console.error(err);
        setError("Could not load bikes. Please try again later.");
      });
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Bikes</h2>
        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : bikes.length === 0 ? (
          <p className="text-gray-600 text-center">Loading bikes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bikes.map((bike: Bike) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{bike.name}</h3>
                  <p className="text-gray-600 mb-2">{bike.description}</p>
                  <p className="text-red-600 font-bold">{bike.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}