import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCircleDotted, IconLock, IconLockOpen } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function LockButton({ isLocked, setLocked, loading, disabled }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('LockButton');

  //
  // B. Render components

  if (loading || (isLocked !== true && isLocked !== false)) {
    return (
      <ActionIcon variant="light" size="lg" loading>
        <IconCircleDotted size={20} />
      </ActionIcon>
    );
  }

  if (isLocked === true) {
    return (
      <Tooltip label={t('locked')} color="teal" position="bottom" withArrow>
        <ActionIcon color="teal" variant="light" size="lg" onClick={() => setLocked(false)} disabled={disabled}>
          <IconLock size={20} />
        </ActionIcon>
      </Tooltip>
    );
  }

  if (isLocked === false) {
    return (
      <Tooltip label={t('unlocked')} position="bottom" withArrow>
        <ActionIcon color="blue" variant="subtle" size="lg" onClick={() => setLocked(true)} disabled={disabled}>
          <IconLockOpen size={20} />
        </ActionIcon>
      </Tooltip>
    );
  }

  //
}
