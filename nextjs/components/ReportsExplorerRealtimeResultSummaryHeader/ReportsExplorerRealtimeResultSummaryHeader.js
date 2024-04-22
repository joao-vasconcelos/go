'use client';

/* * */

import Text from '@/components/Text/Text';
import { IconX } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function ReportsExplorerRealtimeResultSummaryHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerRealtimeResultSummaryHeader');
  const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

  //
  // B. Render components

  return (
    <ListHeader>
      <ActionIcon size="lg" onClick={reportsExplorerRealtimeContext.clearAllData} variant="subtle" color="gray">
        <IconX size="20px" />
      </ActionIcon>
      <Text size="h2" full>
        {t('title')}
      </Text>
    </ListHeader>
  );

  //
}
