'use client';

/* * */

import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';
import { useTranslations } from 'next-intl';

import styles from './GlobalAuthorTimestamp.module.css';

/* * */

export default function GlobalAuthorTimestamp({ actionVerb, timestamp, userId }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('GlobalAuthorTimestamp');

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<UsersExplorerUser type="simple" userId={userId} />
			<p className={styles.timestamp}>{t('timestamp', { timestamp: new Date(timestamp), verb: actionVerb })}</p>
		</div>
	);

	//
}
