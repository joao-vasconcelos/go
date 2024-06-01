'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerSlaHeader from '@/components/ReportsExplorerSlaHeader/ReportsExplorerSlaHeader';
import ReportsExplorerSlaList from '@/components/ReportsExplorerSlaList/ReportsExplorerSlaList';
import { ReportsExplorerSlaContextProvider } from '@/contexts/ReportsExplorerSlaContext';

/* * */

export default function ReportsExplorerSla() {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'view', fields: [{ key: 'kind', values: ['sla'] }], scope: 'reports' }]} redirect>
			<ReportsExplorerSlaContextProvider>
				<OneFullColumn first={<Pannel header={<ReportsExplorerSlaHeader />}><ReportsExplorerSlaList /></Pannel>} />
			</ReportsExplorerSlaContextProvider>
		</AppAuthenticationCheck>
	);
}
