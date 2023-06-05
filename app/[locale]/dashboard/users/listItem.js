import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import Text from '../../../../components/Text/Text';
import Badge from '../../../../components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, name, email }) {
  //

  const router = useRouter();
  const { user_id } = useParams();
  const t = useTranslations('users');

  const handleClick = () => {
    if (user_id === _id) return;
    router.push(`/dashboard/users/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={user_id === _id} withChevron>
      <Text size='title' style={!name && 'untitled'}>
        {name || t('untitled')}
      </Text>
      <Group>
        <Badge>{email}</Badge>
      </Group>
    </BaseListItem>
  );
}
