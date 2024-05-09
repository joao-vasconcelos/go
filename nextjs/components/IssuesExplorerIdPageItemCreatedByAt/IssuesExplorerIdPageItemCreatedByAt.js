'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemCreatedByAt.module.css';
import UsersExplorerUser from '../UsersExplorerUser/UsersExplorerUser';

/* * */

export default function IssuesExplorerIdPageItemCreatedByAt() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemCreatedByAt');
	const issuesExplorerContext = useIssuesExplorerContext();

	//
	// C. Render components

	return (
		<div className={styles.container}>
			<p className={styles.label}>{t('label', { value: new Date(issuesExplorerContext.form.values.created_at) })}</p>
			<UsersExplorerUser userId={issuesExplorerContext.form.values.created_by} />
		</div>
	);
}