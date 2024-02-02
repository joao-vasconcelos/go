'use client';

/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function Page() {
  //

  //
  // A. Setup variables

  const t = useTranslations('agencies');

  //
  // B. Render components

  return <NoDataLabel fill text={t('list.no_selection')} />;

  //
}
