/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import RealtimeExplorerResultTripDetailHeader from '@/components/RealtimeExplorerResultTripDetailHeader/RealtimeExplorerResultTripDetailHeader';
import RealtimeExplorerResultTripDetailDescription from '@/components/RealtimeExplorerResultTripDetailDescription/RealtimeExplorerResultTripDetailDescription';
import RealtimeExplorerResultTripDetailTools from '@/components/RealtimeExplorerResultTripDetailTools/RealtimeExplorerResultTripDetailTools';
import RealtimeExplorerResultTripDetailMap from '@/components/RealtimeExplorerResultTripDetailMap/RealtimeExplorerResultTripDetailMap';
import RealtimeExplorerResultTripDetailMetrics from '@/components/RealtimeExplorerResultTripDetailMetrics/RealtimeExplorerResultTripDetailMetrics';
import RealtimeExplorerResultTripDetailChartsTimestampsDistribution from '@/components/RealtimeExplorerResultTripDetailChartsTimestampsDistribution/RealtimeExplorerResultTripDetailChartsTimestampsDistribution';
import RealtimeExplorerResultTripDetailEventsTable from '@/components/RealtimeExplorerResultTripDetailEventsTable/RealtimeExplorerResultTripDetailEventsTable';

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
      <RealtimeExplorerResultTripDetailChartsTimestampsDistribution />
      <Divider />
      <RealtimeExplorerResultTripDetailEventsTable />
    </Pannel>
  );
}
