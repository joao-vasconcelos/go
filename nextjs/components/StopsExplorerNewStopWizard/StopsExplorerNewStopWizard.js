/* * */

import StopsExplorerNewStopWizardHeader from '@/components/StopsExplorerNewStopWizardHeader/StopsExplorerNewStopWizardHeader';
import StopsExplorerNewStopWizardSteps from '@/components/StopsExplorerNewStopWizardSteps/StopsExplorerNewStopWizardSteps';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { Modal } from '@mantine/core';

import styles from './StopsExplorerNewStopWizard.module.css';

/* * */

export default function StopsExplorerNewStopWizard() {
	//

	//
	// A. Setup variables

	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Render components

	return (
		<Modal.Root onClose={() => null} opened={stopsExplorerNewStopWizardContext.wizard.is_open} size="xl">
			<Modal.Overlay blur={15} className={styles.modalOverlay} />
			<Modal.Content className={styles.modalContent}>
				<Modal.Body className={styles.modalBody}>
					<StopsExplorerNewStopWizardHeader />
					<StopsExplorerNewStopWizardSteps />
				</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	);

	//
}
