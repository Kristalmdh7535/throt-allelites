// components/BikeDetailModal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './BikeDetailModal.module.css';
import { Product } from '@/interfaces/Product';

interface BikeDetailModalProps {
  bike: Product;
  onClose: () => void;
}

export default function BikeDetailModal({ bike, onClose }: BikeDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Block body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  const primaryImage = bike.images?.find(img => img.primary)?.imageUrl 
                    || bike.images?.[0]?.imageUrl;
  const imageSrc = primaryImage 
    ? `${BACKEND_URL}${primaryImage.startsWith('/') ? '' : '/'}${primaryImage}`
    : '/images/placeholder-bike.jpg';

  return createPortal(
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.modalTitle}>
              {bike.brand} {bike.name}
            </h2>
            <span className={styles.modalSubtitle}>{bike.type}</span>
          </div>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Left column - Image & Price */}
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
                {bike.stock > 0 
                  ? `In Stock (${bike.stock} available)` 
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Right column - All specifications */}
          <div className={styles.rightColumn}>
            <div className={styles.specSection}>
              <h3 className={styles.sectionTitle}>Engine & Performance</h3>
              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Engine Capacity</span>
                  <span>{bike.engineCapacityCc} cc</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Engine Type</span>
                  <span>{bike.engineType || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Max Power</span>
                  <span>{bike.maxPower || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Max Torque</span>
                  <span>{bike.maxTorque || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Mileage</span>
                  <span>{bike.mileageKmpl || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Top Speed</span>
                  <span>{bike.topSpeedKmph || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className={styles.specSection}>
              <h3 className={styles.sectionTitle}>Dimensions & Build</h3>
              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Dimension (L×W×H)</span>
                  <span>{bike.dimensionMmLWH || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Seat Height</span>
                  <span>{bike.seatHeightMm || 'N/A'} mm</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Ground Clearance</span>
                  <span>{bike.groundClearanceMm || 'N/A'} mm</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Kerb Weight</span>
                  <span>{bike.kerbWeightKg || 'N/A'} kg</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Fuel Tank Capacity</span>
                  <span>{bike.fuelTankCapacityL || 'N/A'} L</span>
                </div>
              </div>
            </div>

            <div className={styles.specSection}>
              <h3 className={styles.sectionTitle}>Transmission & Brakes</h3>
              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Gearbox</span>
                  <span>{bike.gearbox || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Clutch Type</span>
                  <span>{bike.clutchType || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Front Brake</span>
                  <span>{bike.frontBrake || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Rear Brake</span>
                  <span>{bike.rearBrake || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className={styles.specSection}>
              <h3 className={styles.sectionTitle}>Suspension & Tyres</h3>
              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Front Suspension</span>
                  <span>{bike.frontSuspension || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Rear Suspension</span>
                  <span>{bike.rearSuspension || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Front Tyre</span>
                  <span>{bike.frontTyre || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Rear Tyre</span>
                  <span>{bike.rearTyre || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Tyre Type</span>
                  <span>{bike.tyreType || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}