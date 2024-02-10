import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, code, short_name, name, price, currency_type }) {
  //

  const router = useRouter();
  const { fare_id } = useParams();
  const t = useTranslations('fares');

  const handleClick = () => {
    if (fare_id === _id) return;
    router.push(`/dashboard/fares/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={fare_id === _id} withChevron>
      <Text size="title" style={!name && 'untitled'}>
        {name || t('untitled')}
      </Text>
      <Group>
        <Badge>{code}</Badge>
        <Badge>{short_name}</Badge>
        <Badge>{`${price} ${currency_type}`}</Badge>
      </Group>
    </BaseListItem>
  );
}
