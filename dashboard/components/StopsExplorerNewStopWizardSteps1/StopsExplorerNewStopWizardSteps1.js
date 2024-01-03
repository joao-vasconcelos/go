'use client';

/* * */

import styles from './StopsExplorerNewStopWizardSteps1.module.css';
import StopsExplorerNewStopWizardSteps1Nav from '@/components/StopsExplorerNewStopWizardSteps1Nav/StopsExplorerNewStopWizardSteps1Nav';
import StopsExplorerNewStopWizardSteps1Form from '@/components/StopsExplorerNewStopWizardSteps1Form/StopsExplorerNewStopWizardSteps1Form';

/* * */

export default function StopsExplorerNewStopWizardSteps1() {
  return (
    <div className={styles.container}>
      <StopsExplorerNewStopWizardSteps1Form />
      <StopsExplorerNewStopWizardSteps1Nav />
    </div>
  );
}
