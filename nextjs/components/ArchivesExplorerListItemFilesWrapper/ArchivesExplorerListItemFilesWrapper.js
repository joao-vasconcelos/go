'use client';

/* * */

import styles from './ArchivesExplorerListItemFilesWrapper.module.css';

/* * */

export default function ArchivesExplorerListItemFilesWrapper({ title, children }) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>
      {children}
    </div>
  );
}
