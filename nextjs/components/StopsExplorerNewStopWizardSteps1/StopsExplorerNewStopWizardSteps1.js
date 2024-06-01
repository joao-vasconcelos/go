'use client';

/* * */

import StopsExplorerNewStopWizardSteps1Form from '@/components/StopsExplorerNewStopWizardSteps1Form/StopsExplorerNewStopWizardSteps1Form';
import StopsExplorerNewStopWizardSteps1Nav from '@/components/StopsExplorerNewStopWizardSteps1Nav/StopsExplorerNewStopWizardSteps1Nav';

import styles from './StopsExplorerNewStopWizardSteps1.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps1() {
	return (
		<div className={styles.container}>
			<StopsExplorerNewStopWizardSteps1Form />
			<StopsExplorerNewStopWizardSteps1Nav />
		</div>
	);
}
