/* * */

// import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
// import ReportsExplorerSlaForm from '@/components/ReportsExplorerSlaForm/ReportsExplorerSlaForm';
// import ReportsExplorerSlaResult from '@/components/ReportsExplorerSlaResult/ReportsExplorerSlaResult';
import { ReportsExplorerSlaContextProvider } from '@/contexts/ReportsExplorerSlaContext';

/* * */

export default function ReportsExplorerSla() {
	return (
		<AppAuthenticationCheck permissions={[{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['sla'] }] }]} redirect>
			<ReportsExplorerSlaContextProvider>
				{/* <TwoUnevenColumns first={<ReportsExplorerSlaForm />} second={<ReportsExplorerSlaResult />} /> */}
			</ReportsExplorerSlaContextProvider>
		</AppAuthenticationCheck>
	);
}