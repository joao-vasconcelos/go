'use client';

/* * */

import ListHeader from '@/components/ListHeader/ListHeader';
import OSMMapDefaults from '@/components/OSMMap/OSMMap.config';
import Text from '@/components/Text/Text';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { ActionIcon, SegmentedControl, Tooltip } from '@mantine/core';
import { IconArrowsMinimize, IconBrandGoogleMaps } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMap } from 'react-map-gl/maplibre';

/* * */

export default function StopsExplorerPageHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerPageHeader');
	const stopsExplorerContext = useStopsExplorerContext();
	const { allStopsMap } = useMap();

	//
	// B. Handle actions

	const handleMapReCenter = () => {
		allStopsMap.flyTo({ ...OSMMapDefaults.viewport, duration: 2000 });
	};

	const handleOpenInGoogleMaps = () => {
		const center = allStopsMap.getCenter();
		const zoom = allStopsMap.getZoom();
		window.open(`https://www.google.com/maps/@${center.lat},${center.lng},${zoom}z`, '_blank', 'noopener,noreferrer');
	};

	//
	// C. Render components

	return (
		<ListHeader>
			<Tooltip label={t('operations.recenter.title')} position="bottom" withArrow>
				<ActionIcon color="gray" onClick={handleMapReCenter} size="lg" variant="light">
					<IconArrowsMinimize size="20px" />
				</ActionIcon>
			</Tooltip>
			<Text size="h1" full>
				{t('title')}
			</Text>
			<Tooltip label={t('operations.gmaps.title')} position="bottom" withArrow>
				<ActionIcon color="gray" onClick={handleOpenInGoogleMaps} size="lg" variant="light">
					<IconBrandGoogleMaps size="20px" />
				</ActionIcon>
			</Tooltip>
			<div>
				<SegmentedControl
					onChange={stopsExplorerContext.updateMapStyle}
					value={stopsExplorerContext.map.style}
					data={[
						{ label: 'Mapa', value: 'map' },
						{ label: 'Satélite', value: 'satellite' },
					]}
				/>
			</div>
		</ListHeader>
	);

	//
}
