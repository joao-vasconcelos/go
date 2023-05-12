import { useRouter, useParams } from 'next/navigation';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import Text from '../../../../components/Text/Text';
import Badge from '../../../../components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, stop_name, stop_code, stop_lat, stop_lon }) {
  //

  const router = useRouter();
  const { stop_id } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/stops/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={stop_id === _id} withChevron>
      <Text size='title' style={!stop_name && 'untitled'}>
        {stop_name || 'Paragem Sem Nome'}
      </Text>
      <Group>
        {stop_code && <Badge>{stop_code}</Badge>}
        {stop_lat && stop_lon && (
          <Badge>
            {stop_lat}, {stop_lon}
          </Badge>
        )}
      </Group>
    </BaseListItem>
  );
}
