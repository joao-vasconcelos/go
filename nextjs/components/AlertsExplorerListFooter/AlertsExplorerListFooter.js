'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function AlertsExplorerListFooter() {
  //

  //
  // A. Setup variables

  const t = useTranslations('AlertsExplorerListFooter');
  const alertsExplorerContext = useAlertsExplorerContext();

  //
  // B. Render components

  return <ListFooter>{t('found_items', { count: alertsExplorerContext.list.items.length })}</ListFooter>;

  //
}
