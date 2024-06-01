/* * */

import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRealtimeResultSummaryDescription from '@/components/ReportsExplorerRealtimeResultSummaryDescription/ReportsExplorerRealtimeResultSummaryDescription';
import ReportsExplorerRealtimeResultSummaryHeader from '@/components/ReportsExplorerRealtimeResultSummaryHeader/ReportsExplorerRealtimeResultSummaryHeader';
import ReportsExplorerRealtimeResultSummaryMetrics from '@/components/ReportsExplorerRealtimeResultSummaryMetrics/ReportsExplorerRealtimeResultSummaryMetrics';
import ReportsExplorerRealtimeResultSummaryTable from '@/components/ReportsExplorerRealtimeResultSummaryTable/ReportsExplorerRealtimeResultSummaryTable';
import { Divider } from '@mantine/core';

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
