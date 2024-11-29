'use client';

/* * */

import { usePlansItemContext } from '@/contexts/PlansItemContext';
import { IconCircleCheckFilled, IconCircleDotted } from '@tabler/icons-react';

import styles from './styles.module.css';

/* * */

export function PlansListItemHeaderStatus() {
	//

	//
	// A. Setup variables

	const plansItemContext = usePlansItemContext();

	//
	// B. Render components

	if (plansItemContext.item_data.is_approved) {
		return <IconCircleCheckFilled className={styles.active} size={20} />;
	}

	return <IconCircleDotted className={styles.disabled} size={20} />;

	//
}
