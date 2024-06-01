import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import { useRouter } from '@/translations/navigation';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ListItem({ _id, name }) {
	//

	const router = useRouter();
	const { agency_id } = useParams();
	const t = useTranslations('agencies');

	const handleClick = () => {
		if (agency_id === _id) return;
		router.push(`/agencies/${_id}`);
	};

	return (
		<BaseListItem isSelected={agency_id === _id} onClick={handleClick} withChevron>
			<Text size="title" style={!name && 'untitled'}>
				{name || t('untitled')}
			</Text>
		</BaseListItem>
	);
}
