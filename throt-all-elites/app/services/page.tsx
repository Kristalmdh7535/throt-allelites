'use client';

import BikeComparison from './BikeComparison';
import EmiCalculator from './EmiCalculator';
import TestRideInfo from './TestRideInfo';
import DeliveryInfo from './DeliveryInfo';
import styles from './Services.module.css';

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Throt-All Elites</p>
          <h1 className={styles.heroTitle}>
            Elite Services
            <span className={styles.heroAccent}>For Elite Riders</span>
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroSub}>
            From head-to-head spec battles to doorstep delivery —
            everything you need to own your dream bike, made effortless.
          </p>
        </div>
      </section>

      {/* ── Sections in order ── */}
      <BikeComparison />
      <EmiCalculator />
      <TestRideInfo />
      <DeliveryInfo />
    </main>
  );
}