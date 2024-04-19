/* * */

import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ReportsExplorerRevenueForm from '@/components/ReportsExplorerRevenueForm/ReportsExplorerRevenueForm';
import ReportsExplorerRevenueResult from '@/components/ReportsExplorerRevenueResult/ReportsExplorerRevenueResult';
import { ReportsExplorerRevenueContextProvider } from '@/contexts/ReportsExplorerRevenueContext';

/* * */

export default function ReportsExplorerRevenue() {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['revenue'] }] }]} redirect>
      <ReportsExplorerRevenueContextProvider>
        <TwoUnevenColumns first={<ReportsExplorerRevenueForm />} second={<ReportsExplorerRevenueResult />} />
      </ReportsExplorerRevenueContextProvider>
    </AppAuthenticationCheck>
  );
}
