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

export default function ExportsExplorerFormSlaDebugV1() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ExportsExplorerFormSlaDebugV1');
	const exportsExplorerContext = useExportsExplorerContext();

	//
	// B. Fetch data

	const { data: allAgenciesData } = useSWR('/api/agencies');

	//
	// C. Transform data

	const availableAgencies = useMemo(() => {
		if (!allAgenciesData) return [];
		return allAgenciesData.map(agency => ({ label: agency.name || '-', value: agency._id }));
	}, [allAgenciesData]);

	//
	// B. Render components

	return (
		<>
			<Section>
				<Select
					data={availableAgencies}
					description={t('form.agencies.description')}
					label={t('form.agencies.label')}
					nothingFoundMessage={t('form.agencies.nothingFound')}
					placeholder={t('form.agencies.placeholder')}
					{...exportsExplorerContext.form_sla_debug_v1.getInputProps('agency_id')}
					clearable
					searchable
				/>
			</Section>

			<Divider />

			<Section>
				<DatePickerInput
					description={t('form.debug_date.description')}
					label={t('form.debug_date.label')}
					placeholder={t('form.debug_date.placeholder')}
					{...exportsExplorerContext.form_sla_debug_v1.getInputProps('debug_date')}
					dropdownType="modal"
					clearable
				/>
			</Section>
		</>
	);
}
