'use client';

/* * */

import BaseListItem from '@/components/BaseListItem/BaseListItem';
import { useRouter } from '@/translations/navigation';
import { useParams } from 'next/navigation';

/* * */

export default function AlertsExplorerListItem({ item }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { alert_id } = useParams();

	//
	// B. Handle actions

	const handleClick = () => {
		if (alert_id === item._id) return;
		router.push(`/alerts/${item._id}`);
	};

	//
	// C. Render components

	return (
		<BaseListItem isSelected={alert_id === item._id} onClick={handleClick} withChevron>
			<p>{item.title}</p>
		</BaseListItem>
	);

	//
}
