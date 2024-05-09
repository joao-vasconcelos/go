'use client';

/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function ReportsExplorerRealtimeResultError() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultError');

	//
	// C. Render components

	return <NoDataLabel text={t('text')} fill />;

	//
}