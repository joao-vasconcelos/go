'use client';

/* * */

import styles from './StopsExplorerNewStopWizardSteps3.module.css';
import StopsExplorerNewStopWizardSteps3Nav from '@/components/StopsExplorerNewStopWizardSteps3Nav/StopsExplorerNewStopWizardSteps3Nav';
import StopsExplorerNewStopWizardSteps3Summary from '@/components/StopsExplorerNewStopWizardSteps3Summary/StopsExplorerNewStopWizardSteps3Summary';

/* * */

export default function StopsExplorerNewStopWizardSteps3() {
	return (
		<div className={styles.container}>
			<StopsExplorerNewStopWizardSteps3Summary />
			<StopsExplorerNewStopWizardSteps3Nav />
		</div>
	);
}