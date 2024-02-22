'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function FaresExplorerListFooter() {
  //

  //
  // A. Setup variables

  const t = useTranslations('FaresExplorerListFooter');
  const faresExplorerContext = useFaresExplorerContext();

  //
  // B. Render components

  return <ListFooter>{t('found_items', { count: faresExplorerContext.list.items.length })}</ListFooter>;

  //
}
