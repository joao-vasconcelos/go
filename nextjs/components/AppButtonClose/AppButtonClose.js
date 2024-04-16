'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useRouter } from '@/translations/navigation';
import { Tooltip, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

/* * */

export default function AppButtonClose({ onClick = () => {}, href = '' }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('AppButtonClose');

  //
  // B. Handle actions

  const handleClick = () => {
    if (!href) onClick();
    else if (href) router.push(href);
  };

  //
  // C. Render components

  return (
    <Tooltip label={t('label')} color="gray" position="bottom" withArrow>
      <ActionIcon size="lg" onClick={handleClick} variant="subtle" color="gray">
        <IconX size={20} />
      </ActionIcon>
    </Tooltip>
  );

  //
}
