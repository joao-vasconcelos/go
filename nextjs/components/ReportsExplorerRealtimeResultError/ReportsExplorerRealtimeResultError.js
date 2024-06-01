'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

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
