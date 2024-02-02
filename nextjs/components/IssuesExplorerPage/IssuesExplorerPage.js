/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function IssuesExplorerPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerPage');

  //
  // B. Render components

  return <NoDataLabel fill text={t('no_data')} />;

  //
}
