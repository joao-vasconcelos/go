import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import Text from '../../../../components/Text/Text';
import Badge from '../../../../components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, shape_code, shape_name, shape_distance }) {
  //

  const router = useRouter();
  const { shape_id } = useParams();
  const t = useTranslations('shapes');

  const handleClick = () => {
    router.push(`/dashboard/shapes/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={shape_id === _id} withChevron>
      <Text size='title' style={!shape_name && 'untitled'}>
        {shape_name || t('untitled')}
      </Text>
      <Group>
        {shape_code && <Badge>{shape_code}</Badge>}
        {shape_distance && <Badge>{shape_distance} km</Badge>}
      </Group>
    </BaseListItem>
  );
}
