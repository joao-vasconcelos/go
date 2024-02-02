'use client';

import useSWR from 'swr';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useForm, yupResolver } from '@mantine/form';
import { useMap, Source, Layer } from 'react-map-gl/maplibre';
import API from '@/services/API';
import { StopValidation } from '@/schemas/Stop/validation';
import { StopDefault } from '@/schemas/Stop/default';
import { Tooltip, Select, SimpleGrid, Switch, MultiSelect, TextInput, NumberInput, ActionIcon, Divider, Textarea, Space } from '@mantine/core';
import { IconTrash, IconWorldLatitude, IconWorldLongitude, IconVolume, IconBrandGoogleMaps } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import { Section } from '@/components/Layouts/Layouts';
import Text from '@/components/Text/Text';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import OSMMap from '@/components/OSMMap/OSMMap';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import populate from '@/services/populate';
import LockButton from '@/components/LockButton/LockButton';
import StopPatternsView from '@/components/StopPatternsView/StopPatternsView';
import ListHeader from '@/components/ListHeader/ListHeader';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('stops');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { singleStopMap } = useMap();
  const { data: session } = useSession();
  const canEditStopCode = isAllowed(session, 'stops', 'edit_code');

  const { stop_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allStopsMutate } = useSWR('/api/stops');
  const { data: stopData, error: stopError, isLoading: stopLoading, mutate: stopMutate } = useSWR(stop_id && `/api/stops/${stop_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: allMunicipalitiesData } = useSWR('/api/municipalities');
  const { data: allZonesData } = useSWR('/api/zones');

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(StopValidation),
    initialValues: populate(StopDefault, stopData),
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      const populated = populate(StopDefault, data);
      form.setValues(populated);
      form.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(session, 'stops', 'create_edit') || stopData?.is_locked;

  //
  // E. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/stops/`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await API({ service: 'stops', resourceId: stop_id, operation: 'edit', method: 'PUT', body: form.values });
      stopMutate();
      allStopsMutate();
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  };

  const handleLock = async (value) => {
    try {
      setIsLocking(true);
      await API({ service: 'stops', resourceId: stop_id, operation: 'lock', method: 'PUT', body: { is_locked: value } });
      stopMutate();
      setIsLocking(false);
    } catch (err) {
      console.log(err);
      stopMutate();
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
          notify(stop_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'stops', resourceId: stop_id, operation: 'delete', method: 'DELETE' });
          allStopsMutate();
          router.push('/dashboard/stops');
          notify(stop_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(stop_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handlePlayPhoneticName = async () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(form.values.tts_name || '');
    utterance.lang = 'pt';
    synth.speak(utterance);
  };

  const handleOpenInGoogleMaps = () => {
    const zoom = 19;
    window.open(`https://www.google.com/maps/@${form.values.latitude},${form.values.longitude},${zoom}z`, '_blank', 'noopener,noreferrer');
  };

  const handleMapClick = (event) => {
    console.log(event.features[0]);
  };

  //
  // E. Transform data

  const allMunicipalitiesDataFormatted = useMemo(() => {
    if (!allMunicipalitiesData) return [];
    return allMunicipalitiesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allMunicipalitiesData]);

  const allZonesDataFormatted = useMemo(() => {
    if (!allZonesData) return [];
    return allZonesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allZonesData]);

  const mapData = useMemo(() => {
    // Create a GeoJSON object
    const geoJSON = {
      type: 'Feature',
      geometry: {},
      properties: {},
    };

    // Loop through each stop in the collection and setup the feature to the GeoJSON object.
    if (stopData && stopData.latitude && stopData.longitude) {
      geoJSON.geometry = {
        type: 'Point',
        coordinates: [parseFloat(stopData.longitude), parseFloat(stopData.latitude)],
      };
      geoJSON.properties = {
        _id: stopData._id,
        code: stopData.code,
        name: stopData.name,
        latitude: stopData.latitude,
        longitude: stopData.longitude,
      };
      singleStopMap?.flyTo({
        center: geoJSON.geometry.coordinates,
        duration: 2000,
        zoom: 14,
      });
    }
    // Return parsed data
    return geoJSON;
    // Only run if stopData changes
  }, [singleStopMap, stopData]);

  //
  // F. Render components

  return (
    <Pannel
      loading={stopLoading || isDeleting}
      header={
        <ListHeader>
          <AutoSave isValid={form.isValid()} isDirty={form.isDirty()} isLoading={stopLoading} isErrorValidating={stopError} isSaving={isSaving} isErrorSaving={hasErrorSaving} onValidate={() => handleValidate()} onSave={async () => await handleSave()} onClose={async () => await handleClose()} />
          <Text size="h1" style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AuthGate scope="lines" permission="view">
            <StopPatternsView stop_id={stop_id} />
          </AuthGate>
          <AuthGate scope="stops" permission="lock">
            <LockButton isLocked={stopData?.is_locked} onClick={handleLock} loading={isLocking} />
          </AuthGate>
          <Tooltip label={t('operations.gmaps.title')} position="bottom" withArrow>
            <ActionIcon color="blue" variant="light" size="lg" onClick={handleOpenInGoogleMaps}>
              <IconBrandGoogleMaps size="20px" />
            </ActionIcon>
          </Tooltip>
          <AuthGate scope="stops" permission="delete">
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete}>
                <IconTrash size="20px" />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </ListHeader>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <div style={{ height: 400 }}>
          <OSMMap id="singleStop" scrollZoom={false} onClick={handleMapClick} interactiveLayerIds={['stop']}>
            <Source id="stop" type="geojson" data={mapData}>
              <Layer id="stop" type="circle" source="stop" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#000000' }} />
            </Source>
          </OSMMap>
        </div>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.config.title')}</Text>
            <Text size="h4">{t('sections.config.description')}</Text>
          </div>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly && !canEditStopCode} />
            <NumberInput label={t('form.latitude.label')} placeholder={t('form.latitude.placeholder')} precision={6} min={37} max={40} step={0.000001} hideControls icon={<IconWorldLatitude size="18px" />} {...form.getInputProps('latitude')} readOnly={isReadOnly} />
            <NumberInput label={t('form.longitude.label')} placeholder={t('form.longitude.placeholder')} precision={6} min={-10} max={-7} step={0.000001} hideControls icon={<IconWorldLongitude size="18px" />} {...form.getInputProps('longitude')} />
          </SimpleGrid>
          <SimpleGrid cols={1}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...form.getInputProps('short_name')} />
            <TextInput
              label={t('form.tts_name.label')}
              placeholder={t('form.tts_name.placeholder')}
              {...form.getInputProps('tts_name')}
              readOnly={isReadOnly}
              rightSection={
                <ActionIcon onClick={handlePlayPhoneticName} variant="subtle" color="blue" disabled={!form.values.tts_name}>
                  <IconVolume size="18px" />
                </ActionIcon>
              }
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.zoning.title')}</Text>
            <Text size="h4">{t('sections.zoning.description')}</Text>
          </div>
          <SimpleGrid cols={1}>
            <MultiSelect label={t('form.zones.label')} placeholder={t('form.zones.placeholder')} {...form.getInputProps('zones')} readOnly={isReadOnly} data={allZonesDataFormatted} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.admin.title')}</Text>
            <Text size="h4">{t('sections.admin.description')}</Text>
          </div>
          <div>
            <Text size="h3">{t('sections.admin.description')}</Text>
            <Space h={20} />
            <SimpleGrid cols={3}>
              <Select label={t('form.municipality.label')} placeholder={t('form.municipality.placeholder')} {...form.getInputProps('municipality')} readOnly={isReadOnly} data={allMunicipalitiesDataFormatted} />
            </SimpleGrid>
          </div>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.parish.label')} placeholder={t('form.parish.placeholder')} {...form.getInputProps('parish')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.address.label')} placeholder={t('form.address.placeholder')} {...form.getInputProps('address')} readOnly={isReadOnly} />
            <TextInput label={t('form.postal_code.label')} placeholder={t('form.postal_code.placeholder')} {...form.getInputProps('postal_code')} readOnly={isReadOnly} />
            <TextInput label={t('form.locality.label')} placeholder={t('form.locality.placeholder')} {...form.getInputProps('locality')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.jurisdiction.label')} placeholder={t('form.jurisdiction.placeholder')} {...form.getInputProps('jurisdiction')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.infrastructure.title')}</Text>
            <Text size="h4">{t('sections.infrastructure.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.has_pole.label')}
              placeholder={t('form.has_pole.placeholder')}
              nothingFoundMessage={t('form.has_pole.nothingFound')}
              {...form.getInputProps('has_pole')}
              data={[
                { value: '0', label: '0 - Não Aplicável' },
                { value: '1', label: '1 - Não existe, mas deve ser colocado' },
                { value: '2', label: '2 - Existe, mas está danificado' },
                { value: '3', label: '3 - Existe e está OK' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.pole_material.label')} placeholder={t('form.pole_material.placeholder')} disabled={form.values.has_pole < 2} {...form.getInputProps('pole_material')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <Select
              label={t('form.has_shelter.label')}
              placeholder={t('form.has_shelter.placeholder')}
              nothingFoundMessage={t('form.has_shelter.nothingFound')}
              {...form.getInputProps('has_shelter')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.shelter_code.label')} placeholder={t('form.shelter_code.placeholder')} disabled={form.values.has_shelter < 1} {...form.getInputProps('shelter_code')} readOnly={isReadOnly} />
            <TextInput label={t('form.shelter_maintainer.label')} placeholder={t('form.shelter_maintainer.placeholder')} disabled={form.values.has_shelter < 1} {...form.getInputProps('shelter_maintainer')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <Select
              label={t('form.has_mupi.label')}
              placeholder={t('form.has_mupi.placeholder')}
              nothingFoundMessage={t('form.has_mupi.nothingFound')}
              {...form.getInputProps('has_mupi')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_bench.label')}
              placeholder={t('form.has_bench.placeholder')}
              nothingFoundMessage={t('form.has_bench.nothingFound')}
              {...form.getInputProps('has_bench')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_trash_bin.label')}
              placeholder={t('form.has_trash_bin.placeholder')}
              nothingFoundMessage={t('form.has_trash_bin.nothingFound')}
              {...form.getInputProps('has_trash_bin')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.has_lighting.label')}
              placeholder={t('form.has_lighting.placeholder')}
              nothingFoundMessage={t('form.has_lighting.nothingFound')}
              {...form.getInputProps('has_lighting')}
              data={[
                { value: '0', label: '0 - Sem qualquer iluminação' },
                { value: '1', label: '1 - Iluminação insuficiente' },
                { value: '2', label: '2 - Imediações visíveis' },
                { value: '3', label: '3 - Leitura é possível e confortável' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_electricity.label')}
              placeholder={t('form.has_electricity.placeholder')}
              nothingFoundMessage={t('form.has_electricity.nothingFound')}
              {...form.getInputProps('has_electricity')}
              data={[
                { value: '0', label: '0 - Indisponível' },
                { value: '1', label: '1 - Disponível' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.docking_bay_type.label')}
              placeholder={t('form.docking_bay_type.placeholder')}
              nothingFoundMessage={t('form.docking_bay_type.nothingFound')}
              {...form.getInputProps('docking_bay_type')}
              data={[
                { value: '0', label: '0 - Indisponível' },
                { value: '1', label: '1 - Disponível' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.last_infrastructure_maintenance.label')} placeholder={t('form.last_infrastructure_maintenance.placeholder')} {...form.getInputProps('last_infrastructure_maintenance')} readOnly={isReadOnly} />
            <TextInput label={t('form.last_infrastructure_check.label')} placeholder={t('form.last_infrastructure_check.placeholder')} {...form.getInputProps('last_infrastructure_check')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.public_info.title')}</Text>
            <Text size="h4">{t('sections.public_info.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.has_stop_sign.label')}
              placeholder={t('form.has_stop_sign.placeholder')}
              nothingFoundMessage={t('form.has_stop_sign.nothingFound')}
              {...form.getInputProps('has_stop_sign')}
              data={[
                { value: '0', label: '0 - Não Aplicável' },
                { value: '1', label: '1 - Não existe, mas deve ser colocado' },
                { value: '2', label: '2 - Existe, mas está danificado' },
                { value: '3', label: '3 - Existe e está OK' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.stop_sign_maintainer.label')} placeholder={t('form.stop_sign_maintainer.placeholder')} disabled={form.values.has_stop_sign < 2} {...form.getInputProps('stop_sign_maintainer')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <Select
              label={t('form.has_pole_frame.label')}
              placeholder={t('form.has_pole_frame.placeholder')}
              nothingFoundMessage={t('form.has_pole_frame.nothingFound')}
              {...form.getInputProps('has_pole_frame')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.shelter_frame_area_cm.label')} placeholder={t('form.shelter_frame_area_cm.placeholder')} {...form.getInputProps('shelter_frame_area_cm')} readOnly={isReadOnly} />
            <Select
              label={t('form.has_pip_real_time.label')}
              placeholder={t('form.has_pip_real_time.placeholder')}
              nothingFoundMessage={t('form.has_pip_real_time.nothingFound')}
              {...form.getInputProps('has_pip_real_time')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.pip_real_time_code.label')} placeholder={t('form.pip_real_time_code.placeholder')} {...form.getInputProps('pip_real_time_code')} readOnly={isReadOnly} />
            <Select
              label={t('form.has_h2oa_signage.label')}
              placeholder={t('form.has_h2oa_signage.placeholder')}
              nothingFoundMessage={t('form.has_h2oa_signage.nothingFound')}
              {...form.getInputProps('has_h2oa_signage')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_schedules.label')}
              placeholder={t('form.has_schedules.placeholder')}
              nothingFoundMessage={t('form.has_schedules.nothingFound')}
              {...form.getInputProps('has_schedules')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_network_map.label')}
              placeholder={t('form.has_network_map.placeholder')}
              nothingFoundMessage={t('form.has_network_map.nothingFound')}
              {...form.getInputProps('has_network_map')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.last_schedules_maintenance.label')} placeholder={t('form.last_schedules_maintenance.placeholder')} {...form.getInputProps('last_schedules_maintenance')} readOnly={isReadOnly} />
            <TextInput label={t('form.last_schedules_check.label')} placeholder={t('form.last_schedules_check.placeholder')} {...form.getInputProps('last_schedules_check')} readOnly={isReadOnly} />
            <TextInput label={t('form.last_stop_sign_maintenance.label')} placeholder={t('form.last_stop_sign_maintenance.placeholder')} {...form.getInputProps('last_stop_sign_maintenance')} readOnly={isReadOnly} />
            <TextInput label={t('form.last_stop_sign_check.label')} placeholder={t('form.last_stop_sign_check.placeholder')} {...form.getInputProps('last_stop_sign_check')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.accessibility.title')}</Text>
            <Text size="h4">{t('sections.accessibility.description')}</Text>
          </div>
          <SimpleGrid cols={4}>
            <Select
              label={t('form.has_sidewalk.label')}
              placeholder={t('form.has_sidewalk.placeholder')}
              nothingFoundMessage={t('form.has_sidewalk.nothingFound')}
              {...form.getInputProps('has_sidewalk')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.sidewalk_type.label')} placeholder={t('form.sidewalk_type.placeholder')} {...form.getInputProps('sidewalk_type')} readOnly={isReadOnly} />
            <Select
              label={t('form.has_tactile_schedules.label')}
              placeholder={t('form.has_tactile_schedules.placeholder')}
              nothingFoundMessage={t('form.has_tactile_schedules.nothingFound')}
              {...form.getInputProps('has_tactile_schedules')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.stop_access_type.label')}
              placeholder={t('form.stop_access_type.placeholder')}
              nothingFoundMessage={t('form.stop_access_type.nothingFound')}
              {...form.getInputProps('stop_access_type')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_crosswalk.label')}
              placeholder={t('form.has_crosswalk.placeholder')}
              nothingFoundMessage={t('form.has_crosswalk.nothingFound')}
              {...form.getInputProps('has_crosswalk')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_tactile_pavement.label')}
              placeholder={t('form.has_tactile_pavement.placeholder')}
              nothingFoundMessage={t('form.has_tactile_pavement.nothingFound')}
              {...form.getInputProps('has_tactile_pavement')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_abusive_parking.label')}
              placeholder={t('form.has_abusive_parking.placeholder')}
              nothingFoundMessage={t('form.has_abusive_parking.nothingFound')}
              {...form.getInputProps('has_abusive_parking')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_audio_stop_info.label')}
              placeholder={t('form.has_audio_stop_info.placeholder')}
              nothingFoundMessage={t('form.has_audio_stop_info.nothingFound')}
              {...form.getInputProps('has_audio_stop_info')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.wheelchair_boarding.label')}
              placeholder={t('form.wheelchair_boarding.placeholder')}
              nothingFoundMessage={t('form.wheelchair_boarding.nothingFound')}
              {...form.getInputProps('wheelchair_boarding')}
              data={[
                { value: '0', label: '0 - Não Existe' },
                { value: '1', label: '1 - Em muito mau estado' },
                { value: '2', label: '2 - Em mau estado' },
                { value: '3', label: '3 - Em estado razoável' },
                { value: '4', label: '4 - Em bom estado' },
                { value: '5', label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.last_accessibility_check.label')} placeholder={t('form.last_accessibility_check.placeholder')} {...form.getInputProps('last_accessibility_check')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.services.title')}</Text>
            <Text size="h4">{t('sections.services.description')}</Text>
          </div>
          <SimpleGrid cols={3}>
            <Switch label={t('form.near_health_clinic.label')} size="md" {...form.getInputProps('near_health_clinic', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_hospital.label')} size="md" {...form.getInputProps('near_hospital', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_university.label')} size="md" {...form.getInputProps('near_university', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_school.label')} size="md" {...form.getInputProps('near_school', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_police_station.label')} size="md" {...form.getInputProps('near_police_station', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_fire_station.label')} size="md" {...form.getInputProps('near_fire_station', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_shopping.label')} size="md" {...form.getInputProps('near_shopping', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_historic_building.label')} size="md" {...form.getInputProps('near_historic_building', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_transit_office.label')} size="md" {...form.getInputProps('near_transit_office', { type: 'checkbox' })} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size="h2">{t('sections.connections.title')}</Text>
            <Text size="h4">{t('sections.connections.description')}</Text>
          </div>
          <SimpleGrid cols={3}>
            <Switch label={t('form.subway.label')} size="md" {...form.getInputProps('subway', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.light_rail.label')} size="md" {...form.getInputProps('light_rail', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.train.label')} size="md" {...form.getInputProps('train', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.boat.label')} size="md" {...form.getInputProps('boat', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.airport.label')} size="md" {...form.getInputProps('airport', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.bike_sharing.label')} size="md" {...form.getInputProps('bike_sharing', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.bike_parking.label')} size="md" {...form.getInputProps('bike_parking', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.car_parking.label')} size="md" {...form.getInputProps('car_parking', { type: 'checkbox' })} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <div>
            <Text size="h2">{t('sections.notes.title')}</Text>
            <Text size="h4">{t('sections.notes.description')}</Text>
          </div>
          <Textarea aria-label={t('form.notes.label')} placeholder={t('form.notes.placeholder')} autosize minRows={5} maxRows={15} {...form.getInputProps('notes')} readOnly={isReadOnly} />
        </Section>
      </form>
    </Pannel>
  );
}
