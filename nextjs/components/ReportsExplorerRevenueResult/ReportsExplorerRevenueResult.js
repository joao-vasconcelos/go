'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ReportsExplorerRevenueResultError from '@/components/ReportsExplorerRevenueResultError/ReportsExplorerRevenueResultError';
import ReportsExplorerRevenueResultLoading from '@/components/ReportsExplorerRevenueResultLoading/ReportsExplorerRevenueResultLoading';
import ReportsExplorerRevenueResultSummary from '@/components/ReportsExplorerRevenueResultSummary/ReportsExplorerRevenueResultSummary';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRevenueResult() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRevenueResult');
	const reportsExplorerSalesContext = useReportsExplorerRevenueContext();

	//
	// B. Render components

	if (reportsExplorerSalesContext.request.is_error) {
		return <ReportsExplorerRevenueResultError />;
	}
	else if (reportsExplorerSalesContext.request.is_loading) {
		return <ReportsExplorerRevenueResultLoading />;
	}
	else if (reportsExplorerSalesContext.request.is_success) {
		return <ReportsExplorerRevenueResultSummary />;
	}
	else {
		return <NoDataLabel text={t('no_data')} fill />;
	}

	//
}
