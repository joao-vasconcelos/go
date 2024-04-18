'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Button, Tooltip } from '@mantine/core';
import { useReportsExplorerSalesContext } from '@/contexts/ReportsExplorerSalesContext';
import { IconListNumbers } from '@tabler/icons-react';

/* * */

export default function ReportsExplorerSalesResultSummaryOnboardDownload() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesResultSummaryOnboardDownload');
  const reportsExplorerSalesContext = useReportsExplorerSalesContext();

  //
  // B. Render components

  return (
    <div>
      <Tooltip label={reportsExplorerSalesContext.details.is_loading ? t('operations.download.loading') : t('operations.download.description')} position="bottom" withArrow>
        <Button onClick={reportsExplorerSalesContext.downloadOnboardDetail} leftSection={<IconListNumbers size={18} />} loading={reportsExplorerSalesContext.details.is_loading} variant="light" size="xs" color="grape">
          {t('operations.download.label')}
        </Button>
      </Tooltip>
    </div>
  );

  //
}
