"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bike } from "../types/Bike";
import styles from "./FeaturedBikes.module.css";

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
    <section className={styles.featuredBikes}>
      <div className={styles.container}>
        <h2 className={styles.title}>Featured Bikes</h2>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : bikes.length === 0 ? (
          <p className={styles.loading}>Loading bikes...</p>
        ) : (
          <div className={styles.bikesGrid}>
            {bikes.map((bike: Bike) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={styles.bikeCard}
              >
                <img
                  src={bike.image}
                  alt={bike.name}
                  className={styles.bikeImage}
                />
                <div className={styles.bikeCardContent}>
                  <h3 className={styles.bikeName}>{bike.name}</h3>
                  <p className={styles.bikeDescription}>{bike.description}</p>
                  <p className={styles.bikePrice}>{bike.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}