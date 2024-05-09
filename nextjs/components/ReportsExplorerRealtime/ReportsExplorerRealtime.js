'use client';

/* * */

import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import ReportsExplorerRealtimeForm from '@/components/ReportsExplorerRealtimeForm/ReportsExplorerRealtimeForm';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ReportsExplorerRealtimeResult from '@/components/ReportsExplorerRealtimeResult/ReportsExplorerRealtimeResult';
import { ReportsExplorerRealtimeContextProvider } from '@/contexts/ReportsExplorerRealtimeContext';

/* * */

export default function ReportsExplorerRealtime() {
	return (
		<AppAuthenticationCheck permission={[{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['realtime'] }] }]} redirect>
			<ReportsExplorerRealtimeContextProvider>
				<TwoUnevenColumns first={<ReportsExplorerRealtimeForm />} second={<ReportsExplorerRealtimeResult />} />
			</ReportsExplorerRealtimeContextProvider>
		</AppAuthenticationCheck>
	);
}