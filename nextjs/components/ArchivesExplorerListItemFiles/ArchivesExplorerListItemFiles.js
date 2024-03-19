'use client';

/* * */

import styles from './ArchivesExplorerListItemFiles.module.css';
import ArchivesExplorerListItemFilesReference from '@/components/ArchivesExplorerListItemFilesReference/ArchivesExplorerListItemFilesReference';
import ArchivesExplorerListItemFilesOffer from '@/components/ArchivesExplorerListItemFilesOffer/ArchivesExplorerListItemFilesOffer';
import ArchivesExplorerListItemFilesOperation from '@/components/ArchivesExplorerListItemFilesOperation/ArchivesExplorerListItemFilesOperation';
import ArchivesExplorerListItemFilesApex from '@/components/ArchivesExplorerListItemFilesApex/ArchivesExplorerListItemFilesApex';

/* * */

export default function ArchivesExplorerListItemFiles() {
  return (
    <div className={styles.container}>
      <ArchivesExplorerListItemFilesReference />
      <ArchivesExplorerListItemFilesOffer />
      <ArchivesExplorerListItemFilesOperation />
      <ArchivesExplorerListItemFilesApex />
    </div>
  );
}
