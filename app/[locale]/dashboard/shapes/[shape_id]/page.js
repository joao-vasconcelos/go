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
import { IconTrash, IconPlaylistX } from '@tabler/icons-react';
import Pannel from '../../../../../components/Pannel/Pannel';
import Text from '../../../../../components/Text/Text';
import { Section } from '../../../../../components/Layouts/Layouts';
import SaveButtons from '../../../../../components/SaveButtons';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import ImportShapeFromText from './ImportShapeFromText';
import { useTranslations } from 'next-intl';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('shapes');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const { singleShapeMap } = useMap();

  const { shape_id } = useParams();

  //
  // B. Fetch data
  const { data: shapeData, error: shapeError, isLoading: shapeLoading } = useSWR(shape_id && `/api/shapes/${shape_id}`, { onSuccess: (data) => keepFormUpdated(data) });

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
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [shape_id, form]);

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
          notify(shape_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'shapes', resourceId: shape_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/shapes');
          notify(shape_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
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

  //
  // E. Transform data

  const mapData = useMemo(() => {
    if (shapeData && shapeData.geojson) {
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
      return { geometry: { type: 'LineString', coordinates: [] }, type: 'Feature' };
    }
    // Only run if stopData changes
  }, [shapeData, singleShapeMap]);

  //
  // E. Render components

  return (
    <Pannel
      loading={shapeLoading}
      header={
        <>
          <SaveButtons
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
          <Text size='h1' style={!form.values.shape_name && 'untitled'} full>
            {form.values.shape_name || t('untitled')}
          </Text>
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
      <OSMMap id='singleShape' height='400px' scrollZoom={false} mapStyle='map'>
        <Source id='single-shape' type='geojson' data={mapData}>
          <Layer id='single-shape' type='line' source='single-shape' layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#000000', 'line-width': 6 }} />
        </Source>
      </OSMMap>

      <Divider />

      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <div>
            <Text size='h2'>{t('sections.config.title')}</Text>
            <Text size='h4'>{t('sections.config.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.shape_name.label')} placeholder={t('form.shape_name.placeholder')} {...form.getInputProps('shape_name')} />
            <TextInput label={t('form.shape_code.label')} placeholder={t('form.shape_code.placeholder')} {...form.getInputProps('shape_code')} />
          </SimpleGrid>
        </Section>
      </form>

      <Divider />

      <Section>
        <div>
          <Text size='h2'>{t('sections.statistics.title')}</Text>
          <Text size='h4'>{t('sections.statistics.description')}</Text>
        </div>
        <SimpleGrid cols={2}>TBD</SimpleGrid>
      </Section>

      <Divider />

      <Section>
        <div>
          <Text size='h2'>{t('sections.update.title')}</Text>
          <Text size='h4'>{t('sections.update.description')}</Text>
        </div>
        <ImportShapeFromText onImport={(result) => form.setFieldValue('points', result)} />
      </Section>
    </Pannel>
  );
}
