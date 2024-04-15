/* * */

import styles from './ReportsExplorerSales.module.css';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerSalesHeader from '../ReportsExplorerSalesHeader/ReportsExplorerSalesHeader';

/* * */

export default function ReportsExplorerSales() {
  //

  //
  // A. Setup variables

  //
  // C. Render components

  return (
    <AppAuthenticationCheck permissions={[{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['sales'] }] }]} redirect>
      <OneFullColumn first={<Pannel header={<ReportsExplorerSalesHeader />}></Pannel>} />
    </AppAuthenticationCheck>
  );

  //
}
