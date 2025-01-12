// components/Layout/Header.js
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getToken, removeToken } from '../../utils/auth';
import styles from './Header.module.css';
import { FiHome, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    setAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">MyBlog</Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/">
          <span className={styles.navItem}>
            <FiHome className={styles.icon} /> Home
          </span>
        </Link>
        {authenticated ? (
          <>
            <Link href="/dashboard">
              <span className={styles.navItem}>
                <FiUser className={styles.icon} /> Dashboard
              </span>
            </Link>
            <Link href="/profile">
              <span className={styles.navItem}>
                <FiUser className={styles.icon} /> Profile
              </span>
            </Link>
            <button onClick={handleLogout} className={`${styles.navItem} ${styles.logout}`}>
              <FiLogOut className={styles.icon} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <span className={styles.navItem}>
                <FiLogIn className={styles.icon} /> Login
              </span>
            </Link>
            <Link href="/register">
              <span className={styles.navItem}>
                <FiUser className={styles.icon} /> Register
              </span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
