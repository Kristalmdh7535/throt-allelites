'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import styles from './RecommendationStrip.module.css';

interface RecommendationDto {
  id: number;
  name: string;
  brand: string;
  type: string;
  price: number;
  engineCapacityCc: number;
  primaryImageUrl: string | null;
  score: number;
  scoreLabel: string;
}

interface RecommendationStripProps {
  type: 'most-viewed' | 'most-requested';
  title: string;
  subtitle?: string;
  limit?: number;
  excludeId?: number;           
  onBikeClick?: (id: number) => void; 
  compact?: boolean;            
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export default function RecommendationStrip({
  type,
  title,
  subtitle,
  limit = 6,
  excludeId,
  onBikeClick,
  compact = false,
}: RecommendationStripProps) {
  const [items, setItems]     = useState<RecommendationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (excludeId) params.set('excludeId', String(excludeId));

    fetch(`${api.recommendations}/${type}?${params}`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [type, limit, excludeId]);

  if (!loading && items.length === 0) return null;

  return (
    <section className={`${styles.strip} ${compact ? styles.stripCompact : ''}`}>
      <div className={styles.stripHeader}>
        <div>
          <h3 className={styles.stripTitle}>{title}</h3>
          {subtitle && <p className={styles.stripSubtitle}>{subtitle}</p>}
        </div>
      </div>

      <div className={styles.scroll}>
        {loading
          ? Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeleton} ${compact ? styles.cardCompact : ''}`} />
            ))
          : items.map(bike => (
              <button
                key={bike.id}
                className={`${styles.card} ${compact ? styles.cardCompact : ''}`}
                onClick={() => onBikeClick?.(bike.id)}
                tabIndex={0}
              >
                <div className={styles.imgWrap}>
                  <img
                    src={
                      bike.primaryImageUrl
                        ? `${BACKEND_URL}${bike.primaryImageUrl.startsWith('/') ? '' : '/'}${bike.primaryImageUrl}`
                        : '/images/placeholder-bike.jpg'
                    }
                    alt={`${bike.brand} ${bike.name}`}
                    className={styles.img}
                    onError={e => (e.currentTarget.src = '/images/placeholder-bike.jpg')}
                  />
                  <span className={styles.typePill}>{bike.type}</span>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.cardBrand}>{bike.brand}</span>
                  <span className={styles.cardName}>{bike.name}</span>
                  <span className={styles.cardPrice}>Rs. {bike.price.toLocaleString()}</span>
                  <span className={styles.cardScore}>
                    {type === 'most-viewed' ? '👁' : '🏍️'} {bike.score} {bike.scoreLabel}
                  </span>
                </div>
              </button>
            ))}
      </div>
    </section>
  );
}