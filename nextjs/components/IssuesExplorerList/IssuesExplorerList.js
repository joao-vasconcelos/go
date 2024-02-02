'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import IssuesExplorerListItem from '@/components/IssuesExplorerListItem/IssuesExplorerListItem';
import IssuesExplorerListHeader from '@/components/IssuesExplorerListHeader/IssuesExplorerListHeader';
import IssuesExplorerListFooter from '@/components/IssuesExplorerListFooter/IssuesExplorerListFooter';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';

/* * */

export default function IssuesExplorerList() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerList');
  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Fetch data

  const { error: allIssuesError, isLoading: allIssuesLoading, isValidating: allIssuesValidating } = useSWR('/api/issues');

  //
  // C. Render data

  return (
    <Pannel loading={allIssuesLoading} validating={allIssuesValidating} error={allIssuesError} header={<IssuesExplorerListHeader />} footer={<IssuesExplorerListFooter />}>
      {issuesExplorerContext.list.items.length > 0 ? issuesExplorerContext.list.items.map((item) => <IssuesExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
    </Pannel>
  );

  //
}
