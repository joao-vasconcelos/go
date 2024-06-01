'use client';

/* * */

import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import styles from './StopsExplorerNewStopWizardSteps3Nav.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps3Nav() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardSteps3Nav');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Fetch data

	const { data: newStopData, isLoading: newStopLoading } = useSWR(stopsExplorerNewStopWizardContext.newStopId && `/api/stops/${stopsExplorerNewStopWizardContext.newStopId}`);
	const { isLoading: municipalityLoading } = useSWR(newStopData && `/api/municipalities/${newStopData.municipality}`);

	//
	// C. Render components

	return (
		<div className={styles.container}>
			<Button loading={newStopLoading || municipalityLoading} onClick={stopsExplorerNewStopWizardContext.goToNewStop} variant="filled">
				{t('close.label')}
			</Button>
		</div>
	);

	//
}
