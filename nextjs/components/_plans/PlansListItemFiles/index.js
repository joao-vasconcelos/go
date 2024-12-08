'use client';

/* * */

import { PlansListItemFilesOperation } from '@/components/_plans/PlansListItemFilesOperation';
import { PlansListItemFilesReference } from '@/components/_plans/PlansListItemFilesReference';

import styles from './styles.module.css';

/* * */

export function PlansListItemFiles() {
	return (
		<div className={styles.container}>
			<PlansListItemFilesOperation />
			<PlansListItemFilesReference />
		</div>
	);
}
