'use client';

/* * */

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import styles from './StopsExplorerNewStopWizardSteps2Nav.module.css';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { IconMapPlus } from '@tabler/icons-react';

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
			<Button variant="light" onClick={stopsExplorerNewStopWizardContext.returnWizardToPreviousStep} disabled={stopsExplorerNewStopWizardContext.wizard.is_loading}>
				{t('previous_step.label')}
			</Button>
			<Button onClick={stopsExplorerNewStopWizardContext.confirmNewStopCreation} leftSection={<IconMapPlus size={18} />} loading={stopsExplorerNewStopWizardContext.wizard.is_loading} variant="filled" color="green">
				{t('create.label')}
			</Button>
		</div>
	);

	//
}