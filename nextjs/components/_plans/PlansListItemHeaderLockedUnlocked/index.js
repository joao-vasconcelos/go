'use client';

/* * */

import { usePlansItemContext } from '@/contexts/PlansItemContext';
import { IconLock, IconLockOpen2 } from '@tabler/icons-react';

import styles from './styles.module.css';

/* * */

export function PlansListItemHeaderLockedUnlocked() {
	//

	//
	// A. Setup variables

	const plansItemContext = usePlansItemContext();

	//
	// B. Render components

	return plansItemContext.item_data.is_locked ? <IconLock className={styles.locked} size={20} /> : <IconLockOpen2 className={styles.unlocked} size={20} />;

	//
}
