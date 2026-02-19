'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../(auth)/contexts/AuthContext';
import styles from '../Auth.module.css';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const { login } = useAuth();
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email not found.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Invalid OTP');
      }

      const data = await res.json();

      login(data.token, {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch('http://localhost:8080/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      alert('OTP resent!');
    } catch {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card} style={{ maxWidth: '400px' }}>
      <h1 className={styles.heading}>Verify OTP</h1>
      <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
        We sent a 6-digit code to <strong>{email}</strong>
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>Enter OTP</label>
          <input
            type="text"
            required
            maxLength={6}
            className={styles.input}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            disabled={loading}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify & Login'}
        </button>
      </form>

      <p className={styles.linkText}>
        Didn't receive code?{' '}
        <button
          onClick={resendOtp}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#0070f3',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
}