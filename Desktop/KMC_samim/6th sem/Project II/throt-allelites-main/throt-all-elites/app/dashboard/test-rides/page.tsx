'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(auth)/contexts/AuthContext';
import { api } from '@/lib/api';
import styles from './TestRides.module.css';

type Status = 'PENDING' | 'CONFIRMED' | 'DECLINED';

interface TestRideRequest {
  id: number;
  bikeId: number;
  bikeName: string;
  bikeBrand: string;
  userId: number;
  userName: string;
  userEmail: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: Status;
  declineReason: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<Status, string> = {
  PENDING:   'Pending',
  CONFIRMED: 'Confirmed',
  DECLINED:  'Declined',
};

const REDIRECT_PARAM = encodeURIComponent('/dashboard/test-rides');

export default function TestRidesAdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [requests, setRequests]           = useState<TestRideRequest[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [filterStatus, setFilterStatus]   = useState<Status | 'ALL'>('ALL');
  const [declineTarget, setDeclineTarget] = useState<TestRideRequest | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState('');
  const [detailItem, setDetailItem]       = useState<TestRideRequest | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !token) {
      router.push(`/login?redirect=${REDIRECT_PARAM}`);
      return;
    }

    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchRequests();
  }, [isLoading, isAuthenticated, user?.role]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(api.testRides, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('accessToken');
        router.push(`/login?redirect=${REDIRECT_PARAM}`);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch requests');
      setRequests(await res.json());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: number) => {
    setActionLoading(true);
    setActionError('');
    try {
      const res = await fetch(`${api.testRides}/${id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status: 'CONFIRMED' }),
      });
      if (!res.ok) throw new Error('Failed to confirm request');
      const updated: TestRideRequest = await res.json();
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      if (detailItem?.id === id) setDetailItem(updated);
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineSubmit = async () => {
    if (!declineTarget) return;
    if (!declineReason.trim()) { setActionError('Please provide a reason.'); return; }
    setActionLoading(true);
    setActionError('');
    try {
      const res = await fetch(`${api.testRides}/${declineTarget.id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status: 'DECLINED', declineReason: declineReason.trim() }),
      });
      if (!res.ok) throw new Error('Failed to decline request');
      const updated: TestRideRequest = await res.json();
      setRequests(prev => prev.map(r => r.id === declineTarget.id ? updated : r));
      if (detailItem?.id === declineTarget.id) setDetailItem(updated);
      setDeclineTarget(null);
      setDeclineReason('');
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = filterStatus === 'ALL' ? requests : requests.filter(r => r.status === filterStatus);
  const counts   = {
    ALL:       requests.length,
    PENDING:   requests.filter(r => r.status === 'PENDING').length,
    CONFIRMED: requests.filter(r => r.status === 'CONFIRMED').length,
    DECLINED:  requests.filter(r => r.status === 'DECLINED').length,
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
  const fmtTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  if (isLoading) return null;
  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <button className={styles.backBtn} onClick={() => router.push('/dashboard')}>← Dashboard</button>
          <div>
            <h1 className={styles.heading}>Test Ride Requests</h1>
            <p className={styles.subheading}>Review, confirm or decline customer test ride bookings.</p>
          </div>
        </div>
        <button className={styles.refreshBtn} onClick={fetchRequests}>↻ Refresh</button>
      </div>

      {/* Stat pills */}
      <div className={styles.stats}>
        {(['ALL', 'PENDING', 'CONFIRMED', 'DECLINED'] as const).map(s => (
          <button
            key={s}
            className={`${styles.statPill} ${filterStatus === s ? styles.statPillActive : ''} ${s !== 'ALL' ? styles[`stat${s}`] : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            <span className={styles.statNum}>{counts[s]}</span>
            <span className={styles.statLabel}>{s === 'ALL' ? 'All Requests' : STATUS_LABELS[s]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.stateBox}><div className={styles.spinner} /></div>
      ) : error ? (
        <div className={styles.stateBox}><p className={styles.errorText}>⚠️ {error}</p></div>
      ) : filtered.length === 0 ? (
        <div className={styles.stateBox}>
          <p className={styles.emptyText}>No {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} requests found.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th><th>Customer</th><th>Bike</th><th>Preferred Slot</th>
                <th>Phone</th><th>Submitted</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id} className={styles.row} onClick={() => setDetailItem(req)}>
                  <td className={styles.idCell}>#{req.id}</td>
                  <td>
                    <div className={styles.customerCell}>
                      <span className={styles.customerName}>{req.userName}</span>
                      <span className={styles.customerEmail}>{req.userEmail}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.bikeCell}>
                      <span className={styles.bikeName}>{req.bikeName}</span>
                      <span className={styles.bikeBrand}>{req.bikeBrand}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.slotCell}>
                      <span>{fmtDate(req.preferredDate)}</span>
                      <span className={styles.slotTime}>{fmtTime(req.preferredTime)}</span>
                    </div>
                  </td>
                  <td>{req.phone}</td>
                  <td className={styles.dateCell}>{fmtDate(req.createdAt)}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <span className={`${styles.badge} ${styles[`badge${req.status}`]}`}>
                      {STATUS_LABELS[req.status]}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    {req.status === 'PENDING' ? (
                      <div className={styles.actionBtns}>
                        <button className={styles.confirmBtn} onClick={() => handleConfirm(req.id)} disabled={actionLoading}>Confirm</button>
                        <button className={styles.declineBtn} onClick={() => { setDeclineTarget(req); setActionError(''); }} disabled={actionLoading}>Decline</button>
                      </div>
                    ) : (
                      <span className={styles.resolvedText}>Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {detailItem && (
        <div className={styles.drawerOverlay} onClick={() => setDetailItem(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div>
                <h2 className={styles.drawerTitle}>Request #{detailItem.id}</h2>
                <span className={`${styles.badge} ${styles[`badge${detailItem.status}`]}`}>
                  {STATUS_LABELS[detailItem.status]}
                </span>
              </div>
              <button className={styles.drawerClose} onClick={() => setDetailItem(null)}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <DrawerSection title="Customer">
                <DrawerRow label="Name"  value={detailItem.userName} />
                <DrawerRow label="Email" value={detailItem.userEmail} />
                <DrawerRow label="Phone" value={detailItem.phone} />
              </DrawerSection>
              <DrawerSection title="Bike">
                <DrawerRow label="Model"   value={`${detailItem.bikeBrand} ${detailItem.bikeName}`} />
                <DrawerRow label="Bike ID" value={String(detailItem.bikeId)} />
              </DrawerSection>
              <DrawerSection title="Preferred Slot">
                <DrawerRow label="Date" value={fmtDate(detailItem.preferredDate)} />
                <DrawerRow label="Time" value={fmtTime(detailItem.preferredTime)} />
              </DrawerSection>
              {detailItem.notes && (
                <DrawerSection title="Notes from Customer">
                  <p className={styles.notesText}>{detailItem.notes}</p>
                </DrawerSection>
              )}
              {detailItem.status === 'DECLINED' && detailItem.declineReason && (
                <DrawerSection title="Decline Reason">
                  <p className={styles.declineReasonText}>{detailItem.declineReason}</p>
                </DrawerSection>
              )}
              <DrawerRow label="Submitted" value={fmtDate(detailItem.createdAt)} />
            </div>
            {detailItem.status === 'PENDING' && (
              <div className={styles.drawerFooter}>
                <button className={styles.confirmBtn} style={{ flex: 1 }} onClick={() => handleConfirm(detailItem.id)} disabled={actionLoading}>
                  {actionLoading ? '...' : '✓ Confirm'}
                </button>
                <button className={styles.declineBtn} style={{ flex: 1 }} onClick={() => { setDeclineTarget(detailItem); setActionError(''); }} disabled={actionLoading}>
                  ✕ Decline
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decline modal */}
      {declineTarget && (
        <div className={styles.modalOverlay} onClick={() => { setDeclineTarget(null); setDeclineReason(''); }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Decline Request #{declineTarget.id}</h2>
            <p className={styles.modalDesc}>
              Declining for <strong>{declineTarget.userName}</strong> —{' '}
              <strong>{declineTarget.bikeBrand} {declineTarget.bikeName}</strong>.
              This reason will be emailed to the customer.
            </p>
            <label className={styles.formLabel}>Reason <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea
              className={styles.modalTextarea}
              rows={4}
              placeholder="e.g. The requested slot is fully booked. Please contact us to reschedule."
              value={declineReason}
              onChange={e => setDeclineReason(e.target.value)}
              maxLength={500}
            />
            <span className={styles.charCount}>{declineReason.length}/500</span>
            {actionError && <p className={styles.errorText}>⚠️ {actionError}</p>}
            <div className={styles.modalActions}>
              <button className={styles.declineBtn} onClick={handleDeclineSubmit} disabled={actionLoading}>
                {actionLoading ? 'Sending...' : 'Send Decline & Email User'}
              </button>
              <button className={styles.cancelBtn} onClick={() => { setDeclineTarget(null); setDeclineReason(''); setActionError(''); }} disabled={actionLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.drawerSection}>
      <h3 className={styles.drawerSectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function DrawerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.drawerRow}>
      <span className={styles.drawerRowLabel}>{label}</span>
      <span className={styles.drawerRowValue}>{value}</span>
    </div>
  );
}