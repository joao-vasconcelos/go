/* * */

import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRevenueResultSummaryDescription from '@/components/ReportsExplorerRevenueResultSummaryDescription/ReportsExplorerRevenueResultSummaryDescription';
import ReportsExplorerRevenueResultSummaryFrequent from '@/components/ReportsExplorerRevenueResultSummaryFrequent/ReportsExplorerRevenueResultSummaryFrequent';
import ReportsExplorerRevenueResultSummaryHeader from '@/components/ReportsExplorerRevenueResultSummaryHeader/ReportsExplorerRevenueResultSummaryHeader';
import ReportsExplorerRevenueResultSummaryOnboard from '@/components/ReportsExplorerRevenueResultSummaryOnboard/ReportsExplorerRevenueResultSummaryOnboard';
import ReportsExplorerRevenueResultSummaryPrepaid from '@/components/ReportsExplorerRevenueResultSummaryPrepaid/ReportsExplorerRevenueResultSummaryPrepaid';
import { Divider } from '@mantine/core';

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
