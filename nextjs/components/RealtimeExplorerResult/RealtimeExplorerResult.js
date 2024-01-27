'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import RealtimeExplorerResultLoading from '@/components/RealtimeExplorerResultLoading/RealtimeExplorerResultLoading';
import RealtimeExplorerResultSummary from '@/components/RealtimeExplorerResultSummary/RealtimeExplorerResultSummary';
import RealtimeExplorerResultTripDetail from '@/components/RealtimeExplorerResultTripDetail/RealtimeExplorerResultTripDetail';

/* * */

export default function RealtimeExplorerResult() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResult');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Render components

  if (realtimeExplorerContext.request.is_loading) {
    return <RealtimeExplorerResultLoading />;
  } else if (realtimeExplorerContext.selectedTrip.trip_id) {
    return <RealtimeExplorerResultTripDetail />;
  } else if (realtimeExplorerContext.request.summary?.length > 0) {
    return <RealtimeExplorerResultSummary />;
  } else {
    return <NoDataLabel text={t('no_data')} fill />;
  }

  //
}
