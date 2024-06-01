'use client';

/* * */

import ArchivesExplorerListItemHeaderLockedUnlocked from '@/components/ArchivesExplorerListItemHeaderLockedUnlocked/ArchivesExplorerListItemHeaderLockedUnlocked';
import ArchivesExplorerListItemHeaderSlaManagerFeederStatus from '@/components/ArchivesExplorerListItemHeaderSlaManagerFeederStatus/ArchivesExplorerListItemHeaderSlaManagerFeederStatus';
import ArchivesExplorerListItemHeaderStatus from '@/components/ArchivesExplorerListItemHeaderStatus/ArchivesExplorerListItemHeaderStatus';
import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { IconArrowRight } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

import styles from './ArchivesExplorerListItemHeader.module.css';

/* * */

export default function ArchivesExplorerListItemHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ArchivesExplorerListItemHeader');
	const archivesExplorerItemContext = useArchivesExplorerItemContext();

	//
	// B. Fetch data

	const { data: allAgenciesData } = useSWR('/api/agencies');

	//
	// B. Transform data

	const startDateFormatted = useMemo(() => {
		if (!archivesExplorerItemContext.item_data.start_date) return '?';
		return DateTime.fromISO(archivesExplorerItemContext.item_data.start_date).toFormat('y-LL-dd');
	}, [archivesExplorerItemContext.item_data.start_date]);

	const endDateFormatted = useMemo(() => {
		if (!archivesExplorerItemContext.item_data.end_date) return '?';
		return DateTime.fromISO(archivesExplorerItemContext.item_data.end_date).toFormat('y-LL-dd');
	}, [archivesExplorerItemContext.item_data.end_date]);

	const agencyDataFormatted = useMemo(() => {
		if (!allAgenciesData) return '•••';
		return allAgenciesData.find(item => item._id === archivesExplorerItemContext.item_data.agency)?.name ?? '•••';
	}, [allAgenciesData, archivesExplorerItemContext.item_data.agency]);

	//
	// C. Render components

	return (
		<div className={styles.container}>
			<ArchivesExplorerListItemHeaderStatus />
			<ArchivesExplorerListItemHeaderLockedUnlocked />
			<ArchivesExplorerListItemHeaderSlaManagerFeederStatus />
			<div className={styles.datesWrapper}>
				<p className={`${styles.date} ${styles.start}`}>{startDateFormatted}</p>
				<IconArrowRight size={16} />
				<p className={`${styles.date} ${styles.end}`}>{endDateFormatted}</p>
			</div>
			<p className={styles.agencyName}>{agencyDataFormatted}</p>
			<p className={styles.code}>{archivesExplorerItemContext.item_data.code || '•••'}</p>
		</div>
	);

	//
}
