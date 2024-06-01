'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import buildGoogleMapsUrl from '@/services/buildGoogleMapsUrl';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconBrandGoogleMaps, IconCopy, IconMapShare, IconWorldLatitude, IconWorldLongitude } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './StopsExplorerNewStopWizardSteps0Info.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps0Info() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerNewStopWizardSteps0Info');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();
	const latitudeClipboard = useClipboard();
	const longitudeClipboard = useClipboard();
	const coordinatesClipboard = useClipboard();

	//
	// B. Render components

	const handleCopyLatitude = () => {
		latitudeClipboard.copy(stopsExplorerNewStopWizardContext.newStop.latitude);
	};

	const handleCopyLongitude = () => {
		longitudeClipboard.copy(stopsExplorerNewStopWizardContext.newStop.longitude);
	};

	const handleCopyCoordinates = () => {
		coordinatesClipboard.copy(`${stopsExplorerNewStopWizardContext.newStop.latitude}  ${stopsExplorerNewStopWizardContext.newStop.longitude}`);
	};

	const handleOpenInGoogleMaps = () => {
		const streetViewUrl = buildGoogleMapsUrl({ latitude: stopsExplorerNewStopWizardContext.newStop.latitude, longitude: stopsExplorerNewStopWizardContext.newStop.longitude, type: 'streetview' });
		window.open(streetViewUrl, '_blank', 'noopener,noreferrer');
	};

	const handleOpenInStreetView = () => {
		const streetViewUrl = buildGoogleMapsUrl({ latitude: stopsExplorerNewStopWizardContext.newStop.latitude, longitude: stopsExplorerNewStopWizardContext.newStop.longitude, type: 'streetview' });
		window.open(streetViewUrl, '_blank', 'noopener,noreferrer');
	};

	//
	// B. Render components

	if (!stopsExplorerNewStopWizardContext.newStop.latitude && !stopsExplorerNewStopWizardContext.newStop.longitude) {
		return (
			<div className={styles.container}>
				<NoDataLabel text={t('no_data')} />
			</div>
		);
	}

	return (
		<div className={styles.container}>
			{stopsExplorerNewStopWizardContext.newStop.municipality
				? (
					<div className={styles.municipality}>
						<span className={styles.municipalityPrefix}>#{stopsExplorerNewStopWizardContext.newStop.municipality?.prefix}</span>
						<span className={styles.municipalityName}>{stopsExplorerNewStopWizardContext.newStop.municipality?.name}</span>
					</div>
				)
				: <div className={styles.invalidMunicipality}>{t('invalid_municipality')}</div>}
			<div className={styles.coordinates}>
				<div className={styles.coordinatesValue} onClick={handleCopyLatitude}>
					<Tooltip label={t('coordinates.latitude.label')} withArrow>
						<IconWorldLatitude opacity={0.25} size={20} />
					</Tooltip>
					{latitudeClipboard.copied ? t('coordinates.latitude.copied') : stopsExplorerNewStopWizardContext.newStop.latitude.toFixed(6)}
				</div>
				<div className={styles.coordinatesValue} onClick={handleCopyLongitude}>
					<Tooltip label={t('coordinates.longitude.label')} withArrow>
						<IconWorldLongitude opacity={0.25} size={20} />
					</Tooltip>
					{longitudeClipboard.copied ? t('coordinates.longitude.copied') : stopsExplorerNewStopWizardContext.newStop.longitude.toFixed(6)}
				</div>
			</div>
			<div className={styles.actions}>
				<ActionIcon.Group>
					<Tooltip label={coordinatesClipboard.copied ? t('actions.copy_coordinates.copied') : t('actions.copy_coordinates.idle')} position="bottom" withArrow>
						<ActionIcon onClick={handleCopyCoordinates} size="xl" variant="default">
							<IconCopy size={20} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label={t('actions.open_in_google_maps.label')} position="bottom" withArrow>
						<ActionIcon onClick={handleOpenInGoogleMaps} size="xl" variant="default">
							<IconMapShare size={20} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label={t('actions.open_in_street_view.label')} position="bottom" withArrow>
						<ActionIcon onClick={handleOpenInStreetView} size="xl" variant="default">
							<IconBrandGoogleMaps size={20} />
						</ActionIcon>
					</Tooltip>
				</ActionIcon.Group>
			</div>
		</div>
	);

	//
}
