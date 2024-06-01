'use client';

/* * */

import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { useTranslations } from 'next-intl';

import styles from './StopsExplorerNewStopWizardSteps2Summary.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps2Summary() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardSteps2Summary');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<h2 className={styles.stopName}>{stopsExplorerNewStopWizardContext.newStop.name}</h2>
			<h3 className={styles.stopLocation}>
				{stopsExplorerNewStopWizardContext.newStop.locality}, {stopsExplorerNewStopWizardContext.newStop.municipality.name}
			</h3>
			<h4 className={styles.stopCoordinates}>
				{stopsExplorerNewStopWizardContext.newStop.latitude}, {stopsExplorerNewStopWizardContext.newStop.longitude}
			</h4>
		</div>
	);

	//
}
