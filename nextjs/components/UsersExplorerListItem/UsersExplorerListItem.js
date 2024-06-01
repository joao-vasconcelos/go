'use client';

/* * */

import BaseListItem from '@/components/BaseListItem/BaseListItem';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';
import { useRouter } from '@/translations/navigation';
import { useParams } from 'next/navigation';

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
		<BaseListItem isSelected={user_id === item._id} onClick={handleClick} withChevron>
			<UsersExplorerUser type="full" userId={item._id} withHoverCard={false} />
		</BaseListItem>
	);

	//
}
