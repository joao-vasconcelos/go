'use client';

/* * */

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import styles from './StopsExplorerNewStopWizardNavigation.module.css';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';

/* * */

export default function StopsExplorerNewStopWizardNavigation({ onClose }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardNavigation');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Render components

	if (stopsExplorerNewStopWizardContext.wizard.current_step === 0) {
		return (
			<div className={styles.twoColumnRow}>
				<Button variant="light" color="red" onClick={onClose}>
					{t('cancel.label')}
				</Button>
				<Button onClick={stopsExplorerNewStopWizardContext.advanceWizardToNextStep} variant="filled">
					{t('next_step.label')}
				</Button>
			</div>
		);
	}

	if (stopsExplorerNewStopWizardContext.wizard.current_step > 0 && stopsExplorerNewStopWizardContext.wizard.current_step < stopsExplorerNewStopWizardContext.wizard.max_step - 1) {
		return (
			<div className={styles.twoColumnRow}>
				<Button variant="light" onClick={stopsExplorerNewStopWizardContext.returnWizardToPreviousStep}>
					{t('previous_step.label')}
				</Button>
				<Button onClick={stopsExplorerNewStopWizardContext.advanceWizardToNextStep} variant="filled">
					{t('next_step.label')}
				</Button>
			</div>
		);
	}

	if (stopsExplorerNewStopWizardContext.wizard.current_step === stopsExplorerNewStopWizardContext.wizard.max_step - 1) {
		return (
			<div className={styles.twoColumnRow}>
				<Button variant="light" onClick={stopsExplorerNewStopWizardContext.returnWizardToPreviousStep}>
					{t('previous_step.label')}
				</Button>
				<Button color="green" onClick={stopsExplorerNewStopWizardContext.advanceWizardToNextStep}>
					{t('create.label')}
				</Button>
			</div>
		);
	}

	if (stopsExplorerNewStopWizardContext.wizard.current_step === stopsExplorerNewStopWizardContext.wizard.max_step) {
		return (
			<div className={styles.oneColumnRow}>
				<Button variant="light" onClick={stopsExplorerNewStopWizardContext.goToNewStop}>
					{t('close.label')}
				</Button>
			</div>
		);
	}

	//
}