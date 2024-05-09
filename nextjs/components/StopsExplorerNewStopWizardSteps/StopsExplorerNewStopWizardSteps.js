'use client';

/* * */

import styles from './StopsExplorerNewStopWizardSteps.module.css';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import StopsExplorerNewStopWizardSteps0 from '@/components/StopsExplorerNewStopWizardSteps0/StopsExplorerNewStopWizardSteps0';
import StopsExplorerNewStopWizardSteps1 from '@/components/StopsExplorerNewStopWizardSteps1/StopsExplorerNewStopWizardSteps1';
import StopsExplorerNewStopWizardSteps2 from '@/components/StopsExplorerNewStopWizardSteps2/StopsExplorerNewStopWizardSteps2';
import StopsExplorerNewStopWizardSteps3 from '@/components/StopsExplorerNewStopWizardSteps3/StopsExplorerNewStopWizardSteps3';

/* * */

export default function StopsExplorerNewStopWizardSteps() {
	//

	//
	// A. Setup variables

	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Render components

	return (
		<div className={styles.container}>
			{stopsExplorerNewStopWizardContext.wizard.current_step === 0 && <StopsExplorerNewStopWizardSteps0 />}
			{stopsExplorerNewStopWizardContext.wizard.current_step === 1 && <StopsExplorerNewStopWizardSteps1 />}
			{stopsExplorerNewStopWizardContext.wizard.current_step === 2 && <StopsExplorerNewStopWizardSteps2 />}
			{stopsExplorerNewStopWizardContext.wizard.current_step === 3 && <StopsExplorerNewStopWizardSteps3 />}
		</div>
	);

	//
}