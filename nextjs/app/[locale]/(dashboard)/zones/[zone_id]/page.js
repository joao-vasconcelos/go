'use client';

import useSWR from 'swr';
import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import bbox from '@turf/bbox';
import OSMMap from '@/components/OSMMap/OSMMap';
import { useMap, Source, Layer } from 'react-map-gl/maplibre';
import { ZoneValidation } from '@/schemas/Zone/validation';
import { ZoneDefault } from '@/schemas/Zone/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, JsonInput, Button, ColorInput, Slider } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import isAllowed from '@/authentication/isAllowed';
import populate from '@/services/populate';
import LockButton from '@/components/AppButtonLock/AppButtonLock';
import ListHeader from '@/components/ListHeader/ListHeader';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('zones');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [newGeojson, setNewGeojson] = useState('');
  const { data: sessionData } = useSession();
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
    initialValues: populate(ZoneDefault, zoneData),
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      const populated = populate(ZoneDefault, data);
      form.setValues(populated);
      form.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(sessionData, [{ scope: 'zones', action: 'edit' }], { handleError: true }) || zoneData?.is_locked;

  //
  // E. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/zones/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'zones', resourceId: zone_id, operation: 'edit', method: 'PUT', body: form.values });
      zoneMutate();
      allZonesMutate();
      form.resetDirty();
      setIsSaving(false);
      setIsLocking(false);
      setHasErrorSaving(false);
    } catch (error) {
      console.log(error);
      setIsSaving(false);
      setIsLocking(false);
      setHasErrorSaving(error);
    }
  }, [zone_id, form, zoneMutate, allZonesMutate]);

  const handleLock = async () => {
    try {
      setIsLocking(true);
      await API({ service: 'zones', resourceId: zone_id, operation: 'lock', method: 'PUT' });
      zoneMutate();
      setIsLocking(false);
    } catch (error) {
      console.log(error);
      zoneMutate();
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
          setIsDeleting(true);
          notify(`${zone_id}-delete`, 'loading', t('operations.delete.loading'));
          await API({ service: 'zones', resourceId: zone_id, operation: 'delete', method: 'DELETE' });
          allZonesMutate();
          router.push('/zones');
          notify(`${zone_id}-delete`, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (error) {
          console.log(error);
          setIsDeleting(false);
          notify(`${zone_id}-delete`, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handleImportGeojson = async () => {
    openConfirmModal({
      title: <Text size="h2">{t('operations.import_geojson.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.import_geojson.description')}</Text>,
      labels: { confirm: t('operations.import_geojson.confirm'), cancel: t('operations.import_geojson.cancel') },
      onConfirm: async () => {
        try {
          notify(`${zone_id}-import_geojson`, 'loading', t('operations.import_geojson.loading'));
          const parsedGeojson = JSON.parse(newGeojson);
          form.setFieldValue('geojson', parsedGeojson);
          await handleSave();
          setNewGeojson('');
          notify(`${zone_id}-import_geojson`, 'success', t('operations.import_geojson.success'));
        } catch (error) {
          console.log(error);
          notify(`${zone_id}-import_geojson`, 'error', err.message || t('operations.import_geojson.error'));
        }
      },
    });
  };

  const handleDeleteGeojson = async () => {
    openConfirmModal({
      title: <Text size="h2">{t('operations.delete_geojson.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.delete_geojson.description')}</Text>,
      labels: { confirm: t('operations.delete_geojson.confirm'), cancel: t('operations.delete_geojson.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(`${zone_id}-delete_geojson`, 'loading', t('operations.delete_geojson.loading'));
          form.setFieldValue('geojson', ZoneDefault.geojson);
          await handleSave();
          setNewGeojson('');
          notify(`${zone_id}-delete_geojson`, 'success', t('operations.delete_geojson.success'));
        } catch (error) {
          console.log(error);
          notify(`${zone_id}-delete_geojson`, 'error', err.message || t('operations.delete_geojson.error'));
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
  }, [form.values.geojson, singleZoneMap]);

  //
  // E. Render components

  return (
    <Pannel
      loading={zoneLoading || isDeleting}
      header={
        <ListHeader>
          <AutoSave isValid={form.isValid()} isDirty={form.isDirty()} isLoading={zoneLoading} isErrorValidating={zoneError} isSaving={isSaving} isErrorSaving={hasErrorSaving} onValidate={() => handleValidate()} onSave={async () => await handleSave()} onClose={async () => await handleClose()} />
          <Text size="h1" style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AppAuthenticationCheck permissions={[{ scope: 'zones', action: 'lock' }]}>
            <LockButton isLocked={zoneData?.is_locked} onClick={handleLock} loading={isLocking} />
          </AppAuthenticationCheck>
          <AppAuthenticationCheck permissions={[{ scope: 'zones', action: 'delete' }]}>
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete}>
                <IconTrash size="20px" />
              </ActionIcon>
            </Tooltip>
          </AppAuthenticationCheck>
        </ListHeader>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <div style={{ height: 400 }}>
          <OSMMap id="singleZone" scrollZoom={false} mapStyle="map">
            {form.values?.geojson?.geometry?.coordinates?.length > 0 && (
              <Source id="single-zone" type="geojson" data={form.values.geojson}>
                <Layer id="single-zone-fill" type="fill" layout={{}} source="single-zone" paint={{ 'fill-color': form.values.fill_color, 'fill-opacity': form.values.fill_opacity }} />
                <Layer id="single-zone-border" type="line" layout={{}} source="single-zone" paint={{ 'line-color': form.values.border_color, 'line-opacity': form.values.border_opacity, 'line-width': form.values.border_width }} />
              </Source>
            )}
          </OSMMap>
        </div>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.config.title')}</Text>
            <Text size="h4">{t('sections.config.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.map_representation.title')}</Text>
            <Text size="h4">{t('sections.map_representation.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <ColorInput label={t('form.fill_color.label')} placeholder={t('form.fill_color.placeholder')} {...form.getInputProps('fill_color')} readOnly={isReadOnly} />
            <ColorInput label={t('form.border_color.label')} placeholder={t('form.border_color.placeholder')} {...form.getInputProps('border_color')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <div>
              <Text size="h4">{t('form.fill_opacity.label')}</Text>
              <Slider
                {...form.getInputProps('fill_opacity')}
                min={0}
                max={1}
                step={0.01}
                precision={2}
                marks={[
                  { value: 0.2, label: '20%' },
                  { value: 0.5, label: '50%' },
                  { value: 0.8, label: '80%' },
                ]}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Text size="h4">{t('form.border_opacity.label')}</Text>
              <Slider
                {...form.getInputProps('border_opacity')}
                min={0}
                max={1}
                step={0.01}
                precision={2}
                marks={[
                  { value: 0.2, label: '20%' },
                  { value: 0.5, label: '50%' },
                  { value: 0.8, label: '80%' },
                ]}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Text size="h4">{t('form.border_width.label')}</Text>
              <Slider
                {...form.getInputProps('border_width')}
                min={0}
                max={6}
                step={0.5}
                precision={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 2, label: '2' },
                  { value: 4, label: '4' },
                  { value: 6, label: '6' },
                ]}
                disabled={isReadOnly}
              />
            </div>
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.geojson.title')}</Text>
            <Text size="h4">{t('sections.geojson.description')}</Text>
          </div>
          <SimpleGrid cols={1}>
            <JsonInput label={t('form.geojson.label')} placeholder={t('form.geojson.placeholder')} validationError={t('form.geojson.validation_error')} value={newGeojson} onChange={setNewGeojson} readOnly={isReadOnly} autosize formatOnBlur minRows={5} maxRows={10} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Button onClick={handleImportGeojson} disabled={!newGeojson || isReadOnly}>
              {t('operations.import_geojson.title')}
            </Button>
            <Button onClick={handleDeleteGeojson} disabled={form.values.geojson?.geometry?.coordinates?.length === 0 || isReadOnly} color="red">
              {t('operations.delete_geojson.title')}
            </Button>
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
