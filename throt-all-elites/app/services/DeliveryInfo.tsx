'use client';

import styles from './Services.module.css';

export default function DeliveryInfo() {
  return (
    <section className={styles.band}>
      <div className={styles.bandInner}>

        {/* LEFT — meta */}
        <div className={styles.bandMeta}>
          <span className={styles.sectionNum}>04</span>
          <span className={styles.bandLabel}>— We Come to You</span>
          <h2 className={styles.bandTitle}>
            Home<br /><em>Delivery</em>
          </h2>
          <p className={styles.bandDesc}>
            Secure, fully insured doorstep delivery across Nepal. Your bike arrives
            pre-inspected, documented, and ready to ride. Contact us for charges
            and availability in your district.
          </p>
          <div className={styles.statPill}>
            <span className={styles.statNum}>77</span>
            <span className={styles.statLabel}>districts we deliver to</span>
          </div>
        </div>

        {/* RIGHT — feature list + CTAs */}
        <div className={styles.bandWidget}>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>🛡️</span>
              <div className={styles.featureText}>
                <strong>Fully Insured Transit</strong>
                <p>Your bike is covered end-to-end from our showroom to your door. Any damage in transit is on us.</p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>🔍</span>
              <div className={styles.featureText}>
                <strong>Pre-Delivery Inspection (PDI)</strong>
                <p>Every bike goes through a full PDI before dispatch — fluids, brakes, electrics, tyre pressure.</p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>📄</span>
              <div className={styles.featureText}>
                <strong>Full Documentation Handover</strong>
                <p>Bluebook, warranty card, service manual — everything handed over at your doorstep.</p>
              </div>
            </li>
          </ul>

          <div className={styles.btnRow}>
            <a
              href="tel:+9779823141414"
              className={`${styles.btn} ${styles.btnPhone}`}
            >
              📞 Call 9823141414
            </a>
            <a
              href="https://wa.me/9779823141414?text=Hi%20Throt-All%20Elites!%20I%20want%20to%20know%20more%20about%20home%20delivery%20for..."
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnWhatsApp}`}
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}