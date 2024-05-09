'use client';

/* * */

import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { LinesExplorerLine } from '@/components/LinesExplorerLine/LinesExplorerLine';
import BaseListItem from '@/components/BaseListItem/BaseListItem';

/* * */

export default function LinesExplorerListItem({ item }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { line_id } = useParams();

	//
	// B. Handle actions

	const handleClick = () => {
		if (line_id === item._id) return;
		router.push(`/lines/${item._id}`);
	};

	//
	// C. Render components

	return (
		<BaseListItem onClick={handleClick} isSelected={line_id === item._id} withChevron>
			<LinesExplorerLine withLineData={item} withLink={false} />
		</BaseListItem>
	);

	//
}