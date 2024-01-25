'use client';

/* * */

import Text from '@/components/Text/Text';
import { ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import { IconChevronLeft } from '@tabler/icons-react';

/* * */

export default function RealtimeExplorerResultTripDetailHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultTripDetailHeader');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Render components

  return (
    <>
      <ActionIcon size="lg" onClick={realtimeExplorerContext.clearTripId} variant="subtle" color="gray">
        <IconChevronLeft size="20px" />
      </ActionIcon>
      <Text size="h2" full>
        {t('title', { trip_id: realtimeExplorerContext.selectedTrip.trip_id })}
      </Text>
    </>
  );

  //
}
