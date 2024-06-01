'use client';

/* * */

import Badge from '@/components/Badge/Badge';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import { useRouter } from '@/translations/navigation';
import { Group } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

/* * */

export default function StopsExplorerListItem({ item, style }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { stop_id } = useParams();
	const t = useTranslations('StopsExplorerListItem');

	//
	// B. Handle actions

	const handleClick = () => {
		if (stop_id === item._id) return;
		router.push(`/stops/${item._id}`);
	};

	//
	// C. Render components

	return (
		<BaseListItem isSelected={stop_id === item._id} onClick={handleClick} style={style} withChevron>
			<Text size="title" style={!item.name && 'untitled'}>
				{item.name || t('untitled')}
			</Text>
			<Group>
				<Badge>{item.code}</Badge>
				<Badge>
					{item.latitude} {item.longitude}
				</Badge>
			</Group>
		</BaseListItem>
	);

	//
}
