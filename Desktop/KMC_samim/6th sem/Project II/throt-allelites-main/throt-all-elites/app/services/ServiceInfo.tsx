//app/services/ServiceInfo.tsx
import Link from 'next/link';
import styles from '@/app/services/Services.module.css';

interface ServiceInfoProps {
  title: string;
  description: string;
  icon: string;
  ctaText: string;
  ctaLink?: string;
  isCalculator?: boolean;
}

export default function ServiceInfo({
  title,
  description,
  icon,
  ctaText,
  ctaLink,
  isCalculator = false,
}: ServiceInfoProps) {
  return (
    <div className={styles.serviceCard}>
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}</p>

      {ctaLink ? (
        <Link href={ctaLink} target="_blank" className={styles.cardBtn}>
          {ctaText}
        </Link>
      ) : (
        <button className={styles.cardBtn}>{ctaText}</button>
      )}
    </div>
  );
}