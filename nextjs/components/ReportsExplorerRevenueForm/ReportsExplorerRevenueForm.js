'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Select, Button, Alert, Divider } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import Loader from '@/components/Loader/Loader';
import { DatePickerInput } from '@mantine/dates';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import { IconMoodAnnoyed } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRevenueFormHeader from '@/components/ReportsExplorerRevenueFormHeader/ReportsExplorerRevenueFormHeader';
import ReportsExplorerRevenueFormIntro from '@/components/ReportsExplorerRevenueFormIntro/ReportsExplorerRevenueFormIntro';

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
		return allAgenciesData.map((agency) => ({ value: agency.code, label: agency.name || '-' }));
	}, [allAgenciesData]);

	//
	// D. Render components

	return (
		<Pannel header={<ReportsExplorerRevenueFormHeader />}>
			<ReportsExplorerRevenueFormIntro />
			<Divider />
			<Section>
				<Select
					label={t('form.agency_code.label')}
					description={t('form.agency_code.description')}
					placeholder={t('form.agency_code.placeholder')}
					nothingFoundMessage={t('form.agency_code.nothingFound')}
					data={availableAgencies}
					{...reportsExplorerSalesContext.form.getInputProps('agency_code')}
					disabled={reportsExplorerSalesContext.request.is_loading || reportsExplorerSalesContext.request.is_success}
					searchable
					clearable
				/>
				<DatePickerInput
					label={t('form.start_date.label')}
					description={t('form.start_date.description')}
					placeholder={t('form.start_date.placeholder')}
					{...reportsExplorerSalesContext.form.getInputProps('start_date')}
					disabled={!reportsExplorerSalesContext.form.values.agency_code || reportsExplorerSalesContext.request.is_loading || reportsExplorerSalesContext.request.is_success}
					maxDate={(new Date)}
					dropdownType="modal"
					clearable
				/>
				<DatePickerInput
					label={t('form.end_date.label')}
					description={t('form.end_date.description')}
					placeholder={t('form.end_date.placeholder')}
					{...reportsExplorerSalesContext.form.getInputProps('end_date')}
					disabled={!reportsExplorerSalesContext.form.values.agency_code || !reportsExplorerSalesContext.form.values.start_date || reportsExplorerSalesContext.request.is_loading || reportsExplorerSalesContext.request.is_success}
					minDate={reportsExplorerSalesContext.form.values.start_date}
					maxDate={(new Date)}
					dropdownType="modal"
					clearable
				/>
			</Section>
			<Divider />
			<Section>
				{reportsExplorerSalesContext.request.is_error &&
          <Alert icon={<IconMoodAnnoyed size={20} />} title={t('info.is_error.title')} color="red">
          	{t('info.is_error.description', { errorMessage: reportsExplorerSalesContext.request.is_error })}
          </Alert>
				}
				{reportsExplorerSalesContext.request.is_loading && !reportsExplorerSalesContext.request.summary?.length &&
          <Alert icon={<Loader visible size={20} />} title={t('info.is_loading.title')} color="gray">
          	{t('info.is_loading.description')}
          </Alert>
				}
				{reportsExplorerSalesContext.request.is_loading && reportsExplorerSalesContext.request.summary?.length > 0 &&
          <Alert icon={<Loader visible size={20} />} title={t('info.is_loading_found_trips.title', { value: reportsExplorerSalesContext.request.summary?.length || 0 })} color="green">
          	{t('info.is_loading_found_trips.description')}
          </Alert>
				}
				{!reportsExplorerSalesContext.request.is_loading &&
          <Button
          	onClick={reportsExplorerSalesContext.fetchSummaries}
          	disabled={!reportsExplorerSalesContext.form.values.agency_code || !reportsExplorerSalesContext.form.values.start_date || !reportsExplorerSalesContext.form.values.end_date || reportsExplorerSalesContext.request.is_success}
          	loading={reportsExplorerSalesContext.request.is_loading}
          >
          	{reportsExplorerSalesContext.request.is_error ? t('operations.retry.label') : t('operations.submit.label')}
          </Button>
				}
			</Section>
		</Pannel>
	);

	//
}