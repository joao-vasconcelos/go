'use client';

/* * */

import Text from '@/components/Text/Text';
import { IconX } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useReportsExplorerSalesContext } from '@/contexts/ReportsExplorerSalesContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function ReportsExplorerSalesResultSummaryHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesResultSummaryHeader');
  const reportsExplorerSalesContext = useReportsExplorerSalesContext();

  //
  // B. Render components

  return (
    <ListHeader>
      <ActionIcon size="lg" onClick={reportsExplorerSalesContext.clearAllData} variant="subtle" color="gray">
        <IconX size="20px" />
      </ActionIcon>
      <Text size="h2" full>
        {t('title')}
      </Text>
    </ListHeader>
  );

  //
}
