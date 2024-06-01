'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import ReportsExplorerRevenueResultSummaryPrepaidDownload from '@/components/ReportsExplorerRevenueResultSummaryPrepaidDownload/ReportsExplorerRevenueResultSummaryPrepaidDownload';
import StatCard from '@/components/StatCard/StatCard';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import sorter from '@/helpers/sorter';
import { SimpleGrid, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

/* * */

export default function ReportsExplorerRevenueResultSummaryPrepaid() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRevenueResultSummaryPrepaid');
	const reportsExplorerSalesContext = useReportsExplorerRevenueContext();

	//
	// B. Transform data

	const metricsDataFormatted = useMemo(() => {
		if (!reportsExplorerSalesContext.request.summary_prepaid) return {};
		return {
			total_cashbacks_euro: reportsExplorerSalesContext.request.summary_prepaid.reduce((acc, item) => acc + item.cashbacks_euro, 0) / 100,
			total_cashbacks_qty: reportsExplorerSalesContext.request.summary_prepaid.reduce((acc, item) => acc + item.cashbacks_qty, 0),
			total_sales_euro: reportsExplorerSalesContext.request.summary_prepaid.reduce((acc, item) => acc + item.sales_euro, 0) / 100,
			total_sales_qty: reportsExplorerSalesContext.request.summary_prepaid.reduce((acc, item) => acc + item.sales_qty, 0),
			total_transactions_euro: reportsExplorerSalesContext.request.summary_prepaid.reduce((acc, item) => acc + item.transactions_euro, 0) / 100,
			total_transactions_qty: reportsExplorerSalesContext.request.summary_prepaid.reduce((acc, item) => acc + item.transactions_qty, 0),
		};
	}, [reportsExplorerSalesContext.request.summary_prepaid]);

	const tableDataFormatted = useMemo(() => {
		if (!reportsExplorerSalesContext.request.summary_prepaid) return {};
		return {
			body: reportsExplorerSalesContext.request.summary_prepaid
				.sort((a, b) => sorter.compare(a.product_id, b.product_id))
				.map(item => [
					item.product_id,
					t('table.sales_qty.value', { value: item.sales_qty }),
					t('table.cashbacks_qty.value', { value: item.cashbacks_qty }),
					t('table.transactions_qty.value', { value: item.transactions_qty }),
					t('table.sales_euro.value', { value: item.sales_euro / 100 }),
					t('table.cashbacks_euro.value', { value: item.cashbacks_euro / 100 }),
					t('table.transactions_euro.value', { value: item.transactions_euro / 100 }),
				]),
			head: [t('table.product_id.title'), t('table.sales_qty.title'), t('table.cashbacks_qty.title'), t('table.transactions_qty.title'), t('table.sales_euro.title'), t('table.cashbacks_euro.title'), t('table.transactions_euro.title')],
		};
	}, [reportsExplorerSalesContext.request.summary_prepaid, t]);

	//
	// C. Render components

	return (
		<AppLayoutSection description={t('description')} title={t('title')}>
			<SimpleGrid cols={3}>
				<StatCard displayValue={t('metrics.total_sales_qty.value', { value: metricsDataFormatted.total_sales_qty })} label={t('metrics.total_sales_qty.label')} value={metricsDataFormatted.total_sales_qty} />
				<StatCard displayValue={t('metrics.total_cashbacks_qty.value', { value: metricsDataFormatted.total_cashbacks_qty })} label={t('metrics.total_cashbacks_qty.label')} value={metricsDataFormatted.total_cashbacks_qty} />
				<StatCard displayValue={t('metrics.total_transactions_qty.value', { value: metricsDataFormatted.total_transactions_qty })} label={t('metrics.total_transactions_qty.label')} value={metricsDataFormatted.total_transactions_qty} />
			</SimpleGrid>
			<SimpleGrid cols={3}>
				<StatCard displayValue={t('metrics.total_sales_euro.value', { value: metricsDataFormatted.total_sales_euro })} label={t('metrics.total_sales_euro.label')} value={metricsDataFormatted.total_sales_euro} />
				<StatCard displayValue={t('metrics.total_cashbacks_euro.value', { value: metricsDataFormatted.total_cashbacks_euro })} label={t('metrics.total_cashbacks_euro.label')} value={metricsDataFormatted.total_cashbacks_euro} />
				<StatCard displayValue={t('metrics.total_transactions_euro.value', { value: metricsDataFormatted.total_transactions_euro })} label={t('metrics.total_transactions_euro.label')} value={metricsDataFormatted.total_transactions_euro} />
			</SimpleGrid>
			<Table data={tableDataFormatted} highlightOnHover withColumnBorders withTableBorder />
			<ReportsExplorerRevenueResultSummaryPrepaidDownload />
		</AppLayoutSection>
	);

	//
}
