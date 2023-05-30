'use client';

import useSWR from 'swr';
import { useState, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import { useMap, Source, Layer } from 'react-map-gl';
import API from '../../../../../services/API';
import { Validation as StopValidation } from '../../../../../schemas/Stop/validation';
import { Default as StopDefault } from '../../../../../schemas/Stop/default';
import { Tooltip, Select, SimpleGrid, Switch, MultiSelect, TextInput, NumberInput, ActionIcon, Divider, Textarea } from '@mantine/core';
import { IconTrash, IconWorldLatitude, IconWorldLongitude, IconVolume, IconBrandGoogleMaps } from '@tabler/icons-react';
import Pannel from '../../../../../components/Pannel/Pannel';
import { Section } from '../../../../../components/Layouts/Layouts';
import Text from '../../../../../components/Text/Text';
import SaveButtons from '../../../../../components/SaveButtons';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import OSMMap from '../../../../../components/OSMMap/OSMMap';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '../../../../../components/AuthGate/AuthGate';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('stops');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const { singleStopMap } = useMap();
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'stops', 'create_edit');

  const { stop_id } = useParams();

  //
  // B. Fetch data

  const { data: stopData, error: stopError, isLoading: stopLoading } = useSWR(stop_id && `/api/stops/${stop_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: agenciesData } = useSWR('/api/agencies');
  const { data: municipalitiesData } = useSWR('/api/municipalities');

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(StopValidation),
    initialValues: stopData || StopDefault,
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
    router.push(`/dashboard/stops/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'stops', resourceId: stop_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [stop_id, form]);

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
          notify(stop_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'stops', resourceId: stop_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/stops');
          notify(stop_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
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

  const municipalitiesFormattedForSelect = useMemo(() => {
    return municipalitiesData
      ? municipalitiesData.map((item) => {
          return { value: item._id, label: item.name || '-' };
        })
      : [];
  }, [municipalitiesData]);

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
      loading={stopLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={stopLoading}
            isErrorValidating={stopError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size='h1' style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <Tooltip label={t('operations.gmaps.title')} position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg' onClick={handleOpenInGoogleMaps}>
              <IconBrandGoogleMaps size='20px' />
            </ActionIcon>
          </Tooltip>
          <AuthGate scope='stops' permission='delete'>
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
        <OSMMap id='singleStop' height='400px' scrollZoom={false} onClick={handleMapClick} interactiveLayerIds={['stop']}>
          <Source id='stop' type='geojson' data={mapData}>
            <Layer id='stop' type='circle' source='stop' paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#000000' }} />
          </Source>
        </OSMMap>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.config.title')}</Text>
            <Text size='h4'>{t('sections.config.description')}</Text>
          </div>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
            <NumberInput
              label={t('form.latitude.label')}
              placeholder={t('form.latitude.placeholder')}
              precision={6}
              min={37}
              max={40}
              step={0.000001}
              stepHoldDelay={500}
              stepHoldInterval={100}
              hideControls
              icon={<IconWorldLatitude size='18px' />}
              {...form.getInputProps('latitude')}
              readOnly={isReadOnly}
            />
            <NumberInput
              label={t('form.longitude.label')}
              placeholder={t('form.longitude.placeholder')}
              precision={6}
              min={-10}
              max={-7}
              step={0.000001}
              stepHoldDelay={500}
              stepHoldInterval={100}
              hideControls
              icon={<IconWorldLongitude size='18px' />}
              {...form.getInputProps('longitude')}
            />
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
                <ActionIcon onClick={handlePlayPhoneticName} variant='subtle' color='blue' disabled={!form.values.tts_name}>
                  <IconVolume size='18px' />
                </ActionIcon>
              }
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.areas.title')}</Text>
            <Text size='h4'>{t('sections.areas.description')}</Text>
          </div>
          <SimpleGrid cols={1}>
            <MultiSelect
              label={t('form.agencies.label')}
              placeholder={t('form.agencies.placeholder')}
              nothingFound={t('form.agencies.nothingFound')}
              data={
                agenciesData
                  ? agenciesData.map((item) => {
                      return { value: item._id, label: item.agency_name || '-' };
                    })
                  : []
              }
              {...form.getInputProps('agencies')}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.admin.title')}</Text>
            <Text size='h4'>{t('sections.admin.description')}</Text>
          </div>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.address.label')} placeholder={t('form.address.placeholder')} {...form.getInputProps('address')} readOnly={isReadOnly} />
            <TextInput label={t('form.postal_code.label')} placeholder={t('form.postal_code.placeholder')} {...form.getInputProps('postal_code')} readOnly={isReadOnly} />
            <TextInput label={t('form.locality.label')} placeholder={t('form.locality.placeholder')} {...form.getInputProps('locality')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.region.label')} placeholder={t('form.region.placeholder')} {...form.getInputProps('region')} readOnly={isReadOnly} />
            <TextInput label={t('form.municipality.label')} placeholder={t('form.municipality.placeholder')} {...form.getInputProps('municipality')} readOnly={isReadOnly} />
            <TextInput label={t('form.parish.label')} placeholder={t('form.parish.placeholder')} {...form.getInputProps('parish')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.jurisdiction.label')} placeholder={t('form.jurisdiction.placeholder')} {...form.getInputProps('jurisdiction')} readOnly={isReadOnly} />
            <TextInput label={t('form.stepp_id.label')} placeholder={t('form.stepp_id.placeholder')} {...form.getInputProps('stepp_id')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.infrastructure.title')}</Text>
            <Text size='h4'>{t('sections.infrastructure.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.has_pole.label')}
              placeholder={t('form.has_pole.placeholder')}
              nothingFound={t('form.has_pole.nothingFound')}
              {...form.getInputProps('has_pole')}
              data={[
                { value: 0, label: '0 - Não Aplicável' },
                { value: 1, label: '1 - Não existe, mas deve ser colocado' },
                { value: 2, label: '2 - Existe, mas está danificado' },
                { value: 3, label: '3 - Existe e está OK' },
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
              nothingFound={t('form.has_shelter.nothingFound')}
              {...form.getInputProps('has_shelter')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
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
              nothingFound={t('form.has_mupi.nothingFound')}
              {...form.getInputProps('has_mupi')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_bench.label')}
              placeholder={t('form.has_bench.placeholder')}
              nothingFound={t('form.has_bench.nothingFound')}
              {...form.getInputProps('has_bench')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_trash_bin.label')}
              placeholder={t('form.has_trash_bin.placeholder')}
              nothingFound={t('form.has_trash_bin.nothingFound')}
              {...form.getInputProps('has_trash_bin')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.has_lighting.label')}
              placeholder={t('form.has_lighting.placeholder')}
              nothingFound={t('form.has_lighting.nothingFound')}
              {...form.getInputProps('has_lighting')}
              data={[
                { value: 0, label: '0 - Sem qualquer iluminação' },
                { value: 1, label: '1 - Iluminação insuficiente' },
                { value: 2, label: '2 - Imediações visíveis' },
                { value: 3, label: '3 - Leitura é possível e confortável' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_electricity.label')}
              placeholder={t('form.has_electricity.placeholder')}
              nothingFound={t('form.has_electricity.nothingFound')}
              {...form.getInputProps('has_electricity')}
              data={[
                { value: 0, label: '0 - Indisponível' },
                { value: 1, label: '1 - Disponível' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.docking_bay_type.label')}
              placeholder={t('form.docking_bay_type.placeholder')}
              nothingFound={t('form.docking_bay_type.nothingFound')}
              {...form.getInputProps('docking_bay_type')}
              data={[
                { value: 0, label: '0 - Indisponível' },
                { value: 1, label: '1 - Disponível' },
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
            <Text size='h2'>{t('sections.public_info.title')}</Text>
            <Text size='h4'>{t('sections.public_info.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.has_stop_sign.label')}
              placeholder={t('form.has_stop_sign.placeholder')}
              nothingFound={t('form.has_stop_sign.nothingFound')}
              {...form.getInputProps('has_stop_sign')}
              data={[
                { value: 0, label: '0 - Não Aplicável' },
                { value: 1, label: '1 - Não existe, mas deve ser colocado' },
                { value: 2, label: '2 - Existe, mas está danificado' },
                { value: 3, label: '3 - Existe e está OK' },
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
              nothingFound={t('form.has_pole_frame.nothingFound')}
              {...form.getInputProps('has_pole_frame')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.shelter_frame_area_cm.label')} placeholder={t('form.shelter_frame_area_cm.placeholder')} {...form.getInputProps('shelter_frame_area_cm')} readOnly={isReadOnly} />
            <Select
              label={t('form.has_pip_real_time.label')}
              placeholder={t('form.has_pip_real_time.placeholder')}
              nothingFound={t('form.has_pip_real_time.nothingFound')}
              {...form.getInputProps('has_pip_real_time')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.pip_real_time_code.label')} placeholder={t('form.pip_real_time_code.placeholder')} {...form.getInputProps('pip_real_time_code')} readOnly={isReadOnly} />
            <Select
              label={t('form.has_h2oa_signage.label')}
              placeholder={t('form.has_h2oa_signage.placeholder')}
              nothingFound={t('form.has_h2oa_signage.nothingFound')}
              {...form.getInputProps('has_h2oa_signage')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_schedules.label')}
              placeholder={t('form.has_schedules.placeholder')}
              nothingFound={t('form.has_schedules.nothingFound')}
              {...form.getInputProps('has_schedules')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_network_map.label')}
              placeholder={t('form.has_network_map.placeholder')}
              nothingFound={t('form.has_network_map.nothingFound')}
              {...form.getInputProps('has_network_map')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
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
            <Text size='h2'>{t('sections.accessibility.title')}</Text>
            <Text size='h4'>{t('sections.accessibility.description')}</Text>
          </div>
          <SimpleGrid cols={4}>
            <Select
              label={t('form.has_sidewalk.label')}
              placeholder={t('form.has_sidewalk.placeholder')}
              nothingFound={t('form.has_sidewalk.nothingFound')}
              {...form.getInputProps('has_sidewalk')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <TextInput label={t('form.sidewalk_type.label')} placeholder={t('form.sidewalk_type.placeholder')} {...form.getInputProps('sidewalk_type')} readOnly={isReadOnly} />
            <Select
              label={t('form.has_tactile_schedules.label')}
              placeholder={t('form.has_tactile_schedules.placeholder')}
              nothingFound={t('form.has_tactile_schedules.nothingFound')}
              {...form.getInputProps('has_tactile_schedules')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.stop_access_type.label')}
              placeholder={t('form.stop_access_type.placeholder')}
              nothingFound={t('form.stop_access_type.nothingFound')}
              {...form.getInputProps('stop_access_type')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_crosswalk.label')}
              placeholder={t('form.has_crosswalk.placeholder')}
              nothingFound={t('form.has_crosswalk.nothingFound')}
              {...form.getInputProps('has_crosswalk')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_tactile_pavement.label')}
              placeholder={t('form.has_tactile_pavement.placeholder')}
              nothingFound={t('form.has_tactile_pavement.nothingFound')}
              {...form.getInputProps('has_tactile_pavement')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_abusive_parking.label')}
              placeholder={t('form.has_abusive_parking.placeholder')}
              nothingFound={t('form.has_abusive_parking.nothingFound')}
              {...form.getInputProps('has_abusive_parking')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.has_audio_stop_info.label')}
              placeholder={t('form.has_audio_stop_info.placeholder')}
              nothingFound={t('form.has_audio_stop_info.nothingFound')}
              {...form.getInputProps('has_audio_stop_info')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.wheelchair_boarding.label')}
              placeholder={t('form.wheelchair_boarding.placeholder')}
              nothingFound={t('form.wheelchair_boarding.nothingFound')}
              {...form.getInputProps('wheelchair_boarding')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
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
            <Text size='h2'>{t('sections.services.title')}</Text>
            <Text size='h4'>{t('sections.services.description')}</Text>
          </div>
          <SimpleGrid cols={3}>
            <Switch label={t('form.near_health_clinic.label')} size='md' {...form.getInputProps('near_health_clinic', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_hospital.label')} size='md' {...form.getInputProps('near_hospital', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_university.label')} size='md' {...form.getInputProps('near_university', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_school.label')} size='md' {...form.getInputProps('near_school', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_police_station.label')} size='md' {...form.getInputProps('near_police_station', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_fire_station.label')} size='md' {...form.getInputProps('near_fire_station', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_shopping.label')} size='md' {...form.getInputProps('near_shopping', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_historic_building.label')} size='md' {...form.getInputProps('near_historic_building', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.near_transit_office.label')} size='md' {...form.getInputProps('near_transit_office', { type: 'checkbox' })} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.connections.title')}</Text>
            <Text size='h4'>{t('sections.connections.description')}</Text>
          </div>
          <SimpleGrid cols={3}>
            <Switch label={t('form.subway.label')} size='md' {...form.getInputProps('subway', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.light_rail.label')} size='md' {...form.getInputProps('light_rail', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.train.label')} size='md' {...form.getInputProps('train', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.boat.label')} size='md' {...form.getInputProps('boat', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.airport.label')} size='md' {...form.getInputProps('airport', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.bike_sharing.label')} size='md' {...form.getInputProps('bike_sharing', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.bike_parking.label')} size='md' {...form.getInputProps('bike_parking', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch label={t('form.car_parking.label')} size='md' {...form.getInputProps('car_parking', { type: 'checkbox' })} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <div>
            <Text size='h2'>{t('sections.notes.title')}</Text>
            <Text size='h4'>{t('sections.notes.description')}</Text>
          </div>
          <Textarea aria-label={t('form.notes.label')} placeholder={t('form.notes.placeholder')} autosize minRows={5} maxRows={15} {...form.getInputProps('notes')} readOnly={isReadOnly} />
        </Section>
      </form>
    </Pannel>
  );
}
