import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import Text from '../../../../components/Text/Text';
import Badge from '../../../../components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, code, name, district, dico }) {
  //

  const router = useRouter();
  const { municipality_id } = useParams();
  const t = useTranslations('municipalities');

  const handleClick = () => {
    if (municipality_id === _id) return;
    router.push(`/dashboard/municipalities/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={municipality_id === _id} withChevron>
      <Text size='title' style={!name && 'untitled'}>
        {name || t('untitled')}
      </Text>
      <Group>
        <Badge>{code}</Badge>
        <Badge>{district}</Badge>
        <Badge>{dico}</Badge>
      </Group>
    </BaseListItem>
  );
}
