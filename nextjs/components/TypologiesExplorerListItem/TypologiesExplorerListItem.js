'use client';

/* * */

import Badge from '@/components/Badge/Badge';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import { useRouter } from '@/translations/navigation';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

/* * */

export default function TypologiesExplorerListItem({ item }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { typology_id } = useParams();
	const t = useTranslations('TypologiesExplorerListItem');

	//
	// B. Handle actions

	const handleClick = () => {
		if (typology_id === item._id) return;
		router.push(`/typologies/${item._id}`);
	};

	//
	// C. Render components

	return (
		<BaseListItem isSelected={typology_id === item._id} onClick={handleClick} withChevron>
			<Text size="title" style={!item.name && 'untitled'}>
				{item.name || t('untitled')}
			</Text>
			<Badge>{item.code}</Badge>
		</BaseListItem>
	);

	//
}
