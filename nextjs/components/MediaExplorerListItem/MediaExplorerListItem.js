'use client';

/* * */

import BaseListItem from '@/components/BaseListItem/BaseListItem';
import { useRouter } from '@/translations/navigation';
import { useParams } from 'next/navigation';

/* * */

export default function MediaExplorerListItem({ item }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { tag_id } = useParams();

	//
	// B. Handle actions

	const handleClick = () => {
		if (tag_id === item._id) return;
		router.push(`/media/${item._id}`);
	};

	//
	// C. Render components

	return (
		<BaseListItem isSelected={tag_id === item._id} onClick={handleClick} withChevron>
			<p>{item._id}</p>
		</BaseListItem>
	);

	//
}
