'use client';

/* * */

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconWorldUpload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';

/* * */

export default function StopExplorerIdPageHeaderViewInWebsite() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopExplorerIdPageHeaderViewInWebsite');
  const stopsExplorerContext = useStopsExplorerContext();

  //
  // B. Render components

  return (
    <Tooltip label={t('label')} position="bottom" withArrow>
      <ActionIcon color="blue" variant="subtle" size="lg" onClick={stopsExplorerContext.openInWebsite} loading={stopsExplorerContext.page.is_loading}>
        <IconWorldUpload size={20} />
      </ActionIcon>
    </Tooltip>
  );

  //
}
