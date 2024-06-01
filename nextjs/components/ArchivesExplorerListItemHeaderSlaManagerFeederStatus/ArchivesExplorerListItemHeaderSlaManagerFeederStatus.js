'use client';

/* * */

import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { IconClockCog, IconExclamationCircle, IconHelpHexagon, IconRosetteDiscountCheck } from '@tabler/icons-react';

// import { useTranslations } from 'next-intl';
import styles from './ArchivesExplorerListItemHeaderSlaManagerFeederStatus.module.css';

/* * */

export default function ArchivesExplorerListItemHeaderSlaManagerFeederStatus() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('ArchivesExplorerListItemHeaderSlaManagerFeederStatus');
	const archivesExplorerItemContext = useArchivesExplorerItemContext();

	//
	// B. Render components

	switch (archivesExplorerItemContext.item_data.slamanager_feeder_status) {
		case 'pending':
			return <IconClockCog className={styles.pending} size={20} />;
		case 'processed':
			return <IconRosetteDiscountCheck className={styles.processed} size={20} />;
		case 'error':
			return <IconExclamationCircle className={styles.error} size={20} />;
		default:
			return <IconHelpHexagon className={styles.unknown} size={20} />;
	}

	//
}
