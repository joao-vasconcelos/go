'use client';

/* * */

// import { useTranslations } from 'next-intl';
import styles from './ArchivesExplorerListItemHeaderStatus.module.css';
import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { IconCircleCheckFilled, IconCircleDotted, IconHelpHexagon } from '@tabler/icons-react';

/* * */

export default function ArchivesExplorerListItemHeaderStatus() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('ArchivesExplorerListItemHeaderStatus');
	const archivesExplorerItemContext = useArchivesExplorerItemContext();

	//
	// B. Render components

	switch (archivesExplorerItemContext.item_data.status) {
	case 'active':
		return <IconCircleCheckFilled className={styles.active} size={20} />;
	case 'disabled':
		return <IconCircleDotted className={styles.disabled} size={20} />;
	default:
		return <IconHelpHexagon className={styles.unknown} size={20} />;
	}

	//
}