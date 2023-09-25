'use client';

import { useTranslations } from 'next-intl';
import styles from './PatternPresetsTable.module.css';
import { usePatternFormContext } from '@/schemas/Pattern/form';
import { Text, NumberInput, Button } from '@mantine/core';
import { IconClockPause, IconPlayerTrackNext } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import calculateTravelTime from '@/services/calculateTravelTime';
import notify from '@/services/notify';
import formatSecondsToTime from '@/services/formatSecondsToTime';

//
//
//

//
// STOP SEQUENCE TABLE - VELOCITY COLUMN

export function StopSequenceChangePresetsVelocity({ isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('PatternPresetsTable.velocity');
  const patternForm = usePatternFormContext();

  //
  // Render components

  const handleUpdateAll = () => {
    openConfirmModal({
      title: <Text size="h2">{t('modal.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('modal.description')}</Text>,
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
      <NumberInput label={t('label')} placeholder={t('placeholder')} defaultValue={20} min={0} step={1} suffix={' km/h'} leftSection={<IconPlayerTrackNext size={18} />} {...patternForm.getInputProps(`presets.velocity`)} readOnly={isReadOnly} />
      <Button onClick={handleUpdateAll} variant="default" disabled={isReadOnly}>
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

export function StopSequenceChangePresetsDwellTime({ isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('PatternPresetsTable.dwell_time');
  const patternForm = usePatternFormContext();

  //
  // Render components

  const handleUpdateAll = () => {
    openConfirmModal({
      title: <Text size="h2">{t('modal.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('modal.description')}</Text>,
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
        leftSection={<IconClockPause size={20} />}
        suffix={' seg'}
        {...patternForm.getInputProps(`presets.dwell_time`)}
        readOnly={isReadOnly}
      />
      <Button onClick={handleUpdateAll} variant="default" disabled={isReadOnly}>
        {t('apply')}
      </Button>
    </div>
  );

  //
}

//
// STOP SEQUENCE TABLE

export default function PatternPresetsTable({ isReadOnly }) {
  //

  //
  // Render components

  return (
    <div className={styles.container}>
      <StopSequenceChangePresetsVelocity isReadOnly={isReadOnly} />
      <StopSequenceChangePresetsDwellTime isReadOnly={isReadOnly} />
    </div>
  );

  //
}
