'use client';

/* * */

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import styles from './StopsExplorerNewStopWizardSteps0Nav.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps0Nav() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardSteps0Nav');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// C. Handle actions

	const handleCloseWizard = () => {
		stopsExplorerNewStopWizardContext.closeWizard();
	};

	//
	// D. Render components

	return (
		<div className={styles.container}>
			<Button variant="light" color="red" onClick={handleCloseWizard}>
				{t('cancel.label')}
			</Button>
			<Button onClick={stopsExplorerNewStopWizardContext.advanceWizardToNextStep} variant="filled" disabled={!stopsExplorerNewStopWizardContext.wizard.step_0_complete}>
				{t('next_step.label')}
			</Button>
		</div>
	);

	//
}