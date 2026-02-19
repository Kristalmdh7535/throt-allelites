'use client';

import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to your API
    setSubmitted(true);
  };

  return (
    <main className={styles.page}>

      {/* ── Noise grain overlay ── */}
      <div className={styles.grain} aria-hidden="true" />

      {/* ── Hero strip ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Throt-All Elites</p>
          <h1 className={styles.heroTitle}>
            Let's<br />
            <span className={styles.heroAccent}>Talk</span><br />
            Machines.
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroSub}>
            Whether you're hunting your next ride, need service, or just want to
            geek out about bikes — we're always in the garage.
          </p>
        </div>

        {/* diagonal red slash */}
        <div className={styles.heroSlash} aria-hidden="true" />

        {/* info cards stacked on the right */}
        <div className={styles.infoStack}>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📍</span>
            <div>
              <p className={styles.infoLabel}>Find Us</p>
              <p className={styles.infoValue}>Baneshwor, Kathmandu</p>
              <p className={styles.infoValue}>Bagmati Province, Nepal</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📞</span>
            <div>
              <p className={styles.infoLabel}>Call / WhatsApp</p>
              <p className={styles.infoValue}>+977 98XX-XXXXXX</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🕐</span>
            <div>
              <p className={styles.infoLabel}>Showroom Hours</p>
              <p className={styles.infoValue}>Sun – Fri &nbsp;·&nbsp; 9 AM – 6 PM</p>
              <p className={styles.infoValue}>Saturday &nbsp;·&nbsp; 10 AM – 4 PM</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>✉️</span>
            <div>
              <p className={styles.infoLabel}>Email</p>
              <p className={styles.infoValue}>hello@throtelites.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form section ── */}
      <section className={styles.formSection}>
        <div className={styles.formWrapper}>

          <div className={styles.formHeader}>
            <span className={styles.formTag}>— Drop a message</span>
            <h2 className={styles.formTitle}>Rev Up the Conversation</h2>
          </div>

          {submitted ? (
            <div className={styles.successBox}>
              <span className={styles.successIcon}>🏍️</span>
              <h3 className={styles.successTitle}>Message Received!</h3>
              <p className={styles.successText}>
                We'll get back to you faster than a Hayabusa on an open highway.
              </p>
              <button
                className={styles.resetBtn}
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="name">Full Name *</label>
                  <input
                    className={styles.input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Rider"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email *</label>
                  <input
                    className={styles.input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">Phone</label>
                  <input
                    className={styles.input}
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+977 98XX-XXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="subject">I'm interested in…</label>
                  <select
                    className={styles.input}
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a topic</option>
                    <option value="buying">Buying a Bike</option>
                    <option value="service">Service / Repair</option>
                    <option value="test-ride">Test Ride</option>
                    <option value="parts">Parts & Accessories</option>
                    <option value="other">Something Else</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="message">Message *</label>
                <textarea
                  className={styles.textarea}
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us what you're looking for, your budget, preferred model — anything helps..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className={styles.submitBtn} type="submit">
                <span>Send Message</span>
                <svg className={styles.submitArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

            </form>
          )}
        </div>

        {/* decorative rev counter graphic */}
        <div className={styles.revGraphic} aria-hidden="true">
          <div className={styles.revRing} />
          <div className={styles.revRing} />
          <div className={styles.revRing} />
          <span className={styles.revText}>RPM</span>
        </div>
      </section>

      {/* ── Map placeholder ── */}
      <section className={styles.mapSection}>
        <div className={styles.mapLabel}>
          <span className={styles.mapTag}>— Our Location</span>
          <h3 className={styles.mapTitle}>Come See Us In Person</h3>
        </div>
        <div className={styles.mapPlaceholder}>
          {/* Replace with <iframe> from Google Maps */}
          <div className={styles.mapInner}>
            <span className={styles.mapPin}>📍</span>
            <p>Baneshwor, Kathmandu</p>
            <small>Embed your Google Maps iframe here</small>
          </div>
        </div>
      </section>

    </main>
  );
}