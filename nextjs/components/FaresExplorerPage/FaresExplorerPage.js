/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function FaresExplorerPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('FaresExplorerPage');

  //
  // B. Render components

  return <NoDataLabel fill text={t('no_data')} />;

  //
}
