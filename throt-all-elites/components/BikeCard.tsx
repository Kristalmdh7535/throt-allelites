import styles from './BikeCard.module.css'; 
import { Bike } from '../interfaces/Bike';

interface BikeCardProps {
  bike: Bike;
}

export default function BikeCard({ bike }: BikeCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.typeBadge}>{bike.type}</div>
      
      <div className={styles.imageContainer}>
        <img 
          src={bike.imageUrl} 
          alt={bike.name} 
          className={styles.image} 
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{bike.name}</h3>
        <p className={styles.brand}>{bike.brand}</p>
        <p className={styles.price}>${bike.price.toLocaleString()}</p>
      </div>
    </div>
  );
}