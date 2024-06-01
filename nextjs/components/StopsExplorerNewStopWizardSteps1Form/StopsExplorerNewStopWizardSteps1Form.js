'use client';

/* * */

import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { StopOptions } from '@/schemas/Stop/options';
import { Alert, TextInput } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './StopsExplorerNewStopWizardSteps1Form.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps1Form() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardSteps1Form');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<TextInput
				description={t('name.description')}
				label={t('name.label')}
				onChange={event => stopsExplorerNewStopWizardContext.setNewStopName(event.currentTarget.value)}
				placeholder={t('name.placeholder')}
				rightSection={stopsExplorerNewStopWizardContext.newStop.name.length >= StopOptions.min_stop_name_length && stopsExplorerNewStopWizardContext.newStop.name.length <= StopOptions.max_stop_name_length ? <IconCheck color="green" size={20} /> : <IconX color="red" size={20} />}
				value={stopsExplorerNewStopWizardContext.newStop.name}
			/>
			<TextInput
				description={t('short_name.description')}
				label={t('short_name.label')}
				placeholder={t('short_name.placeholder')}
				readOnly={true}
				rightSection={<div className={`${styles.shortNameLength} ${stopsExplorerNewStopWizardContext.newStop.short_name.length >= StopOptions.max_stop_short_name_length && styles.shortNameLengthTooLong}`}>{stopsExplorerNewStopWizardContext.newStop.short_name.length}</div>}
				value={stopsExplorerNewStopWizardContext.newStop.short_name}
			/>

			<Alert>
				<TextInput description={t('locality.description')} label={t('locality.label')} onChange={event => stopsExplorerNewStopWizardContext.setNewStopLocality(event.currentTarget.value)} placeholder={t('locality.placeholder')} value={stopsExplorerNewStopWizardContext.newStop.locality} />
			</Alert>
		</div>
	);

	//
}
