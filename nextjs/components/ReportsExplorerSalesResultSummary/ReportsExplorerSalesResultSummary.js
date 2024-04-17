/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerSalesResultSummaryHeader from '@/components/ReportsExplorerSalesResultSummaryHeader/ReportsExplorerSalesResultSummaryHeader';
import ReportsExplorerSalesResultSummaryDescription from '@/components/ReportsExplorerSalesResultSummaryDescription/ReportsExplorerSalesResultSummaryDescription';
import ReportsExplorerSalesResultSummaryMetrics from '@/components/ReportsExplorerSalesResultSummaryMetrics/ReportsExplorerSalesResultSummaryMetrics';
// import ReportsExplorerSalesResultSummaryTable from '@/components/ReportsExplorerSalesResultSummaryTable/ReportsExplorerSalesResultSummaryTable';

/* * */

export default function ReportsExplorerSalesResultSummary() {
  return (
    <Pannel header={<ReportsExplorerSalesResultSummaryHeader />}>
      <ReportsExplorerSalesResultSummaryDescription />
      <Divider />
      <ReportsExplorerSalesResultSummaryMetrics />
      <Divider />
      {/* <ReportsExplorerSalesResultSummaryTable /> */}
    </Pannel>
  );
}
