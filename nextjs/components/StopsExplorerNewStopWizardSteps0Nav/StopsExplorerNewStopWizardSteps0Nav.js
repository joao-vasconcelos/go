'use client';

/* * */

import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';

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
			<Button color="red" onClick={handleCloseWizard} variant="light">
				{t('cancel.label')}
			</Button>
			<Button disabled={!stopsExplorerNewStopWizardContext.wizard.step_0_complete} onClick={stopsExplorerNewStopWizardContext.advanceWizardToNextStep} variant="filled">
				{t('next_step.label')}
			</Button>
		</div>
	);

	//
}
