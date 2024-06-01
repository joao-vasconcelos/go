'use client';

/* * */

import { IconFileTypePdf } from '@tabler/icons-react';

import styles from './MediaExplorerMediaPreviewPdf.module.css';

/* * */

export default function MediaExplorerMediaPreviewPdf() {
	return (
		<div className={styles.container}>
			<IconFileTypePdf size={40} stroke={1.5} />
		</div>
	);
}
