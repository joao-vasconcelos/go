import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';

export default function ListItem({ _id, code, name }) {
  //

  const router = useRouter();
  const { zone_id } = useParams();
  const t = useTranslations('zones');

  const handleClick = () => {
    if (zone_id === _id) return;
    router.push(`/dashboard/zones/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={zone_id === _id} withChevron>
      <Text size="title" style={!name && 'untitled'}>
        {name || t('untitled')}
      </Text>
      <Badge>{code}</Badge>
    </BaseListItem>
  );
}
