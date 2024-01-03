/* * */

import { Modal } from '@mantine/core';
import styles from './StopsExplorerNewStopWizard.module.css';
import StopsExplorerNewStopWizardHeader from '@/components/StopsExplorerNewStopWizardHeader/StopsExplorerNewStopWizardHeader';
import StopsExplorerNewStopWizardSteps from '@/components/StopsExplorerNewStopWizardSteps/StopsExplorerNewStopWizardSteps';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';

/* * */

export default function StopsExplorerNewStopWizard() {
  //

  //
  // A. Setup variables

  const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

  //
  // B. Render components

  return (
    <Modal.Root opened={stopsExplorerNewStopWizardContext.wizard.is_open} onClose={() => {}} size="xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body className={styles.modalBody}>
          <StopsExplorerNewStopWizardHeader />
          <StopsExplorerNewStopWizardSteps />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );

  //
}
