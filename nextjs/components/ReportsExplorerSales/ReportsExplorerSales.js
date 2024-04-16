/* * */

import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ReportsExplorerSalesForm from '@/components/ReportsExplorerSalesForm/ReportsExplorerSalesForm';
import ReportsExplorerSalesResult from '@/components/ReportsExplorerSalesResult/ReportsExplorerSalesResult';
import { ReportsExplorerSalesContextProvider } from '@/contexts/ReportsExplorerSalesContext';

/* * */

export default function ReportsExplorerSales() {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['sales'] }] }]} redirect>
      <ReportsExplorerSalesContextProvider>
        <TwoUnevenColumns first={<ReportsExplorerSalesForm />} second={<ReportsExplorerSalesResult />} />
      </ReportsExplorerSalesContextProvider>
    </AppAuthenticationCheck>
  );
}
