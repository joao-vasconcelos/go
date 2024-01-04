'use client';

/* * */

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import styles from './StopsExplorerNewStopWizardSteps1Nav.module.css';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';

/* * */

export default function StopsExplorerNewStopWizardSteps1Nav() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopsExplorerNewStopWizardSteps1Nav');
  const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

  //
  // C. Render components

  return (
    <div className={styles.container}>
      <Button variant="light" onClick={stopsExplorerNewStopWizardContext.returnWizardToPreviousStep}>
        {t('previous_step.label')}
      </Button>
      <Button onClick={stopsExplorerNewStopWizardContext.advanceWizardToNextStep} variant="filled" disabled={!stopsExplorerNewStopWizardContext.wizard.step_1_complete}>
        {t('next_step.label')}
      </Button>
    </div>
  );

  //
}
