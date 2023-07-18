'use client';

import useSWR from 'swr';
import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import bbox from '@turf/bbox';
import OSMMap from '@/components/OSMMap/OSMMap';
import { useMap, Source, Layer } from 'react-map-gl/maplibre';
import { Validation as ZoneValidation } from '@/schemas/Zone/validation';
import { Default as ZoneDefault } from '@/schemas/Zone/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, JsonInput, Button, ColorInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import { merge } from 'lodash';
import populate from '@/services/populate';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('zones');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [newGeojson, setNewGeojson] = useState('');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'zones', 'create_edit');
  const { singleZoneMap } = useMap();

  const { zone_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allZonesMutate } = useSWR('/api/zones');
  const { data: zoneData, error: zoneError, isLoading: zoneLoading, mutate: zoneMutate } = useSWR(zone_id && `/api/zones/${zone_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(ZoneValidation),
    initialValues: ZoneDefault,
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      const populated = populate(ZoneDefault, data);
      form.setValues(populated);
      form.resetDirty(populated);
    }
  };

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/zones/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'zones', resourceId: zone_id, operation: 'edit', method: 'PUT', body: form.values });
      zoneMutate();
      allZonesMutate();
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [zone_id, form, zoneMutate, allZonesMutate]);

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
          notify(zone_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'zones', resourceId: zone_id, operation: 'delete', method: 'DELETE' });
          allZonesMutate();
          router.push('/dashboard/zones');
          notify(zone_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(zone_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handleUpdateGeojson = async () => {
    openConfirmModal({
      title: <Text size='h2'>Update Geojson</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Update Geojson</Text>,
      labels: { confirm: 'Update', cancel: 'Cancel' },
      onConfirm: async () => {
        try {
          notify('update-geojson', 'loading', 'Update geojson');
          const parsedGeojson = JSON.parse(newGeojson);
          form.setFieldValue('geojson', parsedGeojson);
          await handleSave();
          setNewGeojson('');
          notify('update-geojson', 'success', 'Update geojson success');
        } catch (err) {
          console.log(err);
          notify('update-geojson', 'error', err.message || 'Update geojson error');
        }
      },
    });
  };

  const handleDeleteGeojson = async () => {
    openConfirmModal({
      title: <Text size='h2'>Delete Geojson</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Delete Geojson</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: async () => {
        try {
          notify('update-geojson', 'loading', 'Delete geojson');
          form.setFieldValue('geojson', ZoneDefault.geojson);
          await handleSave();
          setNewGeojson('');
          notify('update-geojson', 'success', 'Delete geojson success');
        } catch (err) {
          console.log(err);
          notify('update-geojson', 'error', err.message || 'Delete geojson error');
        }
      },
    });
  };

  //
  // E. Transform data

  useEffect(() => {
    try {
      if (form.values?.geojson?.geometry?.coordinates?.length > 0) {
        // Calculate the bounding box of the feature
        const [minLng, minLat, maxLng, maxLat] = bbox(form.values.geojson);
        // Calculate the bounding box of the feature
        singleZoneMap?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 100, duration: 2000 }
        );
      }
    } catch (error) {
      console.log(error);
    }
    //
  }, [form.values.geojson, singleZoneMap, zoneData]);

  //
  // E. Render components

  return (
    <Pannel
      loading={zoneLoading || isDeleting}
      header={
        <>
          <AutoSave
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={zoneLoading}
            isErrorValidating={zoneError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size='h1' style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AuthGate scope='zones' permission='delete'>
            <Tooltip label={t('operations.delete.title')} color='red' position='bottom' withArrow>
              <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
                <IconTrash size='20px' />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <OSMMap id='singleZone' height='400px' scrollZoom={false} mapStyle='map'>
          {form.values?.geojson?.geometry?.coordinates?.length > 0 && (
            <Source id='single-zone' type='geojson' data={form.values.geojson}>
              <Layer id='single-zone' type='fill' layout={{}} source='single-zone' paint={{ 'fill-color': form.values.color, 'fill-opacity': 0.5 }} />
            </Source>
          )}
        </OSMMap>

        <Divider />

        <Section>
          <Text size='h2'>{t('sections.config.title')}</Text>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <ColorInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('color')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <Text size='h2'>{t('sections.geofence.title')}</Text>
          <SimpleGrid cols={1}>
            <JsonInput label={t('form.geojson.label')} placeholder={t('form.geojson.placeholder')} value={newGeojson} onChange={setNewGeojson} readOnly={isReadOnly} autosize minRows={5} maxRows={10} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Button onClick={handleUpdateGeojson} disabled={!newGeojson}>
              Update Geojson
            </Button>
            <Button onClick={handleDeleteGeojson} color='red'>
              Delete Geojson
            </Button>
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
