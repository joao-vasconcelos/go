'use client';

/* * */

import { useTranslations } from 'next-intl';
import styles from './UsersExplorerUser.module.css';
import useSWR from 'swr';
import { Anchor, Avatar, Group, HoverCard, Stack, Text } from '@mantine/core';
import Loader from '../Loader/Loader';

/* * */

export default function UsersExplorerUser({ userId }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerUser');

  //
  // B. Fetch data

  const { data: userData } = useSWR(userId && `/api/users/${userId}`);

  //
  // C. Render components

  return (
    <div className={styles.container}>
      {userData ? (
        <HoverCard width={400} shadow="md" withArrow openDelay={200} closeDelay={400}>
          <HoverCard.Target>
            <Avatar radius="xl" size="sm">
              {userData.name.substring(0, 2)}
            </Avatar>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Group>
              <Avatar radius="xl" size="md">
                {userData.name.substring(0, 2)}
              </Avatar>
              <Stack gap={5}>
                <Text size="sm" fw={700} style={{ lineHeight: 1 }}>
                  {userData.name}
                </Text>
                <Anchor href={`mailto:${userData.email}`} c="dimmed" size="xs" style={{ lineHeight: 1 }}>
                  {userData.email}
                </Anchor>
              </Stack>
            </Group>

            <Text size="sm" mt="md">
              Customizable React components and hooks library with focus on usability, accessibility and developer experience
            </Text>

            <Group mt="md" gap="xl">
              <Text size="sm">
                Última atividade <b>{userData.last_active}</b>
              </Text>
            </Group>
          </HoverCard.Dropdown>
        </HoverCard>
      ) : (
        <Avatar radius="xl" size="sm">
          <Loader size={14} visible />
        </Avatar>
      )}
    </div>
  );

  //
}
