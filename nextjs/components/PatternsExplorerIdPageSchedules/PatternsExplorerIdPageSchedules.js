'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Text from '@/components/Text/Text';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import { PatternScheduleDefault } from '@/schemas/Pattern/default';
import { ActionIcon, Button, MultiSelect, Select, TextInput, Tooltip } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconAB2, IconBackspace, IconCalendarCheck, IconCalendarX, IconClockPlay, IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import styles from './PatternsExplorerIdPageSchedules.module.css';

/* * */

function PatternsExplorerIdPageSchedulesStartTimeColumn({ item }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.start_time');
	const patternsExplorerContext = usePatternsExplorerContext();

	const rowIndexOfSchedule = patternsExplorerContext.form.values.schedules.findIndex(schedule => schedule._id === item._id);

	//
	// B. Handle actions

	const handleUpdateStartTime = ({ target }) => {
		// Setup the raw value
		let formattedValue = target.value;
		// Remove any non-digit characters from the value
		formattedValue = formattedValue.replace(/\D/g, '');
		// Clip the value to 6 digits
		formattedValue = formattedValue.substr(0, 4);
		// Split the value into hours and minutes
		let hoursString = formattedValue.substr(0, 2);
		let minutesString = formattedValue.substr(2, 2);
		// Parse the hours
		if (hoursString && hoursString.length == 2) {
			// Format the hours
			let hoursInt = parseInt(hoursString);
			// If the hours are bigger than 27, clamp to 27
			if (hoursInt > 27) hoursString = '27';
			// If the hours are smaller than 4, clamp to 4
			else if (hoursInt < 4) hoursString = '04';
			// Add the : if hours is in range
			else hoursString = `${hoursString}`;
		}
		// Parse the minutes
		if (minutesString && minutesString.length == 2) {
			// Format the minutes
			let minutesInt = parseInt(minutesString);
			// If the minutes are bigger than 59, clamp to 59
			if (minutesInt > 59) minutesString = '59';
			// If the minutes are smaller than 0, clamp to 0
			else if (minutesInt < 0) minutesString = '00';
		}
		// Add the : double dots
		if (hoursString.length && !minutesString.length) formattedValue = `${hoursString}`;
		else if (hoursString.length && minutesString.length) formattedValue = `${hoursString}:${minutesString}`;
		// Save the value to the form
		patternsExplorerContext.form.setFieldValue(`schedules.${rowIndexOfSchedule}.start_time`, formattedValue);
		//
	};

	//
	// C. Render components

	return (
		<div className={styles.column}>
			<Tooltip label={t('description')} position="bottom" withArrow>
				<TextInput aria-label={t('label')} leftSection={<IconClockPlay size={18} />} placeholder={t('placeholder')} {...patternsExplorerContext.form.getInputProps(`schedules.${rowIndexOfSchedule}.start_time`)} onChange={handleUpdateStartTime} readOnly={patternsExplorerContext.page.is_read_only} w="100%" />
			</Tooltip>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPageSchedulesCalendarsOnColumn({ item }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.calendars_on');
	const patternsExplorerContext = usePatternsExplorerContext();

	const rowIndexOfSchedule = patternsExplorerContext.form.values.schedules.findIndex(schedule => schedule._id === item._id);

	//
	// B. Render components

	return (
		<div className={styles.column}>
			<MultiSelect
				aria-label={t('label')}
				nothingFoundMessage={t('nothingFound')}
				placeholder={t('placeholder')}
				{...patternsExplorerContext.form.getInputProps(`schedules.${rowIndexOfSchedule}.calendars_on`)}
				data={patternsExplorerContext.data.all_calendars_data}
				leftSection={<IconCalendarCheck size={20} />}
				limit={5}
				readOnly={patternsExplorerContext.page.is_read_only}
				w="100%"
				searchable
			/>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPageSchedulesCalendarsOffColumn({ item }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.calendars_off');
	const patternsExplorerContext = usePatternsExplorerContext();

	const rowIndexOfSchedule = patternsExplorerContext.form.values.schedules.findIndex(schedule => schedule._id === item._id);

	//
	// B. Render components

	return (
		<div className={styles.column}>
			<MultiSelect
				aria-label={t('label')}
				nothingFoundMessage={t('nothingFound')}
				placeholder={t('placeholder')}
				{...patternsExplorerContext.form.getInputProps(`schedules.${rowIndexOfSchedule}.calendars_off`)}
				data={patternsExplorerContext.data.all_calendars_data}
				leftSection={<IconCalendarX size={20} />}
				limit={5}
				readOnly={patternsExplorerContext.page.is_read_only}
				w="100%"
				searchable
			/>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPageSchedulesRemoveTripColumn({ item }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.remove');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Handle actions

	const handleRemoveTrip = () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('modal.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('modal.cancel'), confirm: t('modal.confirm') },
			onConfirm: async () => {
				const rowIndexOfSchedule = patternsExplorerContext.form.values.schedules.findIndex(schedule => schedule._id === item._id);
				patternsExplorerContext.form.removeListItem('schedules', rowIndexOfSchedule);
			},
			title: <Text size="h2">{t('modal.title')}</Text>,
		});
	};

	//
	// C. Render components

	return (
		<div className={`${styles.column} ${styles.hend}`}>
			<AppAuthenticationCheck permissions={[{ action: 'edit', scope: 'lines' }]}>
				<Tooltip label={t('description')} position="bottom" withArrow>
					<ActionIcon color="red" disabled={patternsExplorerContext.page.is_read_only} onClick={handleRemoveTrip} size="lg" variant="subtle">
						<IconBackspace size={20} />
					</ActionIcon>
				</Tooltip>
			</AppAuthenticationCheck>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPageSchedulesRow({ item }) {
	return (
		<div className={`${styles.row} ${styles.bodyRow}`}>
			<PatternsExplorerIdPageSchedulesStartTimeColumn item={item} />
			<PatternsExplorerIdPageSchedulesCalendarsOnColumn item={item} />
			<PatternsExplorerIdPageSchedulesCalendarsOffColumn item={item} />
			<PatternsExplorerIdPageSchedulesRemoveTripColumn item={item} />
		</div>
	);
}

/* * */

function PatternsExplorerIdPageSchedulesAddTrip() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.add');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Handle actions

	const handleAddTrip = () => {
		patternsExplorerContext.form.insertListItem('schedules', { ...PatternScheduleDefault });
	};

	//
	// C. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'edit', scope: 'lines' }]}>
			<Button disabled={patternsExplorerContext.page.is_read_only} leftSection={<IconPlus size={16} />} onClick={handleAddTrip} size="xs" variant="default">
				{t('label')}
			</Button>
		</AppAuthenticationCheck>
	);

	//
}

/* * */

function PatternsExplorerIdPageSchedulesSortTrips() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.sort');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Handle actions

	const handleSortTrips = () => {
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
		const sortedTrips = patternsExplorerContext.form.values.schedules.sort((a, b) => collator.compare(a.start_time, b.start_time));
		patternsExplorerContext.form.setValues('schedules', sortedTrips);
	};

	//
	// C. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'edit', scope: 'lines' }]}>
			<Button disabled={patternsExplorerContext.page.is_read_only} leftSection={<IconAB2 size={16} />} onClick={handleSortTrips} size="xs" variant="default">
				{t('label')}
			</Button>
		</AppAuthenticationCheck>
	);

	//
}

/* * */

function PatternsExplorerIdPageSchedulesHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules');

	//
	// B. Render components

	return (
		<div className={`${styles.row} ${styles.headerRow}`}>
			<div className={styles.column}>{t('start_time.header.title')}</div>
			<div className={styles.column}>{t('calendars_on.header.title')}</div>
			<div className={styles.column}>{t('calendars_off.header.title')}</div>
			<div className={styles.column} />
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPageSchedulesFilterByCalendar() {
	//

	//
	// A. Setup variables

	const patternsExplorerContext = usePatternsExplorerContext();
	const t = useTranslations('PatternsExplorerIdPageSchedules.filter_by_calendar');

	//
	// B. Render components

	return (
		<div className={styles.filterByCalendar}>
			<Select data={patternsExplorerContext.schedulesSection.available_calendars} description={t('description')} label={t('label')} nothingFoundMessage={t('nothingFoundMessage')} onChange={patternsExplorerContext.setSelectedFilterCalendar} placeholder={t('placeholder')} w="100%" clearable searchable />
		</div>
	);

	//
}

/* * */

export default function PatternsExplorerIdPageSchedules() {
	//

	//
	// A. Setup variables

	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Transform data

	const visibleCalendars = useMemo(() => {
		if (!patternsExplorerContext.form?.values?.schedules) return [];
		if (!patternsExplorerContext.schedulesSection?.selected_calendar) {
			return patternsExplorerContext.form.values.schedules;
		};
		const filteredSchedules = patternsExplorerContext.form.values.schedules.filter((item) => {
			const hasCalendarsOn = item.calendars_on.includes(patternsExplorerContext.schedulesSection.selected_calendar);
			const hasCalendarsOff = item.calendars_off.includes(patternsExplorerContext.schedulesSection.selected_calendar);
			return hasCalendarsOn || hasCalendarsOff;
		});
		return filteredSchedules;
	}, [patternsExplorerContext.form?.values?.schedules, patternsExplorerContext.schedulesSection?.selected_calendar]);

	//
	// C. Render components

	return (
		<div className={styles.container}>
			<PatternsExplorerIdPageSchedulesFilterByCalendar />
			<PatternsExplorerIdPageSchedulesHeader />
			<div className={styles.body}>
				{visibleCalendars.length > 0
					? visibleCalendars.map(item => <PatternsExplorerIdPageSchedulesRow key={item._id} item={item} />)
					: (
						<div className={styles.filterByCalendar}>
							<NoDataLabel />
						</div>
					)}
			</div>
			<div className={styles.footerToolbar}>
				<PatternsExplorerIdPageSchedulesAddTrip />
				<PatternsExplorerIdPageSchedulesSortTrips />
			</div>
		</div>
	);

	//
}
