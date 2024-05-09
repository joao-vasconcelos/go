'use client';

/* * */

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './TagsExplorerTagHoverCard.module.css';

/* * */

export default function TagsExplorerTagHoverCard({ tagData }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('TagsExplorerTagHoverCard');

	//
	// B. Transform data

	const parsedCreatedAtDate = useMemo(() => {
		const date = new Date(tagData.created_at);
		return date.toLocaleDateString('pt-PT', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}, [tagData.created_at]);

	//
	// C. Render components

	return (
		<div className={styles.container}>
			{tagData.description &&
        <div className={styles.contentWrapper}>
        	<p className={styles.description}>{tagData.description}</p>
        </div>
			}
			<div className={styles.metadataWrapper}>
				<p className={styles.createdBy}>{t('created_by', { date: parsedCreatedAtDate, name: tagData.created_by?.name })}</p>
			</div>
		</div>
	);

	//
}