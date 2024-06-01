'use client';

/* * */

import styles from './ArchivesExplorerListItemFilesWrapper.module.css';

/* * */

export default function ArchivesExplorerListItemFilesWrapper({ children, title }) {
	return (
		<div className={styles.container}>
			<p className={styles.title}>{title}</p>
			{children}
		</div>
	);
}
