'use client';

/* * */

import styles from './UsersExplorerUserSimple.module.css';

/* * */

export default function UsersExplorerUserSimple({ userData }) {
  return <div className={styles.container}>{userData.name}</div>;
}
