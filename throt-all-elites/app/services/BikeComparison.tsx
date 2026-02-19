'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/interfaces/Product';
import styles from './Services.module.css';

type SpecKey = keyof Product;

interface Spec {
  label: string;
  key: SpecKey;
  format?: (v: number) => string;
  higherIsBetter?: boolean;
}

const specs: Spec[] = [
  { label: 'Price',            key: 'price',             format: v => `Rs. ${v.toLocaleString()}`, higherIsBetter: false },
  { label: 'Engine (CC)',      key: 'engineCapacityCc',  higherIsBetter: true  },
  { label: 'Max Power',        key: 'maxPower' },
  { label: 'Max Torque',       key: 'maxTorque' },
  { label: 'Mileage (kmpl)',   key: 'mileageKmpl',       higherIsBetter: true  },
  { label: 'Kerb Weight (kg)', key: 'kerbWeightKg',      higherIsBetter: false },
  { label: 'Fuel Tank (L)',    key: 'fuelTankCapacityL', higherIsBetter: true  },
  { label: 'Seat Height (mm)', key: 'seatHeightMm' },
];

function getWinner(v1?: number, v2?: number, higherIsBetter?: boolean): 'b1' | 'b2' | null {
  if (v1 == null || v2 == null || v1 === v2 || higherIsBetter === undefined) return null;
  return higherIsBetter ? (v1 > v2 ? 'b1' : 'b2') : (v1 < v2 ? 'b1' : 'b2');
}

export default function BikeComparison() {
  const [bikes, setBikes] = useState<Product[]>([]);
  const [bike1Id, setBike1Id] = useState<number | ''>('');
  const [bike2Id, setBike2Id] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/products?size=1000')
      .then(r => { if (!r.ok) throw new Error('Failed to load bikes'); return r.json(); })
      .then(d => setBikes(d.content || []))
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const bike1 = bikes.find(b => b.id === bike1Id);
  const bike2 = bikes.find(b => b.id === bike2Id);

  return (
    <section className={styles.band}>
      <div className={styles.bandInner}>

        {/* LEFT — meta */}
        <div className={styles.bandMeta}>
          <span className={styles.sectionNum}>01</span>
          <span className={styles.bandLabel}>— Side by Side</span>
          <h2 className={styles.bandTitle}>
            Compare<br /><em>Bikes</em>
          </h2>
          <p className={styles.bandDesc}>
            Pick any two bikes from our inventory and see every spec laid out
            side by side. 🏆 marks the winner on each comparable metric.
          </p>
          <div className={styles.statPill}>
            <span className={styles.statNum}>{bikes.length || '—'}</span>
            <span className={styles.statLabel}>bikes in inventory</span>
          </div>
        </div>

        {/* RIGHT — widget */}
        <div className={styles.bandWidget}>
          {loading ? (
            <p className={styles.loading}>Loading bikes</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <>
              <div className={styles.selectors}>
                <div>
                  <label className={styles.fieldLabel}>Bike 1</label>
                  <select
                    value={bike1Id}
                    onChange={e => setBike1Id(Number(e.target.value) || '')}
                    className={styles.select}
                  >
                    <option value="">Select Bike 1</option>
                    {bikes.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.brand})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.fieldLabel}>Bike 2</label>
                  <select
                    value={bike2Id}
                    onChange={e => setBike2Id(Number(e.target.value) || '')}
                    className={styles.select}
                    disabled={!bike1Id}
                  >
                    <option value="">Select Bike 2</option>
                    {bikes.filter(b => b.id !== bike1Id).map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.brand})</option>
                    ))}
                  </select>
                </div>
              </div>

              {bike1 && bike2 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.specTable}>
                    <thead>
                      <tr>
                        <th>Spec</th>
                        <th>{bike1.name}</th>
                        <th>{bike2.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specs.map(spec => {
                        const v1 = bike1[spec.key] as number | undefined;
                        const v2 = bike2[spec.key] as number | undefined;
                        const winner = getWinner(v1, v2, spec.higherIsBetter);
                        const fmt = (v: unknown) =>
                          spec.format && typeof v === 'number' ? spec.format(v) : (v ?? '—');
                        return (
                          <tr key={spec.label}>
                            <td>{spec.label}</td>
                            <td className={winner === 'b1' ? styles.winner : ''}>
                              {winner === 'b1' ? '🏆 ' : ''}{fmt(v1)}
                            </td>
                            <td className={winner === 'b2' ? styles.winner : ''}>
                              {winner === 'b2' ? '🏆 ' : ''}{fmt(v2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.tableEmpty}>
                  Select two bikes above to see the comparison
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}