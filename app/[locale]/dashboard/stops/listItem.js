import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ style, _id, name, code, latitude, longitude }) {
  //

  const router = useRouter();
  const { stop_id } = useParams();

  const handleClick = () => {
    if (stop_id === _id) return;
    router.push(`/dashboard/stops/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={stop_id === _id} withChevron style={style}>
      <Text size='subtitle' style={!name && 'untitled'}>
        {name || 'Paragem Sem Nome'}
      </Text>
      <Group>
        {code && <Badge>{code}</Badge>}
        {latitude && longitude && (
          <Badge>
            {latitude}, {longitude}
          </Badge>
        )}
      </Group>
    </BaseListItem>
  );
}
