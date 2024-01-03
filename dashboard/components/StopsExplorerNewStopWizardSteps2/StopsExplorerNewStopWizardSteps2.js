'use client';

/* * */

import styles from './StopsExplorerNewStopWizardSteps2.module.css';
import StopsExplorerNewStopWizardSteps2Nav from '@/components/StopsExplorerNewStopWizardSteps2Nav/StopsExplorerNewStopWizardSteps2Nav';
import StopsExplorerNewStopWizardSteps2Summary from '@/components/StopsExplorerNewStopWizardSteps2Summary/StopsExplorerNewStopWizardSteps2Summary';

/* * */

export default function StopsExplorerNewStopWizardSteps2() {
  return (
    <div className={styles.container}>
      <StopsExplorerNewStopWizardSteps2Summary />
      <StopsExplorerNewStopWizardSteps2Nav />
    </div>
  );
}
