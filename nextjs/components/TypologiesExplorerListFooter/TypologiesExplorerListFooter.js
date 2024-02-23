'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function TypologiesExplorerListFooter() {
  //

  //
  // A. Setup variables

  const t = useTranslations('TypologiesExplorerListFooter');
  const typologiesExplorerContext = useTypologiesExplorerContext();

  //
  // B. Render components

  return <ListFooter>{t('found_items', { count: typologiesExplorerContext.list.items.length })}</ListFooter>;

  //
}
