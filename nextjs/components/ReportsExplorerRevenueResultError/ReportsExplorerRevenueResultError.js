'use client';

/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

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