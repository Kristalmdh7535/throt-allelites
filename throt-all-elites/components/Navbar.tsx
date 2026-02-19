'use client';

import Link from 'next/link';
import { useAuth } from '../app/(auth)/contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

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
          <Link href="/services" className={styles.navLink}>Services</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>

          {isAuthenticated ? (
            <div className={styles.userSection}>
              <div className={styles.avatar}>
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className={styles.userName}>
                {user?.name} <small>({user?.role})</small>
              </span>
              <button onClick={logout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.navLink}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}