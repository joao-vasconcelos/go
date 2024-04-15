/* * */

import styles from './ReportsExplorer.module.css';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { useTranslations } from 'next-intl';
import { ReportOptions } from '@/schemas/Report/options';
import ReportsExplorerItem from '@/components/ReportsExplorerItem/ReportsExplorerItem';
import { IconArrowsShuffle, IconCoinEuro, IconTicket } from '@tabler/icons-react';

/* * */

export default function ReportsExplorer() {
  //

  //
  // A. Setup variables

  const reportOptionsLabels = useTranslations('ReportOptions');

  //
  // B. Transform data

  const reportIcons = {
    sales: <IconCoinEuro size={50} />,
    validations: <IconTicket size={50} />,
    realtime: <IconArrowsShuffle size={50} />,
  };

  //
  // C. Render components

  return (
    <AppAuthenticationCheck permissions={[{ scope: 'reports', action: 'view' }]} redirect>
      <OneFullColumn
        first={<div className={styles.container}>{ReportOptions.kind && ReportOptions.kind.map((item) => <ReportsExplorerItem key={item} id={item} icon={reportIcons[item]} title={reportOptionsLabels(`kind.${item}.label`)} description={reportOptionsLabels(`kind.${item}.description`)} />)}</div>}
      />
    </AppAuthenticationCheck>
  );

  //
}
