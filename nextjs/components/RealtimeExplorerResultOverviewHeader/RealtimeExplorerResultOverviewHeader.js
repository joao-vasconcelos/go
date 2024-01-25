'use client';

/* * */

import Text from '@/components/Text/Text';
import { ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import { IconX } from '@tabler/icons-react';

/* * */

export default function RealtimeExplorerResultOverviewHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultOverviewHeader');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Render components

  return (
    <>
      <ActionIcon size="lg" onClick={realtimeExplorerContext.clearAllData} variant="subtle" color="gray">
        <IconX size="20px" />
      </ActionIcon>
      <Text size="h2" full>
        {t('title')}
      </Text>
    </>
  );

  //
}
