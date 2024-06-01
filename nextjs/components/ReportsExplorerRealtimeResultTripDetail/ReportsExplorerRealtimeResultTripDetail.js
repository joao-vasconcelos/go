/* * */

import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRealtimeResultTripDetailChartsTimestampsDistribution from '@/components/ReportsExplorerRealtimeResultTripDetailChartsTimestampsDistribution/ReportsExplorerRealtimeResultTripDetailChartsTimestampsDistribution';
import ReportsExplorerRealtimeResultTripDetailDescription from '@/components/ReportsExplorerRealtimeResultTripDetailDescription/ReportsExplorerRealtimeResultTripDetailDescription';
import ReportsExplorerRealtimeResultTripDetailEventsTable from '@/components/ReportsExplorerRealtimeResultTripDetailEventsTable/ReportsExplorerRealtimeResultTripDetailEventsTable';
import ReportsExplorerRealtimeResultTripDetailHeader from '@/components/ReportsExplorerRealtimeResultTripDetailHeader/ReportsExplorerRealtimeResultTripDetailHeader';
import ReportsExplorerRealtimeResultTripDetailMap from '@/components/ReportsExplorerRealtimeResultTripDetailMap/ReportsExplorerRealtimeResultTripDetailMap';
import ReportsExplorerRealtimeResultTripDetailMetrics from '@/components/ReportsExplorerRealtimeResultTripDetailMetrics/ReportsExplorerRealtimeResultTripDetailMetrics';
import ReportsExplorerRealtimeResultTripDetailTools from '@/components/ReportsExplorerRealtimeResultTripDetailTools/ReportsExplorerRealtimeResultTripDetailTools';
import { Divider } from '@mantine/core';

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
