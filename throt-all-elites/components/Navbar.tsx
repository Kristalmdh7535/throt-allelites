import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink}>
          <img
            src="/images/motorbike.jpg" 
            alt="Throt-All Elites Logo"
            className={styles.logoImage} 
          />
          <span className={styles.logoText}>Throt-All Elites</span> 
        </Link>
        <div className={styles.navList}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/bikes" className={styles.navLink}>Bikes</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
          <Link href="/signup" className={styles.navLink}>Sign Up/In</Link>
        </div>
      </div>
    </nav>
  );
}