/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRevenueResultSummaryHeader from '@/components/ReportsExplorerRevenueResultSummaryHeader/ReportsExplorerRevenueResultSummaryHeader';
import ReportsExplorerRevenueResultSummaryDescription from '@/components/ReportsExplorerRevenueResultSummaryDescription/ReportsExplorerRevenueResultSummaryDescription';
import ReportsExplorerRevenueResultSummaryOnboard from '@/components/ReportsExplorerRevenueResultSummaryOnboard/ReportsExplorerRevenueResultSummaryOnboard';
import ReportsExplorerRevenueResultSummaryPrepaid from '@/components/ReportsExplorerRevenueResultSummaryPrepaid/ReportsExplorerRevenueResultSummaryPrepaid';
import ReportsExplorerRevenueResultSummaryFrequent from '@/components/ReportsExplorerRevenueResultSummaryFrequent/ReportsExplorerRevenueResultSummaryFrequent';

/* * */

export default function ReportsExplorerRevenueResultSummary() {
  return (
    <Pannel header={<ReportsExplorerRevenueResultSummaryHeader />}>
      <ReportsExplorerRevenueResultSummaryDescription />
      <Divider />
      <ReportsExplorerRevenueResultSummaryOnboard />
      <Divider />
      <ReportsExplorerRevenueResultSummaryPrepaid />
      <Divider />
      <ReportsExplorerRevenueResultSummaryFrequent />
    </Pannel>
  );
}
