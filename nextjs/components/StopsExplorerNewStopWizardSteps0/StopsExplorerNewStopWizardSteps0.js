'use client';

/* * */

import styles from './StopsExplorerNewStopWizardSteps0.module.css';
import StopsExplorerNewStopWizardSteps0Toolbar from '@/components/StopsExplorerNewStopWizardSteps0Toolbar/StopsExplorerNewStopWizardSteps0Toolbar';
import StopsExplorerNewStopWizardSteps0Map from '@/components/StopsExplorerNewStopWizardSteps0Map/StopsExplorerNewStopWizardSteps0Map';
import StopsExplorerNewStopWizardSteps0Nav from '@/components/StopsExplorerNewStopWizardSteps0Nav/StopsExplorerNewStopWizardSteps0Nav';
import StopsExplorerNewStopWizardSteps0Info from '@/components/StopsExplorerNewStopWizardSteps0Info/StopsExplorerNewStopWizardSteps0Info';

/* * */

export default function StopsExplorerNewStopWizardSteps0() {
	return (
		<div className={styles.container}>
			<StopsExplorerNewStopWizardSteps0Toolbar />
			<StopsExplorerNewStopWizardSteps0Map />
			<StopsExplorerNewStopWizardSteps0Info />
			<StopsExplorerNewStopWizardSteps0Nav />
		</div>
	);
}