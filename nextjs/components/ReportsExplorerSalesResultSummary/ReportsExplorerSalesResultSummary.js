/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerSalesResultSummaryHeader from '@/components/ReportsExplorerSalesResultSummaryHeader/ReportsExplorerSalesResultSummaryHeader';
import ReportsExplorerSalesResultSummaryDescription from '@/components/ReportsExplorerSalesResultSummaryDescription/ReportsExplorerSalesResultSummaryDescription';
import ReportsExplorerSalesResultSummaryOnboard from '../ReportsExplorerSalesResultSummaryOnboard/ReportsExplorerSalesResultSummaryOnboard';

/* * */

export default function ReportsExplorerSalesResultSummary() {
  return (
    <Pannel header={<ReportsExplorerSalesResultSummaryHeader />}>
      <ReportsExplorerSalesResultSummaryDescription />
      <Divider />
      <ReportsExplorerSalesResultSummaryOnboard />
      <Divider />
      {/* <ReportsExplorerSalesResultSummaryTable /> */}
    </Pannel>
  );
}
