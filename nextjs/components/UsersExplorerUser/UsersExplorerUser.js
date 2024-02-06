'use client';

/* * */

import { useTranslations } from 'next-intl';
import styles from './UsersExplorerUser.module.css';
import useSWR from 'swr';
import { Anchor, Avatar, Box, Group, HoverCard, Stack, Text } from '@mantine/core';
import Loader from '../Loader/Loader';
import UsersExplorerUserAvatar from '../UsersExplorerUserAvatar/UsersExplorerUserAvatar';
import UsersExplorerUserSimple from '../UsersExplorerUserSimple/UsersExplorerUserSimple';
import UsersExplorerUserPopover from '../UsersExplorerUserPopover/UsersExplorerUserPopover';

/* * */

export default function UsersExplorerUser({ userId, type = 'avatar', withHoverCard = true }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerUser');

  //
  // B. Fetch data

  const { data: userData } = useSWR(userId && `/api/users/${userId}`);

  //
  // C. Render components

  return userData ? (
    <HoverCard width={400} shadow="md" withArrow openDelay={200}>
      <HoverCard.Target>
        <Box>
          {type === 'avatar' && <UsersExplorerUserAvatar userData={userData} />}
          {type === 'simple' && <UsersExplorerUserSimple userData={userData} />}
        </Box>
      </HoverCard.Target>
      {withHoverCard && (
        <HoverCard.Dropdown>
          <UsersExplorerUserPopover userData={userData} />
        </HoverCard.Dropdown>
      )}
    </HoverCard>
  ) : (
    <p>loading</p>
  );

  //
}
