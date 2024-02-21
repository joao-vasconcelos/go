'use client';

/* * */

import Text from '@/components/Text/Text';
import { IconX } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function RealtimeExplorerResultSummaryHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultSummaryHeader');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Render components

  return (
    <ListHeader>
      <ActionIcon size="lg" onClick={realtimeExplorerContext.clearAllData} variant="subtle" color="gray">
        <IconX size="20px" />
      </ActionIcon>
      <Text size="h2" full>
        {t('title')}
      </Text>
    </ListHeader>
  );

  //
}
