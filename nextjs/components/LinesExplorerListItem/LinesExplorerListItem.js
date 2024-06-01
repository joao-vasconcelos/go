'use client';

/* * */

import BaseListItem from '@/components/BaseListItem/BaseListItem';
import { LinesExplorerLine } from '@/components/LinesExplorerLine/LinesExplorerLine';
import { useRouter } from '@/translations/navigation';
import { useParams } from 'next/navigation';

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
		<BaseListItem isSelected={line_id === item._id} onClick={handleClick} withChevron>
			<LinesExplorerLine withLineData={item} withLink={false} />
		</BaseListItem>
	);

	//
}
