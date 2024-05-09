'use client';

/* * */

import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';
import { Group } from '@mantine/core';

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
		<BaseListItem onClick={handleClick} isSelected={stop_id === item._id} style={style} withChevron>
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