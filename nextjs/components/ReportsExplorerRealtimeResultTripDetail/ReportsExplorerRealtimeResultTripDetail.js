/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRealtimeResultTripDetailHeader from '@/components/ReportsExplorerRealtimeResultTripDetailHeader/ReportsExplorerRealtimeResultTripDetailHeader';
import ReportsExplorerRealtimeResultTripDetailDescription from '@/components/ReportsExplorerRealtimeResultTripDetailDescription/ReportsExplorerRealtimeResultTripDetailDescription';
import ReportsExplorerRealtimeResultTripDetailTools from '@/components/ReportsExplorerRealtimeResultTripDetailTools/ReportsExplorerRealtimeResultTripDetailTools';
import ReportsExplorerRealtimeResultTripDetailMap from '@/components/ReportsExplorerRealtimeResultTripDetailMap/ReportsExplorerRealtimeResultTripDetailMap';
import ReportsExplorerRealtimeResultTripDetailMetrics from '@/components/ReportsExplorerRealtimeResultTripDetailMetrics/ReportsExplorerRealtimeResultTripDetailMetrics';
import ReportsExplorerRealtimeResultTripDetailChartsTimestampsDistribution from '@/components/ReportsExplorerRealtimeResultTripDetailChartsTimestampsDistribution/ReportsExplorerRealtimeResultTripDetailChartsTimestampsDistribution';
import ReportsExplorerRealtimeResultTripDetailEventsTable from '@/components/ReportsExplorerRealtimeResultTripDetailEventsTable/ReportsExplorerRealtimeResultTripDetailEventsTable';

/* * */

export default function ReportsExplorerRealtimeResultTripDetail() {
	return (
		<Pannel header={<ReportsExplorerRealtimeResultTripDetailHeader />}>
			<ReportsExplorerRealtimeResultTripDetailDescription />
			<Divider />
			<ReportsExplorerRealtimeResultTripDetailTools />
			<Divider />
			<ReportsExplorerRealtimeResultTripDetailMap />
			<Divider />
			<ReportsExplorerRealtimeResultTripDetailMetrics />
			<Divider />
			<ReportsExplorerRealtimeResultTripDetailChartsTimestampsDistribution />
			<Divider />
			<ReportsExplorerRealtimeResultTripDetailEventsTable />
		</Pannel>
	);
}