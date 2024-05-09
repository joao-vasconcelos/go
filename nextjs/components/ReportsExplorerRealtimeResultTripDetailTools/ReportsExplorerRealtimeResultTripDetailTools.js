/* * */

import { Section } from '@/components/Layouts/Layouts';
import ReportsExplorerRealtimeResultTripDetailToolsOrdering from '@/components/ReportsExplorerRealtimeResultTripDetailToolsOrdering/ReportsExplorerRealtimeResultTripDetailToolsOrdering';
import ReportsExplorerRealtimeResultTripDetailToolsAnimation from '@/components/ReportsExplorerRealtimeResultTripDetailToolsAnimation/ReportsExplorerRealtimeResultTripDetailToolsAnimation';

/* * */

export default function ReportsExplorerRealtimeResultTripDetailTools() {
	return (
		<Section>
			<ReportsExplorerRealtimeResultTripDetailToolsOrdering />
			<ReportsExplorerRealtimeResultTripDetailToolsAnimation />
		</Section>
	);
}