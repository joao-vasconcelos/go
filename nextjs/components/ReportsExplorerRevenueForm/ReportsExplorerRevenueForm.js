'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import Loader from '@/components/Loader/Loader';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRevenueFormHeader from '@/components/ReportsExplorerRevenueFormHeader/ReportsExplorerRevenueFormHeader';
import ReportsExplorerRevenueFormIntro from '@/components/ReportsExplorerRevenueFormIntro/ReportsExplorerRevenueFormIntro';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import { Alert, Button, Divider, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconMoodAnnoyed } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

/* * */

export default function ReportsExplorerRevenueForm() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRevenueForm');
	const reportsExplorerSalesContext = useReportsExplorerRevenueContext();

	//
	// B. Fetch data

	const { data: allAgenciesData } = useSWR('/api/agencies');

	//
	// C. Format data

	const availableAgencies = useMemo(() => {
		if (!allAgenciesData) return [];
		return allAgenciesData.map(agency => ({ label: agency.name || '-', value: agency.code }));
	}, [allAgenciesData]);

	//
	// D. Render components

	return (
		<Pannel header={<ReportsExplorerRevenueFormHeader />}>
			<ReportsExplorerRevenueFormIntro />
			<Divider />
			<Section>
				<Select
					data={availableAgencies}
					description={t('form.agency_code.description')}
					label={t('form.agency_code.label')}
					nothingFoundMessage={t('form.agency_code.nothingFound')}
					placeholder={t('form.agency_code.placeholder')}
					{...reportsExplorerSalesContext.form.getInputProps('agency_code')}
					disabled={reportsExplorerSalesContext.request.is_loading || reportsExplorerSalesContext.request.is_success}
					clearable
					searchable
				/>
				<DatePickerInput
					description={t('form.start_date.description')}
					label={t('form.start_date.label')}
					placeholder={t('form.start_date.placeholder')}
					{...reportsExplorerSalesContext.form.getInputProps('start_date')}
					disabled={!reportsExplorerSalesContext.form.values.agency_code || reportsExplorerSalesContext.request.is_loading || reportsExplorerSalesContext.request.is_success}
					dropdownType="modal"
					maxDate={(new Date())}
					clearable
				/>
				<DatePickerInput
					description={t('form.end_date.description')}
					label={t('form.end_date.label')}
					placeholder={t('form.end_date.placeholder')}
					{...reportsExplorerSalesContext.form.getInputProps('end_date')}
					disabled={!reportsExplorerSalesContext.form.values.agency_code || !reportsExplorerSalesContext.form.values.start_date || reportsExplorerSalesContext.request.is_loading || reportsExplorerSalesContext.request.is_success}
					dropdownType="modal"
					maxDate={(new Date())}
					minDate={reportsExplorerSalesContext.form.values.start_date}
					clearable
				/>
			</Section>
			<Divider />
			<Section>
				{reportsExplorerSalesContext.request.is_error
				&& (
					<Alert color="red" icon={<IconMoodAnnoyed size={20} />} title={t('info.is_error.title')}>
						{t('info.is_error.description', { errorMessage: reportsExplorerSalesContext.request.is_error })}
					</Alert>
				)}
				{reportsExplorerSalesContext.request.is_loading && !reportsExplorerSalesContext.request.summary?.length
				&& (
					<Alert color="gray" icon={<Loader size={20} visible />} title={t('info.is_loading.title')}>
						{t('info.is_loading.description')}
					</Alert>
				)}
				{reportsExplorerSalesContext.request.is_loading && reportsExplorerSalesContext.request.summary?.length > 0
				&& (
					<Alert color="green" icon={<Loader size={20} visible />} title={t('info.is_loading_found_trips.title', { value: reportsExplorerSalesContext.request.summary?.length || 0 })}>
						{t('info.is_loading_found_trips.description')}
					</Alert>
				)}
				{!reportsExplorerSalesContext.request.is_loading
				&& (
					<Button
						disabled={!reportsExplorerSalesContext.form.values.agency_code || !reportsExplorerSalesContext.form.values.start_date || !reportsExplorerSalesContext.form.values.end_date || reportsExplorerSalesContext.request.is_success}
						loading={reportsExplorerSalesContext.request.is_loading}
						onClick={reportsExplorerSalesContext.fetchSummaries}
					>
						{reportsExplorerSalesContext.request.is_error ? t('operations.retry.label') : t('operations.submit.label')}
					</Button>
				)}
			</Section>
		</Pannel>
	);

	//
}
