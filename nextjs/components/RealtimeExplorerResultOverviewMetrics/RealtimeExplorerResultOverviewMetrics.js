'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import { SimpleGrid } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import StatCard from '@/components/StatCard/StatCard';

/* * */

export default function RealtimeExplorerResultOverviewMetrics() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultOverviewMetrics');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Render components

  return (
    <Section>
      <SimpleGrid cols={2}>
        <StatCard title={'Total Eventos'} value={-1} displayValue={-1} />
        <StatCard title={'Total Circulações'} value={realtimeExplorerContext.request.unique_trips.length} displayValue={realtimeExplorerContext.request.unique_trips.length} />
      </SimpleGrid>
    </Section>
  );

  //
}
