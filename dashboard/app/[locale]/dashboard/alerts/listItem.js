'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';
import Badge from '@/components/Badge/Badge';
import { Group } from '@mantine/core';

export default function ListItem({ _id, title, published, created_by }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { alert_id } = useParams();
  const t = useTranslations('alerts');

  //
  // B. Fetch data

  const { data: userData } = useSWR(created_by && `/api/users/${created_by}`);

  //
  // C. Handle actions

  const handleClick = () => {
    if (alert_id === _id) return;
    router.push(`/dashboard/alerts/${_id}`);
  };

  //
  // D. Render components

  return (
    <BaseListItem onClick={handleClick} isSelected={alert_id === _id} withChevron>
      <Text size='title' style={!title && 'untitled'}>
        {title || t('untitled')}
      </Text>
      <Group>
        {published ? <Badge>{t('list.published.true')}</Badge> : <Badge>{t('list.published.false')}</Badge>}
        <Badge>{userData ? t('list.created_by', { user_name: userData.name }) : '• • •'}</Badge>
      </Group>
    </BaseListItem>
  );
}
