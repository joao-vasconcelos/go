'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import { SimpleGrid } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import StatCard from '@/components/StatCard/StatCard';

/* * */

export default function RealtimeExplorerResultSummaryMetrics() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultSummaryMetrics');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Render components

  return (
    <Section>
      <SimpleGrid cols={2}>
        <StatCard title={t('total_events.title')} value={-1} displayValue={-1} />
        <StatCard title={t('total_trips.title')} value={realtimeExplorerContext.request.summary.length} displayValue={realtimeExplorerContext.request.summary.length} />
      </SimpleGrid>
    </Section>
  );

  //
}
