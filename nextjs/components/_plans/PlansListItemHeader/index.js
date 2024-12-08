'use client';

/* * */

import { PlansListItemHeaderFeederStatus } from '@/components/_plans/PlansListItemHeaderFeederStatus';
import { PlansListItemHeaderLockedUnlocked } from '@/components/_plans/PlansListItemHeaderLockedUnlocked';
import { PlansListItemHeaderStatus } from '@/components/_plans/PlansListItemHeaderStatus';
import { usePlansItemContext } from '@/contexts/PlansItemContext';
import { IconArrowRight } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import useSWR from 'swr';

import styles from './styles.module.css';

/* * */

export function PlansListItemHeader() {
	//

	//
	// A. Setup variables

	const plansItemContext = usePlansItemContext();

	//
	// B. Fetch data

	const { data: allAgenciesData } = useSWR('/api/agencies');

	//
	// B. Transform data

	const startDateFormatted = useMemo(() => {
		if (!plansItemContext.item_data.valid_from) return '?';
		return DateTime.fromISO(plansItemContext.item_data.valid_from).toFormat('y-LL-dd');
	}, [plansItemContext.item_data.valid_from]);

	const endDateFormatted = useMemo(() => {
		if (!plansItemContext.item_data.valid_until) return '?';
		return DateTime.fromISO(plansItemContext.item_data.valid_until).toFormat('y-LL-dd');
	}, [plansItemContext.item_data.valid_until]);

	const agencyDataFormatted = useMemo(() => {
		if (!allAgenciesData) return '•••';
		return allAgenciesData.find(item => item._id === plansItemContext.item_data.agency_id)?.name ?? '•••';
	}, [allAgenciesData, plansItemContext.item_data.agency_id]);

	//
	// C. Render components

	return (
		<div className={styles.container}>
			<PlansListItemHeaderStatus />
			<PlansListItemHeaderLockedUnlocked />
			<PlansListItemHeaderFeederStatus />
			<div className={styles.datesWrapper}>
				<p className={`${styles.date} ${styles.start}`}>{startDateFormatted}</p>
				<IconArrowRight size={16} />
				<p className={`${styles.date} ${styles.end}`}>{endDateFormatted}</p>
			</div>
			<p className={styles.agencyName}>{agencyDataFormatted}</p>
			<p className={styles.code}>{plansItemContext.item_data._id || '•••'}</p>
		</div>
	);

	//
}
