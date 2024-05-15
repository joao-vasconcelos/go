'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import { SimpleGrid, TextInput, NumberInput, Select, ActionIcon, Divider, MultiSelect, Textarea, Tooltip } from '@mantine/core';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import StopsExplorerIdPageHeader from '@/components/StopsExplorerIdPageHeader/StopsExplorerIdPageHeader';
import { StopOptions } from '@/schemas/Stop/options';
import { IconAB, IconABOff, IconVolume, IconWorldLatitude, IconWorldLongitude } from '@tabler/icons-react';
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

	const hasPoleOptionsData = useMemo(() => {
		if (!StopOptions.has_pole) return [];
		return StopOptions.has_pole.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_pole.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const hasCoverOptionsData = useMemo(() => {
		if (!StopOptions.has_cover) return [];
		return StopOptions.has_cover.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_cover.${option}.label`) };
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

	const hasFlagOptionsData = useMemo(() => {
		if (!StopOptions.has_flag) return [];
		return StopOptions.has_flag.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_flag.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const hasPipStaticOptionsData = useMemo(() => {
		if (!StopOptions.has_pip_static) return [];
		return StopOptions.has_pip_static.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_pip_static.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const hasPipAudioOptionsData = useMemo(() => {
		if (!StopOptions.has_pip_audio) return [];
		return StopOptions.has_pip_audio.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_pip_audio.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const hasPipRealtimeOptionsData = useMemo(() => {
		if (!StopOptions.has_pip_realtime) return [];
		return StopOptions.has_pip_realtime.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_pip_realtime.${option}.label`) };
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

	const hasTactileSchedulesOptionsData = useMemo(() => {
		if (!StopOptions.has_tactile_schedules) return [];
		return StopOptions.has_tactile_schedules.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_tactile_schedules.${option}.label`) };
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

	const hasCrossingOptionsData = useMemo(() => {
		if (!StopOptions.has_crossing) return [];
		return StopOptions.has_crossing.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_crossing.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const hasFlatAccessOptionsData = useMemo(() => {
		if (!StopOptions.has_flat_access) return [];
		return StopOptions.has_flat_access.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_flat_access.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const hasWideAccessOptionsData = useMemo(() => {
		if (!StopOptions.has_wide_access) return [];
		return StopOptions.has_wide_access.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_wide_access.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const hasTactileAccessOptionsData = useMemo(() => {
		if (!StopOptions.has_tactile_access) return [];
		return StopOptions.has_tactile_access.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_tactile_access.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const hasAbusiveParkingOptionsData = useMemo(() => {
		if (!StopOptions.has_abusive_parking) return [];
		return StopOptions.has_abusive_parking.map((option) => {
			return { value: option, label: stopOptionsLabels(`has_abusive_parking.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	const wheelchairBoardingOptionsData = useMemo(() => {
		if (!StopOptions.wheelchair_boarding) return [];
		return StopOptions.wheelchair_boarding.map((option) => {
			return { value: option, label: stopOptionsLabels(`wheelchair_boarding.${option}.label`) };
		});
	}, [stopOptionsLabels]);

	//
	// D. Handle actions

	const handlePlayPhoneticName = async () => {
		if (typeof window !== 'undefined') {
			// eslint-disable-next-line no-undef
			const synth = window.speechSynthesis;
			// eslint-disable-next-line no-undef
			const utterance = new SpeechSynthesisUtterance(stopsExplorerContext.form.values.tts_name || '');
			utterance.lang = 'pt';
			synth.speak(utterance);
		}
	};

	const handleLockShortName = () => {
		stopsExplorerContext.form.setFieldValue('short_name_auto', !stopsExplorerContext.form.values.short_name_auto);
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
					<TextInput
						label={t('form.short_name.label')}
						placeholder={t('form.short_name.placeholder')}
						{...stopsExplorerContext.form.getInputProps('short_name')}
						styles={{ input: { borderColor: !stopsExplorerContext.form.values.short_name_auto && 'var(--mantine-color-grape-6)' } }}
						readOnly={stopsExplorerContext.page.is_read_only_name || stopsExplorerContext.form.values.short_name_auto}
						rightSection={
							<Tooltip label={stopsExplorerContext.form.values.short_name_auto ? t('form.short_name_auto.true') : t('form.short_name_auto.false')} color={stopsExplorerContext.form.values.short_name_auto ? 'green' : 'grape'} position="bottom" withArrow>
								<ActionIcon onClick={handleLockShortName} variant="subtle" color={stopsExplorerContext.form.values.short_name_auto ? 'green' : 'grape'}>
									{stopsExplorerContext.form.values.short_name_auto ? <IconAB size={18} /> : <IconABOff size={18} />}
								</ActionIcon>
							</Tooltip>
						}
					/>
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
				<SimpleGrid cols={3}>
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
					<Select
						data={hasCoverOptionsData}
						label={t('form.has_cover.label')}
						placeholder={t('form.has_cover.placeholder')}
						nothingFoundMessage={t('form.has_cover.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_cover')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
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
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput
						label={t('form.shelter_code.label')}
						placeholder={t('form.shelter_code.placeholder')}
						{...stopsExplorerContext.form.getInputProps('shelter_code')}
						readOnly={stopsExplorerContext.page.is_read_only}
						disabled={!stopsExplorerContext.form.values.has_shelter || stopsExplorerContext.form.values.has_shelter === 'UNKNOWN' || stopsExplorerContext.form.values.has_shelter === 'NO'}
					/>
					<TextInput
						label={t('form.shelter_maintainer.label')}
						placeholder={t('form.shelter_maintainer.placeholder')}
						{...stopsExplorerContext.form.getInputProps('shelter_maintainer')}
						readOnly={stopsExplorerContext.page.is_read_only}
						disabled={!stopsExplorerContext.form.values.has_shelter || stopsExplorerContext.form.values.has_shelter === 'UNKNOWN' || stopsExplorerContext.form.values.has_shelter === 'NO'}
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
				</SimpleGrid>
				<SimpleGrid cols={1}>
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
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.last_infrastructure_maintenance.label')} placeholder={t('form.last_infrastructure_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_infrastructure_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
					<TextInput label={t('form.last_infrastructure_check.label')} placeholder={t('form.last_infrastructure_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_infrastructure_check')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.public_info.title')} description={t('sections.public_info.description')}>
				<SimpleGrid cols={2}>
					<Select
						data={hasFlagOptionsData}
						label={t('form.has_flag.label')}
						placeholder={t('form.has_flag.placeholder')}
						nothingFoundMessage={t('form.has_flag.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_flag')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
					<TextInput label={t('form.flag_maintainer.label')} placeholder={t('form.flag_maintainer.placeholder')} {...stopsExplorerContext.form.getInputProps('flag_maintainer')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<Select
						data={hasPipStaticOptionsData}
						label={t('form.has_pip_static.label')}
						placeholder={t('form.has_pip_static.placeholder')}
						nothingFoundMessage={t('form.has_pip_static.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_pip_static')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						data={hasPipAudioOptionsData}
						label={t('form.has_pip_audio.label')}
						placeholder={t('form.has_pip_audio.placeholder')}
						nothingFoundMessage={t('form.has_pip_audio.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_pip_audio')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
					<TextInput
						label={t('form.pip_audio_code.label')}
						placeholder={t('form.pip_audio_code.placeholder')}
						{...stopsExplorerContext.form.getInputProps('pip_audio_code')}
						readOnly={stopsExplorerContext.page.is_read_only}
						disabled={!stopsExplorerContext.form.values.has_pip_audio || stopsExplorerContext.form.values.has_pip_audio === 'UNKNOWN' || stopsExplorerContext.form.values.has_pip_audio === 'NO'}
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						data={hasPipRealtimeOptionsData}
						label={t('form.has_pip_realtime.label')}
						placeholder={t('form.has_pip_realtime.placeholder')}
						nothingFoundMessage={t('form.has_pip_realtime.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_pip_realtime')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
					<TextInput
						label={t('form.pip_realtime_code.label')}
						placeholder={t('form.pip_realtime_code.placeholder')}
						{...stopsExplorerContext.form.getInputProps('pip_realtime_code')}
						readOnly={stopsExplorerContext.page.is_read_only}
						disabled={!stopsExplorerContext.form.values.has_pip_realtime || stopsExplorerContext.form.values.has_pip_realtime === '0'}
					/>
				</SimpleGrid>
				<SimpleGrid cols={1}>
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
				</SimpleGrid>
				<SimpleGrid cols={2}>
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
						data={hasTactileSchedulesOptionsData}
						label={t('form.has_tactile_schedules.label')}
						placeholder={t('form.has_tactile_schedules.placeholder')}
						nothingFoundMessage={t('form.has_tactile_schedules.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_tactile_schedules')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
				</SimpleGrid>
				<SimpleGrid cols={1}>
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
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.last_schedules_maintenance.label')} placeholder={t('form.last_schedules_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_schedules_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
					<TextInput label={t('form.last_schedules_check.label')} placeholder={t('form.last_schedules_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_schedules_check')} readOnly={stopsExplorerContext.page.is_read_only} />
					<TextInput label={t('form.last_flag_maintenance.label')} placeholder={t('form.last_flag_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_flag_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
					<TextInput label={t('form.last_flag_check.label')} placeholder={t('form.last_flag_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_flag_check')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.accessibility.title')} description={t('sections.accessibility.description')}>
				<SimpleGrid cols={2}>
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
				</SimpleGrid>
				<SimpleGrid cols={4}>
					<Select
						data={hasCrossingOptionsData}
						label={t('form.has_crossing.label')}
						placeholder={t('form.has_crossing.placeholder')}
						nothingFoundMessage={t('form.has_crossing.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_crossing')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
					<Select
						data={hasFlatAccessOptionsData}
						label={t('form.has_flat_access.label')}
						placeholder={t('form.has_flat_access.placeholder')}
						nothingFoundMessage={t('form.has_flat_access.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_flat_access')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
					<Select
						data={hasWideAccessOptionsData}
						label={t('form.has_wide_access.label')}
						placeholder={t('form.has_wide_access.placeholder')}
						nothingFoundMessage={t('form.has_wide_access.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_wide_access')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
					<Select
						data={hasTactileAccessOptionsData}
						label={t('form.has_tactile_access.label')}
						placeholder={t('form.has_tactile_access.placeholder')}
						nothingFoundMessage={t('form.has_tactile_access.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('has_tactile_access')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
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
						data={wheelchairBoardingOptionsData}
						label={t('form.wheelchair_boarding.label')}
						placeholder={t('form.wheelchair_boarding.placeholder')}
						nothingFoundMessage={t('form.wheelchair_boarding.nothingFound')}
						{...stopsExplorerContext.form.getInputProps('wheelchair_boarding')}
						readOnly={stopsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.last_accessibility_maintenance.label')} placeholder={t('form.last_accessibility_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_accessibility_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
					<TextInput label={t('form.last_accessibility_check.label')} placeholder={t('form.last_accessibility_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_accessibility_check')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.services.title')} description={t('sections.services.description')}>
				<SimpleGrid cols={4}>
					<GlobalCheckboxCard label={t('form.near_health_clinic.label')} {...stopsExplorerContext.form.getInputProps('near_health_clinic')} readOnly />
					<GlobalCheckboxCard label={t('form.near_hospital.label')} {...stopsExplorerContext.form.getInputProps('near_hospital')} readOnly />
					<GlobalCheckboxCard label={t('form.near_university.label')} {...stopsExplorerContext.form.getInputProps('near_university')} readOnly />
					<GlobalCheckboxCard label={t('form.near_school.label')} {...stopsExplorerContext.form.getInputProps('near_school')} readOnly />
					<GlobalCheckboxCard label={t('form.near_police_station.label')} {...stopsExplorerContext.form.getInputProps('near_police_station')} readOnly />
					<GlobalCheckboxCard label={t('form.near_fire_station.label')} {...stopsExplorerContext.form.getInputProps('near_fire_station')} readOnly />
					<GlobalCheckboxCard label={t('form.near_shopping.label')} {...stopsExplorerContext.form.getInputProps('near_shopping')} readOnly />
					<GlobalCheckboxCard label={t('form.near_historic_building.label')} {...stopsExplorerContext.form.getInputProps('near_historic_building')} readOnly />
					<GlobalCheckboxCard label={t('form.near_transit_office.label')} {...stopsExplorerContext.form.getInputProps('near_transit_office')} readOnly />
					<GlobalCheckboxCard label={t('form.near_beach.label')} {...stopsExplorerContext.form.getInputProps('near_beach')} readOnly />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.connections.title')} description={t('sections.connections.description')}>
				<SimpleGrid cols={4}>
					<GlobalCheckboxCard label={t('form.near_subway.label')} {...stopsExplorerContext.form.getInputProps('near_subway')} readOnly />
					<GlobalCheckboxCard label={t('form.near_light_rail.label')} {...stopsExplorerContext.form.getInputProps('near_light_rail')} readOnly />
					<GlobalCheckboxCard label={t('form.near_train.label')} {...stopsExplorerContext.form.getInputProps('near_train')} readOnly />
					<GlobalCheckboxCard label={t('form.near_boat.label')} {...stopsExplorerContext.form.getInputProps('near_boat')} readOnly />
					<GlobalCheckboxCard label={t('form.near_airport.label')} {...stopsExplorerContext.form.getInputProps('near_airport')} readOnly />
					<GlobalCheckboxCard label={t('form.near_bike_sharing.label')} {...stopsExplorerContext.form.getInputProps('near_bike_sharing')} readOnly />
					<GlobalCheckboxCard label={t('form.near_bike_parking.label')} {...stopsExplorerContext.form.getInputProps('near_bike_parking')} readOnly />
					<GlobalCheckboxCard label={t('form.near_car_parking.label')} {...stopsExplorerContext.form.getInputProps('near_car_parking')} readOnly />
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