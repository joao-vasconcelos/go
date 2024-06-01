import Badge from '@/components/Badge/Badge';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import { useRouter } from '@/translations/navigation';
import { Group } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ListItem({ _id, code, name }) {
	//

	const router = useRouter();
	const { calendar_id } = useParams();
	const t = useTranslations('calendars');

	const handleClick = () => {
		if (calendar_id === _id) return;
		router.push(`/calendars/${_id}`);
	};

	return (
		<BaseListItem isSelected={calendar_id === _id} onClick={handleClick} withChevron>
			<Text size="title" style={!name && 'untitled'}>
				{name || t('untitled')}
			</Text>
			<Group>
				<Badge>{code}</Badge>
			</Group>
		</BaseListItem>
	);
}
