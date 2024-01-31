'use client';

/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function RealtimeExplorerResultError() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultError');

  //
  // C. Render components

  return <NoDataLabel text={t('text')} fill />;

  //
}
