'use client';

/* * */

import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import styles from './StopsExplorerNewStopWizardHeader.module.css';
import { Stepper } from '@mantine/core';
import { useTranslations } from 'next-intl';

/* * */

export default function StopsExplorerNewStopWizardHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardHeader');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<Stepper active={stopsExplorerNewStopWizardContext.wizard.current_step}>
				<Stepper.Step label={t('step_0.label')} description={t('step_0.description')} loading={stopsExplorerNewStopWizardContext.wizard.current_step === 0 && stopsExplorerNewStopWizardContext.wizard.is_loading} />
				<Stepper.Step label={t('step_1.label')} description={t('step_1.description')} loading={stopsExplorerNewStopWizardContext.wizard.current_step === 1 && stopsExplorerNewStopWizardContext.wizard.is_loading} />
				<Stepper.Step label={t('step_2.label')} description={t('step_2.description')} loading={stopsExplorerNewStopWizardContext.wizard.current_step === 2 && stopsExplorerNewStopWizardContext.wizard.is_loading} />
				<Stepper.Completed />
			</Stepper>
		</div>
	);

	//
}