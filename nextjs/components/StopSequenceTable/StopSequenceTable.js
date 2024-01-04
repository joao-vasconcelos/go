'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './StopSequenceTable.module.css';
import { usePatternFormContext } from '@/schemas/Pattern/form';
import { IconSortAscendingNumbers, IconArrowBarUp, IconArrowBarToDown } from '@tabler/icons-react';
import { Checkbox, Tooltip, NumberInput, MultiSelect, ActionIcon, TextInput } from '@mantine/core';
import { IconX, IconClockPause, IconEqual, IconPlayerTrackNext, IconArrowAutofitContent, IconClockHour4, IconTicket, IconRotate2 } from '@tabler/icons-react';
import AuthGate from '@/components/AuthGate/AuthGate';
import Loader from '../Loader/Loader';
import calculateTravelTime from '@/services/calculateTravelTime';
import formatSecondsToTime from '@/services/formatSecondsToTime';

//
//
//

//
// STOP SEQUENCE TABLE - INDEX COLUMN

function StopSequenceTableIndexColumn({ rowIndex }) {
  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <div className={styles.sequenceIndex}>{rowIndex + 1}</div>
    </div>
  );
}

//
//
//

//
// STOP SEQUENCE TABLE - STOP COLUMN

function StopSequenceTableStopColumn({ stopId }) {
  //

  //
  // B. Fetch data

  const { data: stopData } = useSWR(stopId && `/api/stops/${stopId}`);
  const { data: municipalityData } = useSWR(stopData && `/api/municipalities/${stopData.municipality}`);

  //
  // Transform data

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
  // Handle actions

  const handleOpenStop = () => {
    window.open(`/dashboard/stops/${stopId}`, '_blank');
  };

  //
  // Render components

  return (
    <div className={`${styles.column}`}>
      {stopData ? (
        <div className={styles.sequenceStop} onClick={handleOpenStop}>
          <div className={styles.sequenceStopName}>{stopData.name}</div>
          {stopLocationInfo && <div className={styles.stopLocationInfo}>{stopLocationInfo}</div>}
          <div className={styles.sequenceStopId}>#{stopData.code}</div>
        </div>
      ) : (
        <Loader size={20} visible />
      )}
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - ALLOW PICKUP COLUMN

function StopSequenceTableAllowPickupColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.allow_pickup');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <Tooltip label={t('description')} position="bottom" withArrow>
        <Checkbox size="sm" {...patternForm.getInputProps(`path.${rowIndex}.allow_pickup`, { type: 'checkbox' })} disabled={isReadOnly} />
      </Tooltip>
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - ALLOW DROPOFF COLUMN

function StopSequenceTableAllowDropoffColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.allow_drop_off');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <Tooltip label={t('description')} position="bottom" withArrow>
        <Checkbox size="sm" {...patternForm.getInputProps(`path.${rowIndex}.allow_drop_off`, { type: 'checkbox' })} disabled={isReadOnly} />
      </Tooltip>
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - DISTANCE DELTA COLUMN

function StopSequenceTableDistanceDeltaColumn({ rowIndex, distanceDelta }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.distance_delta');

  //
  // Formatters

  let distanceDeltaFormatted = `${distanceDelta} metros`;

  if (distanceDelta >= 1000) {
    const distanceInKm = Math.floor(distanceDelta / 1000);
    const remainderInMeters = distanceDelta % 1000;
    distanceDeltaFormatted = `${distanceInKm} km ${remainderInMeters} metros`;
  }

  //
  // Handle actions

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position="bottom" withArrow>
        <TextInput aria-label={t('label')} placeholder={t('placeholder')} value={distanceDeltaFormatted} leftSection={<IconArrowAutofitContent size={20} />} disabled={rowIndex === 0} readOnly />
      </Tooltip>
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - DISTANCE TIMES VELOCITY COLUMN

function StopSequenceTableDistanceTimesVelocityColumn() {
  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <IconX size={20} />
    </div>
  );
}

//
//
//

//
// STOP SEQUENCE TABLE - VELOCITY COLUMN

function StopSequenceTableVelocityColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.default_velocity');
  const patternForm = usePatternFormContext();

  //
  // Render components

  const handleUpdateVelocity = (value) => {
    patternForm.setFieldValue(`path.${rowIndex}.default_velocity`, value);
    patternForm.setFieldValue(`path.${rowIndex}.default_travel_time`, calculateTravelTime(patternForm.values.path[rowIndex].distance_delta, value));
  };

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position="bottom" withArrow>
        <NumberInput
          aria-label={t('label')}
          placeholder={t('placeholder')}
          defaultValue={20}
          min={0}
          step={1}
          suffix={' km/h'}
          leftSection={<IconPlayerTrackNext size={18} />}
          {...patternForm.getInputProps(`path.${rowIndex}.default_velocity`)}
          onChange={handleUpdateVelocity}
          disabled={rowIndex === 0}
          readOnly={isReadOnly}
        />
      </Tooltip>
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - DISTANCE TIMES VELOCITY EQUALS TRAVEL TIME COLUMN

function StopSequenceTableDistanceTimesVelocityEqualsTravelTimeColumn() {
  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <IconEqual size={25} />
    </div>
  );
}

//
//
//

//
// STOP SEQUENCE TABLE - TRAVEL TIME COLUMN

function StopSequenceTableTravelTimeColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.default_travel_time');
  const patternForm = usePatternFormContext();

  //
  // Format value

  const valueFormatted = formatSecondsToTime(patternForm.values.path[rowIndex].default_travel_time);

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position="bottom" width={350} multiline withArrow>
        <TextInput aria-label={t('label')} placeholder={t('placeholder')} leftSection={<IconClockHour4 size={18} />} value={valueFormatted} disabled={rowIndex === 0} readOnly />
      </Tooltip>
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - DWELL TIME COLUMN

function StopSequenceTableDwellTimeColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.default_dwell_time');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position="bottom" width={350} multiline withArrow>
        <NumberInput
          aria-label={t('label')}
          placeholder={t('placeholder')}
          defaultValue={30}
          min={0}
          max={900}
          step={10}
          leftSection={<IconClockPause size={20} />}
          suffix=" seg"
          {...patternForm.getInputProps(`path.${rowIndex}.default_dwell_time`)}
          readOnly={isReadOnly}
        />
      </Tooltip>
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - ZONES COLUMN

function StopSequenceTableZonesColumn({ rowIndex, stopId, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.zones');
  const patternForm = usePatternFormContext();

  //
  // B. Fetch data

  const { data: allZonesData } = useSWR('/api/zones');
  const { data: stopData, isLoading: stopLoading } = useSWR(stopId && `/api/stops/${stopId}`);

  //
  // D. Format data

  const allZonesDataFormatted = useMemo(() => {
    if (!allZonesData) return [];
    return allZonesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allZonesData]);

  //
  // Handle actions

  const handleResetZones = () => {
    if (stopData) {
      patternForm.setFieldValue(`path.${rowIndex}.zones`, stopData.zones);
    }
  };

  //
  // Render components

  return (
    <div className={styles.column}>
      <MultiSelect
        aria-label={t('label')}
        placeholder={t('placeholder')}
        nothingFoundMessage={t('nothingFound')}
        {...patternForm.getInputProps(`path.${rowIndex}.zones`)}
        data={allZonesDataFormatted}
        leftSection={<IconTicket size={20} />}
        rightSection={
          <AuthGate scope="lines" permission="create_edit">
            <ActionIcon onClick={handleResetZones} loading={stopLoading} disabled={!stopData || isReadOnly} variant="subtle" color="gray">
              <IconRotate2 size={20} />
            </ActionIcon>
          </AuthGate>
        }
        readOnly={isReadOnly}
        searchable
        w="100%"
      />
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - TABLE ROW

function StopSequenceTableRow({ rowIndex, item, isReadOnly }) {
  return (
    <div className={`${styles.row} ${styles.bodyRow}`}>
      <StopSequenceTableIndexColumn rowIndex={rowIndex} />
      <StopSequenceTableStopColumn stopId={item.stop} />
      <StopSequenceTableAllowPickupColumn rowIndex={rowIndex} isReadOnly={isReadOnly} />
      <StopSequenceTableAllowDropoffColumn rowIndex={rowIndex} isReadOnly={isReadOnly} />
      <StopSequenceTableDistanceDeltaColumn rowIndex={rowIndex} distanceDelta={item.distance_delta} />
      <StopSequenceTableDistanceTimesVelocityColumn />
      <StopSequenceTableVelocityColumn rowIndex={rowIndex} isReadOnly={isReadOnly} />
      <StopSequenceTableDistanceTimesVelocityEqualsTravelTimeColumn />
      <StopSequenceTableTravelTimeColumn rowIndex={rowIndex} />
      <StopSequenceTableDwellTimeColumn rowIndex={rowIndex} isReadOnly={isReadOnly} />
      <StopSequenceTableZonesColumn rowIndex={rowIndex} stopId={item.stop} isReadOnly={isReadOnly} />
    </div>
  );
}

//
//
//

//
// STOP SEQUENCE TABLE - HEADER

function StopSequenceTableHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable');

  //
  // Render components

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

//
//
//

//
// STOP SEQUENCE TABLE - FOOTER

function StopSequenceTableFooter() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable');
  const patternForm = usePatternFormContext();

  //
  // D. Format data

  //
  // Formatters

  const totalTravelTime = useMemo(() => {
    if (!patternForm.values.path) return -1;
    let totalTravelTimeTemp = 0;
    for (const pathStop of patternForm.values.path) {
      totalTravelTimeTemp += pathStop.default_travel_time + pathStop.default_dwell_time;
    }
    return totalTravelTimeTemp;
    //
  }, [patternForm.values.path]);

  //
  // Render components

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
      <div className={`${styles.column} ${styles.hcenter}`}>{formatSecondsToTime(totalTravelTime)}</div>
      <div className={styles.column} />
      <div className={styles.column} />
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE

export default function StopSequenceTable({ isReadOnly }) {
  //

  //
  // A. Setup variables

  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.container}>
      <StopSequenceTableHeader />
      <div className={styles.body}>{patternForm.values.path && patternForm.values.path.map((item, index) => <StopSequenceTableRow key={index} rowIndex={index} item={item} isReadOnly={isReadOnly} />)}</div>
      <StopSequenceTableFooter />
    </div>
  );

  //
}
