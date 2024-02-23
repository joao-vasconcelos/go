/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function TypologiesExplorerPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('TypologiesExplorerPage');

  //
  // B. Render components

  return <NoDataLabel fill text={t('no_data')} />;

  //
}
