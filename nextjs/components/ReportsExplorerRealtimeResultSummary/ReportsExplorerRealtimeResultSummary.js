/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRealtimeResultSummaryHeader from '@/components/ReportsExplorerRealtimeResultSummaryHeader/ReportsExplorerRealtimeResultSummaryHeader';
import ReportsExplorerRealtimeResultSummaryDescription from '@/components/ReportsExplorerRealtimeResultSummaryDescription/ReportsExplorerRealtimeResultSummaryDescription';
import ReportsExplorerRealtimeResultSummaryMetrics from '@/components/ReportsExplorerRealtimeResultSummaryMetrics/ReportsExplorerRealtimeResultSummaryMetrics';
import ReportsExplorerRealtimeResultSummaryTable from '@/components/ReportsExplorerRealtimeResultSummaryTable/ReportsExplorerRealtimeResultSummaryTable';

/* * */

export default function ReportsExplorerRealtimeResultSummary() {
  return (
    <Pannel header={<ReportsExplorerRealtimeResultSummaryHeader />}>
      <ReportsExplorerRealtimeResultSummaryDescription />
      <Divider />
      <ReportsExplorerRealtimeResultSummaryMetrics />
      <Divider />
      <ReportsExplorerRealtimeResultSummaryTable />
    </Pannel>
  );
}
