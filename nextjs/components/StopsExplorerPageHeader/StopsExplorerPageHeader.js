'use client';

/* * */

import { useMap } from 'react-map-gl/maplibre';
import { IconArrowsMinimize, IconBrandGoogleMaps } from '@tabler/icons-react';
import { Tooltip, ActionIcon, SegmentedControl } from '@mantine/core';
import OSMMapDefaults from '@/components/OSMMap/OSMMap.config';
import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';
import ListHeader from '@/components/ListHeader/ListHeader';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';

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
        <ActionIcon color="gray" variant="light" size="lg" onClick={handleMapReCenter}>
          <IconArrowsMinimize size="20px" />
        </ActionIcon>
      </Tooltip>
      <Text size="h1" full>
        {t('title')}
      </Text>
      <Tooltip label={t('operations.gmaps.title')} position="bottom" withArrow>
        <ActionIcon color="gray" variant="light" size="lg" onClick={handleOpenInGoogleMaps}>
          <IconBrandGoogleMaps size="20px" />
        </ActionIcon>
      </Tooltip>
      <div>
        <SegmentedControl
          value={stopsExplorerContext.map.style}
          onChange={stopsExplorerContext.updateMapStyle}
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
