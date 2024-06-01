'use client';

/* * */

import Loader from '@/components/Loader/Loader';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import styles from './StopsExplorerNewStopWizardSteps3Summary.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps3Summary() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardSteps3Summary');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Fetch data

	const { data: newStopData, isLoading: newStopLoading } = useSWR(stopsExplorerNewStopWizardContext.newStopId && `/api/stops/${stopsExplorerNewStopWizardContext.newStopId}`);
	const { data: municipalityData, isLoading: municipalityLoading } = useSWR(newStopData && `/api/municipalities/${newStopData.municipality}`);

	//
	// B. Render components

	if (newStopLoading || municipalityLoading) {
		return (
			<div className={styles.container}>
				<Loader visible />
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<p>Criada nova paragem com o Código #{newStopData.code}</p>
			<h2 className={styles.stopName}>{newStopData.name}</h2>
			<h3 className={styles.stopLocation}>
				{newStopData.locality}, {municipalityData.name}
			</h3>
			<h4 className={styles.stopCoordinates}>
				{newStopData.latitude}, {newStopData.longitude}
			</h4>
		</div>
	);

	//
}
