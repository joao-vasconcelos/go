'use client';

/* * */

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { SimpleGrid, Table } from '@mantine/core';
import StatCard from '@/components/StatCard/StatCard';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import ReportsExplorerRevenueResultSummaryOnboardDownload from '@/components/ReportsExplorerRevenueResultSummaryOnboardDownload/ReportsExplorerRevenueResultSummaryOnboardDownload';
import sorter from '@/helpers/sorter';

/* * */

export default function ReportsExplorerRevenueResultSummaryOnboard() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerRevenueResultSummaryOnboard');
  const reportsExplorerSalesContext = useReportsExplorerRevenueContext();

  //
  // B. Transform data

  const metricsDataFormatted = useMemo(() => {
    if (!reportsExplorerSalesContext.request.summary_onboard) return {};
    return {
      total_transactions_qty: reportsExplorerSalesContext.request.summary_onboard.reduce((acc, item) => acc + item.transactions_qty, 0),
      total_sales_qty: reportsExplorerSalesContext.request.summary_onboard.reduce((acc, item) => acc + item.sales_qty, 0),
      total_cashbacks_qty: reportsExplorerSalesContext.request.summary_onboard.reduce((acc, item) => acc + item.cashbacks_qty, 0),
      total_transactions_euro: reportsExplorerSalesContext.request.summary_onboard.reduce((acc, item) => acc + item.transactions_euro, 0) / 100,
      total_sales_euro: reportsExplorerSalesContext.request.summary_onboard.reduce((acc, item) => acc + item.sales_euro, 0) / 100,
      total_cashbacks_euro: reportsExplorerSalesContext.request.summary_onboard.reduce((acc, item) => acc + item.cashbacks_euro, 0) / 100,
    };
  }, [reportsExplorerSalesContext.request.summary_onboard]);

  const tableDataFormatted = useMemo(() => {
    if (!reportsExplorerSalesContext.request.summary_onboard) return {};
    return {
      head: [t('table.product_id.title'), t('table.sales_qty.title'), t('table.cashbacks_qty.title'), t('table.transactions_qty.title'), t('table.sales_euro.title'), t('table.cashbacks_euro.title'), t('table.transactions_euro.title')],
      body: reportsExplorerSalesContext.request.summary_onboard
        .sort((a, b) => sorter.compare(a.product_id, b.product_id))
        .map((item) => [
          item.product_id,
          t('table.sales_qty.value', { value: item.sales_qty }),
          t('table.cashbacks_qty.value', { value: item.cashbacks_qty }),
          t('table.transactions_qty.value', { value: item.transactions_qty }),
          t('table.sales_euro.value', { value: item.sales_euro / 100 }),
          t('table.cashbacks_euro.value', { value: item.cashbacks_euro / 100 }),
          t('table.transactions_euro.value', { value: item.transactions_euro / 100 }),
        ]),
    };
  }, [reportsExplorerSalesContext.request.summary_onboard, t]);

  //
  // C. Render components

  return (
    <AppLayoutSection title={t('title')} description={t('description')}>
      <SimpleGrid cols={3}>
        <StatCard label={t('metrics.total_sales_qty.label')} value={metricsDataFormatted.total_sales_qty} displayValue={t('metrics.total_sales_qty.value', { value: metricsDataFormatted.total_sales_qty })} />
        <StatCard label={t('metrics.total_cashbacks_qty.label')} value={metricsDataFormatted.total_cashbacks_qty} displayValue={t('metrics.total_cashbacks_qty.value', { value: metricsDataFormatted.total_cashbacks_qty })} />
        <StatCard label={t('metrics.total_transactions_qty.label')} value={metricsDataFormatted.total_transactions_qty} displayValue={t('metrics.total_transactions_qty.value', { value: metricsDataFormatted.total_transactions_qty })} />
      </SimpleGrid>
      <SimpleGrid cols={3}>
        <StatCard label={t('metrics.total_sales_euro.label')} value={metricsDataFormatted.total_sales_euro} displayValue={t('metrics.total_sales_euro.value', { value: metricsDataFormatted.total_sales_euro })} />
        <StatCard label={t('metrics.total_cashbacks_euro.label')} value={metricsDataFormatted.total_cashbacks_euro} displayValue={t('metrics.total_cashbacks_euro.value', { value: metricsDataFormatted.total_cashbacks_euro })} />
        <StatCard label={t('metrics.total_transactions_euro.label')} value={metricsDataFormatted.total_transactions_euro} displayValue={t('metrics.total_transactions_euro.value', { value: metricsDataFormatted.total_transactions_euro })} />
      </SimpleGrid>
      <Table data={tableDataFormatted} highlightOnHover withTableBorder withColumnBorders />
      <ReportsExplorerRevenueResultSummaryOnboardDownload />
    </AppLayoutSection>
  );

  //
}
