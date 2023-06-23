'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePatternFormContext } from '@/contexts/patternForm';
import styles from './StopSequenceTableRow.module.css';
import { Checkbox, Tooltip, NumberInput, MultiSelect, ActionIcon } from '@mantine/core';
import { IconX, IconClockPause, IconEqual, IconPlayerTrackNext, IconArrowAutofitContent, IconClockHour4, IconTicket, IconRotate2 } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import Loader from '../Loader/Loader';

//
//
//

//
// STOP SEQUENCE TABLE - INDEX COLUMN

export function StopSequenceTableIndexColumn({ rowIndex }) {
  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <div className={styles.sequenceIndex}>{rowIndex}</div>
    </div>
  );
}

//
//
//

//
// STOP SEQUENCE TABLE - STOP COLUMN

export function StopSequenceTableStopColumn({ stopId }) {
  //

  //
  // B. Fetch data

  const { data: stopData } = useSWR(stopId && `/api/stops/${stopId}`);

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
          <div className={styles.sequenceStopId}>{stopData.code}</div>
        </div>
      ) : (
        <Loader visible />
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

export function StopSequenceTableAllowPickupColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const form = usePatternFormContext();

  //
  // Render components

  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <Tooltip label={t('allow_pickup.description')} position='bottom' withArrow>
        <Checkbox size='sm' {...form.getInputProps(`path.${rowIndex}.allow_pickup`, { type: 'checkbox' })} readOnly={isReadOnly} />
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

export function StopSequenceTableAllowDropoffColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const form = usePatternFormContext();

  //
  // Render components

  return (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <Tooltip label={t('allow_drop_off.description')} position='bottom' withArrow>
        <Checkbox size='sm' {...form.getInputProps(`path.${rowIndex}.allow_drop_off`, { type: 'checkbox' })} readOnly={isReadOnly} />
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

export function StopSequenceTableDistanceDeltaColumn({ rowIndex, distanceDelta }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTableRow');

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
      <Tooltip label={t('distance_delta.description')} position='bottom' withArrow>
        <NumberInput aria-label={t('distance_delta.label')} placeholder={t('distance_delta.placeholder')} formatter={formatMetersToDistance} icon={<IconArrowAutofitContent size='20px' />} value={distanceDelta} disabled={rowIndex === 0} readOnly />
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

export function StopSequenceTableDistanceTimesVelocityColumn() {
  return (
    <div className={styles.column}>
      <IconX size='20px' />
    </div>
  );
}

//
//
//

//
// STOP SEQUENCE TABLE - VELOCITY COLUMN

export function StopSequenceTableVelocityColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const form = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('default_velocity.description')} position='bottom' withArrow>
        <NumberInput
          aria-label={t('default_velocity.label')}
          placeholder={t('default_velocity.placeholder')}
          defaultValue={20}
          min={0}
          step={5}
          stepHoldDelay={500}
          stepHoldInterval={100}
          formatter={(value) => `${value} km/h`}
          icon={<IconPlayerTrackNext size='18px' />}
          {...form.getInputProps(`path.${rowIndex}.default_velocity`)}
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

export function StopSequenceTableDistanceTimesVelocityEqualsTravelTimeColumn() {
  return (
    <div className={styles.column}>
      <IconEqual size='30px' />
    </div>
  );
}

//
//
//

//
// STOP SEQUENCE TABLE - TRAVEL TIME COLUMN

export function StopSequenceTableTravelTimeColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTableRow');
  const form = usePatternFormContext();

  //
  // Formatters

  const formatSecondsToTime = (timeInSeconds) => {
    if (timeInSeconds < 60) {
      return timeInSeconds + ' seg';
    } else if (timeInSeconds < 3600) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes} min ${seconds} seg`;
    } else {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      return `${hours} h ${minutes} min ${seconds} seg`;
    }
  };

  function calculateTravelTime(distanceInMeters, speedInKmPerHour) {
    if (speedInKmPerHour === 0 || distanceInMeters === 0) {
      return 0;
    }
    const speedInMetersPerSecond = (speedInKmPerHour * 1000) / 3600;
    const travelTimeInSeconds = distanceInMeters / speedInMetersPerSecond;
    return travelTimeInSeconds || 0;
  }

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('default_travel_time.description')} position='bottom' width={350} multiline withArrow>
        <NumberInput
          aria-label={t('default_travel_time.label')}
          placeholder={t('default_travel_time.placeholder')}
          formatter={formatSecondsToTime}
          icon={<IconClockHour4 size='18px' />}
          {...form.getInputProps(`path.${rowIndex}.default_travel_time`)}
          value={calculateTravelTime(form.values.path[rowIndex].distance_delta, form.values.path[rowIndex].default_velocity)}
          disabled={rowIndex === 0}
          readOnly
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
// STOP SEQUENCE TABLE - DWELL TIME COLUMN

export function StopSequenceTableDwellTimeColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const form = usePatternFormContext();

  //
  // Formatters

  const formatSecondsToTime = (timeInSeconds) => {
    if (timeInSeconds < 60) {
      return timeInSeconds + ' seg';
    } else if (timeInSeconds < 3600) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes} min ${seconds} seg`;
    } else {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      return `${hours} h ${minutes} min ${seconds} seg`;
    }
  };

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('default_dwell_time.description')} position='bottom' width={350} multiline withArrow>
        <NumberInput
          aria-label={t('default_dwell_time.label')}
          placeholder={t('default_dwell_time.placeholder')}
          defaultValue={30}
          min={0}
          max={900}
          step={10}
          stepHoldDelay={500}
          stepHoldInterval={100}
          icon={<IconClockPause size='20px' />}
          formatter={formatSecondsToTime}
          {...form.getInputProps(`path.${rowIndex}.default_dwell_time`)}
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

export function StopSequenceTableZonesColumn({ rowIndex, stopId }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const form = usePatternFormContext();

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
      form.setFieldValue(`path.${rowIndex}.zones`, stopData.zones);
    }
  };

  //
  // Render components

  return (
    <div className={styles.column}>
      <MultiSelect
        aria-label={t('zones.label')}
        placeholder={t('zones.placeholder')}
        nothingFound={t('zones.nothingFound')}
        {...form.getInputProps(`path.${rowIndex}.zones`)}
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

export default function StopSequenceTableRow({ rowIndex, item }) {
  return (
    <div className={styles.container}>
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
