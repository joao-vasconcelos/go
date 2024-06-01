'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import Text from '@/components/Text/Text';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import { PatternScheduleDefault } from '@/schemas/Pattern/default';
import { ActionIcon, Button, MultiSelect, TextInput, Tooltip } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconAB2, IconBackspace, IconCalendarCheck, IconCalendarX, IconClockPlay, IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './PatternsExplorerIdPageSchedules.module.css';

/* * */

function PatternsExplorerIdPageSchedulesStartTimeColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.start_time');
	const patternsExplorerContext = usePatternsExplorerContext();

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
		patternsExplorerContext.form.setFieldValue(`schedules.${rowIndex}.start_time`, formattedValue);
		//
	};

	//
	// C. Render components

	return (
		<div className={styles.column}>
			<Tooltip label={t('description')} position="bottom" withArrow>
				<TextInput aria-label={t('label')} leftSection={<IconClockPlay size={18} />} placeholder={t('placeholder')} {...patternsExplorerContext.form.getInputProps(`schedules.${rowIndex}.start_time`)} onChange={handleUpdateStartTime} readOnly={patternsExplorerContext.page.is_read_only} w="100%" />
			</Tooltip>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPageSchedulesCalendarsOnColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.calendars_on');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Render components

	return (
		<div className={styles.column}>
			<MultiSelect
				aria-label={t('label')}
				nothingFoundMessage={t('nothingFound')}
				placeholder={t('placeholder')}
				{...patternsExplorerContext.form.getInputProps(`schedules.${rowIndex}.calendars_on`)}
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

function PatternsExplorerIdPageSchedulesCalendarsOffColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageSchedules.calendars_off');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Render components

	return (
		<div className={styles.column}>
			<MultiSelect
				aria-label={t('label')}
				nothingFoundMessage={t('nothingFound')}
				placeholder={t('placeholder')}
				{...patternsExplorerContext.form.getInputProps(`schedules.${rowIndex}.calendars_off`)}
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

function PatternsExplorerIdPageSchedulesRemoveTripColumn({ rowIndex }) {
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
				patternsExplorerContext.form.removeListItem('schedules', rowIndex);
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

function PatternsExplorerIdPageSchedulesRow({ rowIndex }) {
	return (
		<div className={`${styles.row} ${styles.bodyRow}`}>
			<PatternsExplorerIdPageSchedulesStartTimeColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPageSchedulesCalendarsOnColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPageSchedulesCalendarsOffColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPageSchedulesRemoveTripColumn rowIndex={rowIndex} />
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

export default function PatternsExplorerIdPageSchedules() {
	//

	//
	// A. Setup variables

	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<PatternsExplorerIdPageSchedulesHeader />
			<div className={styles.body}>
				{patternsExplorerContext.form?.values?.schedules?.map((item, index) => <PatternsExplorerIdPageSchedulesRow key={item._id || index} rowIndex={index} />)}
			</div>

			<div className={styles.footerToolbar}>
				<PatternsExplorerIdPageSchedulesAddTrip />
				<PatternsExplorerIdPageSchedulesSortTrips />
			</div>
		</div>
	);

	//
}
