'use client';

/* * */

import ArchivesExplorerListItemFilesOperation from '@/components/ArchivesExplorerListItemFilesOperation/ArchivesExplorerListItemFilesOperation';
import ArchivesExplorerListItemFilesReference from '@/components/ArchivesExplorerListItemFilesReference/ArchivesExplorerListItemFilesReference';

import styles from './ArchivesExplorerListItemFiles.module.css';

/* * */

export default function ArchivesExplorerListItemFiles() {
	return (
		<div className={styles.container}>
			<ArchivesExplorerListItemFilesOperation />
			<ArchivesExplorerListItemFilesReference />
		</div>
	);
}
