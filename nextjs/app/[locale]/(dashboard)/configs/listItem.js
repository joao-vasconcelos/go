import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';

export default function ListItem({ _id, name }) {
  //

  const router = useRouter();
  const { agency_id } = useParams();
  const t = useTranslations('agencies');

  const handleClick = () => {
    if (agency_id === _id) return;
    router.push(`/dashboard/agencies/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={agency_id === _id} withChevron>
      <Text size="title" style={!name && 'untitled'}>
        {name || t('untitled')}
      </Text>
    </BaseListItem>
  );
}
