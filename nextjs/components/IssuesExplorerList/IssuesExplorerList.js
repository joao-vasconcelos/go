'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ListFooter from '@/components/ListFooter/ListFooter';
import IssuesExplorerListItem from '@/components/IssuesExplorerListItem/IssuesExplorerListItem';
import IssuesExplorerListHeader from '@/components/IssuesExplorerListHeader/IssuesExplorerListHeader';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';

/* * */

export default function IssuesExplorerList() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerList');
  const tagsExplorerContext = useTagsExplorerContext();

  //
  // B. Fetch data

  const { error: allTagsError, isLoading: allTagsLoading, isValidating: allTagsValidating } = useSWR('/api/tags');

  //
  // C. Render data

  return (
    <Pannel loading={allTagsLoading} validating={allTagsValidating} error={allTagsError} header={<IssuesExplorerListHeader />} footer={<ListFooter>{t('footer', { count: tagsExplorerContext.list.items.length })}</ListFooter>}>
      {tagsExplorerContext.list.items.length > 0 ? tagsExplorerContext.list.items.map((item) => <IssuesExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
    </Pannel>
  );

  //
}
