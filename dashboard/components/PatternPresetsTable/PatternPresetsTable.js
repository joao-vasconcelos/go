'use client';

import { useTranslations } from 'next-intl';
import styles from './PatternPresetsTable.module.css';
import { useFormContext as usePatternFormContext } from '@/schemas/Pattern/form';
import { Text, NumberInput, Button } from '@mantine/core';
import { IconClockPause, IconPlayerTrackNext } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { isAllowed } from '@/components/AuthGate/AuthGate';
import { openConfirmModal } from '@mantine/modals';
import calculateTravelTime from '@/services/calculateTravelTime';
import notify from '@/services/notify';

//
//
//

//
// STOP SEQUENCE TABLE - VELOCITY COLUMN

export function StopSequenceChangePresetsVelocity() {
  //

  //
  // A. Setup variables

  const t = useTranslations('PatternPresetsTable.velocity');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const patternForm = usePatternFormContext();

  //
  // Render components

  const handleUpdateAll = () => {
    openConfirmModal({
      title: <Text size='h2'>{t('modal.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('modal.description')}</Text>,
      labels: { confirm: t('modal.confirm'), cancel: t('modal.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        notify('update-preset-velocity', 'loading', t('notification.loading'));
        const presetValue = patternForm.values.presets.velocity;
        for (const [pathIndex, pathData] of patternForm.values.path.entries()) {
          if (pathIndex === 0) continue;
          patternForm.setFieldValue(`path.${pathIndex}.default_velocity`, presetValue);
          patternForm.setFieldValue(`path.${pathIndex}.default_travel_time`, calculateTravelTime(pathData.distance_delta, presetValue));
        }
        notify('update-preset-velocity', 'success', t('notification.success', { value: `${presetValue} km/h` }));
      },
    });
  };

  //
  // Render components

  return (
    <div className={styles.presetCard}>
      <NumberInput
        label={t('label')}
        placeholder={t('placeholder')}
        defaultValue={20}
        min={0}
        step={1}
        stepHoldDelay={500}
        stepHoldInterval={100}
        formatter={(value) => `${value} km/h`}
        icon={<IconPlayerTrackNext size='18px' />}
        {...patternForm.getInputProps(`presets.velocity`)}
        readOnly={isReadOnly}
      />
      <Button onClick={handleUpdateAll} variant='default'>
        {t('apply')}
      </Button>
    </div>
  );

  //
}

//
//
//

//
// STOP SEQUENCE TABLE - DWELL TIME COLUMN

export function StopSequenceChangePresetsDwellTime() {
  //

  //
  // A. Setup variables

  const t = useTranslations('PatternPresetsTable.dwell_time');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const patternForm = usePatternFormContext();

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

  const handleUpdateAll = () => {
    openConfirmModal({
      title: <Text size='h2'>{t('modal.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('modal.description')}</Text>,
      labels: { confirm: t('modal.confirm'), cancel: t('modal.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        notify('update-preset-dwell_time', 'loading', t('notification.success'));
        const presetValue = patternForm.values.presets.dwell_time;
        for (const [pathIndex, pathData] of patternForm.values.path.entries()) {
          patternForm.setFieldValue(`path.${pathIndex}.default_dwell_time`, presetValue);
        }
        notify('update-preset-dwell_time', 'success', t('notification.success', { value: formatSecondsToTime(presetValue) }));
      },
    });
  };

  //
  // Render components

  return (
    <div className={styles.presetCard}>
      <NumberInput
        label={t('label')}
        placeholder={t('placeholder')}
        defaultValue={30}
        min={0}
        max={900}
        step={10}
        stepHoldDelay={500}
        stepHoldInterval={100}
        icon={<IconClockPause size='20px' />}
        formatter={formatSecondsToTime}
        {...patternForm.getInputProps(`presets.dwell_time`)}
        readOnly={isReadOnly}
      />
      <Button onClick={handleUpdateAll} variant='default'>
        {t('apply')}
      </Button>
    </div>
  );

  //
}

//
// STOP SEQUENCE TABLE

export default function PatternPresetsTable() {
  //

  //
  // A. Setup variables

  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.container}>
      <StopSequenceChangePresetsVelocity />
      <StopSequenceChangePresetsDwellTime />
    </div>
  );

  //
}
