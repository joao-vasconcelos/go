'use client';

import useSWR from 'swr';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { yupResolver } from '@mantine/form';
import StatCard from '@/components/StatCard/StatCard';
import bbox from '@turf/bbox';
import { FormProvider as PatternFormProvider, useForm as usePatternForm } from '@/schemas/Pattern/form';
import API from '@/services/API';
import { Validation as PatternValidation } from '@/schemas/Pattern/validation';
import { Default as PatternDefault } from '@/schemas/Pattern/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider } from '@mantine/core';
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
import { create } from 'lodash';
import ImportPatternFromGTFS from '@/components/ImportPatternFromGTFS/ImportPatternFromGTFS';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('patterns');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isImporting, setIsImporting] = useState();
  const { data: session } = useSession();
  const { patternShapeMap } = useMap();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');

  const { line_id, route_id, pattern_id } = useParams();

  //
  // B. Fetch data

  const { data: lineData } = useSWR(line_id && `/api/lines/${line_id}`);
  const { data: routeData, error: routeError, isLoading: routeLoading, isValidating: routeValidating, mutate: routeMutate } = useSWR(route_id && `/api/routes/${route_id}`);
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
    initialValues: create({ ...PatternDefault }, { ...patternData }),
  });

  const keepFormUpdated = (data) => {
    if (!patternForm.isDirty()) {
      const document = create({ ...PatternDefault }, { ...data });
      patternForm.setValues(document);
      patternForm.resetDirty(document);
    }
  };

  //
  // D. Format data

  //
  // E. Transform data

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

  const shapeExtension = useMemo(() => {
    if (patternForm.values.shape.extension > 1000) return `${(patternForm.values.shape.extension / 1000).toFixed(3)} km`;
    else return `${patternForm.values.shape.extension} m`;
  }, [patternForm.values.shape.extension]);

  const patternStopsMapData = useMemo(() => {
    // Create a GeoJSON object
    const geoJSON = {
      type: 'FeatureCollection',
      features: [],
    };
    if (patternStopsData?.path?.length) {
      for (const [pathSequenceIndex, pathSequence] of patternStopsData.path.entries()) {
        geoJSON.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [pathSequence.stop.longitude, pathSequence.stop.latitude],
          },
          properties: {
            index: pathSequenceIndex,
            _id: pathSequence.stop._id,
            code: pathSequence.stop.code,
            name: pathSequence.stop.name,
            latitude: pathSequence.stop.latitude,
            longitude: pathSequence.stop.longitude,
          },
        });
      }
    }
    return geoJSON;
  }, [patternStopsData]);

  //
  // D. Handle actions

  const handleValidate = () => {
    patternForm.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/lines/${line_id}/${route_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'patterns', resourceId: pattern_id, operation: 'edit', method: 'PUT', body: patternForm.values });
      patternMutate();
      patternStopsMutate();
      patternForm.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [pattern_id, patternForm, patternMutate, patternStopsMutate]);

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size='h2'>{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(pattern_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'patterns', resourceId: pattern_id, operation: 'delete', method: 'DELETE' });
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
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Replace Path and Shape?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Tem a certeza que pretende eliminar este horário?</Text>,
      labels: { confirm: 'Sim, importar percurso', cancel: 'Manter como está' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          await API({ service: 'patterns', resourceId: pattern_id, operation: 'import', method: 'PUT', body: importedPattern });
          patternMutate();
          patternStopsMutate();
          patternForm.resetDirty();
          setIsImporting(false);
          setHasErrorSaving(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          setHasErrorSaving(err);
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
          <AutoSave
            isValid={patternForm.isValid()}
            isDirty={patternForm.isDirty()}
            isLoading={patternLoading}
            isErrorValidating={patternError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
            closeType='back'
          />
          <LineDisplay short_name={lineData && lineData.short_name} name={patternForm.values.headsign || t('untitled')} color={typologyData && typologyData.color} text_color={typologyData && typologyData.text_color} />
          <AuthGate scope='lines' permission='delete'>
            <Tooltip label={t('operations.delete.title')} color='red' position='bottom' withArrow>
              <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
                <IconTrash size='20px' />
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
              <Text size='h2'>{t('sections.config.title')}</Text>
              <Text size='h4'>{t('sections.config.description')}</Text>
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
              <Text size='h2'>Shape</Text>
              <Text size='h4'>{t('sections.config.description')}</Text>
            </div>
            <SimpleGrid cols={2}>
              <StatCard title={t('sections.shape.cards.extension')} value={shapeExtension} />
              <StatCard title={t('sections.shape.cards.points_count')} value={patternForm.values?.shape?.points?.length} />
            </SimpleGrid>
          </Section>
          <OSMMap id='patternShape' height={500} scrollZoom={false} mapStyle='map'>
            <Source id='pattern-shape' type='geojson' data={patternForm.values.shape.geojson}>
              <Layer id='pattern-shape' type='line' source='pattern-shape' layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': typologyData ? typologyData.color : '#000000', 'line-width': 4 }} />
            </Source>
            <Source id='pattern-stops' type='geojson' data={patternStopsMapData}>
              <Layer id='pattern-stops-circle' type='circle' source='pattern-stops' paint={{ 'circle-color': '#ffdd01', 'circle-radius': 8, 'circle-stroke-width': 1, 'circle-stroke-color': '#000000' }} />
              <Layer id='pattern-stops-labels' type='symbol' source='pattern-stops' layout={{ 'text-field': ['get', 'index'], 'text-offset': [0, 0], 'text-anchor': 'center', 'text-size': 10 }} />
            </Source>
          </OSMMap>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('sections.path.title')}</Text>
              <Text size='h4'>{t('sections.path.description')}</Text>
            </div>
            <StopSequenceTable />
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('sections.schedules.title')}</Text>
              <Text size='h4'>{t('sections.schedules.description')}</Text>
            </div>
            <SchedulesTable />
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('sections.update_path.title')}</Text>
              <Text size='h4'>{t('sections.update_path.description')}</Text>
            </div>
            <ImportPatternFromGTFS onImport={handleImport} />
          </Section>
        </form>
      </PatternFormProvider>
    </Pannel>
  );
}