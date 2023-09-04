import { ActionIcon, Tooltip } from '@mantine/core';
import Loader from '@/components/Loader/Loader';
import { IconLock, IconLockOpen } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function LockButton({ isLocked, setLocked }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('LockButton');

  //
  // B. Render components

  if (isLocked === true) {
    return (
      <Tooltip label={t('locked')} color="teal" position="bottom" withArrow>
        <ActionIcon color="teal" variant="light" size="lg" onClick={() => setLocked(false)}>
          <IconLock size={20} />
        </ActionIcon>
      </Tooltip>
    );
  }

  if (isLocked === false) {
    return (
      <Tooltip label={t('unlocked')} position="bottom" withArrow>
        <ActionIcon color="blue" variant="subtle" size="lg" onClick={() => setLocked(true)}>
          <IconLockOpen size={20} />
        </ActionIcon>
      </Tooltip>
    );
  }

  return <Loader size={20} visible />;

  //
}
