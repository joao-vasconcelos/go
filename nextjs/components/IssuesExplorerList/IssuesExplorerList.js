'use client';

/* * */

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import IssuesExplorerListTableRow from '@/components/IssuesExplorerListTableRow/IssuesExplorerListTableRow';
import IssuesExplorerListHeader from '@/components/IssuesExplorerListHeader/IssuesExplorerListHeader';
import IssuesExplorerListFooter from '@/components/IssuesExplorerListFooter/IssuesExplorerListFooter';
import IssuesExplorerListTableHeader from '@/components/IssuesExplorerListTableHeader/IssuesExplorerListTableHeader';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { Table } from '@mantine/core';

/* * */

export default function IssuesExplorerList() {
  //

  //
  // A. Setup variables

  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Fetch data

  const { error: allIssuesError, isLoading: allIssuesLoading, isValidating: allIssuesValidating } = useSWR('/api/issues');

  //
  // C. Render data

  return (
    <Pannel loading={allIssuesLoading} validating={allIssuesValidating} error={allIssuesError} header={<IssuesExplorerListHeader />} footer={<IssuesExplorerListFooter />}>
      {issuesExplorerContext.list.items.length > 0 ? (
        <Table highlightOnHover horizontalSpacing="md" stickyHeader>
          <IssuesExplorerListTableHeader />
          <Table.Tbody>
            {issuesExplorerContext.list.items.map((item) => (
              <IssuesExplorerListTableRow key={item._id} item={item} />
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <NoDataLabel fill />
      )}
    </Pannel>
  );

  //
}
