'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Avatar } from '@mantine/core';

/* * */

export default function UsersExplorerUserAvatar({ userData }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerUserAvatar');

  //
  // B. Render components

  return (
    <Avatar radius="xl" size="sm">
      {userData.name.substring(0, 2)}
    </Avatar>
  );

  //
}
