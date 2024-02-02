'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function IssuesExplorerListFooter() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerListFooter');
  const tagsExplorerContext = useTagsExplorerContext();

  //
  // B. Render components

  return <ListFooter>{t('footer', { count: tagsExplorerContext.list.items.length })}</ListFooter>;

  //
}
