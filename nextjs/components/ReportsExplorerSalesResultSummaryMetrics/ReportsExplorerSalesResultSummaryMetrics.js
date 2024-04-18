'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Divider, SimpleGrid, Table } from '@mantine/core';
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

  const formattedMetricsTable = useMemo(() => {
    if (!reportsExplorerSalesContext.request.result_onboard) return {};

    const totalQty = reportsExplorerSalesContext.request.result_onboard.reduce((acc, item) => acc + item.qty, 0);
    const totalEuro = reportsExplorerSalesContext.request.result_onboard.reduce((acc, item) => acc + item.euro, 0) / 100;

    const result = {
      head: ['product', 'qty', 'euro'],
      body: reportsExplorerSalesContext.request.result_onboard.map((item) => [item.productLongID, t('formatters.number', { value: item.qty }), t('formatters.euro', { value: item.euro })]),
      //   foot: ['Total', t('formatters.number', { value: totalQty }), t('formatters.euro', { value: totalEuro })],
    };
    console.log(result);
    return result;
  }, [reportsExplorerSalesContext.request.result_onboard, t]);

  const formattedMetricsTotals = useMemo(() => {
    if (!reportsExplorerSalesContext.request.result_onboard) return {};
    return {
      qty: reportsExplorerSalesContext.request.result_onboard.reduce((acc, item) => acc + item.qty, 0),
      euro: reportsExplorerSalesContext.request.result_onboard.reduce((acc, item) => acc + item.euro, 0) / 100,
    };
  }, [reportsExplorerSalesContext.request.result_onboard]);

  //
  // C. Render components

  return (
    <>
      <AppLayoutSection title={t('sections.onboard.title')} description={t('sections.onboard.description')}>
        <SimpleGrid cols={2}>
          <StatCard label={t('metrics.encm_cashback_qty.label')} value={formattedMetricsTotals.qty} displayValue={t('metrics.encm_cashback_qty.value', { value: formattedMetricsTotals.qty })} />
          <StatCard label={t('metrics.encm_cashback_euro.label')} value={formattedMetricsTotals.euro} displayValue={t('metrics.encm_cashback_euro.value', { value: formattedMetricsTotals.euro })} />
        </SimpleGrid>
        <Table data={formattedMetricsTable} highlightOnHover withTableBorder />
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
