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

export default function FaresExplorerListItem({ item }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { fare_id } = useParams();
	const t = useTranslations('FaresExplorerListItem');

	//
	// B. Handle actions

	const handleClick = () => {
		if (fare_id === item._id) return;
		router.push(`/fares/${item._id}`);
	};

	//
	// C. Render components

	return (
		<BaseListItem onClick={handleClick} isSelected={fare_id === item._id} withChevron>
			<Text size="title" style={!item.name && 'untitled'}>
				{item.name || t('untitled')}
			</Text>
			<Group>
				<Badge>{item.code}</Badge>
				<Badge>{item.short_name}</Badge>
				<Badge>{`${item.price} ${item.currency_type}`}</Badge>
			</Group>
		</BaseListItem>
	);

	//
}