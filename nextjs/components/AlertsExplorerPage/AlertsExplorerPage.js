/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function AlertsExplorerPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('AlertsExplorerPage');

  //
  // B. Render components

  return <NoDataLabel fill text={t('no_data')} />;

  //
}
