'use client';

/* * */

import { usePlansItemContext } from '@/contexts/PlansItemContext';
import { IconExclamationCircle, IconHelpHexagon, IconPoint, IconRefreshDot, IconRosetteDiscountCheck } from '@tabler/icons-react';

import styles from './styles.module.css';

/* * */

export function PlansListItemHeaderFeederStatus() {
	//

	//
	// A. Setup variables

	const plansItemContext = usePlansItemContext();

	//
	// B. Render components

	switch (plansItemContext.item_data.feeder_status) {
		case 'error':
			return <IconExclamationCircle className={styles.error} size={20} />;
		case 'processing':
			return <IconRefreshDot className={styles.processing} size={20} />;
		case 'success':
			return <IconRosetteDiscountCheck className={styles.success} size={20} />;
		case 'waiting':
			return <IconPoint className={styles.waiting} size={20} />;
		default:
			return <IconHelpHexagon className={styles.unknown} size={20} />;
	}

	//
}
