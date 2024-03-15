'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import { SimpleGrid, TextInput, NumberInput, Select, ActionIcon, Divider, MultiSelect, Textarea } from '@mantine/core';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import StopsExplorerIdPageHeader from '@/components/StopsExplorerIdPageHeader/StopsExplorerIdPageHeader';
import { StopOptions } from '@/schemas/Stop/options';
import { IconVolume, IconWorldLatitude, IconWorldLongitude } from '@tabler/icons-react';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import StopsExplorerIdPageMap from '@/components/StopsExplorerIdPageMap/StopsExplorerIdPageMap';

/* * */

export default function StopsExplorerIdPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopsExplorerIdPage');
  const stopOptionsLabels = useTranslations('StopOptions');
  const stopsExplorerContext = useStopsExplorerContext();

  //
  // E. Transform data

  const { data: allMunicipalitiesData } = useSWR('/api/municipalities');
  const { data: allZonesData } = useSWR('/api/zones');

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

  //
  // E. Handle actions

  const handlePlayPhoneticName = async () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(stopsExplorerContext.form.values.tts_name || '');
    utterance.lang = 'pt';
    synth.speak(utterance);
  };

  //
  // C. Render components

  return (
    <Pannel loading={stopsExplorerContext.page.is_loading} header={<StopsExplorerIdPageHeader />}>
      <StopsExplorerIdPageMap />

      <Divider />

      <AppLayoutSection title={t('sections.intro.title')} description={t('sections.intro.description')}>
        <SimpleGrid cols={4}>
          <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...stopsExplorerContext.form.getInputProps('code')} readOnly={stopsExplorerContext.page.is_read_only_code} />
          <NumberInput
            label={t('form.latitude.label')}
            placeholder={t('form.latitude.placeholder')}
            precision={6}
            min={37}
            max={40}
            step={0.000001}
            hideControls
            icon={<IconWorldLatitude size="18px" />}
            {...stopsExplorerContext.form.getInputProps('latitude')}
            readOnly={stopsExplorerContext.page.is_read_only_location}
          />
          <NumberInput
            label={t('form.longitude.label')}
            placeholder={t('form.longitude.placeholder')}
            precision={6}
            min={-10}
            max={-7}
            step={0.000001}
            hideControls
            icon={<IconWorldLongitude size="18px" />}
            {...stopsExplorerContext.form.getInputProps('longitude')}
            readOnly={stopsExplorerContext.page.is_read_only_location}
          />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...stopsExplorerContext.form.getInputProps('name')} readOnly={stopsExplorerContext.page.is_read_only_name} />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...stopsExplorerContext.form.getInputProps('short_name')} readOnly />
          <TextInput
            label={t('form.tts_name.label')}
            placeholder={t('form.tts_name.placeholder')}
            {...stopsExplorerContext.form.getInputProps('tts_name')}
            rightSection={
              <ActionIcon onClick={handlePlayPhoneticName} variant="subtle" color="blue" disabled={!stopsExplorerContext.form.values.tts_name}>
                <IconVolume size="18px" />
              </ActionIcon>
            }
            readOnly
          />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.zoning.title')} description={t('sections.zoning.description')}>
        <SimpleGrid cols={1}>
          <MultiSelect label={t('form.zones.label')} placeholder={t('form.zones.placeholder')} {...stopsExplorerContext.form.getInputProps('zones')} readOnly={stopsExplorerContext.page.is_read_only_zones} data={allZonesDataFormatted} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.admin.title')} description={t('sections.admin.description')}>
        <SimpleGrid cols={3}>
          <Select label={t('form.municipality.label')} placeholder={t('form.municipality.placeholder')} {...stopsExplorerContext.form.getInputProps('municipality')} readOnly={stopsExplorerContext.page.is_read_only} data={allMunicipalitiesDataFormatted} />
          <TextInput label={t('form.parish.label')} placeholder={t('form.parish.placeholder')} {...stopsExplorerContext.form.getInputProps('parish')} readOnly={stopsExplorerContext.page.is_read_only} />
          <TextInput label={t('form.locality.label')} placeholder={t('form.locality.placeholder')} {...stopsExplorerContext.form.getInputProps('locality')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <TextInput label={t('form.address.label')} placeholder={t('form.address.placeholder')} {...stopsExplorerContext.form.getInputProps('address')} readOnly={stopsExplorerContext.page.is_read_only} />
          <TextInput label={t('form.postal_code.label')} placeholder={t('form.postal_code.placeholder')} {...stopsExplorerContext.form.getInputProps('postal_code')} readOnly={stopsExplorerContext.page.is_read_only} />
          <TextInput label={t('form.jurisdiction.label')} placeholder={t('form.jurisdiction.placeholder')} {...stopsExplorerContext.form.getInputProps('jurisdiction')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.infrastructure.title')} description={t('sections.infrastructure.description')}>
        <SimpleGrid cols={2}>
          <Select
            label={t('form.has_pole.label')}
            placeholder={t('form.has_pole.placeholder')}
            nothingFoundMessage={t('form.has_pole.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_pole')}
            data={[
              { value: '0', label: '0 - Não Aplicável' },
              { value: '1', label: '1 - Não existe, mas deve ser colocado' },
              { value: '2', label: '2 - Existe, mas está danificado' },
              { value: '3', label: '3 - Existe e está OK' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput label={t('form.pole_material.label')} placeholder={t('form.pole_material.placeholder')} disabled={stopsExplorerContext.form.values.has_pole < 2} {...stopsExplorerContext.form.getInputProps('pole_material')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Select
            label={t('form.has_shelter.label')}
            placeholder={t('form.has_shelter.placeholder')}
            nothingFoundMessage={t('form.has_shelter.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_shelter')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput label={t('form.shelter_code.label')} placeholder={t('form.shelter_code.placeholder')} disabled={stopsExplorerContext.form.values.has_shelter < 1} {...stopsExplorerContext.form.getInputProps('shelter_code')} readOnly={stopsExplorerContext.page.is_read_only} />
          <TextInput label={t('form.shelter_maintainer.label')} placeholder={t('form.shelter_maintainer.placeholder')} disabled={stopsExplorerContext.form.values.has_shelter < 1} {...stopsExplorerContext.form.getInputProps('shelter_maintainer')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Select
            label={t('form.has_mupi.label')}
            placeholder={t('form.has_mupi.placeholder')}
            nothingFoundMessage={t('form.has_mupi.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_mupi')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_bench.label')}
            placeholder={t('form.has_bench.placeholder')}
            nothingFoundMessage={t('form.has_bench.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_bench')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_trash_bin.label')}
            placeholder={t('form.has_trash_bin.placeholder')}
            nothingFoundMessage={t('form.has_trash_bin.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_trash_bin')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Select
            label={t('form.has_lighting.label')}
            placeholder={t('form.has_lighting.placeholder')}
            nothingFoundMessage={t('form.has_lighting.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_lighting')}
            data={[
              { value: '0', label: '0 - Sem qualquer iluminação' },
              { value: '1', label: '1 - Iluminação insuficiente' },
              { value: '2', label: '2 - Imediações visíveis' },
              { value: '3', label: '3 - Leitura é possível e confortável' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_electricity.label')}
            placeholder={t('form.has_electricity.placeholder')}
            nothingFoundMessage={t('form.has_electricity.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_electricity')}
            data={[
              { value: '0', label: '0 - Indisponível' },
              { value: '1', label: '1 - Disponível' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.docking_bay_type.label')}
            placeholder={t('form.docking_bay_type.placeholder')}
            nothingFoundMessage={t('form.docking_bay_type.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('docking_bay_type')}
            data={[
              { value: '0', label: '0 - Indisponível' },
              { value: '1', label: '1 - Disponível' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput label={t('form.last_infrastructure_maintenance.label')} placeholder={t('form.last_infrastructure_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_infrastructure_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
          <TextInput label={t('form.last_infrastructure_check.label')} placeholder={t('form.last_infrastructure_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_infrastructure_check')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.public_info.title')} description={t('sections.public_info.description')}>
        <SimpleGrid cols={2}>
          <Select
            label={t('form.has_stop_sign.label')}
            placeholder={t('form.has_stop_sign.placeholder')}
            nothingFoundMessage={t('form.has_stop_sign.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_stop_sign')}
            data={[
              { value: '0', label: '0 - Não Aplicável' },
              { value: '1', label: '1 - Não existe, mas deve ser colocado' },
              { value: '2', label: '2 - Existe, mas está danificado' },
              { value: '3', label: '3 - Existe e está OK' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput
            label={t('form.stop_sign_maintainer.label')}
            placeholder={t('form.stop_sign_maintainer.placeholder')}
            disabled={stopsExplorerContext.form.values.has_stop_sign < 2}
            {...stopsExplorerContext.form.getInputProps('stop_sign_maintainer')}
            readOnly={stopsExplorerContext.page.is_read_only}
          />
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Select
            label={t('form.has_pole_frame.label')}
            placeholder={t('form.has_pole_frame.placeholder')}
            nothingFoundMessage={t('form.has_pole_frame.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_pole_frame')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput label={t('form.shelter_frame_area_cm.label')} placeholder={t('form.shelter_frame_area_cm.placeholder')} {...stopsExplorerContext.form.getInputProps('shelter_frame_area_cm')} readOnly={stopsExplorerContext.page.is_read_only} />
          <Select
            label={t('form.has_pip_real_time.label')}
            placeholder={t('form.has_pip_real_time.placeholder')}
            nothingFoundMessage={t('form.has_pip_real_time.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_pip_real_time')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput label={t('form.pip_real_time_code.label')} placeholder={t('form.pip_real_time_code.placeholder')} {...stopsExplorerContext.form.getInputProps('pip_real_time_code')} readOnly={stopsExplorerContext.page.is_read_only} />
          <Select
            label={t('form.has_h2oa_signage.label')}
            placeholder={t('form.has_h2oa_signage.placeholder')}
            nothingFoundMessage={t('form.has_h2oa_signage.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_h2oa_signage')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_schedules.label')}
            placeholder={t('form.has_schedules.placeholder')}
            nothingFoundMessage={t('form.has_schedules.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_schedules')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_network_map.label')}
            placeholder={t('form.has_network_map.placeholder')}
            nothingFoundMessage={t('form.has_network_map.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_network_map')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput label={t('form.last_schedules_maintenance.label')} placeholder={t('form.last_schedules_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_schedules_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
          <TextInput label={t('form.last_schedules_check.label')} placeholder={t('form.last_schedules_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_schedules_check')} readOnly={stopsExplorerContext.page.is_read_only} />
          <TextInput label={t('form.last_stop_sign_maintenance.label')} placeholder={t('form.last_stop_sign_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_stop_sign_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
          <TextInput label={t('form.last_stop_sign_check.label')} placeholder={t('form.last_stop_sign_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_stop_sign_check')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.accessibility.title')} description={t('sections.accessibility.description')}>
        <SimpleGrid cols={4}>
          <Select
            label={t('form.has_sidewalk.label')}
            placeholder={t('form.has_sidewalk.placeholder')}
            nothingFoundMessage={t('form.has_sidewalk.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_sidewalk')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput label={t('form.sidewalk_type.label')} placeholder={t('form.sidewalk_type.placeholder')} {...stopsExplorerContext.form.getInputProps('sidewalk_type')} readOnly={stopsExplorerContext.page.is_read_only} />
          <Select
            label={t('form.has_tactile_schedules.label')}
            placeholder={t('form.has_tactile_schedules.placeholder')}
            nothingFoundMessage={t('form.has_tactile_schedules.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_tactile_schedules')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.stop_access_type.label')}
            placeholder={t('form.stop_access_type.placeholder')}
            nothingFoundMessage={t('form.stop_access_type.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('stop_access_type')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_crosswalk.label')}
            placeholder={t('form.has_crosswalk.placeholder')}
            nothingFoundMessage={t('form.has_crosswalk.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_crosswalk')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_tactile_pavement.label')}
            placeholder={t('form.has_tactile_pavement.placeholder')}
            nothingFoundMessage={t('form.has_tactile_pavement.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_tactile_pavement')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_abusive_parking.label')}
            placeholder={t('form.has_abusive_parking.placeholder')}
            nothingFoundMessage={t('form.has_abusive_parking.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_abusive_parking')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.has_audio_stop_info.label')}
            placeholder={t('form.has_audio_stop_info.placeholder')}
            nothingFoundMessage={t('form.has_audio_stop_info.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_audio_stop_info')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.wheelchair_boarding.label')}
            placeholder={t('form.wheelchair_boarding.placeholder')}
            nothingFoundMessage={t('form.wheelchair_boarding.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('wheelchair_boarding')}
            data={[
              { value: '0', label: '0 - Não Existe' },
              { value: '1', label: '1 - Em muito mau estado' },
              { value: '2', label: '2 - Em mau estado' },
              { value: '3', label: '3 - Em estado razoável' },
              { value: '4', label: '4 - Em bom estado' },
              { value: '5', label: '5 - Em muito bom estado' },
            ]}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
          />
          <TextInput label={t('form.last_accessibility_check.label')} placeholder={t('form.last_accessibility_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_accessibility_check')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.services.title')} description={t('sections.services.description')}>
        <SimpleGrid cols={3}>
          <GlobalCheckboxCard label={t('form.near_health_clinic.label')} {...stopsExplorerContext.form.getInputProps('near_health_clinic')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.near_hospital.label')} {...stopsExplorerContext.form.getInputProps('near_hospital')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.near_university.label')} {...stopsExplorerContext.form.getInputProps('near_university')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.near_school.label')} {...stopsExplorerContext.form.getInputProps('near_school')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.near_police_station.label')} {...stopsExplorerContext.form.getInputProps('near_police_station')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.near_fire_station.label')} {...stopsExplorerContext.form.getInputProps('near_fire_station')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.near_shopping.label')} {...stopsExplorerContext.form.getInputProps('near_shopping')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.near_historic_building.label')} {...stopsExplorerContext.form.getInputProps('near_historic_building')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.near_transit_office.label')} {...stopsExplorerContext.form.getInputProps('near_transit_office')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.connections.title')} description={t('sections.connections.description')}>
        <SimpleGrid cols={3}>
          <GlobalCheckboxCard label={t('form.subway.label')} {...stopsExplorerContext.form.getInputProps('subway')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.light_rail.label')} {...stopsExplorerContext.form.getInputProps('light_rail')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.train.label')} {...stopsExplorerContext.form.getInputProps('train')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.boat.label')} {...stopsExplorerContext.form.getInputProps('boat')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.airport.label')} {...stopsExplorerContext.form.getInputProps('airport')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.bike_sharing.label')} {...stopsExplorerContext.form.getInputProps('bike_sharing')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.bike_parking.label')} {...stopsExplorerContext.form.getInputProps('bike_parking')} readOnly={stopsExplorerContext.page.is_read_only} />
          <GlobalCheckboxCard label={t('form.car_parking.label')} {...stopsExplorerContext.form.getInputProps('car_parking')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.notes.title')} description={t('sections.notes.description')}>
        <Textarea aria-label={t('form.notes.label')} placeholder={t('form.notes.placeholder')} autosize minRows={5} maxRows={15} {...stopsExplorerContext.form.getInputProps('notes')} readOnly={stopsExplorerContext.page.is_read_only} />
      </AppLayoutSection>
    </Pannel>
  );

  //
}
