'use client';

/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function ReportsExplorerSalesResultError() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesResultError');

  //
  // C. Render components

  return <NoDataLabel text={t('text')} fill />;

  //
}
