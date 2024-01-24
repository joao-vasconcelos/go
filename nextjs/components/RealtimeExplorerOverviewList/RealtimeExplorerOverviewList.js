'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Section } from '@/components/Layouts/Layouts';
import { useMemo } from 'react';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import API from '@/services/API';
import { Button } from '@mantine/core';

/* * */

export default function RealtimeExplorerOverviewList() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerOverviewList');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Format data

  const availableRealtimeTrips = useMemo(async () => {
    // Return empty if filters are empty
    if (!realtimeExplorerContext.form.agency_id || !realtimeExplorerContext.form.operation_day) return [];
    // Look for data in the DB
    const responseData = await API({
      service: 'realtime',
      operation: 'list',
      method: 'POST',
      body: {
        agency_id: realtimeExplorerContext.form.agency_id,
        operation_day: realtimeExplorerContext.form.operation_day,
      },
    });

    return responseData;
    //
  }, [realtimeExplorerContext.form.agency_id, realtimeExplorerContext.form.operation_day]);

  const handleCallApi = async () => {
    const responseData = await API({
      service: 'realtime',
      operation: 'list',
      method: 'POST',
      body: {
        agency_id: realtimeExplorerContext.form.agency_id,
        operation_day: realtimeExplorerContext.form.operation_day,
      },
    });
  };

  //
  // D. Render components

  return (
    <Section>
      <Button onClick={handleCallApi}>Call API</Button>
      {availableRealtimeTrips?.length || 'none'}
    </Section>
  );

  //
}
