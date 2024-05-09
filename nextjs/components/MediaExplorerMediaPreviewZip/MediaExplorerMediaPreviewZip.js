'use client';

/* * */

import styles from './MediaExplorerMediaPreviewZip.module.css';
import { IconFileTypeZip } from '@tabler/icons-react';

/* * */

export default function MediaExplorerMediaPreviewZip() {
	return (
		<div className={styles.container}>
			<IconFileTypeZip size={40} stroke={1.5} />
		</div>
	);
}