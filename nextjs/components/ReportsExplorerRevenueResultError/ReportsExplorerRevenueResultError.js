'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRevenueResultError() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRevenueResultError');

	//
	// C. Render components

	return <NoDataLabel text={t('text')} fill />;

	//
}
