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
import StopsExplorerIdPageItemMedia from '@/components/StopsExplorerIdPageItemMedia/StopsExplorerIdPageItemMedia';

/* * */

export default function StopsExplorerIdPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopsExplorerIdPage');
  const stopOptionsLabels = useTranslations('StopOptions');
  const stopsExplorerContext = useStopsExplorerContext();

  //
  // B. Fetch data

  const { data: allMunicipalitiesData } = useSWR('/api/municipalities');
  const { data: allZonesData } = useSWR('/api/zones');

  //
  // C. Transform data

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

  const operationalStatusOptionsData = useMemo(() => {
    if (!StopOptions.operational_status) return [];
    return StopOptions.operational_status.map((option) => {
      return { value: option, label: stopOptionsLabels(`operational_status.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const currentStatusOptionsData = useMemo(() => {
    if (!StopOptions.current_status) return [];
    return StopOptions.current_status.map((option) => {
      return { value: option, label: stopOptionsLabels(`current_status.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasPoleOptionsData = useMemo(() => {
    if (!StopOptions.has_pole) return [];
    return StopOptions.has_pole.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_pole.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasShelterOptionsData = useMemo(() => {
    if (!StopOptions.has_shelter) return [];
    return StopOptions.has_shelter.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_shelter.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasMupiOptionsData = useMemo(() => {
    if (!StopOptions.has_mupi) return [];
    return StopOptions.has_mupi.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_mupi.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasBenchOptionsData = useMemo(() => {
    if (!StopOptions.has_bench) return [];
    return StopOptions.has_bench.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_bench.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasTrashBinOptionsData = useMemo(() => {
    if (!StopOptions.has_trash_bin) return [];
    return StopOptions.has_trash_bin.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_trash_bin.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasLightingOptionsData = useMemo(() => {
    if (!StopOptions.has_lighting) return [];
    return StopOptions.has_lighting.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_lighting.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasElectricityOptionsData = useMemo(() => {
    if (!StopOptions.has_electricity) return [];
    return StopOptions.has_electricity.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_electricity.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const dockingBayTypeOptionsData = useMemo(() => {
    if (!StopOptions.docking_bay_type) return [];
    return StopOptions.docking_bay_type.map((option) => {
      return { value: option, label: stopOptionsLabels(`docking_bay_type.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasStopSignOptionsData = useMemo(() => {
    if (!StopOptions.has_stop_sign) return [];
    return StopOptions.has_stop_sign.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_stop_sign.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasPoleFrameOptionsData = useMemo(() => {
    if (!StopOptions.has_pole_frame) return [];
    return StopOptions.has_pole_frame.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_pole_frame.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasPipRealTimeOptionsData = useMemo(() => {
    if (!StopOptions.has_pip_real_time) return [];
    return StopOptions.has_pip_real_time.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_pip_real_time.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasH2oaSignageOptionsData = useMemo(() => {
    if (!StopOptions.has_h2oa_signage) return [];
    return StopOptions.has_h2oa_signage.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_h2oa_signage.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasSchedulesOptionsData = useMemo(() => {
    if (!StopOptions.has_schedules) return [];
    return StopOptions.has_schedules.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_schedules.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasNetworkMapOptionsData = useMemo(() => {
    if (!StopOptions.has_network_map) return [];
    return StopOptions.has_network_map.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_network_map.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasSidewalkOptionsData = useMemo(() => {
    if (!StopOptions.has_sidewalk) return [];
    return StopOptions.has_sidewalk.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_sidewalk.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasTactileSchedulesOptionsData = useMemo(() => {
    if (!StopOptions.has_tactile_schedules) return [];
    return StopOptions.has_tactile_schedules.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_tactile_schedules.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasStopAccessTypeOptionsData = useMemo(() => {
    if (!StopOptions.stop_access_type) return [];
    return StopOptions.stop_access_type.map((option) => {
      return { value: option, label: stopOptionsLabels(`stop_access_type.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasCrosswalkOptionsData = useMemo(() => {
    if (!StopOptions.has_crosswalk) return [];
    return StopOptions.has_crosswalk.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_crosswalk.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasTactilePavementOptionsData = useMemo(() => {
    if (!StopOptions.has_tactile_pavement) return [];
    return StopOptions.has_tactile_pavement.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_tactile_pavement.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasAbusiveParkingOptionsData = useMemo(() => {
    if (!StopOptions.has_abusive_parking) return [];
    return StopOptions.has_abusive_parking.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_abusive_parking.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasAudioStopInfoOptionsData = useMemo(() => {
    if (!StopOptions.has_audio_stop_info) return [];
    return StopOptions.has_audio_stop_info.map((option) => {
      return { value: option, label: stopOptionsLabels(`has_audio_stop_info.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  const hasWeelchairBoardingOptionsData = useMemo(() => {
    if (!StopOptions.wheelchair_boarding) return [];
    return StopOptions.wheelchair_boarding.map((option) => {
      return { value: option, label: stopOptionsLabels(`wheelchair_boarding.${option}.label`) };
    });
  }, [stopOptionsLabels]);

  //
  // D. Handle actions

  const handlePlayPhoneticName = async () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(stopsExplorerContext.form.values.tts_name || '');
    utterance.lang = 'pt';
    synth.speak(utterance);
  };

  //
  // E. Render components

  return (
    <Pannel loading={stopsExplorerContext.page.is_loading} header={<StopsExplorerIdPageHeader />}>
      <StopsExplorerIdPageMap />

      <Divider />

      <AppLayoutSection title={t('sections.intro.title')} description={t('sections.intro.description')}>
        <SimpleGrid cols={3}>
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
          <TextInput
            label={t('form.name.label')}
            placeholder={t('form.name.placeholder')}
            {...stopsExplorerContext.form.getInputProps('name')}
            readOnly={stopsExplorerContext.page.is_read_only_name}
            styles={{ input: { borderColor: stopsExplorerContext.form.values.name === stopsExplorerContext.form.values.name_new ? 'green' : 'orange', color: stopsExplorerContext.form.values.name === stopsExplorerContext.form.values.name_new ? 'green' : 'orange' } }}
          />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <TextInput label={t('form.name_new.label')} placeholder={t('form.name_new.placeholder')} {...stopsExplorerContext.form.getInputProps('name_new')} readOnly={stopsExplorerContext.page.is_read_only_name} />
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
        <SimpleGrid cols={1}>
          <Select
            data={operationalStatusOptionsData}
            label={t('form.operational_status.label')}
            placeholder={t('form.operational_status.placeholder')}
            nothingFoundMessage={t('form.operational_status.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('operational_status')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <MultiSelect
            data={currentStatusOptionsData}
            label={t('form.current_status.label')}
            placeholder={t('form.current_status.placeholder')}
            nothingFoundMessage={t('form.current_status.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('current_status')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
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
          <Select label={t('form.municipality.label')} placeholder={t('form.municipality.placeholder')} {...stopsExplorerContext.form.getInputProps('municipality')} readOnly={stopsExplorerContext.page.is_read_only_location} data={allMunicipalitiesDataFormatted} />
          <TextInput label={t('form.parish.label')} placeholder={t('form.parish.placeholder')} {...stopsExplorerContext.form.getInputProps('parish')} readOnly={stopsExplorerContext.page.is_read_only_location} />
          <TextInput label={t('form.locality.label')} placeholder={t('form.locality.placeholder')} {...stopsExplorerContext.form.getInputProps('locality')} readOnly={stopsExplorerContext.page.is_read_only_location} />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <TextInput label={t('form.jurisdiction.label')} placeholder={t('form.jurisdiction.placeholder')} {...stopsExplorerContext.form.getInputProps('jurisdiction')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.infrastructure.title')} description={t('sections.infrastructure.description')}>
        <SimpleGrid cols={2}>
          <Select
            data={hasPoleOptionsData}
            label={t('form.has_pole.label')}
            placeholder={t('form.has_pole.placeholder')}
            nothingFoundMessage={t('form.has_pole.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_pole')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Select
            data={hasShelterOptionsData}
            label={t('form.has_shelter.label')}
            placeholder={t('form.has_shelter.placeholder')}
            nothingFoundMessage={t('form.has_shelter.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_shelter')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <TextInput
            label={t('form.shelter_code.label')}
            placeholder={t('form.shelter_code.placeholder')}
            {...stopsExplorerContext.form.getInputProps('shelter_code')}
            readOnly={stopsExplorerContext.page.is_read_only}
            disabled={!stopsExplorerContext.form.values.has_shelter || stopsExplorerContext.form.values.has_shelter === '0'}
          />
          <TextInput
            label={t('form.shelter_maintainer.label')}
            placeholder={t('form.shelter_maintainer.placeholder')}
            {...stopsExplorerContext.form.getInputProps('shelter_maintainer')}
            readOnly={stopsExplorerContext.page.is_read_only}
            disabled={!stopsExplorerContext.form.values.has_shelter || stopsExplorerContext.form.values.has_shelter === '0'}
          />
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Select
            data={hasMupiOptionsData}
            label={t('form.has_mupi.label')}
            placeholder={t('form.has_mupi.placeholder')}
            nothingFoundMessage={t('form.has_mupi.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_mupi')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasBenchOptionsData}
            label={t('form.has_bench.label')}
            placeholder={t('form.has_bench.placeholder')}
            nothingFoundMessage={t('form.has_bench.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_bench')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasTrashBinOptionsData}
            label={t('form.has_trash_bin.label')}
            placeholder={t('form.has_trash_bin.placeholder')}
            nothingFoundMessage={t('form.has_trash_bin.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_trash_bin')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Select
            data={hasLightingOptionsData}
            label={t('form.has_lighting.label')}
            placeholder={t('form.has_lighting.placeholder')}
            nothingFoundMessage={t('form.has_lighting.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_lighting')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasElectricityOptionsData}
            label={t('form.has_electricity.label')}
            placeholder={t('form.has_electricity.placeholder')}
            nothingFoundMessage={t('form.has_electricity.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_electricity')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={dockingBayTypeOptionsData}
            label={t('form.docking_bay_type.label')}
            placeholder={t('form.docking_bay_type.placeholder')}
            nothingFoundMessage={t('form.docking_bay_type.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('docking_bay_type')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          {/* <TextInput label={t('form.last_infrastructure_maintenance.label')} placeholder={t('form.last_infrastructure_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_infrastructure_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} /> */}
          {/* <TextInput label={t('form.last_infrastructure_check.label')} placeholder={t('form.last_infrastructure_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_infrastructure_check')} readOnly={stopsExplorerContext.page.is_read_only} /> */}
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.public_info.title')} description={t('sections.public_info.description')}>
        <SimpleGrid cols={2}>
          <Select
            data={hasStopSignOptionsData}
            label={t('form.has_stop_sign.label')}
            placeholder={t('form.has_stop_sign.placeholder')}
            nothingFoundMessage={t('form.has_stop_sign.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_stop_sign')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <TextInput label={t('form.stop_sign_maintainer.label')} placeholder={t('form.stop_sign_maintainer.placeholder')} {...stopsExplorerContext.form.getInputProps('stop_sign_maintainer')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Select
            data={hasPoleFrameOptionsData}
            label={t('form.has_pole_frame.label')}
            placeholder={t('form.has_pole_frame.placeholder')}
            nothingFoundMessage={t('form.has_pole_frame.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_pole_frame')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <TextInput
            label={t('form.shelter_frame_area_cm.label')}
            placeholder={t('form.shelter_frame_area_cm.placeholder')}
            {...stopsExplorerContext.form.getInputProps('shelter_frame_area_cm')}
            readOnly={stopsExplorerContext.page.is_read_only}
            disabled={!stopsExplorerContext.form.values.has_pole_frame || stopsExplorerContext.form.values.has_pole_frame === '0'}
          />
          <Select
            data={hasPipRealTimeOptionsData}
            label={t('form.has_pip_real_time.label')}
            placeholder={t('form.has_pip_real_time.placeholder')}
            nothingFoundMessage={t('form.has_pip_real_time.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_pip_real_time')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <TextInput
            label={t('form.pip_real_time_code.label')}
            placeholder={t('form.pip_real_time_code.placeholder')}
            {...stopsExplorerContext.form.getInputProps('pip_real_time_code')}
            readOnly={stopsExplorerContext.page.is_read_only}
            disabled={!stopsExplorerContext.form.values.has_pip_real_time || stopsExplorerContext.form.values.has_pip_real_time === '0'}
          />
          <Select
            data={hasH2oaSignageOptionsData}
            label={t('form.has_h2oa_signage.label')}
            placeholder={t('form.has_h2oa_signage.placeholder')}
            nothingFoundMessage={t('form.has_h2oa_signage.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_h2oa_signage')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasSchedulesOptionsData}
            label={t('form.has_schedules.label')}
            placeholder={t('form.has_schedules.placeholder')}
            nothingFoundMessage={t('form.has_schedules.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_schedules')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasNetworkMapOptionsData}
            label={t('form.has_network_map.label')}
            placeholder={t('form.has_network_map.placeholder')}
            nothingFoundMessage={t('form.has_network_map.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_network_map')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
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
            data={hasSidewalkOptionsData}
            label={t('form.has_sidewalk.label')}
            placeholder={t('form.has_sidewalk.placeholder')}
            nothingFoundMessage={t('form.has_sidewalk.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_sidewalk')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <TextInput label={t('form.sidewalk_type.label')} placeholder={t('form.sidewalk_type.placeholder')} {...stopsExplorerContext.form.getInputProps('sidewalk_type')} readOnly={stopsExplorerContext.page.is_read_only} />
          <Select
            data={hasTactileSchedulesOptionsData}
            label={t('form.has_tactile_schedules.label')}
            placeholder={t('form.has_tactile_schedules.placeholder')}
            nothingFoundMessage={t('form.has_tactile_schedules.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_tactile_schedules')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasStopAccessTypeOptionsData}
            label={t('form.stop_access_type.label')}
            placeholder={t('form.stop_access_type.placeholder')}
            nothingFoundMessage={t('form.stop_access_type.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('stop_access_type')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasCrosswalkOptionsData}
            label={t('form.has_crosswalk.label')}
            placeholder={t('form.has_crosswalk.placeholder')}
            nothingFoundMessage={t('form.has_crosswalk.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_crosswalk')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasTactilePavementOptionsData}
            label={t('form.has_tactile_pavement.label')}
            placeholder={t('form.has_tactile_pavement.placeholder')}
            nothingFoundMessage={t('form.has_tactile_pavement.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_tactile_pavement')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasAbusiveParkingOptionsData}
            label={t('form.has_abusive_parking.label')}
            placeholder={t('form.has_abusive_parking.placeholder')}
            nothingFoundMessage={t('form.has_abusive_parking.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_abusive_parking')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasAudioStopInfoOptionsData}
            label={t('form.has_audio_stop_info.label')}
            placeholder={t('form.has_audio_stop_info.placeholder')}
            nothingFoundMessage={t('form.has_audio_stop_info.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('has_audio_stop_info')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <Select
            data={hasWeelchairBoardingOptionsData}
            label={t('form.wheelchair_boarding.label')}
            placeholder={t('form.wheelchair_boarding.placeholder')}
            nothingFoundMessage={t('form.wheelchair_boarding.nothingFound')}
            {...stopsExplorerContext.form.getInputProps('wheelchair_boarding')}
            readOnly={stopsExplorerContext.page.is_read_only}
            searchable
            clearable
          />
          <TextInput label={t('form.last_accessibility_check.label')} placeholder={t('form.last_accessibility_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_accessibility_check')} readOnly={stopsExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.services.title')} description={t('sections.services.description')}>
        <SimpleGrid cols={3}>
          <GlobalCheckboxCard label={t('form.near_health_clinic.label')} {...stopsExplorerContext.form.getInputProps('near_health_clinic')} readOnly />
          <GlobalCheckboxCard label={t('form.near_hospital.label')} {...stopsExplorerContext.form.getInputProps('near_hospital')} readOnly />
          <GlobalCheckboxCard label={t('form.near_university.label')} {...stopsExplorerContext.form.getInputProps('near_university')} readOnly />
          <GlobalCheckboxCard label={t('form.near_school.label')} {...stopsExplorerContext.form.getInputProps('near_school')} readOnly />
          <GlobalCheckboxCard label={t('form.near_police_station.label')} {...stopsExplorerContext.form.getInputProps('near_police_station')} readOnly />
          <GlobalCheckboxCard label={t('form.near_fire_station.label')} {...stopsExplorerContext.form.getInputProps('near_fire_station')} readOnly />
          <GlobalCheckboxCard label={t('form.near_shopping.label')} {...stopsExplorerContext.form.getInputProps('near_shopping')} readOnly />
          <GlobalCheckboxCard label={t('form.near_historic_building.label')} {...stopsExplorerContext.form.getInputProps('near_historic_building')} readOnly />
          <GlobalCheckboxCard label={t('form.near_transit_office.label')} {...stopsExplorerContext.form.getInputProps('near_transit_office')} readOnly />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.connections.title')} description={t('sections.connections.description')}>
        <SimpleGrid cols={3}>
          <GlobalCheckboxCard label={t('form.subway.label')} {...stopsExplorerContext.form.getInputProps('subway')} readOnly />
          <GlobalCheckboxCard label={t('form.light_rail.label')} {...stopsExplorerContext.form.getInputProps('light_rail')} readOnly />
          <GlobalCheckboxCard label={t('form.train.label')} {...stopsExplorerContext.form.getInputProps('train')} readOnly />
          <GlobalCheckboxCard label={t('form.boat.label')} {...stopsExplorerContext.form.getInputProps('boat')} readOnly />
          <GlobalCheckboxCard label={t('form.airport.label')} {...stopsExplorerContext.form.getInputProps('airport')} readOnly />
          <GlobalCheckboxCard label={t('form.bike_sharing.label')} {...stopsExplorerContext.form.getInputProps('bike_sharing')} readOnly />
          <GlobalCheckboxCard label={t('form.bike_parking.label')} {...stopsExplorerContext.form.getInputProps('bike_parking')} readOnly />
          <GlobalCheckboxCard label={t('form.car_parking.label')} {...stopsExplorerContext.form.getInputProps('car_parking')} readOnly />
        </SimpleGrid>
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.media.title')} description={t('sections.media.description')}>
        <StopsExplorerIdPageItemMedia />
      </AppLayoutSection>

      <Divider />

      <AppLayoutSection title={t('sections.notes.title')} description={t('sections.notes.description')}>
        <Textarea aria-label={t('form.notes.label')} placeholder={t('form.notes.placeholder')} autosize minRows={5} maxRows={15} {...stopsExplorerContext.form.getInputProps('notes')} readOnly={stopsExplorerContext.page.is_read_only} />
      </AppLayoutSection>
    </Pannel>
  );

  //
}
