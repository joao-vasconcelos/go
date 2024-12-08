'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import Loader from '@/components/Loader/Loader';
import { useExportsExplorerContext } from '@/contexts/ExportsExplorerContext';
import { Divider, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { OPERATIONAL_DATE_FORMAT } from '@tmlmobilidade/services/types';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

/* * */

export default function ExportsExplorerFormSlaDefaultV1() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ExportsExplorerFormSlaDefaultV1');
	const exportsExplorerContext = useExportsExplorerContext();

	//
	// B. Fetch data

	const { data: allAgenciesData } = useSWR('/api/agencies');
	const { data: breakdownByOperationalDateData, isLoading: breakdownByOperationalDateLoading } = useSWR('/api/sla/progress/breakdown-by-operational-date');

	//
	// C. Transform data

	const availableAgencies = useMemo(() => {
		if (!allAgenciesData) return [];
		return allAgenciesData.map(agency => ({ label: agency.name || '-', value: agency._id }));
	}, [allAgenciesData]);

	const availableOperationalDates = useMemo(() => {
		if (!breakdownByOperationalDateData) return null;
		const onlyCompletedOperationalDates = breakdownByOperationalDateData.filter(item => item.complete === item.total).map(item => item.operational_date);
		return new Set(onlyCompletedOperationalDates);
	}, [breakdownByOperationalDateData]);

	const excludedDates = (date) => {
		if (!availableOperationalDates || !breakdownByOperationalDateData || !breakdownByOperationalDateData.length) return true;
		const dateString = DateTime.fromJSDate(date).toFormat(OPERATIONAL_DATE_FORMAT);
		return !availableOperationalDates.has(dateString);
	};

	//
	// D. Render components

	return (
		<>
			<Section>
				<Select
					data={availableAgencies}
					description={t('form.agencies.description')}
					label={t('form.agencies.label')}
					nothingFoundMessage={t('form.agencies.nothingFound')}
					placeholder={t('form.agencies.placeholder')}
					{...exportsExplorerContext.form_sla_default_v1.getInputProps('agency_id')}
					clearable
					searchable
				/>
			</Section>

			<Divider />

			<Section>
				<DatePickerInput
					description={t('form.start_date.description')}
					excludeDate={excludedDates}
					label={t('form.start_date.label')}
					placeholder={t('form.start_date.placeholder')}
					{...exportsExplorerContext.form_sla_default_v1.getInputProps('start_date')}
					disabled={breakdownByOperationalDateLoading}
					dropdownType="modal"
					rightSection={breakdownByOperationalDateLoading ? <Loader size={18} visible /> : null}
					clearable
				/>
				<DatePickerInput
					description={t('form.end_date.description')}
					excludeDate={excludedDates}
					label={t('form.end_date.label')}
					placeholder={t('form.end_date.placeholder')}
					{...exportsExplorerContext.form_sla_default_v1.getInputProps('end_date')}
					disabled={breakdownByOperationalDateLoading}
					dropdownType="modal"
					rightSection={breakdownByOperationalDateLoading ? <Loader size={18} visible /> : null}
					clearable
				/>
			</Section>
		</>
	);
}
