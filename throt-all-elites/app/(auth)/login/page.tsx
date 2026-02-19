'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../(auth)/contexts/AuthContext';
import styles from '../Auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.text();

      if (res.ok) {
        setMessage(data || 'OTP sent to your email!');
        setStep('otp');
      } else {
        setError(data || 'Failed to send OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Invalid or expired OTP');
      }

      const data = await res.json();

      if (!data.token) {
        throw new Error('No token received from server');
      }

      login(data.token, {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      setMessage('Login successful!');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className={styles.form}>
          <div>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>

          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className={styles.form}>
          <div>
            <label className={styles.label}>OTP</label>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={styles.input}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('email');
              setOtp('');
            }}
            className={styles.button}
            style={{ marginTop: '10px', background: 'gray' }}
          >
            Back to Email
          </button>

          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}

      <p className={styles.linkText}>
        Don't have an account?{' '}
        <Link href="/signup" className={styles.link}>
          Sign Up
        </Link>
      </p>
    </>
  );
}