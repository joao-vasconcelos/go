'use client';

/* * */

import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';

import styles from './StopsExplorerNewStopWizardSteps1Nav.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps1Nav() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardSteps1Nav');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// C. Render components

	return (
		<div className={styles.container}>
			<Button onClick={stopsExplorerNewStopWizardContext.returnWizardToPreviousStep} variant="light">
				{t('previous_step.label')}
			</Button>
			<Button disabled={!stopsExplorerNewStopWizardContext.wizard.step_1_complete} onClick={stopsExplorerNewStopWizardContext.advanceWizardToNextStep} variant="filled">
				{t('next_step.label')}
			</Button>
		</div>
	);

	//
}
