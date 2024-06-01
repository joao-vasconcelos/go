'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import UsersExplorerListFooter from '@/components/UsersExplorerListFooter/UsersExplorerListFooter';
import UsersExplorerListHeader from '@/components/UsersExplorerListHeader/UsersExplorerListHeader';
import UsersExplorerListItem from '@/components/UsersExplorerListItem/UsersExplorerListItem';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import useSWR from 'swr';

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
		<Pannel error={allUsersError} footer={<UsersExplorerListFooter />} header={<UsersExplorerListHeader />} loading={allUsersLoading} validating={allUsersValidating}>
			{usersExplorerContext.list.items.length > 0 ? usersExplorerContext.list.items.map(item => <UsersExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}
