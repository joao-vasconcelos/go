'use client';

/* * */

import useSWR from 'swr';
import { Box, HoverCard } from '@mantine/core';
import UsersExplorerUserSimple from '@/components/UsersExplorerUserSimple/UsersExplorerUserSimple';
import UsersExplorerUserAvatar from '@/components/UsersExplorerUserAvatar/UsersExplorerUserAvatar';
import UsersExplorerUserFull from '@/components/UsersExplorerUserFull/UsersExplorerUserFull';
import UsersExplorerUserPopover from '@/components/UsersExplorerUserPopover/UsersExplorerUserPopover';

/* * */

export default function UsersExplorerUser({ userId, type = 'avatar', withHoverCard = true }) {
  //

  //
  // A. Fetch data

  const { data: userData } = useSWR(userId && `/api/users/${userId}`);

  //
  // B. Render components

  return userData ? (
    <HoverCard width={400} shadow="md" withArrow openDelay={200} closeDelay={200}>
      <HoverCard.Target>
        <Box style={{ cursor: withHoverCard ? 'help' : 'inherit' }}>
          {type === 'simple' && <UsersExplorerUserSimple userData={userData} />}
          {type === 'avatar' && <UsersExplorerUserAvatar userData={userData} />}
          {type === 'full' && <UsersExplorerUserFull userData={userData} />}
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
