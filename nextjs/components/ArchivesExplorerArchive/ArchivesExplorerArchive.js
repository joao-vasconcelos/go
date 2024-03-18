'use client';

/* * */

import { useArchivesExplorerContext } from '@/contexts/ArchivesExplorerContext';
import styles from './ArchivesExplorerArchive.module.css';

/* * */

export default function ArchivesExplorerArchive() {
  //

  //
  // A. Setup variables

  const archivesExplorerContext = useArchivesExplorerContext();

  //
  // B. Render components

  return <div className={styles.container}></div>;

  //
}
