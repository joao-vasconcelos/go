'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function LinesExplorerListFooter() {
  //

  //
  // A. Setup variables

  const t = useTranslations('LinesExplorerListFooter');
  const linesExplorerContext = useLinesExplorerContext();

  //
  // B. Render components

  return <ListFooter>{t('found_items', { count: linesExplorerContext.list.items.length })}</ListFooter>;

  //
}
