'use client';

/* * */

import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import calculateTravelTime from '@/services/calculateTravelTime';
import formatSecondsToTime from '@/services/formatSecondsToTime';
import notify from '@/services/notify';
import { Button, NumberInput, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconClockPause, IconPlayerTrackNext } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './PatternsExplorerIdPagePresets.module.css';

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
			centered: true,
			children: <Text size="h3">{t('modal.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('modal.cancel'), confirm: t('modal.confirm') },
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
			title: <Text size="h2">{t('modal.title')}</Text>,
		});
	};

	//
	// C. Render components

	return (
		<div className={styles.presetCard}>
			<NumberInput defaultValue={20} label={t('label')} leftSection={<IconPlayerTrackNext size={18} />} min={0} placeholder={t('placeholder')} step={1} suffix=" km/h" {...patternsExplorerContext.form.getInputProps(`presets.velocity`)} readOnly={patternsExplorerContext.page.is_read_only} />
			<Button disabled={patternsExplorerContext.page.is_read_only} onClick={handleUpdateAll} variant="default">
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
			centered: true,
			children: <Text size="h3">{t('modal.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('modal.cancel'), confirm: t('modal.confirm') },
			onConfirm: async () => {
				notify('update-preset-dwell_time', 'loading', t('notification.success'));
				const presetValue = patternsExplorerContext.form.values.presets.dwell_time;
				for (const [pathIndex, pathData] of patternsExplorerContext.form.values.path.entries()) {
					patternsExplorerContext.form.setFieldValue(`path.${pathIndex}.default_dwell_time`, presetValue);
				}
				notify('update-preset-dwell_time', 'success', t('notification.success', { value: formatSecondsToTime(presetValue) }));
			},
			title: <Text size="h2">{t('modal.title')}</Text>,
		});
	};

	//
	// C. Render components

	return (
		<div className={styles.presetCard}>
			<NumberInput defaultValue={30} label={t('label')} leftSection={<IconClockPause size={20} />} max={900} min={0} placeholder={t('placeholder')} step={10} suffix=" seg" {...patternsExplorerContext.form.getInputProps(`presets.dwell_time`)} readOnly={patternsExplorerContext.page.is_read_only} />
			<Button disabled={patternsExplorerContext.page.is_read_only} onClick={handleUpdateAll} variant="default">
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
