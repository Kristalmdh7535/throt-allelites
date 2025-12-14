import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h3 className={styles.title}>Throt-All Elites</h3>
        <p className={styles.contactInfo}>Contact us: kristalmdhr7535@gmail.com | +977 9823141414</p>
        <div className={styles.socialLinks}>
          <a href="#" className={styles.socialLink}>Facebook</a>
          <a href="#" className={styles.socialLink}>Instagram</a>
          <a href="#" className={styles.socialLink}>Twitter</a>
        </div>
        <p className={styles.copyRight}>&copy; 2025 Throt-All Elites. All rights reserved.</p>
      </div>
    </footer>
  );
}