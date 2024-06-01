'use client';

/* * */

import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { IconLock, IconLockOpen2 } from '@tabler/icons-react';

// import { useTranslations } from 'next-intl';
import styles from './ArchivesExplorerListItemHeaderLockedUnlocked.module.css';

/* * */

export default function ArchivesExplorerListItemHeaderLockedUnlocked() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('ArchivesExplorerListItemHeaderLockedUnlocked');
	const archivesExplorerItemContext = useArchivesExplorerItemContext();

	//
	// B. Render components

	return archivesExplorerItemContext.item_data.is_locked ? <IconLock className={styles.locked} size={20} /> : <IconLockOpen2 className={styles.unlocked} size={20} />;

	//
}
