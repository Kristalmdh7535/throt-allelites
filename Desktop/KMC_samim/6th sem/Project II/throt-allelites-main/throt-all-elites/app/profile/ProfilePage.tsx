'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(auth)/contexts/AuthContext';
import { api } from '@/lib/api';
import styles from './Profile.module.css';

type Tab = 'account' | 'rides';
type RideStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';

interface TestRideRequest {
  id: number;
  bikeName: string;
  bikeBrand: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: RideStatus;
  declineReason: string | null;
  createdAt: string;
}

const STATUS_META: Record<RideStatus, { label: string; emoji: string; cls: string }> = {
  PENDING:   { label: 'Pending Review', emoji: '⏳', cls: 'pending'   },
  CONFIRMED: { label: 'Confirmed',      emoji: '✅', cls: 'confirmed' },
  DECLINED:  { label: 'Declined',       emoji: '❌', cls: 'declined'  },
};

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [rides, setRides]         = useState<TestRideRequest[]>([]);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [ridesError, setRidesError]     = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent('/profile')}`);
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (activeTab !== 'rides' || !token) return;
    fetchRides();
  }, [activeTab]);

  const fetchRides = async () => {
    setRidesLoading(true);
    setRidesError(null);
    try {
      const res = await fetch(`${api.testRides}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load your ride requests');
      setRides(await res.json());
    } catch (err) {
      setRidesError((err as Error).message);
    } finally {
      setRidesLoading(false);
    }
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
  const fmtTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  if (isLoading || !isAuthenticated || !user) return null;

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={styles.page}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.avatarInfo}>
            <span className={styles.avatarName}>{user.name}</span>
            <span className={styles.avatarRole}>{user.role === 'ADMIN' ? 'Administrator' : 'Member'}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeTab === 'account' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <span className={styles.navIcon}>👤</span>
            Account Details
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'rides' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('rides')}
          >
            <span className={styles.navIcon}>🏍️</span>
            My Test Rides
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          {user.role === 'ADMIN' && (
            <button className={styles.dashboardBtn} onClick={() => router.push('/dashboard')}>
              ⚙️ Admin Dashboard
            </button>
          )}
          <button className={styles.logoutBtn} onClick={logout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* ══ ACCOUNT TAB ══ */}
        {activeTab === 'account' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h1 className={styles.tabTitle}>Account Details</h1>
              <p className={styles.tabSub}>Your profile information as registered with Throt-All Elites.</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardSection}>
                <h2 className={styles.cardSectionTitle}>Personal Information</h2>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Full Name</span>
                    <span className={styles.fieldValue}>{user.name}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Email Address</span>
                    <span className={styles.fieldValue}>{user.email}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Account Type</span>
                    <span className={styles.fieldValue}>
                      <span className={user.role === 'ADMIN' ? styles.roleAdmin : styles.roleUser}>
                        {user.role === 'ADMIN' ? 'Administrator' : 'Standard Member'}
                      </span>
                    </span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>User ID</span>
                    <span className={styles.fieldValue} style={{ color: '#9ca3af' }}>#{user.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ TEST RIDES TAB ══ */}
        {activeTab === 'rides' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h1 className={styles.tabTitle}>My Test Rides</h1>
              <p className={styles.tabSub}>Track the status of all your test ride booking requests.</p>
            </div>

            {ridesLoading ? (
              <div className={styles.stateBox}><div className={styles.spinner} /></div>
            ) : ridesError ? (
              <div className={styles.stateBox}>
                <span className={styles.stateIcon}>⚠️</span>
                <p className={styles.stateText}>{ridesError}</p>
                <button className={styles.retryBtn} onClick={fetchRides}>Try Again</button>
              </div>
            ) : rides.length === 0 ? (
              <div className={styles.stateBox}>
                <span className={styles.stateIcon}>🏍️</span>
                <p className={styles.stateTitle}>No bookings yet</p>
                <p className={styles.stateText}>
                  Browse our bike collection and click "Book Test Ride" on any bike to get started.
                </p>
                <button className={styles.browseBikesBtn} onClick={() => router.push('/bikes')}>
                  Browse Bikes →
                </button>
              </div>
            ) : (
              <div className={styles.ridesList}>
                {rides.map(ride => {
                  const meta = STATUS_META[ride.status];
                  return (
                    <div key={ride.id} className={`${styles.rideCard} ${styles[`ride${ride.status}`]}`}>
                      <div className={styles.rideCardTop}>
                        <div className={styles.rideBikeInfo}>
                          <span className={styles.rideBrand}>{ride.bikeBrand}</span>
                          <span className={styles.rideName}>{ride.bikeName}</span>
                        </div>
                        <span className={`${styles.rideBadge} ${styles[`badge${ride.status}`]}`}>
                          {meta.emoji} {meta.label}
                        </span>
                      </div>

                      <div className={styles.rideDetails}>
                        <div className={styles.rideDetail}>
                          <span className={styles.rideDetailLabel}>📅 Preferred Date</span>
                          <span className={styles.rideDetailValue}>{fmtDate(ride.preferredDate)}</span>
                        </div>
                        <div className={styles.rideDetail}>
                          <span className={styles.rideDetailLabel}>🕐 Preferred Time</span>
                          <span className={styles.rideDetailValue}>{fmtTime(ride.preferredTime)}</span>
                        </div>
                        <div className={styles.rideDetail}>
                          <span className={styles.rideDetailLabel}>📞 Contact</span>
                          <span className={styles.rideDetailValue}>{ride.phone}</span>
                        </div>
                        <div className={styles.rideDetail}>
                          <span className={styles.rideDetailLabel}>📋 Requested On</span>
                          <span className={styles.rideDetailValue}>{fmtDate(ride.createdAt)}</span>
                        </div>
                      </div>

                      {ride.notes && (
                        <div className={styles.rideNotes}>
                          <span className={styles.rideNotesLabel}>Your notes:</span>
                          <span className={styles.rideNotesText}>{ride.notes}</span>
                        </div>
                      )}

                      {ride.status === 'CONFIRMED' && (
                        <div className={styles.rideAlert} style={{ background: '#f0fdf4', borderColor: '#86efac' }}>
                          <strong style={{ color: '#15803d' }}>✅ Confirmed!</strong>
                          <span style={{ color: '#166534' }}>
                            {' '}Please bring your driving licence on <strong>{fmtDate(ride.preferredDate)}</strong> at <strong>{fmtTime(ride.preferredTime)}</strong>.
                            We're at Tindobato, Banepa.
                          </span>
                        </div>
                      )}

                      {ride.status === 'DECLINED' && ride.declineReason && (
                        <div className={styles.rideAlert} style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
                          <strong style={{ color: '#b91c1c' }}>Reason: </strong>
                          <span style={{ color: '#7f1d1d' }}>{ride.declineReason}</span>
                        </div>
                      )}

                      {ride.status === 'DECLINED' && (
                        <button
                          className={styles.reBookBtn}
                          onClick={() => router.push('/bikes')}
                        >
                          Browse Bikes & Book Again →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}