'use client';

/* * */

import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { Button } from '@mantine/core';
import { IconMapPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './StopsExplorerNewStopWizardSteps2Nav.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps2Nav() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardSteps2Nav');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// C. Render components

	return (
		<div className={styles.container}>
			<Button disabled={stopsExplorerNewStopWizardContext.wizard.is_loading} onClick={stopsExplorerNewStopWizardContext.returnWizardToPreviousStep} variant="light">
				{t('previous_step.label')}
			</Button>
			<Button color="green" leftSection={<IconMapPlus size={18} />} loading={stopsExplorerNewStopWizardContext.wizard.is_loading} onClick={stopsExplorerNewStopWizardContext.confirmNewStopCreation} variant="filled">
				{t('create.label')}
			</Button>
		</div>
	);

	//
}
