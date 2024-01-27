'use client';

/* * */

import { useTranslations } from 'next-intl';
import { SimpleGrid } from '@mantine/core';
import StatCard from '@/components/StatCard/StatCard';
import { Section } from '@/components/Layouts/Layouts';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import { useMemo } from 'react';

/* * */

export default function RealtimeExplorerResultSummaryMetrics() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultSummaryMetrics');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Transform data

  const totalEventsMetricData = useMemo(() => {
    // Return zero if no trips are yet available
    if (!realtimeExplorerContext.request.summary) return 0;
    // Setup a new variable to hold the count total
    let eventsCount = 0;
    // Count the events for each trip
    realtimeExplorerContext.request.summary.forEach((trip) => (eventsCount += trip.positions.length));
    // Return the result
    return eventsCount;
    //
  }, [realtimeExplorerContext.request.summary]);

  //
  // C. Render components

  return (
    <Section>
      <SimpleGrid cols={2}>
        <StatCard title={t('total_events.title')} value={totalEventsMetricData} displayValue={totalEventsMetricData} />
        <StatCard title={t('total_trips.title')} value={realtimeExplorerContext.request.summary.length} displayValue={realtimeExplorerContext.request.summary.length} />
      </SimpleGrid>
    </Section>
  );

  //
}
