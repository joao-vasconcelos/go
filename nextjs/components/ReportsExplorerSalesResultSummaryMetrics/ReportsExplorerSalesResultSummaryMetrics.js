'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Divider, SimpleGrid } from '@mantine/core';
import StatCard from '@/components/StatCard/StatCard';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { useReportsExplorerSalesContext } from '@/contexts/ReportsExplorerSalesContext';
import { useMemo } from 'react';

/* * */

export default function ReportsExplorerSalesResultSummaryMetrics() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesResultSummaryMetrics');
  const reportsExplorerSalesContext = useReportsExplorerSalesContext();

  //
  // B. Transform data

  const formattedMetrics = useMemo(() => {
    if (!reportsExplorerSalesContext.request.result) return {};
    return {
      ...reportsExplorerSalesContext.request.result,
      encm_sales_euro: reportsExplorerSalesContext.request.result.encm_sales_euro / 100,
      encm_cashback_euro: reportsExplorerSalesContext.request.result.encm_cashback_euro / 100,
    };
  }, [reportsExplorerSalesContext.request.result]);

  //
  // C. Render components

  return (
    <>
      <AppLayoutSection title={t('sections.encm.title')} description={t('sections.encm.description')}>
        <SimpleGrid cols={4}>
          <StatCard label={t('metrics.encm_sales_qty.label')} value={formattedMetrics.encm_sales_qty} displayValue={t('metrics.encm_sales_qty.value', { value: formattedMetrics.encm_sales_qty })} />
          <StatCard label={t('metrics.encm_sales_euro.label')} value={formattedMetrics.encm_sales_euro} displayValue={t('metrics.encm_sales_euro.value', { value: formattedMetrics.encm_sales_euro })} />
          <StatCard label={t('metrics.encm_cashback_qty.label')} value={formattedMetrics.encm_sales_qty} displayValue={t('metrics.encm_cashback_qty.value', { value: formattedMetrics.encm_cashback_qty })} />
          <StatCard label={t('metrics.encm_cashback_euro.label')} value={formattedMetrics.encm_cashback_euro} displayValue={t('metrics.encm_cashback_euro.value', { value: formattedMetrics.encm_cashback_euro })} />
        </SimpleGrid>
      </AppLayoutSection>
      <Divider />
      <AppLayoutSection title={t('sections.onboard.title')} description={t('sections.onboard.description')}>
        <SimpleGrid cols={4}>
          <StatCard label={t('metrics.onboard_sales_qty.label')} value={formattedMetrics.onboard_sales_qty} displayValue={t('metrics.onboard_sales_qty.value', { value: formattedMetrics.onboard_sales_qty })} />
          <StatCard label={t('metrics.onboard_sales_euro.label')} value={formattedMetrics.onboard_sales_euro} displayValue={t('metrics.onboard_sales_euro.value', { value: formattedMetrics.onboard_sales_euro })} />
          <StatCard label={t('metrics.onboard_cashback_qty.label')} value={formattedMetrics.onboard_cashback_qty} displayValue={t('metrics.onboard_cashback_qty.value', { value: formattedMetrics.onboard_cashback_qty })} />
          <StatCard label={t('metrics.onboard_cashback_euro.label')} value={formattedMetrics.onboard_cashback_euro} displayValue={t('metrics.onboard_cashback_euro.value', { value: formattedMetrics.onboard_cashback_euro })} />
        </SimpleGrid>
      </AppLayoutSection>
    </>
  );

  //
}
