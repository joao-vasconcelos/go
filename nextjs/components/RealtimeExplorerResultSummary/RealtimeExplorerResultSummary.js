/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import RealtimeExplorerResultSummaryHeader from '@/components/RealtimeExplorerResultSummaryHeader/RealtimeExplorerResultSummaryHeader';
import RealtimeExplorerResultSummaryDescription from '@/components/RealtimeExplorerResultSummaryDescription/RealtimeExplorerResultSummaryDescription';
import RealtimeExplorerResultSummaryMetrics from '@/components/RealtimeExplorerResultSummaryMetrics/RealtimeExplorerResultSummaryMetrics';
import RealtimeExplorerResultSummaryTable from '@/components/RealtimeExplorerResultSummaryTable/RealtimeExplorerResultSummaryTable';

/* * */

export default function RealtimeExplorerResultSummary() {
  return (
    <Pannel header={<RealtimeExplorerResultSummaryHeader />}>
      <RealtimeExplorerResultSummaryDescription />
      <Divider />
      <RealtimeExplorerResultSummaryMetrics />
      <Divider />
      <RealtimeExplorerResultSummaryTable />
    </Pannel>
  );
}
