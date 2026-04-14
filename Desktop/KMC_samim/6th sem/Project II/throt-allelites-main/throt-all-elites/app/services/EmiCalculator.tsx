'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/interfaces/Product';
import styles from './Services.module.css';

export default function EmiCalculator() {
  const [bikeId, setBikeId]                     = useState<number | ''>('');
  const [downPaymentPercent, setDownPayment]    = useState(20);
  const [tenureMonths, setTenure]               = useState(36);
  const [interestRate, setInterestRate]         = useState(11.5);
  const [bikes, setBikes]                       = useState<Product[]>([]);
  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/products?size=1000')
      .then(r => r.json())
      .then(d => setBikes(d.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedBike  = bikes.find(b => b.id === bikeId);
  const price         = selectedBike?.price ?? 0;
  const downPayment   = price * (downPaymentPercent / 100);
  const loanAmount    = price - downPayment;
  const monthlyRate   = interestRate / 100 / 12;
  const emi = loanAmount > 0 && monthlyRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))
      / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    : 0;
  const totalPayable  = emi * tenureMonths;
  const totalInterest = totalPayable - loanAmount;

  const waText = selectedBike
    ? `Hi Throt-All Elites! I want EMI details for ${selectedBike.name} (Rs. ${price.toLocaleString()}). Down payment ${downPaymentPercent}%, ${tenureMonths} months tenure.`
    : '';

  return (
    <section className={styles.band}>
      <div className={styles.bandInner}>

        {/* LEFT — meta */}
        <div className={styles.bandMeta}>
          <span className={styles.sectionNum}>02</span>
          <span className={styles.bandLabel}>— Finance Planning</span>
          <h2 className={styles.bandTitle}>
            EMI<br /><em>Calculator</em>
          </h2>
          <p className={styles.bandDesc}>
            Punch in your down payment, tenure, and interest rate to instantly
            see your monthly outgo. Final terms depend on bank approval.
          </p>
          <div className={styles.statPill}>
            <span className={styles.statNum}>11.5%</span>
            <span className={styles.statLabel}>avg. interest rate p.a.</span>
          </div>
        </div>

        {/* RIGHT — widget */}
        <div className={styles.bandWidget}>
          {loading ? (
            <p className={styles.loading}>Loading bikes</p>
          ) : (
            <>
              <label className={styles.fieldLabel}>Select Bike</label>
              <select
                value={bikeId}
                onChange={e => setBikeId(Number(e.target.value) || '')}
                className={styles.select}
              >
                <option value="">Choose a bike to calculate</option>
                {bikes.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} – Rs. {b.price.toLocaleString()}
                  </option>
                ))}
              </select>

              {bikeId && (
                <>
                  <div className={styles.emiGrid}>
                    <div>
                      <label className={styles.fieldLabel}>Down Payment (%)</label>
                      <input
                        type="number" min="0" max="90"
                        value={downPaymentPercent}
                        onChange={e => setDownPayment(Number(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>Tenure (months)</label>
                      <input
                        type="number" min="12" max="60" step="12"
                        value={tenureMonths}
                        onChange={e => setTenure(Number(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>Interest Rate (% p.a.)</label>
                      <input
                        type="number" step="0.1"
                        value={interestRate}
                        onChange={e => setInterestRate(Number(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>Down Payment Amount</label>
                      <input
                        readOnly
                        value={`Rs. ${Math.round(downPayment).toLocaleString()}`}
                        className={styles.input}
                        style={{ opacity: 0.6, cursor: 'default' }}
                      />
                    </div>

                    {/* full-width result */}
                    <div className={styles.emiResultBig}>
                      <p className={styles.emiLabelText}>Monthly EMI</p>
                      <strong className={styles.emiAmount}>
                        Rs. {Math.round(emi).toLocaleString()}
                      </strong>
                      <div className={styles.emiSub}>
                        <div className={styles.emiSubItem}>
                          Loan Amount
                          <span>Rs. {Math.round(loanAmount).toLocaleString()}</span>
                        </div>
                        <div className={styles.emiSubItem}>
                          Total Payable
                          <span>Rs. {Math.round(totalPayable).toLocaleString()}</span>
                        </div>
                        <div className={styles.emiSubItem}>
                          Total Interest
                          <span>Rs. {Math.round(totalInterest).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/9779823141414?text=${encodeURIComponent(waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btn}
                  >
                    Get Personalized Quote →
                  </a>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}