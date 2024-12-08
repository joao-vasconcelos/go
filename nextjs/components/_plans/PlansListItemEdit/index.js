'use client';

/* * */

import { PlansListItemEditButton } from '@/components/_plans/PlansListItemEditButton';
import { PlansListItemEditForm } from '@/components/_plans/PlansListItemEditForm';
import { usePlansItemContext } from '@/contexts/PlansItemContext';

import styles from './styles.module.css';

/* * */

export function PlansListItemEdit() {
	//

	//
	// A. Setup variables

	const plansItemContext = usePlansItemContext();

	//
	// B. Render components

	return <div className={styles.container}>{plansItemContext.item.is_edit_mode ? <PlansListItemEditForm /> : <PlansListItemEditButton />}</div>;

	//
}
