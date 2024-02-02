/* * */

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCircleDotted, IconLock, IconLockOpen } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* * */

export default function LockButton({ isLocked, onClick, disabled }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('LockButton');
  const [isLoading, setIsLoading] = useState(false);

  //
  // B. Handle actions

  const handleClick = async () => {
    setIsLoading(true);
    await onClick(!isLocked);
    setIsLoading(false);
  };

  //
  // C. Render components

  if (isLoading || (isLocked !== true && isLocked !== false)) {
    return (
      <ActionIcon variant="light" size="lg" loading>
        <IconCircleDotted size={20} />
      </ActionIcon>
    );
  }

  if (isLocked === true) {
    return (
      <Tooltip label={t('locked')} color="teal" position="bottom" withArrow>
        <ActionIcon color="teal" variant="light" size="lg" onClick={handleClick} disabled={disabled}>
          <IconLock size={20} />
        </ActionIcon>
      </Tooltip>
    );
  }

  if (isLocked === false) {
    return (
      <Tooltip label={t('unlocked')} position="bottom" withArrow>
        <ActionIcon color="blue" variant="subtle" size="lg" onClick={handleClick} disabled={disabled}>
          <IconLockOpen size={20} />
        </ActionIcon>
      </Tooltip>
    );
  }

  //
}
