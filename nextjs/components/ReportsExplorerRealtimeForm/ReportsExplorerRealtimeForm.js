'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import Loader from '@/components/Loader/Loader';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerRealtimeFormHeader from '@/components/ReportsExplorerRealtimeFormHeader/ReportsExplorerRealtimeFormHeader';
import Text from '@/components/Text/Text';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { Alert, Button, Divider, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconMoodAnnoyed } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

/* * */

export default function ReportsExplorerRealtimeForm() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeForm');
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

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
		<Pannel header={<ReportsExplorerRealtimeFormHeader />}>
			<Section>
				<Text color="muted" size="h4">
					{t('summary')}
				</Text>
			</Section>
			<Divider />
			<Section>
				<Select
					data={availableAgencies}
					description={t('form.agency_code.description')}
					disabled={reportsExplorerRealtimeContext.request.is_loading}
					label={t('form.agency_code.label')}
					nothingFoundMessage={t('form.agency_code.nothingFound')}
					onChange={reportsExplorerRealtimeContext.selectAgencyId}
					placeholder={t('form.agency_code.placeholder')}
					value={reportsExplorerRealtimeContext.form.agency_code}
					clearable
					searchable
				/>
				<DatePickerInput
					description={t('form.operation_day.description')}
					disabled={reportsExplorerRealtimeContext.request.is_loading || !reportsExplorerRealtimeContext.form.agency_code}
					dropdownType="modal"
					label={t('form.operation_day.label')}
					onChange={reportsExplorerRealtimeContext.selectOperationDay}
					placeholder={t('form.operation_day.placeholder')}
					value={reportsExplorerRealtimeContext.form.operation_day}
					clearable
				/>
			</Section>
			<Divider />
			<Section>
				{reportsExplorerRealtimeContext.request.is_error
				&& (
					<Alert color="red" icon={<IconMoodAnnoyed size={20} />} title={t('info.is_error.title')}>
						{t('info.is_error.description', { errorMessage: reportsExplorerRealtimeContext.request.is_error })}
					</Alert>
				)}
				{reportsExplorerRealtimeContext.request.is_loading && !reportsExplorerRealtimeContext.request.summary?.length
				&& (
					<Alert color="gray" icon={<Loader size={20} visible />} title={t('info.is_loading.title')}>
						{t('info.is_loading.description')}
					</Alert>
				)}
				{reportsExplorerRealtimeContext.request.is_loading && reportsExplorerRealtimeContext.request.summary?.length > 0
				&& (
					<Alert color="green" icon={<Loader size={20} visible />} title={t('info.is_loading_found_trips.title', { value: reportsExplorerRealtimeContext.request.summary?.length || 0 })}>
						{t('info.is_loading_found_trips.description')}
					</Alert>
				)}
				{!reportsExplorerRealtimeContext.request.is_loading
				&& (
					<Button
						disabled={!reportsExplorerRealtimeContext.form.agency_code || !reportsExplorerRealtimeContext.form.operation_day || reportsExplorerRealtimeContext.request.summary?.length > 0}
						loading={reportsExplorerRealtimeContext.request.is_loading}
						onClick={reportsExplorerRealtimeContext.fetchEvents}
					>
						{reportsExplorerRealtimeContext.request.is_error ? t('operations.retry.label') : t('operations.submit.label')}
					</Button>
				)}
			</Section>
		</Pannel>
	);

	//
}
