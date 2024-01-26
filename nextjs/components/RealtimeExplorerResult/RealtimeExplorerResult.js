'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import RealtimeExplorerResultLoading from '@/components/RealtimeExplorerResultLoading/RealtimeExplorerResultLoading';
import RealtimeExplorerResultOverview from '@/components/RealtimeExplorerResultOverview/RealtimeExplorerResultOverview';
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

  if (realtimeExplorerContext.request.is_loading || realtimeExplorerContext.request.is_processing) {
    return <RealtimeExplorerResultLoading />;
  }

  if (realtimeExplorerContext.selectedTrip.trip_id) {
    return <RealtimeExplorerResultTripDetail />;
  }

  if (realtimeExplorerContext.request.unique_trips) {
    return <RealtimeExplorerResultOverview />;
  }

  return <NoDataLabel text={t('no_data')} fill />;

  //
}
