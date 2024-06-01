import Badge from '@/components/Badge/Badge';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import { useRouter } from '@/translations/navigation';
import { Group } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ListItem({ _id, code, district, name, region }) {
	//

	const router = useRouter();
	const { municipality_id } = useParams();
	const t = useTranslations('municipalities');

	const handleClick = () => {
		if (municipality_id === _id) return;
		router.push(`/municipalities/${_id}`);
	};

	return (
		<BaseListItem isSelected={municipality_id === _id} onClick={handleClick} withChevron>
			<Text size="title" style={!name && 'untitled'}>
				{name || t('untitled')}
			</Text>
			<Group>
				<Badge>{region}</Badge>
				<Badge>{district}</Badge>
				<Badge>{code}</Badge>
			</Group>
		</BaseListItem>
	);
}
