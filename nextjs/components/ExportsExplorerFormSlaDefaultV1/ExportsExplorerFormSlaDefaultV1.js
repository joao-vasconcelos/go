'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import { useExportsExplorerContext } from '@/contexts/ExportsExplorerContext';
import { Divider, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
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
	const { data: allAvailableSlaOperationalDaysData } = useSWR('/api/sla/progress/');

	//
	// C. Transform data

	const availableAgencies = useMemo(() => {
		if (!allAgenciesData) return [];
		return allAgenciesData.map(agency => ({ label: agency.name || '-', value: agency._id }));
	}, [allAgenciesData]);

	const excludedDates = (date) => {
		return false;
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
					dropdownType="modal"
					clearable
				/>
				<DatePickerInput
					description={t('form.end_date.description')}
					excludeDate={excludedDates}
					label={t('form.end_date.label')}
					placeholder={t('form.end_date.placeholder')}
					{...exportsExplorerContext.form_sla_default_v1.getInputProps('end_date')}
					dropdownType="modal"
					clearable
				/>
			</Section>
		</>
	);
}
