/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import RealtimeExplorerResultOverviewHeader from '@/components/RealtimeExplorerResultOverviewHeader/RealtimeExplorerResultOverviewHeader';
import RealtimeExplorerResultOverviewSummary from '@/components/RealtimeExplorerResultOverviewSummary/RealtimeExplorerResultOverviewSummary';
import RealtimeExplorerResultOverviewMetrics from '@/components/RealtimeExplorerResultOverviewMetrics/RealtimeExplorerResultOverviewMetrics';
import RealtimeExplorerResultOverviewTable from '@/components/RealtimeExplorerResultOverviewTable/RealtimeExplorerResultOverviewTable';

/* * */

export default function RealtimeExplorerResultOverview() {
  return (
    <Pannel header={<RealtimeExplorerResultOverviewHeader />}>
      <RealtimeExplorerResultOverviewSummary />
      <Divider />
      <RealtimeExplorerResultOverviewMetrics />
      <Divider />
      <RealtimeExplorerResultOverviewTable />
    </Pannel>
  );
}
