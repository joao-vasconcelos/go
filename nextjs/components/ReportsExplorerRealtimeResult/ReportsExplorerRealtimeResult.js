'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ReportsExplorerRealtimeResultLoading from '@/components/ReportsExplorerRealtimeResultLoading/ReportsExplorerRealtimeResultLoading';
import ReportsExplorerRealtimeResultError from '@/components/ReportsExplorerRealtimeResultError/ReportsExplorerRealtimeResultError';
import ReportsExplorerRealtimeResultSummary from '@/components/ReportsExplorerRealtimeResultSummary/ReportsExplorerRealtimeResultSummary';
import ReportsExplorerRealtimeResultTripDetail from '@/components/ReportsExplorerRealtimeResultTripDetail/ReportsExplorerRealtimeResultTripDetail';

/* * */

export default function ReportsExplorerRealtimeResult() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResult');
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	//
	// B. Render components

	if (reportsExplorerRealtimeContext.request.is_error) {
		return <ReportsExplorerRealtimeResultError />;
	} else if (reportsExplorerRealtimeContext.request.is_loading) {
		return <ReportsExplorerRealtimeResultLoading />;
	} else if (reportsExplorerRealtimeContext.selectedTrip.trip_id) {
		return <ReportsExplorerRealtimeResultTripDetail />;
	} else if (reportsExplorerRealtimeContext.request.summary?.length > 0) {
		return <ReportsExplorerRealtimeResultSummary />;
	} else {
		return <NoDataLabel text={t('no_data')} fill />;
	}

	//
}