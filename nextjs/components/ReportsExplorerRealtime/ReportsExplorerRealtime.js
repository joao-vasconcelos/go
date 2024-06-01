'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import ReportsExplorerRealtimeForm from '@/components/ReportsExplorerRealtimeForm/ReportsExplorerRealtimeForm';
import ReportsExplorerRealtimeResult from '@/components/ReportsExplorerRealtimeResult/ReportsExplorerRealtimeResult';
import { ReportsExplorerRealtimeContextProvider } from '@/contexts/ReportsExplorerRealtimeContext';

/* * */

export default function ReportsExplorerRealtime() {
	return (
		<AppAuthenticationCheck permission={[{ action: 'view', fields: [{ key: 'kind', values: ['realtime'] }], scope: 'reports' }]} redirect>
			<ReportsExplorerRealtimeContextProvider>
				<TwoUnevenColumns first={<ReportsExplorerRealtimeForm />} second={<ReportsExplorerRealtimeResult />} />
			</ReportsExplorerRealtimeContextProvider>
		</AppAuthenticationCheck>
	);
}
