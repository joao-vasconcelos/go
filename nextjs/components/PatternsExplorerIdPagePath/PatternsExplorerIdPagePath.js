'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import Loader from '@/components/Loader/Loader';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import calculateTravelTime from '@/services/calculateTravelTime';
import formatSecondsToTime from '@/services/formatSecondsToTime';
import { ActionIcon, Checkbox, MultiSelect, NumberInput, TextInput, Tooltip } from '@mantine/core';
import { IconArrowBarToDown, IconArrowBarUp, IconSortAscendingNumbers } from '@tabler/icons-react';
import { IconArrowAutofitContent, IconClockHour4, IconClockPause, IconEqual, IconPlayerTrackNext, IconRotate2, IconTicket, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

import styles from './PatternsExplorerIdPagePath.module.css';

/* * */

function PatternsExplorerIdPagePathIndexColumn({ rowIndex }) {
	return (
		<div className={`${styles.column} ${styles.hcenter}`}>
			<div className={styles.sequenceIndex}>{rowIndex + 1}</div>
		</div>
	);
}

/* * */

function PatternsExplorerIdPagePathStopColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Fetch data

	const { data: stopData } = useSWR(patternsExplorerContext.form.values.path[rowIndex]?.stop && `/api/stops/${patternsExplorerContext.form.values.path[rowIndex].stop}`);
	const { data: municipalityData } = useSWR(stopData && `/api/municipalities/${stopData.municipality}`);

	//
	// C. Transform data

	const stopLocationInfo = useMemo(() => {
		// If none of the location strings are defined
		if (!stopData?.locality && !municipalityData?.name) return null;
		// If only locality is defined, then return it
		if (stopData?.locality && !municipalityData?.name) return stopData.locality;
		// If only municipality is defined, then return it.
		if (!stopData?.locality && municipalityData?.name) return municipalityData.name;
		// If both locality and municipality are the same return only one of them to avoid duplicate strings.
		if (stopData?.locality === municipalityData?.name) return stopData.locality;
		// Return both if none of the previous conditions was matched.
		return `${stopData.locality}, ${municipalityData.name}`;
		//
	}, [municipalityData, stopData]);

	//
	// D. Handle actions

	const handleOpenStop = () => {
		window.open(`/stops/${patternsExplorerContext.form.values.path[rowIndex]?.stop}`, '_blank');
	};

	//
	// E. Render components

	return (
		<div className={styles.column}>
			{stopData
				? (
					<div className={styles.sequenceStop} onClick={handleOpenStop}>
						<div className={styles.sequenceStopName}>{stopData.name}</div>
						{stopLocationInfo && <div className={styles.stopLocationInfo}>{stopLocationInfo}</div>}
						<div className={styles.sequenceStopId}>#{stopData.code}</div>
					</div>
				)
				: <Loader size={20} visible />}
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathAllowPickupColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPagePath.allow_pickup');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Render components

	return (
		<div className={`${styles.column} ${styles.hcenter}`}>
			<Tooltip label={t('description')} position="bottom" withArrow>
				<Checkbox size="sm" {...patternsExplorerContext.form.getInputProps(`path.${rowIndex}.allow_pickup`, { type: 'checkbox' })} disabled={patternsExplorerContext.page.is_read_only} />
			</Tooltip>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathAllowDropoffColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPagePath.allow_drop_off');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Render components

	return (
		<div className={`${styles.column} ${styles.hcenter}`}>
			<Tooltip label={t('description')} position="bottom" withArrow>
				<Checkbox size="sm" {...patternsExplorerContext.form.getInputProps(`path.${rowIndex}.allow_drop_off`, { type: 'checkbox' })} disabled={patternsExplorerContext.page.is_read_only} />
			</Tooltip>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathDistanceDeltaColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPagePath.distance_delta');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Transform data

	const distanceDeltaFormatted = useMemo(() => {
		//
		let newDistanceDeltaFormatted = `${patternsExplorerContext.form.values.path[rowIndex]?.distance_delta} metros`;
		//
		if (patternsExplorerContext.form.values.path[rowIndex]?.distance_delta >= 1000) {
			const distanceInKm = Math.floor(patternsExplorerContext.form.values.path[rowIndex]?.distance_delta / 1000);
			const remainderInMeters = patternsExplorerContext.form.values.path[rowIndex]?.distance_delta % 1000;
			newDistanceDeltaFormatted = `${distanceInKm} km ${remainderInMeters} metros`;
		}
		//
		return newDistanceDeltaFormatted;
		//
	}, [patternsExplorerContext.form.values.path, rowIndex]);

	//
	// C. Render components

	return (
		<div className={styles.column}>
			<Tooltip label={t('description')} position="bottom" withArrow>
				<TextInput aria-label={t('label')} disabled={rowIndex === 0} leftSection={<IconArrowAutofitContent size={20} />} placeholder={t('placeholder')} value={distanceDeltaFormatted} readOnly />
			</Tooltip>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathDistanceTimesVelocityColumn() {
	return (
		<div className={`${styles.column} ${styles.hcenter}`}>
			<IconX size={20} />
		</div>
	);
}

/* * */

function PatternsExplorerIdPagePathVelocityColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPagePath.default_velocity');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Handle actions

	const handleUpdateVelocity = (value) => {
		patternsExplorerContext.form.setFieldValue(`path.${rowIndex}.default_velocity`, value);
		patternsExplorerContext.form.setFieldValue(`path.${rowIndex}.default_travel_time`, calculateTravelTime(patternsExplorerContext.form.values.path[rowIndex].distance_delta, value));
	};

	//
	// C. Render components

	return (
		<div className={styles.column}>
			<Tooltip label={t('description')} position="bottom" withArrow>
				<NumberInput
					aria-label={t('label')}
					defaultValue={20}
					leftSection={<IconPlayerTrackNext size={18} />}
					min={0}
					placeholder={t('placeholder')}
					step={1}
					suffix=" km/h"
					{...patternsExplorerContext.form.getInputProps(`path.${rowIndex}.default_velocity`)}
					disabled={rowIndex === 0}
					onChange={handleUpdateVelocity}
					readOnly={patternsExplorerContext.page.is_read_only}
				/>
			</Tooltip>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathDistanceTimesVelocityEqualsTravelTimeColumn() {
	return (
		<div className={`${styles.column} ${styles.hcenter}`}>
			<IconEqual size={25} />
		</div>
	);
}

/* * */

function PatternsExplorerIdPagePathTravelTimeColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPagePath.default_travel_time');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Transform data

	const travelTimeFormatted = useMemo(() => {
		return formatSecondsToTime(patternsExplorerContext.form.values.path[rowIndex].default_travel_time);
	}, [patternsExplorerContext.form.values.path, rowIndex]);

	//
	// C. Render components

	return (
		<div className={styles.column}>
			<Tooltip label={t('description')} position="bottom" width={350} multiline withArrow>
				<TextInput aria-label={t('label')} disabled={rowIndex === 0} leftSection={<IconClockHour4 size={18} />} placeholder={t('placeholder')} value={travelTimeFormatted} readOnly />
			</Tooltip>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathDwellTimeColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPagePath.default_dwell_time');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Render components

	return (
		<div className={styles.column}>
			<Tooltip label={t('description')} position="bottom" width={350} multiline withArrow>
				<NumberInput
					aria-label={t('label')}
					defaultValue={30}
					leftSection={<IconClockPause size={20} />}
					max={900}
					min={0}
					placeholder={t('placeholder')}
					step={10}
					suffix=" seg"
					{...patternsExplorerContext.form.getInputProps(`path.${rowIndex}.default_dwell_time`)}
					readOnly={patternsExplorerContext.page.is_read_only}
				/>
			</Tooltip>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathZonesColumn({ rowIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPagePath.zones');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Fetch data

	const { data: stopData, isLoading: stopLoading } = useSWR(patternsExplorerContext.form.values.path[rowIndex]?.stop && `/api/stops/${patternsExplorerContext.form.values.path[rowIndex].stop}`);

	//
	// C. Handle actions

	const handleResetZones = () => {
		if (stopData) {
			patternsExplorerContext.form.setFieldValue(`path.${rowIndex}.zones`, stopData.zones);
		}
	};

	//
	// D. Render components

	return (
		<div className={styles.column}>
			<MultiSelect
				aria-label={t('label')}
				nothingFoundMessage={t('nothingFound')}
				placeholder={t('placeholder')}
				{...patternsExplorerContext.form.getInputProps(`path.${rowIndex}.zones`)}
				data={patternsExplorerContext.data.all_zones_data}
				readOnly={patternsExplorerContext.page.is_read_only}
				rightSection={<IconTicket size={20} />}
				w="100%"
				leftSection={(
					<AppAuthenticationCheck permissions={[{ action: 'edit', scope: 'lines' }]}>
						<ActionIcon color="gray" disabled={!stopData || patternsExplorerContext.page.is_read_only} loading={stopLoading} onClick={handleResetZones} variant="subtle">
							<IconRotate2 size={20} />
						</ActionIcon>
					</AppAuthenticationCheck>
				)}
				searchable
			/>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathRow({ rowIndex }) {
	return (
		<div className={`${styles.row} ${styles.bodyRow}`}>
			<PatternsExplorerIdPagePathIndexColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPagePathStopColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPagePathAllowPickupColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPagePathAllowDropoffColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPagePathDistanceDeltaColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPagePathDistanceTimesVelocityColumn />
			<PatternsExplorerIdPagePathVelocityColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPagePathDistanceTimesVelocityEqualsTravelTimeColumn />
			<PatternsExplorerIdPagePathTravelTimeColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPagePathDwellTimeColumn rowIndex={rowIndex} />
			<PatternsExplorerIdPagePathZonesColumn rowIndex={rowIndex} />
		</div>
	);
}

/* * */

function PatternsExplorerIdPagePathHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPagePath');

	//
	// B. Render components

	return (
		<div className={`${styles.row} ${styles.headerRow}`}>
			<div className={`${styles.column} ${styles.hcenter}`}>
				<Tooltip label={t('sequence_index.description')} withArrow>
					<IconSortAscendingNumbers size={20} />
				</Tooltip>
			</div>
			<div className={styles.column} style={{ paddingLeft: 10 }}>
				{t('stop.label')}
			</div>
			<div className={`${styles.column} ${styles.hcenter}`}>
				<Tooltip label={t('allow_pickup.label')} withArrow>
					<IconArrowBarToDown size={20} />
				</Tooltip>
			</div>
			<div className={`${styles.column} ${styles.hcenter}`}>
				<Tooltip label={t('allow_drop_off.label')} withArrow>
					<IconArrowBarUp size={20} />
				</Tooltip>
			</div>
			<div className={styles.column}>{t('distance_delta.label')}</div>
			<div className={styles.column} />
			<div className={styles.column}>{t('default_velocity.label')}</div>
			<div className={styles.column} />
			<div className={styles.column}>{t('default_travel_time.label')}</div>
			<div className={styles.column}>{t('default_dwell_time.label')}</div>
			<div className={styles.column}>{t('zones.label')}</div>
		</div>
	);

	//
}

/* * */

function PatternsExplorerIdPagePathFooter() {
	//

	//
	// A. Setup variables

	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Transform data

	const totalTravelTimeFormatted = useMemo(() => {
		//
		if (!patternsExplorerContext.form.values.path) return -1;
		//
		let totalTravelTimeTemp = 0;
		//
		for (const pathStop of patternsExplorerContext.form.values.path) {
			totalTravelTimeTemp += pathStop.default_travel_time + pathStop.default_dwell_time;
		}
		//
		return formatSecondsToTime(totalTravelTimeTemp);
		//
	}, [patternsExplorerContext.form.values.path]);

	//
	// C. Render components

	return (
		<div className={`${styles.row} ${styles.headerRow}`}>
			<div className={styles.column} />
			<div className={styles.column} />
			<div className={styles.column} />
			<div className={styles.column} />
			<div className={styles.column} />
			<div className={styles.column} />
			<div className={styles.column} />
			<div className={styles.column} />
			<div className={`${styles.column} ${styles.hcenter}`}>{totalTravelTimeFormatted}</div>
			<div className={styles.column} />
			<div className={styles.column} />
		</div>
	);

	//
}

/* * */

export default function PatternsExplorerIdPagePath() {
	//

	//
	// A. Setup variables

	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<PatternsExplorerIdPagePathHeader />
			<div className={styles.body}>{patternsExplorerContext.form.values.path && patternsExplorerContext.form.values.path.map((item, index) => <PatternsExplorerIdPagePathRow key={index} rowIndex={index} />)}</div>
			<PatternsExplorerIdPagePathFooter />
		</div>
	);

	//
}
