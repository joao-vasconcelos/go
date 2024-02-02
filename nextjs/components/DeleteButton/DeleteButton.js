/* * */

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { IconCircleDotted } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* * */

export default function DeleteButton({ onClick, disabled }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('DeleteButton');
  const [isLoading, setIsLoading] = useState(false);

  //
  // B. Handle actions

  const handleClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  };

  //
  // C. Render components

  if (isLoading) {
    return (
      <ActionIcon variant="light" size="lg" loading>
        <IconCircleDotted size={20} />
      </ActionIcon>
    );
  }

  return (
    <Tooltip label={t('label')} color="red" position="bottom" disabled={disabled} withArrow>
      <ActionIcon color="red" variant="light" size="lg" onClick={handleClick} disabled={disabled}>
        <IconTrash size={20} />
      </ActionIcon>
    </Tooltip>
  );

  //
}
