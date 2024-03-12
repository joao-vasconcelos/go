'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { SimpleGrid } from '@mantine/core';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import StatCard from '@/components/StatCard/StatCard';
import PatternsExplorerIdPageShapeMap from '@/components/PatternsExplorerIdPageShapeMap/PatternsExplorerIdPageShapeMap';

/* * */

export default function PatternsExplorerIdPageShape() {
  //

  //
  // A. Setup variables

  const t = useTranslations('PatternsExplorerIdPageShape');
  const linessExplorerContext = useLinesExplorerContext();
  const patternsExplorerContext = usePatternsExplorerContext();

  //
  // B. Fetch data

  const { data: agencyData } = useSWR(linessExplorerContext.item_data && linessExplorerContext.item_data.agency && `/api/agencies/${linessExplorerContext.item_data.agency}`);

  //
  // C. Transform data

  const shapeExtensionCardValue = useMemo(() => {
    if (!patternsExplorerContext.form.values?.shape?.extension) return '(no shape)';
    if (patternsExplorerContext.form.values?.shape?.extension > 1000) return `${(patternsExplorerContext.form.values.shape.extension / 1000).toFixed(3)} km`;
    else return `${patternsExplorerContext.form.values.shape.extension} m`;
  }, [patternsExplorerContext.form.values]);

  const shapeCost = useMemo(() => {
    if (!patternsExplorerContext.form.values?.shape?.extension || !agencyData) return '(no shape)';
    const shapeExtensionInKm = patternsExplorerContext.form.values?.shape?.extension / 1000;
    const shapeCostRaw = shapeExtensionInKm * agencyData.price_per_km;
    return `${shapeCostRaw.toFixed(2)} €`;
  }, [agencyData, patternsExplorerContext.form.values]);

  //
  // D. Render components

  return (
    <>
      <AppLayoutSection>
        <SimpleGrid cols={2}>
          <StatCard title={t('cards.extension')} value={shapeExtensionCardValue} />
          <StatCard title={t('cards.cost')} value={shapeCost} />
        </SimpleGrid>
      </AppLayoutSection>
      <PatternsExplorerIdPageShapeMap />
    </>
  );

  //
}
