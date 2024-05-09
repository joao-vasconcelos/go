'use client';

/* * */

import { useTranslations } from 'next-intl';
import { IconPencil, IconBroadcast, IconBolt, IconHandStop, IconDiscountCheck, IconStatusChange } from '@tabler/icons-react';
import styles from './IssuesExplorerAttributeStatus.module.css';

/* * */

export default function IssuesExplorerAttributeStatus({ value }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerAttributeStatus');

	//
	// B. Render components

	switch (value) {
	case 'draft':
		return (
			<div className={`${styles.container} ${styles.draft}`}>
				<IconPencil size={14} />
				<p className={styles.label}>{t(`${value}.label`)}</p>
			</div>
		);
	case 'open':
		return (
			<div className={`${styles.container} ${styles.open}`}>
				<IconBroadcast size={14} />
				<p className={styles.label}>{t(`${value}.label`)}</p>
			</div>
		);
	case 'in_progress':
		return (
			<div className={`${styles.container} ${styles.inProgress}`}>
				<IconBolt size={14} />
				<p className={styles.label}>{t(`${value}.label`)}</p>
			</div>
		);
	case 'on_hold':
		return (
			<div className={`${styles.container} ${styles.blocked}`}>
				<IconHandStop size={14} />
				<p className={styles.label}>{t(`${value}.label`)}</p>
			</div>
		);
	case 'closed':
		return (
			<div className={`${styles.container} ${styles.closed}`}>
				<IconDiscountCheck size={14} />
				<p className={styles.label}>{t(`${value}.label`)}</p>
			</div>
		);
	default:
		return (
			<div className={`${styles.container} ${styles.default}`}>
				<IconStatusChange size={14} />
				<p className={styles.label}>{t('default.label')}</p>
			</div>
		);
	}

	//
}