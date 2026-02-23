'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(auth)/contexts/AuthContext';
import { api } from '@/lib/api';
import styles from './Deliveries.module.css';

type DeliveryStatus = 'SCHEDULED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

interface Delivery {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bikeBrand: string;
  bikeName: string;
  chassisNumber: string | null;
  deliveryAddress: string;
  scheduledDate: string;
  assignedDriver: string | null;
  notes: string | null;
  status: DeliveryStatus;
  actualDeliveryDate: string | null;
  createdAt: string;
}

interface DeliveryForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bikeBrand: string;
  bikeName: string;
  chassisNumber: string;
  deliveryAddress: string;
  scheduledDate: string;
  assignedDriver: string;
  notes: string;
}

const EMPTY_FORM: DeliveryForm = {
  customerName: '', customerPhone: '', customerEmail: '',
  bikeBrand: '', bikeName: '', chassisNumber: '',
  deliveryAddress: '', scheduledDate: '', assignedDriver: '', notes: '',
};

const STATUS_META: Record<DeliveryStatus, { label: string; emoji: string }> = {
  SCHEDULED:        { label: 'Scheduled',        emoji: '📅' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',  emoji: '🚚' },
  DELIVERED:        { label: 'Delivered',         emoji: '✅' },
  CANCELLED:        { label: 'Cancelled',         emoji: '❌' },
};

const STATUS_FLOW: DeliveryStatus[] = ['SCHEDULED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const REDIRECT = encodeURIComponent('/dashboard/deliveries');

export default function DeliveriesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [deliveries, setDeliveries]       = useState<Delivery[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [filterStatus, setFilterStatus]   = useState<DeliveryStatus | 'ALL'>('ALL');

  const [modalOpen, setModalOpen]         = useState(false);
  const [modalMode, setModalMode]         = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget]       = useState<Delivery | null>(null);
  const [form, setForm]                   = useState<DeliveryForm>(EMPTY_FORM);
  const [formError, setFormError]         = useState('');
  const [submitting, setSubmitting]       = useState(false);

  const [statusTarget, setStatusTarget]   = useState<Delivery | null>(null);
  const [newStatus, setNewStatus]         = useState<DeliveryStatus>('SCHEDULED');
  const [statusNotes, setStatusNotes]     = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError]     = useState('');

  const [detail, setDetail]               = useState<Delivery | null>(null);

  const [deleteTarget, setDeleteTarget]   = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !token) { router.push(`/login?redirect=${REDIRECT}`); return; }
    if (user?.role !== 'ADMIN')     { router.push('/');                            return; }
    fetchDeliveries();
  }, [isLoading, isAuthenticated, user?.role]);

  const fetchDeliveries = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(api.deliveries, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401 || res.status === 403) { router.push(`/login?redirect=${REDIRECT}`); return; }
      if (!res.ok) throw new Error('Failed to fetch deliveries');
      setDeliveries(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setForm(EMPTY_FORM); setModalMode('create');
    setEditTarget(null); setFormError(''); setModalOpen(true);
  };

  const openEdit = (d: Delivery) => {
    setForm({
      customerName:    d.customerName,
      customerPhone:   d.customerPhone,
      customerEmail:   d.customerEmail,
      bikeBrand:       d.bikeBrand,
      bikeName:        d.bikeName,
      chassisNumber:   d.chassisNumber   ?? '',
      deliveryAddress: d.deliveryAddress,
      scheduledDate:   d.scheduledDate,
      assignedDriver:  d.assignedDriver  ?? '',
      notes:           d.notes           ?? '',
    });
    setModalMode('edit'); setEditTarget(d); setFormError(''); setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setFormError('');
    try {
      const isEdit = modalMode === 'edit' && editTarget;
      const url    = isEdit ? `${api.deliveries}/${editTarget!.id}` : api.deliveries;
      const method = isEdit ? 'PATCH' : 'POST';

      const body: Record<string, string> = { ...form };
      if (!body.chassisNumber)  delete body.chassisNumber;
      if (!body.assignedDriver) delete body.assignedDriver;
      if (!body.notes)          delete body.notes;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text() || `Failed (${res.status})`);
      const saved: Delivery = await res.json();

      if (isEdit) {
        setDeliveries(prev => prev.map(d => d.id === saved.id ? saved : d));
        if (detail?.id === saved.id) setDetail(saved);
      } else {
        setDeliveries(prev => [saved, ...prev]);
      }
      setModalOpen(false);
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const openStatusModal = (d: Delivery) => {
    setStatusTarget(d);
    setNewStatus(d.status);
    setStatusNotes('');
    setStatusError('');
  };

  const handleStatusUpdate = async () => {
    if (!statusTarget) return;
    setStatusLoading(true); setStatusError('');
    try {
      const res = await fetch(`${api.deliveries}/${statusTarget.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: newStatus,
          notes:  statusNotes || undefined,
          actualDeliveryDate: newStatus === 'DELIVERED' ? new Date().toISOString().split('T')[0] : undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated: Delivery = await res.json();
      setDeliveries(prev => prev.map(d => d.id === updated.id ? updated : d));
      if (detail?.id === updated.id) setDetail(updated);
      setStatusTarget(null);
    } catch (e) {
      setStatusError((e as Error).message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${api.deliveries}/${deleteTarget}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveries(prev => prev.filter(d => d.id !== deleteTarget));
      if (detail?.id === deleteTarget) setDetail(null);
      setDeleteTarget(null);
    } catch {
    }
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });

  const filtered = filterStatus === 'ALL'
    ? deliveries
    : deliveries.filter(d => d.status === filterStatus);

  const counts = {
    ALL:              deliveries.length,
    SCHEDULED:        deliveries.filter(d => d.status === 'SCHEDULED').length,
    OUT_FOR_DELIVERY: deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length,
    DELIVERED:        deliveries.filter(d => d.status === 'DELIVERED').length,
    CANCELLED:        deliveries.filter(d => d.status === 'CANCELLED').length,
  };

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <button className={styles.backBtn} onClick={() => router.push('/dashboard')}>← Dashboard</button>
          <div>
            <h1 className={styles.heading}>Deliveries</h1>
            <p className={styles.subheading}>Track and manage all bike delivery records.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={fetchDeliveries}>↻ Refresh</button>
          <button className={styles.createBtn} onClick={openCreate}>+ New Delivery</button>
        </div>
      </div>

      {/* ── Stat pills ── */}
      <div className={styles.stats}>
        {(['ALL', 'SCHEDULED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const).map(s => (
          <button
            key={s}
            className={`${styles.statPill} ${filterStatus === s ? styles.statPillActive : ''} ${s !== 'ALL' ? styles[`stat_${s}`] : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            <span className={styles.statNum}>{counts[s]}</span>
            <span className={styles.statLabel}>
              {s === 'ALL' ? 'All' : STATUS_META[s as DeliveryStatus].label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className={styles.stateBox}><div className={styles.spinner} /></div>
      ) : error ? (
        <div className={styles.stateBox}><p className={styles.errorText}>⚠️ {error}</p></div>
      ) : filtered.length === 0 ? (
        <div className={styles.stateBox}>
          <span className={styles.stateIcon}>🚚</span>
          <p className={styles.stateTitle}>No deliveries found</p>
          <p className={styles.stateText}>
            {filterStatus === 'ALL'
              ? 'Create your first delivery record using the "+ New Delivery" button above.'
              : `No ${STATUS_META[filterStatus as DeliveryStatus].label.toLowerCase()} deliveries.`}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Bike</th>
                <th>Address</th>
                <th>Scheduled</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className={styles.row} onClick={() => setDetail(d)}>
                  <td className={styles.idCell}>#{d.id}</td>
                  <td>
                    <div className={styles.customerCell}>
                      <span className={styles.customerName}>{d.customerName}</span>
                      <span className={styles.customerSub}>{d.customerPhone}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.bikeCell}>
                      <span className={styles.bikeName}>{d.bikeName}</span>
                      <span className={styles.bikeSub}>{d.bikeBrand}</span>
                    </div>
                  </td>
                  <td className={styles.addressCell}>{d.deliveryAddress}</td>
                  <td className={styles.dateCell}>{fmtDate(d.scheduledDate)}</td>
                  <td className={styles.driverCell}>{d.assignedDriver ?? <span className={styles.unassigned}>—</span>}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <span className={`${styles.badge} ${styles[`badge_${d.status}`]}`}>
                      {STATUS_META[d.status].emoji} {STATUS_META[d.status].label}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className={styles.actionBtns}>
                      <button className={styles.statusBtn} onClick={() => openStatusModal(d)}
                        disabled={d.status === 'DELIVERED' || d.status === 'CANCELLED'}>
                        Update
                      </button>
                      <button className={styles.editBtn} onClick={() => openEdit(d)}>Edit</button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteTarget(d.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══ DETAIL DRAWER ══ */}
      {detail && (
        <div className={styles.drawerOverlay} onClick={() => setDetail(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div>
                <h2 className={styles.drawerTitle}>Delivery #{detail.id}</h2>
                <span className={`${styles.badge} ${styles[`badge_${detail.status}`]}`}>
                  {STATUS_META[detail.status].emoji} {STATUS_META[detail.status].label}
                </span>
              </div>
              <button className={styles.drawerClose} onClick={() => setDetail(null)}>✕</button>
            </div>

            <div className={styles.drawerBody}>
              <DrawerSection title="Customer">
                <DrawerRow label="Name"  value={detail.customerName} />
                <DrawerRow label="Phone" value={detail.customerPhone} />
                <DrawerRow label="Email" value={detail.customerEmail} />
              </DrawerSection>

              <DrawerSection title="Bike">
                <DrawerRow label="Model"   value={`${detail.bikeBrand} ${detail.bikeName}`} />
                {detail.chassisNumber && <DrawerRow label="Chassis" value={detail.chassisNumber} />}
              </DrawerSection>

              <DrawerSection title="Delivery">
                <DrawerRow label="Address"   value={detail.deliveryAddress} />
                <DrawerRow label="Scheduled" value={fmtDate(detail.scheduledDate)} />
                {detail.assignedDriver && <DrawerRow label="Driver" value={detail.assignedDriver} />}
                {detail.actualDeliveryDate && (
                  <DrawerRow label="Delivered On" value={fmtDate(detail.actualDeliveryDate)} />
                )}
              </DrawerSection>

              {detail.notes && (
                <DrawerSection title="Notes">
                  <p className={styles.notesText}>{detail.notes}</p>
                </DrawerSection>
              )}

              <DrawerRow label="Created" value={fmtDate(detail.createdAt)} />
            </div>

            {detail.status !== 'DELIVERED' && detail.status !== 'CANCELLED' && (
              <div className={styles.drawerFooter}>
                <button className={styles.createBtn} style={{ flex: 1 }}
                  onClick={() => { openStatusModal(detail); }}>
                  Update Status
                </button>
                <button className={styles.editBtnLarge}
                  onClick={() => { openEdit(detail); setDetail(null); }}>
                  Edit Record
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ CREATE / EDIT MODAL ══ */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === 'create' ? '+ New Delivery Record' : `Edit Delivery #${editTarget?.id}`}
              </h2>
              <button className={styles.drawerClose} onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className={styles.modalForm}>
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Customer</legend>
                <div className={styles.formRow}>
                  <FormField label="Full Name *"     name="customerName"  value={form.customerName}  onChange={handleFormChange} required placeholder="Ram Shrestha" />
                  <FormField label="Phone *"         name="customerPhone" value={form.customerPhone} onChange={handleFormChange} required placeholder="98XXXXXXXX" />
                </div>
                <FormField label="Email *"           name="customerEmail" value={form.customerEmail} onChange={handleFormChange} required placeholder="customer@email.com" type="email" />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Bike</legend>
                <div className={styles.formRow}>
                  <FormField label="Brand *" name="bikeBrand" value={form.bikeBrand} onChange={handleFormChange} required placeholder="Ducati" />
                  <FormField label="Model *" name="bikeName"  value={form.bikeName}  onChange={handleFormChange} required placeholder="Panigale V4" />
                </div>
                <FormField label="Chassis / VIN" name="chassisNumber" value={form.chassisNumber} onChange={handleFormChange} placeholder="Optional" />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Delivery Details</legend>
                <FormField label="Delivery Address *" name="deliveryAddress" value={form.deliveryAddress} onChange={handleFormChange} required placeholder="Tinkune, Kathmandu" />
                <div className={styles.formRow}>
                  <FormField label="Scheduled Date *" name="scheduledDate" value={form.scheduledDate} onChange={handleFormChange} required type="date" />
                  <FormField label="Assigned Driver"  name="assignedDriver" value={form.assignedDriver} onChange={handleFormChange} placeholder="Optional" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Notes</label>
                  <textarea
                    name="notes" value={form.notes} onChange={handleFormChange}
                    className={styles.textarea} rows={3}
                    placeholder="Any special instructions for this delivery..."
                    maxLength={500}
                  />
                </div>
              </fieldset>

              {formError && <p className={styles.errorText}>⚠️ {formError}</p>}

              <div className={styles.modalActions}>
                <button type="submit" className={styles.createBtn} disabled={submitting}>
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Delivery' : 'Save Changes'}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => setModalOpen(false)} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ STATUS UPDATE MODAL ══ */}
      {statusTarget && (
        <div className={styles.modalOverlay} onClick={() => setStatusTarget(null)}>
          <div className={styles.modal} style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Update Status</h2>
            <p className={styles.modalDesc}>
              <strong>{statusTarget.customerName}</strong> — {statusTarget.bikeBrand} {statusTarget.bikeName}
            </p>

            <div className={styles.statusFlow}>
              {STATUS_FLOW.map(s => (
                <button
                  key={s}
                  className={`${styles.statusOption} ${newStatus === s ? styles.statusOptionActive : ''} ${styles[`statusOpt_${s}`]}`}
                  onClick={() => setNewStatus(s)}
                  type="button"
                >
                  {STATUS_META[s].emoji} {STATUS_META[s].label}
                </button>
              ))}
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
              <label className={styles.formLabel}>Note (optional)</label>
              <textarea
                className={styles.textarea} rows={2}
                placeholder="e.g. Customer was not available, rescheduled..."
                value={statusNotes}
                onChange={e => setStatusNotes(e.target.value)}
                maxLength={300}
              />
            </div>

            {statusError && <p className={styles.errorText}>⚠️ {statusError}</p>}

            <div className={styles.modalActions}>
              <button className={styles.createBtn} onClick={handleStatusUpdate} disabled={statusLoading}>
                {statusLoading ? 'Updating...' : 'Confirm Update'}
              </button>
              <button className={styles.cancelBtn} onClick={() => setStatusTarget(null)} disabled={statusLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM ══ */}
      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
            <p className={styles.confirmText}>
              Permanently delete delivery <strong>#{deleteTarget}</strong>? This cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.deleteConfirmBtn} onClick={handleDelete}>Yes, Delete</button>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>Cancel</button>
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

function FormField({
  label, name, value, onChange, required, placeholder, type = 'text'
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; placeholder?: string; type?: string;
}) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>{label}</label>
      <input
        className={styles.formInput} type={type}
        name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
      />
    </div>
  );
}