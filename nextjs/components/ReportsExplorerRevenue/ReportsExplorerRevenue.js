/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import ReportsExplorerRevenueForm from '@/components/ReportsExplorerRevenueForm/ReportsExplorerRevenueForm';
import ReportsExplorerRevenueResult from '@/components/ReportsExplorerRevenueResult/ReportsExplorerRevenueResult';
import { ReportsExplorerRevenueContextProvider } from '@/contexts/ReportsExplorerRevenueContext';

/* * */

export default function ReportsExplorerRevenue() {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'view', fields: [{ key: 'kind', values: ['revenue'] }], scope: 'reports' }]} redirect>
			<ReportsExplorerRevenueContextProvider>
				<TwoUnevenColumns first={<ReportsExplorerRevenueForm />} second={<ReportsExplorerRevenueResult />} />
			</ReportsExplorerRevenueContextProvider>
		</AppAuthenticationCheck>
	);
}
