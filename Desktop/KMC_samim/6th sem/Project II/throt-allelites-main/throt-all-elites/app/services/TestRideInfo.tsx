'use client';

import styles from './Services.module.css';

export default function TestRideInfo() {
  return (
    <section className={styles.band}>
      <div className={styles.bandInner}>
        <div className={styles.bandMeta}>
          <span className={styles.sectionNum}>03</span>
          <span className={styles.bandLabel}>— Before You Buy</span>
          <h2 className={styles.bandTitle}>
            Test Ride<br /><em>Booking</em>
          </h2>
          <p className={styles.bandDesc}>
            Feel the power and handling of your dream machine before you commit.
            No-pressure rides at our showroom in Tindobato, Banepa.
            Most popular models available same day — subject to availability.
          </p>
          <div className={styles.statPill}>
            <span className={styles.statNum}>0</span>
            <span className={styles.statLabel}>pressure. ever.</span>
          </div>
        </div>

        <div className={styles.bandWidget}>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>01</span>
              <div className={styles.stepBody}>
                <strong>Pick your bike</strong>
                <p>Browse our inventory and tell us which model you want to ride. We'll confirm availability within the hour.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>02</span>
              <div className={styles.stepBody}>
                <strong>Show up at the showroom</strong>
                <p>Bring your valid driving licence to Tindobato, Banepa. No paperwork, no wait — just ride.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>03</span>
              <div className={styles.stepBody}>
                <strong>Hit the road</strong>
                <p>Our team will brief you on the bike and let you experience it on real roads around Banepa.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>04</span>
              <div className={styles.stepBody}>
                <strong>Decide with confidence</strong>
                <p>No pressure to buy on the day. Take your time — we want you to love your choice.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}