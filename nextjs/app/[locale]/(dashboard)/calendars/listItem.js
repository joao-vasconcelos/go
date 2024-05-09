import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';
import { Group } from '@mantine/core';

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
		<BaseListItem onClick={handleClick} isSelected={calendar_id === _id} withChevron>
			<Text size="title" style={!name && 'untitled'}>
				{name || t('untitled')}
			</Text>
			<Group>
				<Badge>{code}</Badge>
			</Group>
		</BaseListItem>
	);
}