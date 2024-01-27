/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import RealtimeExplorerResultTripDetailHeader from '@/components/RealtimeExplorerResultTripDetailHeader/RealtimeExplorerResultTripDetailHeader';
import RealtimeExplorerResultTripDetailMap from '@/components/RealtimeExplorerResultTripDetailMap/RealtimeExplorerResultTripDetailMap';
import RealtimeExplorerResultTripDetailDescription from '@/components/RealtimeExplorerResultTripDetailDescription/RealtimeExplorerResultTripDetailDescription';
import RealtimeExplorerResultTripDetailMetrics from '@/components/RealtimeExplorerResultTripDetailMetrics/RealtimeExplorerResultTripDetailMetrics';
import RealtimeExplorerResultTripDetailTimeDistributionGraph from '@/components/RealtimeExplorerResultTripDetailTimeDistributionGraph/RealtimeExplorerResultTripDetailTimeDistributionGraph';
import RealtimeExplorerResultTripDetailTools from '@/components/RealtimeExplorerResultTripDetailTools/RealtimeExplorerResultTripDetailTools';

/* * */

export default function RealtimeExplorerResultTripDetail() {
  return (
    <Pannel header={<RealtimeExplorerResultTripDetailHeader />}>
      <RealtimeExplorerResultTripDetailDescription />
      <Divider />
      <RealtimeExplorerResultTripDetailTools />
      <Divider />
      <RealtimeExplorerResultTripDetailMap />
      <Divider />
      <RealtimeExplorerResultTripDetailMetrics />
      <Divider />
      <RealtimeExplorerResultTripDetailTimeDistributionGraph />
    </Pannel>
  );
}
