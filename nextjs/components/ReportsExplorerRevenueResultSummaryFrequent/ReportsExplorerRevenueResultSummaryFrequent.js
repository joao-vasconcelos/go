'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import ReportsExplorerRevenueResultSummaryFrequentDownload from '@/components/ReportsExplorerRevenueResultSummaryFrequentDownload/ReportsExplorerRevenueResultSummaryFrequentDownload';
import StatCard from '@/components/StatCard/StatCard';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import sorter from '@/helpers/sorter';
import { NumberInput, SimpleGrid, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

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
			total_transactions_euro: (totalTransactionsQty * reportsExplorerSalesContext.multipliers.values.frequent) / 100,
			total_transactions_qty: totalTransactionsQty,
		};
	}, [reportsExplorerSalesContext.multipliers.values.frequent, reportsExplorerSalesContext.request.summary_frequent]);

	const tableDataFormatted = useMemo(() => {
		if (!reportsExplorerSalesContext.request.summary_frequent) return {};
		return {
			body: reportsExplorerSalesContext.request.summary_frequent
				.sort((a, b) => sorter.compare(a.product_id, b.product_id))
				.map(item => [item.product_id, t('table.transactions_qty.value', { value: item.transactions_qty }), t('table.transactions_euro.value', { value: (item.transactions_qty * reportsExplorerSalesContext.multipliers.values.frequent) / 100 })]),
			head: [t('table.product_id.title'), t('table.transactions_qty.title'), t('table.transactions_euro.title')],
		};
	}, [reportsExplorerSalesContext.multipliers.values.frequent, reportsExplorerSalesContext.request.summary_frequent, t]);

	//
	// C. Render components

	return (
		<AppLayoutSection description={t('description')} title={t('title')}>
			<SimpleGrid cols={3}>
				<NumberInput description={t('form.multiplier.description')} label={t('form.multiplier.label')} placeholder={t('form.multiplier.placeholder')} {...reportsExplorerSalesContext.multipliers.getInputProps('frequent')} max={500} min={0} />
			</SimpleGrid>
			<SimpleGrid cols={2}>
				<StatCard displayValue={t('metrics.total_transactions_qty.value', { value: metricsDataFormatted.total_transactions_qty })} label={t('metrics.total_transactions_qty.label')} value={metricsDataFormatted.total_transactions_qty} />
				<StatCard displayValue={t('metrics.total_transactions_euro.value', { value: metricsDataFormatted.total_transactions_euro })} label={t('metrics.total_transactions_euro.label')} value={metricsDataFormatted.total_transactions_euro} />
			</SimpleGrid>
			<Table data={tableDataFormatted} highlightOnHover withColumnBorders withTableBorder />
			<ReportsExplorerRevenueResultSummaryFrequentDownload />
		</AppLayoutSection>
	);

	//
}
