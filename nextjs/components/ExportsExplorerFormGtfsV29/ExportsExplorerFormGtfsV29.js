'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { SimpleGrid, Select, MultiSelect, Divider, Switch, NumberInput } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import { useMemo } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { DateTime } from 'luxon';
import { useExportsExplorerContext } from '@/contexts/ExportsExplorerContext';

/* * */

export default function ExportsExplorerFormGtfsV29() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ExportsExplorerFormGtfsV29');
	const exportsExplorerContext = useExportsExplorerContext();

	//
	// B. Fetch data

	const { data: allAgenciesData } = useSWR('/api/agencies');
	const { data: allLinesData } = useSWR('/api/lines');

	//
	// B. Format data

	const availableAgencies = useMemo(() => {
		if (!allAgenciesData) return [];
		return allAgenciesData.map((agency) => ({ value: agency._id, label: agency.name || '-' }));
	}, [allAgenciesData]);

	const availableLinesToInclude = useMemo(() => {
		if (!allLinesData && !exportsExplorerContext.form_gtfs_v29.values.agency_id) return [];
		const filteredLinesBySelectedAgency = allLinesData.filter((item) => item.agency === exportsExplorerContext.form_gtfs_v29.values.agency_id);
		return filteredLinesBySelectedAgency.map((item) => ({ value: item._id, label: `(${item.short_name}) ${item.name}` }));
	}, [allLinesData, exportsExplorerContext.form_gtfs_v29.values.agency_id]);

	const availableLinesToExclude = useMemo(() => {
		if (!allLinesData || !exportsExplorerContext.form_gtfs_v29.values.agency_id) return [];
		const filteredLinesBySelectedAgency = allLinesData.filter((item) => item.agency === exportsExplorerContext.form_gtfs_v29.values.agency_id);
		return filteredLinesBySelectedAgency.map((item) => ({ value: item._id, label: `(${item.short_name}) ${item.name}` }));
	}, [allLinesData, exportsExplorerContext.form_gtfs_v29.values.agency_id]);

	//
	// D. Handle actions

	const handleSelectAgency = (agencyId) => {
		// Set the selected agency
		exportsExplorerContext.form_gtfs_v29.setFieldValue('agency_id', agencyId);
		// Set Feed Start Date, since it does not require any agency information
		const firstDayOfNextMonth = DateTime.now().plus({ months: 1 }).startOf('month');
		exportsExplorerContext.form_gtfs_v29.setFieldValue('feed_start_date', firstDayOfNextMonth.toJSDate());
		// Get the selected agency data
		const agencyData = allAgenciesData.find((agency) => agency._id === agencyId);
		// Exit if no agency found or agency has not set an operation start date
		if (!agencyData || !agencyData.operation_start_date) return;
		// Setup variables to hold the start and end dates of the current operational year
		let currentOperationYearStartDate;
		let currentOperationYearEndDate;
		// Get the operation start date into a DateTime object
		const operationStartDate = DateTime.fromFormat(agencyData.operation_start_date, 'yyyyMMdd');
		// If now is before the start date of the operationation if it was this year...
		if (agencyId === '645d7f204ef63aec14fbf22a') {
			// If A4 then start the next month until the end of the contract
			const endOfContractStartDate = DateTime.now().set({ year: 2029, month: 12, day: 31 }).endOf('month');
			const nextMonthStartDatePlusOneYear = firstDayOfNextMonth.plus({ year: 1, day: -1 }).endOf('month');
			// Set the corresponding fields
			exportsExplorerContext.form_gtfs_v29.setFieldValue('calendars_clip_start_date', firstDayOfNextMonth.toJSDate());
			exportsExplorerContext.form_gtfs_v29.setFieldValue('calendars_clip_end_date', endOfContractStartDate.toJSDate());
			exportsExplorerContext.form_gtfs_v29.setFieldValue('feed_end_date', nextMonthStartDatePlusOneYear.toJSDate());
			exportsExplorerContext.form_gtfs_v29.setFieldValue('numeric_calendar_codes', true);
		} else if (DateTime.now() < operationStartDate.set({ year: DateTime.now().year })) {
			// ...then it means the current operation year started last year
			currentOperationYearStartDate = operationStartDate.set({ year: DateTime.now().year - 1 });
			currentOperationYearEndDate = currentOperationYearStartDate.plus({ year: 1 }).minus({ day: 1 });
			// Set the corresponding fields
			exportsExplorerContext.form_gtfs_v29.setFieldValue('calendars_clip_start_date', currentOperationYearStartDate.toJSDate());
			exportsExplorerContext.form_gtfs_v29.setFieldValue('calendars_clip_end_date', currentOperationYearEndDate.toJSDate());
			exportsExplorerContext.form_gtfs_v29.setFieldValue('feed_end_date', currentOperationYearEndDate.toJSDate());
			//
		} else {
			// ...else it means the current operation year is in the current year
			currentOperationYearStartDate = operationStartDate.set({ year: DateTime.now().year });
			currentOperationYearEndDate = currentOperationYearStartDate.plus({ year: 1 }).minus({ day: 1 });
			// Set the corresponding fields
			exportsExplorerContext.form_gtfs_v29.setFieldValue('calendars_clip_start_date', currentOperationYearStartDate.toJSDate());
			exportsExplorerContext.form_gtfs_v29.setFieldValue('calendars_clip_end_date', currentOperationYearEndDate.toJSDate());
			exportsExplorerContext.form_gtfs_v29.setFieldValue('feed_end_date', currentOperationYearEndDate.toJSDate());
			//
		}
		//
	};

	//
	// E. Render components

	return (
		<>
			<Section>
				<Select
					label={t('form.agencies.label')}
					description={t('form.agencies.description')}
					placeholder={t('form.agencies.placeholder')}
					nothingFoundMessage={t('form.agencies.nothingFound')}
					data={availableAgencies}
					{...exportsExplorerContext.form_gtfs_v29.getInputProps('agency_id')}
					onChange={handleSelectAgency}
					searchable
					clearable
				/>
			</Section>

			<Divider />

			<Section>
				<MultiSelect
					label={t('form.lines_include.label')}
					placeholder={t('form.lines_include.placeholder')}
					description={t('form.lines_include.description')}
					nothingFoundMessage={t('form.lines_include.nothingFound')}
					data={availableLinesToInclude}
					{...exportsExplorerContext.form_gtfs_v29.getInputProps('lines_include')}
					disabled={!exportsExplorerContext.form_gtfs_v29.values.agency_id || exportsExplorerContext.form_gtfs_v29.values.lines_exclude.length > 0}
					searchable
					clearable
				/>
				<MultiSelect
					label={t('form.lines_exclude.label')}
					placeholder={t('form.lines_exclude.placeholder')}
					description={t('form.lines_exclude.description')}
					nothingFoundMessage={t('form.lines_exclude.nothingFound')}
					data={availableLinesToExclude}
					{...exportsExplorerContext.form_gtfs_v29.getInputProps('lines_exclude')}
					disabled={!exportsExplorerContext.form_gtfs_v29.values.agency_id || exportsExplorerContext.form_gtfs_v29.values.lines_include.length > 0}
					searchable
					clearable
				/>
			</Section>

			<Divider />

			<Section>
				<SimpleGrid cols={2}>
					<DatePickerInput
						label={t('form.feed_start_date.label')}
						description={t('form.feed_start_date.description')}
						placeholder={t('form.feed_start_date.placeholder')}
						{...exportsExplorerContext.form_gtfs_v29.getInputProps('feed_start_date')}
						disabled={!exportsExplorerContext.form_gtfs_v29.values.agency_id}
						dropdownType="modal"
						clearable
					/>
					<DatePickerInput
						label={t('form.feed_end_date.label')}
						description={t('form.feed_end_date.description')}
						placeholder={t('form.feed_end_date.placeholder')}
						{...exportsExplorerContext.form_gtfs_v29.getInputProps('feed_end_date')}
						disabled={!exportsExplorerContext.form_gtfs_v29.values.feed_end_date}
						minDate={exportsExplorerContext.form_gtfs_v29.values.feed_start_date}
						dropdownType="modal"
						clearable
					/>
				</SimpleGrid>
			</Section>

			<Divider />

			<Section>
				<SimpleGrid cols={1}>
					<Switch
						label={t('form.clip_calendars.label')}
						description={t('form.clip_calendars.description')}
						{...exportsExplorerContext.form_gtfs_v29.getInputProps('clip_calendars', { type: 'checkbox' })}
						disabled={!exportsExplorerContext.form_gtfs_v29.values.agency_id || !exportsExplorerContext.form_gtfs_v29.values.feed_start_date || !exportsExplorerContext.form_gtfs_v29.values.feed_end_date}
					/>
				</SimpleGrid>
				{exportsExplorerContext.form_gtfs_v29.values.clip_calendars &&
          <SimpleGrid cols={2}>
          	<DatePickerInput
          		label={t('form.calendars_clip_start_date.label')}
          		description={t('form.calendars_clip_start_date.description')}
          		placeholder={t('form.calendars_clip_start_date.placeholder')}
          		{...exportsExplorerContext.form_gtfs_v29.getInputProps('calendars_clip_start_date')}
          		disabled={!exportsExplorerContext.form_gtfs_v29.values.agency_id}
          		dropdownType="modal"
          		clearable
          	/>
          	<DatePickerInput
          		label={t('form.calendars_clip_end_date.label')}
          		description={t('form.calendars_clip_end_date.description')}
          		placeholder={t('form.calendars_clip_end_date.placeholder')}
          		{...exportsExplorerContext.form_gtfs_v29.getInputProps('calendars_clip_end_date')}
          		disabled={!exportsExplorerContext.form_gtfs_v29.values.calendars_clip_start_date}
          		minDate={exportsExplorerContext.form_gtfs_v29.values.calendars_clip_start_date}
          		dropdownType="modal"
          		clearable
          	/>
          </SimpleGrid>
				}
			</Section>

			<Divider />

			<Section>
				<SimpleGrid cols={1}>
					<Switch
						label={t('form.numeric_calendar_codes.label')}
						description={t('form.numeric_calendar_codes.description')}
						{...exportsExplorerContext.form_gtfs_v29.getInputProps('numeric_calendar_codes', { type: 'checkbox' })}
						disabled={!exportsExplorerContext.form_gtfs_v29.values.agency_id || !exportsExplorerContext.form_gtfs_v29.values.feed_start_date || !exportsExplorerContext.form_gtfs_v29.values.feed_end_date}
					/>
				</SimpleGrid>
			</Section>

			<Divider />

			<Section>
				<SimpleGrid cols={1}>
					<NumberInput
						label={t('form.stop_sequence_start.label')}
						description={t('form.stop_sequence_start.description')}
						placeholder={t('form.stop_sequence_start.placeholder')}
						{...exportsExplorerContext.form_gtfs_v29.getInputProps('stop_sequence_start')}
						disabled={!exportsExplorerContext.form_gtfs_v29.values.agency_id || !exportsExplorerContext.form_gtfs_v29.values.feed_start_date || !exportsExplorerContext.form_gtfs_v29.values.feed_end_date}
						max={1}
						min={0}
					/>
				</SimpleGrid>
			</Section>
		</>
	);
}