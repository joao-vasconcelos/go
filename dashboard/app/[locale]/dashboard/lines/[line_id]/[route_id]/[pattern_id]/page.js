'use client';

import useSWR from 'swr';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { yupResolver } from '@mantine/form';
import StatCard from '@/components/StatCard/StatCard';
import bbox from '@turf/bbox';
import { PatternFormProvider, usePatternForm } from '@/schemas/Pattern/form';
import API from '@/services/API';
import { PatternValidation } from '@/schemas/Pattern/validation';
import { PatternDefault } from '@/schemas/Pattern/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, Switch, SegmentedControl, Accordion, Group, JsonInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import OSMMap from '@/components/OSMMap/OSMMap';
import { useMap, Source, Layer } from 'react-map-gl/maplibre';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import LineDisplay from '@/components/LineDisplay/LineDisplay';
import StopSequenceTable from '@/components/StopSequenceTable/StopSequenceTable';
import SchedulesTable from '@/components/SchedulesTable/SchedulesTable';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import ImportPatternFromGTFS from '@/components/ImportPatternFromGTFS/ImportPatternFromGTFS';
import populate from '@/services/populate';
import PatternPresetsTable from '@/components/PatternPresetsTable/PatternPresetsTable';
import LockButton from '@/components/LockButton/LockButton';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('patterns');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isImporting, setIsImporting] = useState();
  const { data: session } = useSession();
  const { patternShapeMap } = useMap();

  const [showAllZonesOnMap, setShowAllZonesOnMap] = useState(false);
  const [showAllStopsOnMap, setShowAllStopsOnMap] = useState(false);
  const [allowScrollOnMap, setAllowScrollOnMap] = useState(false);
  const [mapStyle, setMapStyle] = useState('map');

  const [activeSection, setActiveSection] = useState(null);

  const { line_id, route_id, pattern_id } = useParams();

  //
  // B. Fetch data

  const { data: lineData } = useSWR(line_id && `/api/lines/${line_id}`);
  const { data: routeData, mutate: routeMutate } = useSWR(route_id && `/api/routes/${route_id}`);
  const { data: allZonesData } = useSWR('/api/zones');
  const { data: allStopsData } = useSWR('/api/stops');
  const { data: agencyData } = useSWR(lineData && lineData.agency && `/api/agencies/${lineData.agency}`);
  const { data: typologyData } = useSWR(lineData && lineData.typology && `/api/typologies/${lineData.typology}`);
  const { data: patternData, error: patternError, isLoading: patternLoading, mutate: patternMutate } = useSWR(pattern_id && `/api/patterns/${pattern_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: patternStopsData, mutate: patternStopsMutate } = useSWR(pattern_id && `/api/patterns/${pattern_id}/stops`);

  //
  // C. Setup patternForm

  const patternForm = usePatternForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(PatternValidation),
    initialValues: populate(PatternDefault, patternData),
  });

  const keepFormUpdated = (data) => {
    if (!patternForm.isDirty()) {
      const populated = populate(PatternDefault, data);
      patternForm.setValues(populated);
      patternForm.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(session, 'lines', 'create_edit') || lineData?.is_locked || routeData?.is_locked || patternData?.is_locked;

  //
  // E. Transform data

  useEffect(() => {
    if (!patternShapeMap) return;
    // Load direction arrows
    patternShapeMap.loadImage('/icons/shape-arrow-direction.png', (error, image) => {
      if (error) throw error;
      patternShapeMap.addImage('shape-arrow-direction', image, { sdf: true });
    });
  }, [patternShapeMap]);

  useEffect(() => {
    if (patternData?.shape?.geojson?.geometry?.coordinates?.length) {
      // Calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(patternData.shape.geojson);
      patternShapeMap?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 50, duration: 2000 }
      );
    }
    //
  }, [patternData, patternShapeMap]);

  const shapeExtensionCardValue = useMemo(() => {
    if (!patternForm.values?.shape?.extension) return '(no shape)';
    if (patternForm.values?.shape?.extension > 1000) return `${(patternForm.values.shape.extension / 1000).toFixed(3)} km`;
    else return `${patternForm.values.shape.extension} m`;
  }, [patternForm.values]);

  const shapeCost = useMemo(() => {
    if (!patternForm.values?.shape?.extension || !agencyData) return '(no shape)';
    const shapeExtensionInKm = patternForm.values?.shape?.extension / 1000;
    const shapeCostRaw = shapeExtensionInKm * agencyData.price_per_km;
    return `${shapeCostRaw.toFixed(2)} €`;
  }, [agencyData, patternForm.values]);

  const patternStopsMapData = useMemo(() => {
    // Create a GeoJSON object
    const geoJSON = {
      type: 'FeatureCollection',
      features: [],
    };
    if (patternStopsData?.path?.length > 1) {
      for (const [pathSequenceIndex, pathSequence] of patternStopsData.path.entries()) {
        geoJSON.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [pathSequence.stop?.longitude, pathSequence.stop?.latitude],
          },
          properties: {
            index: pathSequenceIndex + 1,
            _id: pathSequence.stop?._id,
            code: pathSequence.stop?.code,
            name: pathSequence.stop?.name,
            latitude: pathSequence.stop?.latitude,
            longitude: pathSequence.stop?.longitude,
          },
        });
      }
    }
    return geoJSON;
  }, [patternStopsData]);

  const allZonesMapData = useMemo(() => {
    // Create a GeoJSON object
    const geoJSON = {
      type: 'FeatureCollection',
      features: [],
    };
    if (allZonesData) {
      for (const zone of allZonesData) {
        if (zone?.geojson.geometry.coordinates?.length > 0) {
          geoJSON.features.push({
            ...zone.geojson,
            properties: {
              name: zone.name,
              code: zone.code,
              fill_color: zone.fill_color,
              fill_opacity: zone.fill_opacity,
              border_color: zone.border_color,
              border_opacity: zone.border_opacity,
              border_width: zone.border_width,
            },
          });
        }
      }
    }
    return geoJSON;
  }, [allZonesData]);

  const allStopsMapData = useMemo(() => {
    // Create a GeoJSON object
    const geoJSON = {
      type: 'FeatureCollection',
      features: [],
    };
    if (allStopsData) {
      for (const stop of allStopsData) {
        geoJSON.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(stop?.longitude), parseFloat(stop?.latitude)],
          },
          properties: {
            _id: stop?._id,
            code: stop?.code,
            name: stop?.name,
            latitude: stop?.latitude,
            longitude: stop?.longitude,
          },
        });
      }
    }
    return geoJSON;
  }, [allStopsData]);

  //
  // F. Handle actions

  const handleValidate = () => {
    patternForm.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/lines/${line_id}/${route_id}`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await API({ service: 'patterns', resourceId: pattern_id, operation: 'edit', method: 'PUT', body: patternForm.values });
      patternMutate();
      patternStopsMutate();
      patternForm.resetDirty();
      setIsSaving(false);
      setIsLocking(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setIsLocking(false);
      setHasErrorSaving(err);
    }
  };

  const handleLock = async (value) => {
    try {
      setIsLocking(true);
      await API({ service: 'patterns', resourceId: pattern_id, operation: 'lock', method: 'PUT', body: { is_locked: value } });
      patternMutate();
      setIsLocking(false);
    } catch (err) {
      console.log(err);
      patternMutate();
      setIsLocking(false);
    }
  };

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size="h2">{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(pattern_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'patterns', resourceId: pattern_id, operation: 'delete', method: 'DELETE' });
          routeMutate();
          router.push(`/dashboard/lines/${line_id}/${route_id}`);
          notify(pattern_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(pattern_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handleImport = async (importedPattern) => {
    console.log(importedPattern);
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Replace Path and Shape?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <SimpleGrid cols={1}>
          <Text>Tem a certeza que pretende importar este pattern?</Text>
          <Divider />
          <div>
            <Text>COMO ESTÁ AGORA</Text>
            <Text>Paragens: {patternData.path.length}</Text>
            <Text>Shape: {patternData.shape.extension} metros</Text>
          </div>
          <Divider />
          <div>
            <Text>COMO VAI FICAR DEPOIS DE IMPORTAR</Text>
            <Text>Paragens: {importedPattern.path.length}</Text>
            <Text>Shape: {parseInt(importedPattern.shape[importedPattern.shape.length - 1].shape_dist_traveled)} metros</Text>
          </div>
        </SimpleGrid>
      ),
      labels: { confirm: 'Sim, importar percurso', cancel: 'Manter como está' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('importing', 'loading', t('operations.import.loading'));
          await API({ service: 'patterns', resourceId: pattern_id, operation: 'import', method: 'PUT', body: importedPattern });
          patternMutate();
          patternStopsMutate();
          patternForm.resetDirty();
          setIsImporting(false);
          setHasErrorSaving(false);
          notify('importing', 'success', t('operations.import.success'));
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          setHasErrorSaving(err);
          notify('importing', 'error', err.message || t('operations.import.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={patternLoading || isImporting}
      header={
        <>
          <AutoSave isValid={patternForm.isValid()} isDirty={patternForm.isDirty()} isLoading={patternLoading} isErrorValidating={patternError} isSaving={isSaving} isErrorSaving={hasErrorSaving} onValidate={handleValidate} onSave={handleSave} onClose={handleClose} closeType="back" />
          <LineDisplay short_name={lineData && lineData.short_name} name={patternForm.values.headsign || t('untitled')} color={typologyData && typologyData.color} text_color={typologyData && typologyData.text_color} />
          <AuthGate scope="lines" permission="lock">
            <LockButton isLocked={patternData?.is_locked} setLocked={handleLock} loading={isLocking} disabled={lineData?.is_locked || routeData?.is_locked} />
          </AuthGate>
          <AuthGate scope="lines" permission="delete">
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete}>
                <IconTrash size="20px" />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </>
      }
    >
      <PatternFormProvider form={patternForm}>
        <form onSubmit={patternForm.onSubmit(async () => await handleSave())}>
          <Section>
            <div>
              <Text size="h2">{t('sections.config.title')}</Text>
              <Text size="h4">{t('sections.config.description')}</Text>
            </div>
            <SimpleGrid cols={4}>
              <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...patternForm.getInputProps('code')} readOnly={isReadOnly} />
            </SimpleGrid>
            <SimpleGrid cols={1}>
              <TextInput label={t('form.headsign.label')} placeholder={t('form.headsign.placeholder')} description={t('form.headsign.description')} {...patternForm.getInputProps('headsign')} readOnly={isReadOnly} />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size="h2">{t('sections.shape.title')}</Text>
              <Text size="h4">{t('sections.shape.description')}</Text>
            </div>
            <SimpleGrid cols={2}>
              <StatCard title={t('sections.shape.cards.extension')} value={shapeExtensionCardValue} />
              <StatCard title={t('sections.shape.cards.cost')} value={shapeCost} />
            </SimpleGrid>
          </Section>

          <div style={{ height: 400 }}>
            <OSMMap
              id="patternShapeMap"
              height={500}
              scrollZoom={allowScrollOnMap}
              mapStyle={mapStyle}
              toolbar={
                <>
                  <SegmentedControl
                    value={mapStyle}
                    onChange={setMapStyle}
                    size="xs"
                    data={[
                      { label: 'Map', value: 'map' },
                      { label: 'Satellite', value: 'satellite' },
                    ]}
                  />
                  <Switch size="xs" label={'Show Zones'} defaultChecked={showAllZonesOnMap} value={showAllZonesOnMap} onChange={(event) => setShowAllZonesOnMap(event.currentTarget.checked)} />
                  <Switch size="xs" label={'Show All Stops'} defaultChecked={showAllStopsOnMap} value={showAllStopsOnMap} onChange={(event) => setShowAllStopsOnMap(event.currentTarget.checked)} />
                  <Switch size="xs" label={'Allow Scroll'} defaultChecked={allowScrollOnMap} value={allowScrollOnMap} onChange={(event) => setAllowScrollOnMap(event.currentTarget.checked)} />
                </>
              }
            >
              {allZonesMapData && showAllZonesOnMap && (
                <Source id="all-zones" type="geojson" data={allZonesMapData}>
                  <Layer id="all-zones-polygons" type="fill" source="all-zones" layout={{}} paint={{ 'fill-color': ['get', 'fill_color'], 'fill-opacity': ['get', 'fill_opacity'] }} />
                  <Layer id="all-zones-borders" type="line" layout={{}} source="all-zones" paint={{ 'line-color': ['get', 'border_color'], 'line-opacity': ['get', 'border_opacity'], 'line-width': ['get', 'border_width'] }} />
                  <Layer id="all-zones-labels" type="symbol" source="all-zones" layout={{ 'text-field': ['get', 'name'], 'text-offset': [0, 0], 'text-anchor': 'center', 'text-size': 14 }} />
                </Source>
              )}
              {allStopsMapData && showAllStopsOnMap && (
                <Source id="all-stops" type="geojson" data={allStopsMapData}>
                  <Layer id="all-stops" type="circle" source="all-stops" paint={{ 'circle-color': 'rgba(255,220,0,0.75)', 'circle-radius': 2, 'circle-stroke-width': 1, 'circle-stroke-color': 'rgba(0,0,0,0.5)' }} />
                </Source>
              )}
              {patternForm.values?.shape?.geojson && (
                <Source id="pattern-shape" type="geojson" data={patternForm.values.shape.geojson}>
                  <Layer
                    id="pattern-shape-direction"
                    type="symbol"
                    source="pattern-shape"
                    layout={{
                      'icon-allow-overlap': true,
                      'icon-ignore-placement': true,
                      'icon-anchor': 'center',
                      'symbol-placement': 'line',
                      'icon-image': 'shape-arrow-direction',
                      'icon-size': ['interpolate', ['linear', 0.5], ['zoom'], 10, 0.1, 20, 0.2],
                      'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 10, 2, 20, 30],
                      'icon-offset': [0, 0],
                      'icon-rotate': 90,
                    }}
                    paint={{
                      'icon-color': '#ffffff',
                      'icon-opacity': 0.8,
                    }}
                  />
                  <Layer
                    id="pattern-shape-line"
                    type="line"
                    source="pattern-shape"
                    beforeId="pattern-shape-direction"
                    layout={{
                      'line-join': 'round',
                      'line-cap': 'round',
                    }}
                    paint={{
                      'line-color': typologyData ? typologyData.color : '#000000',
                      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
                    }}
                  />
                </Source>
              )}
              {patternStopsMapData && (
                <Source id="pattern-stops" type="geojson" data={patternStopsMapData}>
                  <Layer id="pattern-stops-circle" type="circle" source="pattern-stops" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 8, 'circle-stroke-width': 1, 'circle-stroke-color': '#000000' }} />
                  <Layer id="pattern-stops-labels" type="symbol" source="pattern-stops" layout={{ 'text-field': ['get', 'index'], 'text-offset': [0, 0], 'text-anchor': 'center', 'text-size': 10 }} />
                </Source>
              )}
            </OSMMap>
          </div>

          <Divider />

          <Accordion value={activeSection} onChange={setActiveSection}>
            <Accordion.Item value={'path'}>
              <Accordion.Control>
                <Section>
                  <div>
                    <Text size="h2">{t('sections.path.title')}</Text>
                    <Text size="h4">{t('sections.path.description')}</Text>
                  </div>
                </Section>
              </Accordion.Control>
              <Accordion.Panel>
                {activeSection === 'path' && (
                  <Section>
                    <StopSequenceTable isReadOnly={isReadOnly} />
                  </Section>
                )}
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value={'schedules'}>
              <Accordion.Control>
                <Section>
                  <div>
                    <Text size="h2">{t('sections.schedules.title')}</Text>
                    <Text size="h4">{t('sections.schedules.description')}</Text>
                  </div>
                </Section>
              </Accordion.Control>
              <Accordion.Panel>
                {activeSection === 'schedules' && (
                  <Section>
                    <SchedulesTable isReadOnly={isReadOnly} />
                  </Section>
                )}
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value={'presets'}>
              <Accordion.Control>
                <Section>
                  <div>
                    <Text size="h2">{t('sections.presets.title')}</Text>
                    <Text size="h4">{t('sections.presets.description')}</Text>
                  </div>
                </Section>
              </Accordion.Control>
              <Accordion.Panel>
                {activeSection === 'presets' && (
                  <Section>
                    <PatternPresetsTable isReadOnly={isReadOnly} />
                  </Section>
                )}
              </Accordion.Panel>
            </Accordion.Item>

            {!isReadOnly && (
              <Accordion.Item value={'import'}>
                <Accordion.Control>
                  <Section>
                    <div>
                      <Text size="h2">{t('sections.update_path.title')}</Text>
                      <Text size="h4">{t('sections.update_path.description')}</Text>
                    </div>
                  </Section>
                </Accordion.Control>
                <Accordion.Panel>
                  {activeSection === 'import' && (
                    <Section>
                      <ImportPatternFromGTFS onImport={handleImport} />
                    </Section>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            )}

            <AuthGate scope="configs" permission="admin">
              <Accordion.Item value={'debug'}>
                <Accordion.Control>
                  <Section>
                    <div>
                      <Text size="h2">{t('sections.debug.title')}</Text>
                      <Text size="h4">{t('sections.debug.description')}</Text>
                    </div>
                  </Section>
                </Accordion.Control>
                <Accordion.Panel>
                  {activeSection === 'debug' && (
                    <Section>
                      <JsonInput value={JSON.stringify(patternData)} rows={20} />
                    </Section>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            </AuthGate>
          </Accordion>
        </form>
      </PatternFormProvider>
    </Pannel>
  );
}
