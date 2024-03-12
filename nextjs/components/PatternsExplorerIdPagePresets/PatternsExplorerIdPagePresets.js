'use client';

/* * */

import { useTranslations } from 'next-intl';
import styles from './PatternsExplorerIdPagePresets.module.css';
import { Text, NumberInput, Button } from '@mantine/core';
import { IconClockPause, IconPlayerTrackNext } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import calculateTravelTime from '@/services/calculateTravelTime';
import notify from '@/services/notify';
import formatSecondsToTime from '@/services/formatSecondsToTime';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';

/* * */

export function PatternsExplorerIdPagePresetsVelocity() {
  //

  //
  // A. Setup variables

  const t = useTranslations('PatternsExplorerIdPagePresets.velocity');
  const patternsExplorerContext = usePatternsExplorerContext();

  //
  // B. Handle actions

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
        const presetValue = patternsExplorerContext.form.values.presets.velocity;
        for (const [pathIndex, pathData] of patternsExplorerContext.form.values.path.entries()) {
          if (pathIndex === 0) continue;
          patternsExplorerContext.form.setFieldValue(`path.${pathIndex}.default_velocity`, presetValue);
          patternsExplorerContext.form.setFieldValue(`path.${pathIndex}.default_travel_time`, calculateTravelTime(pathData.distance_delta, presetValue));
        }
        notify('update-preset-velocity', 'success', t('notification.success', { value: `${presetValue} km/h` }));
      },
    });
  };

  //
  // C. Render components

  return (
    <div className={styles.presetCard}>
      <NumberInput label={t('label')} placeholder={t('placeholder')} defaultValue={20} min={0} step={1} suffix={' km/h'} leftSection={<IconPlayerTrackNext size={18} />} {...patternsExplorerContext.form.getInputProps(`presets.velocity`)} readOnly={patternsExplorerContext.page.is_read_only} />
      <Button onClick={handleUpdateAll} variant="default" disabled={patternsExplorerContext.page.is_read_only}>
        {t('apply')}
      </Button>
    </div>
  );

  //
}

/* * */

export function PatternsExplorerIdPagePresetsDwellTime() {
  //

  //
  // A. Setup variables

  const t = useTranslations('PatternsExplorerIdPagePresets.dwell_time');
  const patternsExplorerContext = usePatternsExplorerContext();

  //
  // B. Handle actions

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
        const presetValue = patternsExplorerContext.form.values.presets.dwell_time;
        for (const [pathIndex, pathData] of patternsExplorerContext.form.values.path.entries()) {
          patternsExplorerContext.form.setFieldValue(`path.${pathIndex}.default_dwell_time`, presetValue);
        }
        notify('update-preset-dwell_time', 'success', t('notification.success', { value: formatSecondsToTime(presetValue) }));
      },
    });
  };

  //
  // C. Render components

  return (
    <div className={styles.presetCard}>
      <NumberInput label={t('label')} placeholder={t('placeholder')} defaultValue={30} min={0} max={900} step={10} leftSection={<IconClockPause size={20} />} suffix={' seg'} {...patternsExplorerContext.form.getInputProps(`presets.dwell_time`)} readOnly={patternsExplorerContext.page.is_read_only} />
      <Button onClick={handleUpdateAll} variant="default" disabled={patternsExplorerContext.page.is_read_only}>
        {t('apply')}
      </Button>
    </div>
  );

  //
}

/* * */

export default function PatternsExplorerIdPagePresets() {
  return (
    <div className={styles.container}>
      <PatternsExplorerIdPagePresetsVelocity />
      <PatternsExplorerIdPagePresetsDwellTime />
    </div>
  );
}
