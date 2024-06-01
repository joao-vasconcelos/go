/* * */

import { Section } from '@/components/Layouts/Layouts';
import ReportsExplorerRealtimeResultTripDetailToolsAnimation from '@/components/ReportsExplorerRealtimeResultTripDetailToolsAnimation/ReportsExplorerRealtimeResultTripDetailToolsAnimation';
import ReportsExplorerRealtimeResultTripDetailToolsOrdering from '@/components/ReportsExplorerRealtimeResultTripDetailToolsOrdering/ReportsExplorerRealtimeResultTripDetailToolsOrdering';

/* * */

export default function ReportsExplorerRealtimeResultTripDetailTools() {
	return (
		<Section>
			<ReportsExplorerRealtimeResultTripDetailToolsOrdering />
			<ReportsExplorerRealtimeResultTripDetailToolsAnimation />
		</Section>
	);
}
