import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, code, name, distance }) {
  //

  const router = useRouter();
  const { shape_id } = useParams();
  const t = useTranslations('shapes');

  const handleClick = () => {
    if (shape_id === _id) return;
    router.push(`/dashboard/shapes/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={shape_id === _id} withChevron>
      <Text size='title' style={!name && 'untitled'}>
        {name || t('untitled')}
      </Text>
      <Group>
        {code && <Badge>{code}</Badge>}
        {distance && <Badge>{distance} km</Badge>}
      </Group>
    </BaseListItem>
  );
}
