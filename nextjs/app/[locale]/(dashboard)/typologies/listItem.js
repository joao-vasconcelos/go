import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';

export default function ListItem({ _id, code, name }) {
  //

  const router = useRouter();
  const { typology_id } = useParams();
  const t = useTranslations('typologies');

  const handleClick = () => {
    if (typology_id === _id) return;
    router.push(`/typologies/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={typology_id === _id} withChevron>
      <Text size="title" style={!name && 'untitled'}>
        {name || t('untitled')}
      </Text>
      <Badge>{code}</Badge>
    </BaseListItem>
  );
}
