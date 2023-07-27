'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './StopSequenceTable.module.css';
import { useFormContext as usePatternFormContext } from '@/schemas/Pattern/form';
import { IconSortAscendingNumbers, IconArrowBarUp, IconArrowBarToDown } from '@tabler/icons-react';
import { Checkbox, Tooltip, NumberInput, MultiSelect, ActionIcon } from '@mantine/core';
import { IconX, IconClockPause, IconEqual, IconPlayerTrackNext, IconArrowAutofitContent, IconClockHour4, IconTicket, IconRotate2 } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
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

function StopSequenceTableAllowPickupColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.allow_pickup');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <Tooltip label={t('description')} position='bottom' withArrow>
        <Checkbox size='sm' {...patternForm.getInputProps(`path.${rowIndex}.allow_pickup`, { type: 'checkbox' })} readOnly={isReadOnly} />
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

function StopSequenceTableAllowDropoffColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.allow_drop_off');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <Tooltip label={t('description')} position='bottom' withArrow>
        <Checkbox size='sm' {...patternForm.getInputProps(`path.${rowIndex}.allow_drop_off`, { type: 'checkbox' })} readOnly={isReadOnly} />
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

  const formatMetersToDistance = (distanceInMeters) => {
    if (distanceInMeters >= 1000) {
      const distanceInKm = Math.floor(distanceInMeters / 1000);
      const remainderInMeters = distanceInMeters % 1000;
      return `${distanceInKm} km ${remainderInMeters} metros`;
    } else {
      return distanceInMeters + ' metros';
    }
  };

  //
  // Handle actions

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position='bottom' withArrow>
        <NumberInput aria-label={t('label')} placeholder={t('placeholder')} formatter={formatMetersToDistance} icon={<IconArrowAutofitContent size='20px' />} value={distanceDelta} disabled={rowIndex === 0} readOnly />
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

function StopSequenceTableVelocityColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.default_velocity');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
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
      <Tooltip label={t('description')} position='bottom' withArrow>
        <NumberInput
          aria-label={t('label')}
          placeholder={t('placeholder')}
          defaultValue={20}
          min={0}
          step={1}
          stepHoldDelay={500}
          stepHoldInterval={100}
          formatter={(value) => `${value} km/h`}
          icon={<IconPlayerTrackNext size='18px' />}
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
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position='bottom' width={350} multiline withArrow>
        <NumberInput aria-label={t('label')} placeholder={t('placeholder')} formatter={formatSecondsToTime} icon={<IconClockHour4 size='18px' />} value={patternForm.values.path[rowIndex].default_travel_time} disabled={rowIndex === 0} readOnly />
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

function StopSequenceTableDwellTimeColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.default_dwell_time');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position='bottom' width={350} multiline withArrow>
        <NumberInput
          aria-label={t('label')}
          placeholder={t('placeholder')}
          defaultValue={30}
          min={0}
          max={900}
          step={10}
          stepHoldDelay={500}
          stepHoldInterval={100}
          icon={<IconClockPause size='20px' />}
          formatter={formatSecondsToTime}
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

function StopSequenceTableZonesColumn({ rowIndex, stopId }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable.zones');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
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
        nothingFound={t('nothingFound')}
        {...patternForm.getInputProps(`path.${rowIndex}.zones`)}
        data={allZonesDataFormatted}
        icon={<IconTicket size={20} />}
        rightSection={
          <AuthGate scope='lines' permission='create_edit'>
            <ActionIcon onClick={handleResetZones} loading={stopLoading} disabled={!stopData}>
              <IconRotate2 size={20} />
            </ActionIcon>
          </AuthGate>
        }
        readOnly={isReadOnly}
        searchable
        w='100%'
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

function StopSequenceTableRow({ rowIndex, item }) {
  return (
    <div className={`${styles.row} ${styles.bodyRow}`}>
      <StopSequenceTableIndexColumn rowIndex={rowIndex} />
      <StopSequenceTableStopColumn stopId={item.stop} />
      <StopSequenceTableAllowPickupColumn rowIndex={rowIndex} />
      <StopSequenceTableAllowDropoffColumn rowIndex={rowIndex} />
      <StopSequenceTableDistanceDeltaColumn rowIndex={rowIndex} distanceDelta={item.distance_delta} />
      <StopSequenceTableDistanceTimesVelocityColumn />
      <StopSequenceTableVelocityColumn rowIndex={rowIndex} />
      <StopSequenceTableDistanceTimesVelocityEqualsTravelTimeColumn />
      <StopSequenceTableTravelTimeColumn rowIndex={rowIndex} />
      <StopSequenceTableDwellTimeColumn rowIndex={rowIndex} />
      <StopSequenceTableZonesColumn rowIndex={rowIndex} stopId={item.stop} />
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
          <IconSortAscendingNumbers size='20px' />
        </Tooltip>
      </div>
      <div className={styles.column} style={{ paddingLeft: 10 }}>
        {t('stop.label')}
      </div>
      <div className={`${styles.column} ${styles.hcenter}`}>
        <Tooltip label={t('allow_pickup.label')} withArrow>
          <IconArrowBarToDown size='20px' />
        </Tooltip>
      </div>
      <div className={`${styles.column} ${styles.hcenter}`}>
        <Tooltip label={t('allow_drop_off.label')} withArrow>
          <IconArrowBarUp size='20px' />
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

export default function StopSequenceTable() {
  //

  //
  // A. Setup variables

  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.container}>
      <StopSequenceTableHeader />
      <div className={styles.body}>{patternForm.values.path && patternForm.values.path.map((item, index) => <StopSequenceTableRow key={index} rowIndex={index} item={item} />)}</div>
      <StopSequenceTableFooter />
    </div>
  );

  //
}
