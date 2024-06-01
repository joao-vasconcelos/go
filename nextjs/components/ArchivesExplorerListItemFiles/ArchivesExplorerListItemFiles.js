'use client';

/* * */

import ArchivesExplorerListItemFilesApex from '@/components/ArchivesExplorerListItemFilesApex/ArchivesExplorerListItemFilesApex';
import ArchivesExplorerListItemFilesOffer from '@/components/ArchivesExplorerListItemFilesOffer/ArchivesExplorerListItemFilesOffer';
import ArchivesExplorerListItemFilesOperation from '@/components/ArchivesExplorerListItemFilesOperation/ArchivesExplorerListItemFilesOperation';
import ArchivesExplorerListItemFilesReference from '@/components/ArchivesExplorerListItemFilesReference/ArchivesExplorerListItemFilesReference';

import styles from './ArchivesExplorerListItemFiles.module.css';

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
