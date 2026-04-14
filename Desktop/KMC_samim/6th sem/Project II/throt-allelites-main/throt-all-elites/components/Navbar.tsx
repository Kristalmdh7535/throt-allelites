'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../app/(auth)/contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        {/* ── Logo (original) ── */}
        <Link href="/" className={styles.logoLink}>
          <img
            src="/images/motorbike.jpg"
            alt="Throt-All Elites Logo"
            className={styles.logoImage}
          />
          <span className={styles.logoText}>Throt-All Elites</span>
        </Link>

        {/* ── Nav links (original) ── */}
        <div className={styles.navList}>
          <Link href="/"         className={styles.navLink}>Home</Link>
          <Link href="/bikes"    className={styles.navLink}>Bikes</Link>
          <Link href="/services" className={styles.navLink}>Services</Link>
          <Link href="/contact"  className={styles.navLink}>Contact</Link>
        </div>

        {/* ── Auth section ── */}
        <div className={styles.authSection}>
          {isLoading ? (
            <div className={styles.skeleton} aria-hidden="true" />
          ) : isAuthenticated && user ? (
            <div className={styles.userSection} ref={dropdownRef}>
              {/* Avatar button — opens dropdown */}
              <button
                className={styles.avatarBtn}
                onClick={() => setDropdownOpen(prev => !prev)}
                aria-label="Account menu"
                aria-expanded={dropdownOpen}
              >
                <div className={styles.avatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>
                  {user.name} <small>({user.role})</small>
                </span>
                <svg
                  className={`${styles.chevron} ${dropdownOpen ? styles.chevronUp : ''}`}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  {/* User info header */}
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>{initials}</div>
                    <div className={styles.dropdownUserInfo}>
                      <span className={styles.dropdownName}>{user.name}</span>
                      <span className={styles.dropdownEmail}>{user.email}</span>
                    </div>
                  </div>

                  <div className={styles.dropdownDivider} />

                  {/* All logged-in users */}
                  <Link
                    href="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className={styles.dropdownItemIcon}>👤</span>
                    My Profile
                  </Link>
                  <Link
                    href="/profile?tab=rides"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className={styles.dropdownItemIcon}>🏍️</span>
                    My Test Rides
                  </Link>

                  {/* Admin-only */}
                  {user.role === 'ADMIN' && (
                    <>
                      <div className={styles.dropdownDivider} />
                      <span className={styles.dropdownSectionLabel}>Admin</span>
                      <Link
                        href="/dashboard"
                        className={styles.dropdownItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className={styles.dropdownItemIcon}>⚙️</span>
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/test-rides"
                        className={styles.dropdownItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className={styles.dropdownItemIcon}>📋</span>
                        Test Ride Requests
                      </Link>
                    </>
                  )}

                  <div className={styles.dropdownDivider} />

                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                    onClick={() => { setDropdownOpen(false); logout(); }}
                  >
                    <span className={styles.dropdownItemIcon}>→</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.navLink}>Sign In</Link>
          )}
        </div>

      </div>
    </nav>
  );
}