'use client';

/* * */

import Loader from '@/components/Loader/Loader';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import styles from './LinesExplorerLine.module.css';

/* * */

export function LinesExplorerLine({ lineId, withBadge = true, withLineData, withLink = true, withLinkOpenNewTab = true }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('LinesExplorerLine');
	const router = useRouter();

	//
	// B. Fetch data

	const { data: lineData } = useSWR(!withLineData && lineId && `/api/lines/${lineId}`);
	const { data: typologyData } = useSWR(!withLineData && lineId ? `/api/typologies/${lineData?.typology}` : `/api/typologies/${withLineData?.typology}`);

	//
	// C. Handle actions

	const handleOpenLine = () => {
		if (withLink) {
			if (withLinkOpenNewTab) window.open(`/lines/${lineId || withLineData._id}`, '_blank');
			else router.push(`/lines/${lineId || withLineData._id}`);
		}
	};

	//
	// D. Render components

	if (!withLineData && lineId) {
		return lineData && typologyData
			? (
				<div className={`${styles.container} ${withLink && styles.withLink}`} onClick={handleOpenLine}>
					{withBadge
					&& (
						<div className={styles.badge} style={{ backgroundColor: typologyData.color, color: typologyData.text_color }}>
							{lineData.short_name || t('untitled')}
						</div>
					)}
					<div className={styles.name}>{lineData.name}</div>
				</div>
			)
			: <Loader size={10} visible />;
	}

	if (withLineData && !lineId) {
		return withLineData && typologyData
			? (
				<div className={`${styles.container} ${withLink && styles.withLink}`} onClick={handleOpenLine}>
					{withBadge
					&& (
						<div className={styles.badge} style={{ backgroundColor: typologyData.color, color: typologyData.text_color }}>
							{withLineData.short_name || t('untitled')}
						</div>
					)}
					<div className={styles.name}>{withLineData.name}</div>
				</div>
			)
			: <Loader size={10} visible />;
	}

	//
}
