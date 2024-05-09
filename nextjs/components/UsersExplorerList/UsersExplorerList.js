'use client';

/* * */

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import UsersExplorerListItem from '@/components/UsersExplorerListItem/UsersExplorerListItem';
import UsersExplorerListHeader from '@/components/UsersExplorerListHeader/UsersExplorerListHeader';
import UsersExplorerListFooter from '@/components/UsersExplorerListFooter/UsersExplorerListFooter';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';

/* * */

export default function UsersExplorerList() {
	//

	//
	// A. Setup variables

	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Fetch data

	const { error: allUsersError, isLoading: allUsersLoading, isValidating: allUsersValidating } = useSWR('/api/users');

	//
	// C. Render data

	return (
		<Pannel loading={allUsersLoading} validating={allUsersValidating} error={allUsersError} header={<UsersExplorerListHeader />} footer={<UsersExplorerListFooter />}>
			{usersExplorerContext.list.items.length > 0 ? usersExplorerContext.list.items.map((item) => <UsersExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}