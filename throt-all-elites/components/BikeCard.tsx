// components/BikeCard.tsx
import styles from './BikeCard.module.css';
import { Product } from '@/interfaces/Product';

const BACKEND_BASE = 'http://localhost:8080'; // later use env var

interface BikeCardProps {
  bike: Product;
}

export default function BikeCard({ bike }: BikeCardProps) {
  // Get primary or first image
  const imagePath = bike.images?.find(img => img.primary)?.imageUrl 
                 || bike.images?.[0]?.imageUrl;

  // ALWAYS prepend backend URL
  const src = imagePath ? `${BACKEND_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}` 
                       : '/images/placeholder-bike.jpg';

  

  return (
    <div className={styles.card}>
      <div className={styles.typeBadge}>{bike.type}</div>

      <div className={styles.imageContainer}>
        <img
          src={src}
          alt={`${bike.brand} ${bike.name}`}
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder-bike.jpg';
          }}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{bike.name}</h3>
        <p className={styles.brand}>{bike.brand}</p>
        <p className={styles.price}>Rs. {bike.price.toLocaleString()}</p>
      </div>
    </div>
  );
}