import Badge from '@/components/Badge/Badge';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import { useRouter } from '@/translations/navigation';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ListItem({ _id, code, name }) {
	//

	const router = useRouter();
	const { zone_id } = useParams();
	const t = useTranslations('zones');

	const handleClick = () => {
		if (zone_id === _id) return;
		router.push(`/zones/${_id}`);
	};

	return (
		<BaseListItem isSelected={zone_id === _id} onClick={handleClick} withChevron>
			<Text size="title" style={!name && 'untitled'}>
				{name || t('untitled')}
			</Text>
			<Badge>{code}</Badge>
		</BaseListItem>
	);
}
