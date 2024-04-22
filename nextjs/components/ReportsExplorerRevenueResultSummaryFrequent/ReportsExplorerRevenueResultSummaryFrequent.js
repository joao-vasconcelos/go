'use client';

/* * */

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { NumberInput, SimpleGrid, Table } from '@mantine/core';
import StatCard from '@/components/StatCard/StatCard';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import ReportsExplorerRevenueResultSummaryFrequentDownload from '@/components/ReportsExplorerRevenueResultSummaryFrequentDownload/ReportsExplorerRevenueResultSummaryFrequentDownload';
import sorter from '@/helpers/sorter';

/* * */

export default function ReportsExplorerRevenueResultSummaryFrequent() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerRevenueResultSummaryFrequent');
  const reportsExplorerSalesContext = useReportsExplorerRevenueContext();

  //
  // B. Transform data

  const metricsDataFormatted = useMemo(() => {
    if (!reportsExplorerSalesContext.request.summary_frequent) return {};
    const totalTransactionsQty = reportsExplorerSalesContext.request.summary_frequent.reduce((acc, item) => acc + item.transactions_qty, 0);
    return {
      total_transactions_qty: totalTransactionsQty,
      total_transactions_euro: (totalTransactionsQty * reportsExplorerSalesContext.multipliers.values.frequent) / 100,
    };
  }, [reportsExplorerSalesContext.multipliers.values.frequent, reportsExplorerSalesContext.request.summary_frequent]);

  const tableDataFormatted = useMemo(() => {
    if (!reportsExplorerSalesContext.request.summary_frequent) return {};
    return {
      head: [t('table.product_id.title'), t('table.transactions_qty.title'), t('table.transactions_euro.title')],
      body: reportsExplorerSalesContext.request.summary_frequent
        .sort((a, b) => sorter.compare(a.product_id, b.product_id))
        .map((item) => [item.product_id, t('table.transactions_qty.value', { value: item.transactions_qty }), t('table.transactions_euro.value', { value: (item.transactions_qty * reportsExplorerSalesContext.multipliers.values.frequent) / 100 })]),
    };
  }, [reportsExplorerSalesContext.multipliers.values.frequent, reportsExplorerSalesContext.request.summary_frequent, t]);

  //
  // C. Render components

  return (
    <AppLayoutSection title={t('title')} description={t('description')}>
      <SimpleGrid cols={3}>
        <NumberInput label={t('form.multiplier.label')} description={t('form.multiplier.description')} placeholder={t('form.multiplier.placeholder')} {...reportsExplorerSalesContext.multipliers.getInputProps('frequent')} min={0} max={500} />
      </SimpleGrid>
      <SimpleGrid cols={2}>
        <StatCard label={t('metrics.total_transactions_qty.label')} value={metricsDataFormatted.total_transactions_qty} displayValue={t('metrics.total_transactions_qty.value', { value: metricsDataFormatted.total_transactions_qty })} />
        <StatCard label={t('metrics.total_transactions_euro.label')} value={metricsDataFormatted.total_transactions_euro} displayValue={t('metrics.total_transactions_euro.value', { value: metricsDataFormatted.total_transactions_euro })} />
      </SimpleGrid>
      <Table data={tableDataFormatted} highlightOnHover withTableBorder withColumnBorders />
      <ReportsExplorerRevenueResultSummaryFrequentDownload />
    </AppLayoutSection>
  );

  //
}
