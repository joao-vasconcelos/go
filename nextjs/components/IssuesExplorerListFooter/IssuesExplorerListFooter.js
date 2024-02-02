'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function IssuesExplorerListFooter() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerListFooter');
  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Render components

  return <ListFooter>{t('found_items', { count: issuesExplorerContext.list.items.length })}</ListFooter>;

  //
}
