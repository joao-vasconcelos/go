'use client';

/* * */

import { useTranslations } from 'next-intl';
import styles from './GlobalAuthorTimestamp.module.css';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';

/* * */

export default function GlobalAuthorTimestamp({ userId, timestamp, actionVerb }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('GlobalAuthorTimestamp');

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<UsersExplorerUser userId={userId} type="simple" />
			<p className={styles.timestamp}>{t('timestamp', { verb: actionVerb, timestamp: new Date(timestamp) })}</p>
		</div>
	);

	//
}