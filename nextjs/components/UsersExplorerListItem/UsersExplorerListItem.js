'use client';

/* * */

import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';

/* * */

export default function UsersExplorerListItem({ item }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { user_id } = useParams();

	//
	// B. Handle actions

	const handleClick = () => {
		if (user_id === item._id) return;
		router.push(`/users/${item._id}`);
	};

	//
	// C. Render components

	return (
		<BaseListItem onClick={handleClick} isSelected={user_id === item._id} withChevron>
			<UsersExplorerUser userId={item._id} type="full" withHoverCard={false} />
		</BaseListItem>
	);

	//
}