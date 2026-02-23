'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './BikeDetailModal.module.css';
import { Product } from '@/interfaces/Product';
import { useAuth } from '@/app/(auth)/contexts/AuthContext';
import { api } from '@/lib/api';

interface BikeDetailModalProps {
  bike: Product;
  onClose: () => void;
}

interface TestRideForm {
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

type ModalView = 'specs' | 'testride';
type BookingStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function BikeDetailModal({ bike, onClose }: BikeDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  const [view, setView] = useState<ModalView>('specs');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState<TestRideForm>({
    phone: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const primaryImage = bike.images?.find(img => img.primary)?.imageUrl || bike.images?.[0]?.imageUrl;
  const imageSrc = primaryImage
    ? `${BACKEND_URL}${primaryImage.startsWith('/') ? '' : '/'}${primaryImage}`
    : '/images/placeholder-bike.jpg';

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('submitting');
    setErrorMsg('');

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setBookingStatus('error');
      setErrorMsg('Session expired. Please log in again.');
      return;
    }

    try {
      const res = await fetch(api.testRides, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bikeId:        bike.id,
          bikeName:      bike.name,
          bikeBrand:     bike.brand,
          phone:         form.phone,
          preferredDate: form.preferredDate,
          preferredTime: form.preferredTime,
          notes:         form.notes,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
      setErrorMsg((err as Error).message || 'Something went wrong. Please try again.');
    }
  };

  const resetBooking = () => {
    setView('specs');
    setBookingStatus('idle');
    setErrorMsg('');
    setForm({ phone: '', preferredDate: '', preferredTime: '', notes: '' });
  };

  return createPortal(
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modalContainer}>

        {/* ── Header ── */}
        <div className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.modalTitle}>{bike.brand} {bike.name}</h2>
            <span className={styles.modalSubtitle}>{bike.type}</span>
          </div>

          <div className={styles.headerActions}>
            {/* Tab switcher */}
            <div className={styles.tabBar}>
              <button
                className={`${styles.tab} ${view === 'specs' ? styles.tabActive : ''}`}
                onClick={() => { setView('specs'); }}
              >
                Specifications
              </button>
              <button
                className={`${styles.tab} ${view === 'testride' ? styles.tabActive : ''}`}
                onClick={() => setView('testride')}
              >
                🏍️ Book Test Ride
              </button>
            </div>

            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ══ SPECS VIEW ══ */}
        {view === 'specs' && (
          <div className={styles.modalBody}>
            <div className={styles.leftColumn}>
              <div className={styles.imageWrapper}>
                <img
                  src={imageSrc}
                  alt={`${bike.brand} ${bike.name}`}
                  className={styles.modalImage}
                  onError={e => (e.currentTarget.src = '/images/placeholder-bike.jpg')}
                />
              </div>

              <div className={styles.priceBox}>
                <span className={styles.priceLabel}>Price</span>
                <span className={styles.priceValue}>Rs. {bike.price.toLocaleString()}</span>
              </div>

              <div className={styles.stockStatus}>
                <span className={bike.stock > 0 ? styles.stockIn : styles.stockOut}>
                  {bike.stock > 0 ? `In Stock (${bike.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Book CTA in left column */}
              {isAuthenticated ? (
                <button
                  className={styles.bookBtn}
                  onClick={() => setView('testride')}
                >
                  Book Test Ride
                </button>
              ) : (
                <div className={styles.loginPrompt}>
                  <span>🔒</span>
                  <p>
                    <strong>Want to test ride?</strong><br />
                    <a href="/login" className={styles.loginLink}>Log in</a> to book a test ride for this bike.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.rightColumn}>
              <SpecSection title="Engine & Performance">
                <SpecItem label="Engine Capacity" value={`${bike.engineCapacityCc} cc`} />
                <SpecItem label="Engine Type"     value={bike.engineType} />
                <SpecItem label="Max Power"        value={bike.maxPower} />
                <SpecItem label="Max Torque"       value={bike.maxTorque} />
                <SpecItem label="Mileage"          value={bike.mileageKmpl} />
                <SpecItem label="Top Speed"        value={bike.topSpeedKmph} />
              </SpecSection>

              <SpecSection title="Dimensions & Build">
                <SpecItem label="Dimension (L×W×H)"  value={bike.dimensionMmLWH} />
                <SpecItem label="Seat Height"         value={bike.seatHeightMm ? `${bike.seatHeightMm} mm` : undefined} />
                <SpecItem label="Ground Clearance"    value={bike.groundClearanceMm ? `${bike.groundClearanceMm} mm` : undefined} />
                <SpecItem label="Kerb Weight"         value={bike.kerbWeightKg ? `${bike.kerbWeightKg} kg` : undefined} />
                <SpecItem label="Fuel Tank Capacity"  value={bike.fuelTankCapacityL ? `${bike.fuelTankCapacityL} L` : undefined} />
              </SpecSection>

              <SpecSection title="Transmission & Brakes">
                <SpecItem label="Gearbox"    value={bike.gearbox} />
                <SpecItem label="Clutch Type" value={bike.clutchType} />
                <SpecItem label="Front Brake" value={bike.frontBrake} />
                <SpecItem label="Rear Brake"  value={bike.rearBrake} />
              </SpecSection>

              <SpecSection title="Suspension & Tyres">
                <SpecItem label="Front Suspension" value={bike.frontSuspension} />
                <SpecItem label="Rear Suspension"  value={bike.rearSuspension} />
                <SpecItem label="Front Tyre"       value={bike.frontTyre} />
                <SpecItem label="Rear Tyre"        value={bike.rearTyre} />
                <SpecItem label="Tyre Type"        value={bike.tyreType} />
              </SpecSection>
            </div>
          </div>
        )}

        {/* ══ TEST RIDE BOOKING VIEW ══ */}
        {view === 'testride' && (
          <div className={styles.bookingView}>

            {/* Not logged in guard */}
            {!isAuthenticated ? (
              <div className={styles.authGuard}>
                <span className={styles.authGuardIcon}>🔒</span>
                <h3>Login Required</h3>
                <p>You need to be logged in to book a test ride.</p>
                <a href="/login" className={styles.bookBtn} style={{ display: 'inline-block', textDecoration: 'none' }}>
                  Log In to Continue
                </a>
                <button className={styles.backLink} onClick={resetBooking}>
                  ← Back to specs
                </button>
              </div>
            ) : bookingStatus === 'success' ? (
              /* ── Success state ── */
              <div className={styles.successState}>
                <div className={styles.successIcon}>✅</div>
                <h3 className={styles.successTitle}>Request Submitted!</h3>
                <p className={styles.successDesc}>
                  Your test ride request for the <strong>{bike.brand} {bike.name}</strong> has been sent.
                  Our team will confirm your slot and send a confirmation email to <strong>{user?.email}</strong>.
                </p>
                <div className={styles.successActions}>
                  <button className={styles.bookBtn} onClick={resetBooking}>
                    Back to Specs
                  </button>
                  <button className={styles.backLink} onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* ── Booking form ── */
              <div className={styles.bookingLayout}>
                {/* Left: bike summary */}
                <div className={styles.bookingSummary}>
                  <div className={styles.imageWrapper} style={{ aspectRatio: '4/3' }}>
                    <img
                      src={imageSrc}
                      alt={bike.name}
                      className={styles.modalImage}
                      onError={e => (e.currentTarget.src = '/images/placeholder-bike.jpg')}
                    />
                  </div>
                  <div className={styles.bookingBikeInfo}>
                    <span className={styles.bookingBrand}>{bike.brand}</span>
                    <span className={styles.bookingModel}>{bike.name}</span>
                    <span className={styles.bookingPrice}>Rs. {bike.price.toLocaleString()}</span>
                  </div>
                  <div className={styles.bookingLocationCard}>
                    <span className={styles.bookingLocationLabel}>📍 Showroom Location</span>
                    <span className={styles.bookingLocationValue}>Tindobato, Banepa</span>
                    <span className={styles.bookingLocationValue}>Kavrepalanchok, Nepal</span>
                    <span className={styles.bookingHoursLabel}>⏰ Hours</span>
                    <span className={styles.bookingLocationValue}>Sun–Fri · 9:00 AM – 6:00 PM</span>
                  </div>
                </div>

                {/* Right: form */}
                <div className={styles.bookingForm}>
                  <div className={styles.bookingFormHeader}>
                    <h3 className={styles.bookingFormTitle}>Book Your Test Ride</h3>
                    <p className={styles.bookingFormSub}>
                      Fill in your details and preferred slot. We'll confirm within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className={styles.form}>
                    {/* Pre-filled user info (read-only) */}
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Your Name</label>
                        <input
                          className={`${styles.formInput} ${styles.formInputReadOnly}`}
                          value={user?.name || ''}
                          readOnly
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Your Email</label>
                        <input
                          className={`${styles.formInput} ${styles.formInputReadOnly}`}
                          value={user?.email || ''}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Contact Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.formInput}
                        name="phone"
                        type="tel"
                        placeholder="98XXXXXXXX"
                        value={form.phone}
                        onChange={handleFormChange}
                        required
                        pattern="[0-9+\-\s]{7,15}"
                        title="Please enter a valid phone number"
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          Preferred Date <span className={styles.required}>*</span>
                        </label>
                        <input
                          className={styles.formInput}
                          name="preferredDate"
                          type="date"
                          value={form.preferredDate}
                          onChange={handleFormChange}
                          min={minDateStr}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          Preferred Time <span className={styles.required}>*</span>
                        </label>
                        <input
                          className={styles.formInput}
                          name="preferredTime"
                          type="time"
                          value={form.preferredTime}
                          onChange={handleFormChange}
                          min="09:00"
                          max="17:30"
                          required
                        />
                        <span className={styles.formHint}>Between 9:00 AM and 5:30 PM</span>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Notes <span className={styles.optional}>(optional)</span></label>
                      <textarea
                        className={styles.formTextarea}
                        name="notes"
                        placeholder="Any specific questions, riding experience level, or requests for our team..."
                        value={form.notes}
                        onChange={handleFormChange}
                        rows={3}
                        maxLength={500}
                      />
                      <span className={styles.charCount}>{form.notes.length}/500</span>
                    </div>

                    {bookingStatus === 'error' && (
                      <div className={styles.errorBanner}>
                        ⚠️ {errorMsg}
                      </div>
                    )}

                    <div className={styles.formActions}>
                      <button
                        type="submit"
                        className={styles.bookBtn}
                        disabled={bookingStatus === 'submitting'}
                      >
                        {bookingStatus === 'submitting' ? 'Submitting...' : 'Submit Request →'}
                      </button>
                      <button type="button" className={styles.backLink} onClick={resetBooking}>
                        ← Back to specs
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}

function SpecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.specSection}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.specGrid}>{children}</div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className={styles.specItem}>
      <span className={styles.specLabel}>{label}</span>
      <span>{value ?? 'N/A'}</span>
    </div>
  );
}