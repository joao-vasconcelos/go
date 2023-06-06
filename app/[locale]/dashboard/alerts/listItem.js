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
  const { alert_id } = useParams();
  const t = useTranslations('alerts');

  const handleClick = () => {
    if (alert_id === _id) return;
    router.push(`/dashboard/alerts/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={alert_id === _id} withChevron>
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
