/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import RealtimeExplorerResultTripDetailHeader from '@/components/RealtimeExplorerResultTripDetailHeader/RealtimeExplorerResultTripDetailHeader';
import RealtimeExplorerResultTripDetailSummary from '@/components/RealtimeExplorerResultTripDetailSummary/RealtimeExplorerResultTripDetailSummary';
import RealtimeExplorerResultTripDetailMap from '@/components/RealtimeExplorerResultTripDetailMap/RealtimeExplorerResultTripDetailMap';

/* * */

export default function RealtimeExplorerResultTripDetail() {
  return (
    <Pannel header={<RealtimeExplorerResultTripDetailHeader />}>
      <RealtimeExplorerResultTripDetailMap />
      <Divider />
      <RealtimeExplorerResultTripDetailSummary />
    </Pannel>
  );
}
