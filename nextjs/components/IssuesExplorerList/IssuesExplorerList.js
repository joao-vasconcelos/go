'use client';

/* * */

import IssuesExplorerListFooter from '@/components/IssuesExplorerListFooter/IssuesExplorerListFooter';
import IssuesExplorerListHeader from '@/components/IssuesExplorerListHeader/IssuesExplorerListHeader';
import IssuesExplorerListTableHeader from '@/components/IssuesExplorerListTableHeader/IssuesExplorerListTableHeader';
import IssuesExplorerListTableRow from '@/components/IssuesExplorerListTableRow/IssuesExplorerListTableRow';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { Table } from '@mantine/core';
import useSWR from 'swr';

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
		<Pannel error={allIssuesError} footer={<IssuesExplorerListFooter />} header={<IssuesExplorerListHeader />} loading={allIssuesLoading} validating={allIssuesValidating}>
			{issuesExplorerContext.list.items.length > 0
				? (
					<Table horizontalSpacing="md" highlightOnHover stickyHeader>
						<IssuesExplorerListTableHeader />
						<Table.Tbody>
							{issuesExplorerContext.list.items.map(item => <IssuesExplorerListTableRow key={item._id} item={item} />)}
						</Table.Tbody>
					</Table>
				)
				: <NoDataLabel fill />}
		</Pannel>
	);

	//
}
