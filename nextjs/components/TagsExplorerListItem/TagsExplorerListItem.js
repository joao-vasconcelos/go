'use client';

/* * */

import BaseListItem from '@/components/BaseListItem/BaseListItem';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import { useRouter } from '@/translations/navigation';
import { useParams } from 'next/navigation';

/* * */

export default function TagsExplorerListItem({ item }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { tag_id } = useParams();

	//
	// B. Handle actions

	const handleClick = () => {
		if (tag_id === item._id) return;
		router.push(`/tags/${item._id}`);
	};

	//
	// C. Render components

	return (
		<BaseListItem isSelected={tag_id === item._id} onClick={handleClick} withChevron>
			<TagsExplorerTag tagId={item._id} withHoverCard={false} />
		</BaseListItem>
	);

	//
}
