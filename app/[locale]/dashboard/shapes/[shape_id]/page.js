'use client';

import useSWR from 'swr';
import { useState, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../services/API';
import bbox from '@turf/bbox';
import OSMMap from '../../../../../components/OSMMap/OSMMap';
import { useMap, Source, Layer } from 'react-map-gl';
import { Validation as ShapeValidation } from '../../../../../schemas/Shape/validation';
import { Default as ShapeDefault } from '../../../../../schemas/Shape/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider } from '@mantine/core';
import { IconArrowUpRight, IconTrash, IconPlaylistX } from '@tabler/icons-react';
import Pannel from '../../../../../components/Pannel/Pannel';
import Text from '../../../../../components/Text/Text';
import { Section } from '../../../../../components/Layouts/Layouts';
import AutoSave from '../../../../../components/AutoSave/AutoSave';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import StatCard from '../../../../../components/StatCard/StatCard';
import ImportShapeFromGTFS from '../../../../../components/ImportShapeFromGTFS/ImportShapeFromGTFS';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('shapes');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { singleShapeMap } = useMap();

  const { shape_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allShapesMutate } = useSWR('/api/shapes');
  const { data: shapeData, error: shapeError, isLoading: shapeLoading, mutate: shapeMutate } = useSWR(shape_id && `/api/shapes/${shape_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(ShapeValidation),
    initialValues: shapeData || ShapeDefault,
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      form.setValues(data);
      form.resetDirty(data);
    }
  };

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/shapes`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'shapes', resourceId: shape_id, operation: 'edit', method: 'PUT', body: form.values });
      shapeMutate();
      allShapesMutate();
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [shape_id, form, shapeMutate, allShapesMutate]);

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
          setIsDeleting(true);
          notify(shape_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'shapes', resourceId: shape_id, operation: 'delete', method: 'DELETE' });
          allShapesMutate();
          router.push('/dashboard/shapes');
          notify(shape_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(shape_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handlePointsDelete = async () => {
    openConfirmModal({
      title: <Text size='h2'>{t('operations.delete_points.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('operations.delete_points.description')}</Text>,
      labels: { confirm: t('operations.delete_points.confirm'), cancel: t('operations.delete_points.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify('shape-points-delete', 'loading', t('operations.delete_points.loading'));
          form.setFieldValue('points', []);
          notify('shape-points-delete', 'success', t('operations.delete_points.success'));
        } catch (err) {
          console.log(err);
          notify('shape-points-delete', 'error', err.message || t('operations.delete_points.error'));
        }
      },
    });
  };

  const handleOpenPattern = async () => {
    const pattern_id = shapeData.associated_pattern._id;
    const route_id = shapeData.associated_pattern.parent_route._id;
    const line_id = shapeData.associated_pattern.parent_route.parent_line._id;
    window.open(`/dashboard/lines/${line_id}/${route_id}/${pattern_id}`, '_blank');
  };

  const handleImport = async (shapePoints) => {
    form.setFieldValue('points', shapePoints);
  };

  //
  // E. Transform data

  const mapData = useMemo(() => {
    try {
      if (shapeData && shapeData.geojson) {
        console.log(shapeData.geojson);
        // Calculate the bounding box of the feature
        const [minLng, minLat, maxLng, maxLat] = bbox(shapeData.geojson);
        // Calculate the bounding box of the feature
        singleShapeMap?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 100, duration: 2000 }
        );
        // Calculate the bounding box of the feature
        return shapeData.geojson;
      } else {
        return { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } };
      }
    } catch (error) {
      console.log(error);
    }
    //
  }, [shapeData, singleShapeMap]);

  const shapeExtension = useMemo(() => {
    if (shapeData && shapeData.extension) {
      if (shapeData.extension > 1000) return `${shapeData.extension / 1000} km`;
      else return `${shapeData.extension} meters`;
    } else return '0 km';
    //
  }, [shapeData]);

  //
  // E. Render components

  return (
    <Pannel
      loading={shapeLoading || isDeleting}
      header={
        <>
          <AutoSave
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={shapeLoading}
            isErrorValidating={shapeError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size='h1' style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          {shapeData && shapeData.associated_pattern && (
            <Tooltip label={t('operations.open_pattern.title')} color='gray' position='bottom' withArrow>
              <ActionIcon color='gray' variant='light' size='lg' onClick={handleOpenPattern}>
                <IconArrowUpRight size='20px' />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label={t('operations.delete_points.title')} color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handlePointsDelete}>
              <IconPlaylistX size='20px' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('operations.delete.title')} color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <IconTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      {mapData && (
        <OSMMap id='singleShape' height='400px' scrollZoom={false} mapStyle='map'>
          <Source id='single-shape' type='geojson' data={mapData}>
            <Layer id='single-shape' type='line' source='single-shape' layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#000000', 'line-width': 6 }} />
          </Source>
        </OSMMap>
      )}

      <Divider />

      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <div>
            <Text size='h2'>{t('sections.config.title')}</Text>
            <Text size='h4'>{t('sections.config.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} />
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} />
          </SimpleGrid>
        </Section>
      </form>

      <Divider />

      <Section>
        <div>
          <Text size='h2'>{t('sections.statistics.title')}</Text>
          <Text size='h4'>{t('sections.statistics.description')}</Text>
        </div>
        <SimpleGrid cols={2}>
          <StatCard title={t('sections.statistics.cards.extension')} value={shapeExtension} />
          <StatCard title={t('sections.statistics.cards.points_count')} value={form.values.points.length} />
        </SimpleGrid>
      </Section>

      <Divider />

      <Section>
        <div>
          <Text size='h2'>{t('sections.update.title')}</Text>
          <Text size='h4'>{t('sections.update.description')}</Text>
        </div>
        {/* <ImportShapeFromText onImport={(result) => form.setFieldValue('points', result)} /> */}
        <ImportShapeFromGTFS onImport={handleImport} />
      </Section>
    </Pannel>
  );
}
