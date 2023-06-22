'use client';

import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePatternFormContext } from '@/contexts/patternForm';
import styles from './StopSequenceTableRow.module.css';
import { Checkbox, Tooltip, NumberInput, MultiSelect } from '@mantine/core';
import { IconX, IconClockPause, IconEqual, IconPlayerTrackNext, IconArrowAutofitContent, IconClockHour4 } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { isAllowed } from '@/components/AuthGate/AuthGate';
import Loader from '../Loader/Loader';

export default function StopSequenceTableRow({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const form = usePatternFormContext();

  //
  // B. Fetch data

  const { data: stopData } = useSWR(form.values?.path[rowIndex]?.stop && `/api/stops/${form.values.path[rowIndex].stop}`);
  const { data: allZonesData } = useSWR('/api/zones');

  //
  // D. Setup row values

  useEffect(() => {
    // If zones is empty and there is a stop loaded
    if (!form.values.path[rowIndex].zones.length && stopData) {
      form.setValues(`path.${rowIndex}.zones`, stopData.zones);
    }
  }, [form, rowIndex, stopData]);

  //
  // D. Format data

  const allZonesDataFormatted = useMemo(() => {
    if (!allZonesData) return [];
    return allZonesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allZonesData]);

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
  // Handle actions

  const handleOpenStop = () => {
    const stopId = form.values.path[rowIndex].stop;
    window.open(`/dashboard/stops/${stopId}`, '_blank');
  };

  //
  // Render components

  const sequenceIndexColumn = (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <div className={styles.sequenceIndex}>{rowIndex}</div>
    </div>
  );

  const sequenceStopColumn = (
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

  const allowPickupColumn = (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <Tooltip label={t('allow_pickup.description')} position='bottom' withArrow>
        <Checkbox size='sm' {...form.getInputProps(`path.${rowIndex}.allow_pickup`, { type: 'checkbox' })} readOnly={isReadOnly} />
      </Tooltip>
    </div>
  );

  const allowDropoffColumn = (
    <div className={`${styles.column} ${styles.hcenter}`}>
      <Tooltip label={t('allow_drop_off.description')} position='bottom' withArrow>
        <Checkbox size='sm' {...form.getInputProps(`path.${rowIndex}.allow_drop_off`, { type: 'checkbox' })} readOnly={isReadOnly} />
      </Tooltip>
    </div>
  );

  const distanceDeltaColumn = (
    <div className={styles.column}>
      <Tooltip label={t('distance_delta.description')} position='bottom' withArrow>
        <NumberInput
          aria-label={t('distance_delta.label')}
          placeholder={t('distance_delta.placeholder')}
          stepHoldDelay={500}
          stepHoldInterval={100}
          formatter={formatMetersToDistance}
          icon={<IconArrowAutofitContent size='20px' />}
          value={rowIndex === 0 ? 0 : form.values.path[rowIndex].distance_delta}
          disabled={rowIndex === 0}
          readOnly
        />
      </Tooltip>
    </div>
  );

  const distanceTimesVelocityColumn = (
    <div className={styles.column}>
      <IconX size='20px' />
    </div>
  );

  const defaultVelocityColumn = (
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
          value={rowIndex === 0 ? 0 : form.values.path[rowIndex].default_velocity}
        />
      </Tooltip>
    </div>
  );

  const distanceTimesVelocityEqualsTravelTimeColumn = (
    <div className={styles.column}>
      <IconEqual size='30px' />
    </div>
  );

  const defaultTravelTimeColumn = (
    <div className={styles.column}>
      <Tooltip label={t('default_travel_time.description')} position='bottom' width={350} multiline withArrow>
        <NumberInput
          aria-label={t('default_travel_time.label')}
          placeholder={t('default_travel_time.placeholder')}
          formatter={formatSecondsToTime}
          icon={<IconClockHour4 size='18px' />}
          readOnly
          {...form.getInputProps(`path.${rowIndex}.default_travel_time`)}
          disabled={rowIndex === 0}
          value={calculateTravelTime(form.values.path[rowIndex].distance_delta, form.values.path[rowIndex].default_velocity)}
        />
      </Tooltip>
    </div>
  );

  const zonesColumn = (
    <div className={styles.column}>
      <MultiSelect aria-label={t('zones.label')} placeholder={t('zones.placeholder')} nothingFound={t('zones.nothingFound')} {...form.getInputProps(`path.${rowIndex}.zones`)} data={allZonesDataFormatted} readOnly={isReadOnly} searchable w='100%' />
    </div>
  );

  const defaultDwellTimeColumn = (
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
        />
      </Tooltip>
    </div>
  );

  return (
    <div className={styles.container}>
      {sequenceIndexColumn}
      {sequenceStopColumn}
      {allowPickupColumn}
      {allowDropoffColumn}
      {distanceDeltaColumn}
      {distanceTimesVelocityColumn}
      {defaultVelocityColumn}
      {distanceTimesVelocityEqualsTravelTimeColumn}
      {defaultTravelTimeColumn}
      {defaultDwellTimeColumn}
      {zonesColumn}
    </div>
  );

  //
}
