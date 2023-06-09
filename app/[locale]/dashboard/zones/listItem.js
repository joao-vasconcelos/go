import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, code, short_name, long_name, price, currency_type }) {
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
      <Text size='title' style={!long_name && 'untitled'}>
        {long_name || t('untitled')}
      </Text>
      <Group>
        <Badge>{code}</Badge>
        <Badge>{short_name}</Badge>
        <Badge>{`${price} ${currency_type}`}</Badge>
      </Group>
    </BaseListItem>
  );
}