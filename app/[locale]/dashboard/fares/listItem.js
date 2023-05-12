import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import Text from '../../../../components/Text/Text';
import Badge from '../../../../components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, fare_code, fare_short_name, fare_long_name, price, currency_type }) {
  //

  const router = useRouter();
  const { fare_id } = useParams();
  const t = useTranslations('fares');

  const handleClick = () => {
    router.push(`/dashboard/fares/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={fare_id === _id} withChevron>
      <Text size='title' style={!fare_long_name && 'untitled'}>
        {fare_long_name || t('untitled')}
      </Text>
      <Group>
        <Badge>{fare_code}</Badge>
        <Badge>{fare_short_name}</Badge>
        <Badge>{`${price} ${currency_type}`}</Badge>
      </Group>
    </BaseListItem>
  );
}
