'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import Pannel from '@/components/Pannel/Pannel';
import StopsExplorerIdPageHeader from '@/components/StopsExplorerIdPageHeader/StopsExplorerIdPageHeader';
import StopsExplorerIdPageItemMedia from '@/components/StopsExplorerIdPageItemMedia/StopsExplorerIdPageItemMedia';
import StopsExplorerIdPageMap from '@/components/StopsExplorerIdPageMap/StopsExplorerIdPageMap';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { StopOptions } from '@/schemas/Stop/options';
import { ActionIcon, Divider, MultiSelect, NumberInput, Select, SimpleGrid, TextInput, Textarea, Tooltip } from '@mantine/core';
import { IconAB, IconABOff, IconVolume, IconWorldLatitude, IconWorldLongitude } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

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
			return { label: item.name || '-', value: item._id };
		});
	}, [allMunicipalitiesData]);

	const allZonesDataFormatted = useMemo(() => {
		if (!allZonesData) return [];
		return allZonesData.map((item) => {
			return { label: item.name || '-', value: item._id };
		});
	}, [allZonesData]);

	const operationalStatusOptionsData = useMemo(() => {
		if (!StopOptions.operational_status) return [];
		return StopOptions.operational_status.map((option) => {
			return { label: stopOptionsLabels(`operational_status.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasPoleOptionsData = useMemo(() => {
		if (!StopOptions.has_pole) return [];
		return StopOptions.has_pole.map((option) => {
			return { label: stopOptionsLabels(`has_pole.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasCoverOptionsData = useMemo(() => {
		if (!StopOptions.has_cover) return [];
		return StopOptions.has_cover.map((option) => {
			return { label: stopOptionsLabels(`has_cover.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasShelterOptionsData = useMemo(() => {
		if (!StopOptions.has_shelter) return [];
		return StopOptions.has_shelter.map((option) => {
			return { label: stopOptionsLabels(`has_shelter.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasMupiOptionsData = useMemo(() => {
		if (!StopOptions.has_mupi) return [];
		return StopOptions.has_mupi.map((option) => {
			return { label: stopOptionsLabels(`has_mupi.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasBenchOptionsData = useMemo(() => {
		if (!StopOptions.has_bench) return [];
		return StopOptions.has_bench.map((option) => {
			return { label: stopOptionsLabels(`has_bench.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasTrashBinOptionsData = useMemo(() => {
		if (!StopOptions.has_trash_bin) return [];
		return StopOptions.has_trash_bin.map((option) => {
			return { label: stopOptionsLabels(`has_trash_bin.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasLightingOptionsData = useMemo(() => {
		if (!StopOptions.has_lighting) return [];
		return StopOptions.has_lighting.map((option) => {
			return { label: stopOptionsLabels(`has_lighting.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasElectricityOptionsData = useMemo(() => {
		if (!StopOptions.has_electricity) return [];
		return StopOptions.has_electricity.map((option) => {
			return { label: stopOptionsLabels(`has_electricity.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const dockingBayTypeOptionsData = useMemo(() => {
		if (!StopOptions.docking_bay_type) return [];
		return StopOptions.docking_bay_type.map((option) => {
			return { label: stopOptionsLabels(`docking_bay_type.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasFlagOptionsData = useMemo(() => {
		if (!StopOptions.has_flag) return [];
		return StopOptions.has_flag.map((option) => {
			return { label: stopOptionsLabels(`has_flag.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasPipStaticOptionsData = useMemo(() => {
		if (!StopOptions.has_pip_static) return [];
		return StopOptions.has_pip_static.map((option) => {
			return { label: stopOptionsLabels(`has_pip_static.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasPipAudioOptionsData = useMemo(() => {
		if (!StopOptions.has_pip_audio) return [];
		return StopOptions.has_pip_audio.map((option) => {
			return { label: stopOptionsLabels(`has_pip_audio.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasPipRealtimeOptionsData = useMemo(() => {
		if (!StopOptions.has_pip_realtime) return [];
		return StopOptions.has_pip_realtime.map((option) => {
			return { label: stopOptionsLabels(`has_pip_realtime.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasH2oaSignageOptionsData = useMemo(() => {
		if (!StopOptions.has_h2oa_signage) return [];
		return StopOptions.has_h2oa_signage.map((option) => {
			return { label: stopOptionsLabels(`has_h2oa_signage.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasSchedulesOptionsData = useMemo(() => {
		if (!StopOptions.has_schedules) return [];
		return StopOptions.has_schedules.map((option) => {
			return { label: stopOptionsLabels(`has_schedules.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasTactileSchedulesOptionsData = useMemo(() => {
		if (!StopOptions.has_tactile_schedules) return [];
		return StopOptions.has_tactile_schedules.map((option) => {
			return { label: stopOptionsLabels(`has_tactile_schedules.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasNetworkMapOptionsData = useMemo(() => {
		if (!StopOptions.has_network_map) return [];
		return StopOptions.has_network_map.map((option) => {
			return { label: stopOptionsLabels(`has_network_map.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasSidewalkOptionsData = useMemo(() => {
		if (!StopOptions.has_sidewalk) return [];
		return StopOptions.has_sidewalk.map((option) => {
			return { label: stopOptionsLabels(`has_sidewalk.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasCrossingOptionsData = useMemo(() => {
		if (!StopOptions.has_crossing) return [];
		return StopOptions.has_crossing.map((option) => {
			return { label: stopOptionsLabels(`has_crossing.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasFlatAccessOptionsData = useMemo(() => {
		if (!StopOptions.has_flat_access) return [];
		return StopOptions.has_flat_access.map((option) => {
			return { label: stopOptionsLabels(`has_flat_access.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasWideAccessOptionsData = useMemo(() => {
		if (!StopOptions.has_wide_access) return [];
		return StopOptions.has_wide_access.map((option) => {
			return { label: stopOptionsLabels(`has_wide_access.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasTactileAccessOptionsData = useMemo(() => {
		if (!StopOptions.has_tactile_access) return [];
		return StopOptions.has_tactile_access.map((option) => {
			return { label: stopOptionsLabels(`has_tactile_access.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const hasAbusiveParkingOptionsData = useMemo(() => {
		if (!StopOptions.has_abusive_parking) return [];
		return StopOptions.has_abusive_parking.map((option) => {
			return { label: stopOptionsLabels(`has_abusive_parking.${option}.label`), value: option };
		});
	}, [stopOptionsLabels]);

	const wheelchairBoardingOptionsData = useMemo(() => {
		if (!StopOptions.wheelchair_boarding) return [];
		return StopOptions.wheelchair_boarding.map((option) => {
			return { label: stopOptionsLabels(`wheelchair_boarding.${option}.label`), value: option };
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
		<Pannel header={<StopsExplorerIdPageHeader />} loading={stopsExplorerContext.page.is_loading}>
			<StopsExplorerIdPageMap />

			<Divider />

			<AppLayoutSection description={t('sections.intro.description')} title={t('sections.intro.title')}>
				<SimpleGrid cols={3}>
					<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...stopsExplorerContext.form.getInputProps('code')} readOnly={stopsExplorerContext.page.is_read_only_code} />
					<NumberInput
						icon={<IconWorldLatitude size="18px" />}
						label={t('form.latitude.label')}
						max={40}
						min={37}
						placeholder={t('form.latitude.placeholder')}
						precision={6}
						step={0.000001}
						hideControls
						{...stopsExplorerContext.form.getInputProps('latitude')}
						readOnly={stopsExplorerContext.page.is_read_only_location}
					/>
					<NumberInput
						icon={<IconWorldLongitude size="18px" />}
						label={t('form.longitude.label')}
						max={-7}
						min={-10}
						placeholder={t('form.longitude.placeholder')}
						precision={6}
						step={0.000001}
						hideControls
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
						readOnly={stopsExplorerContext.page.is_read_only_name || stopsExplorerContext.form.values.short_name_auto}
						styles={{ input: { borderColor: !stopsExplorerContext.form.values.short_name_auto && 'var(--mantine-color-grape-6)' } }}
						rightSection={(
							<Tooltip color={stopsExplorerContext.form.values.short_name_auto ? 'green' : 'grape'} label={stopsExplorerContext.form.values.short_name_auto ? t('form.short_name_auto.true') : t('form.short_name_auto.false')} position="bottom" withArrow>
								<ActionIcon color={stopsExplorerContext.form.values.short_name_auto ? 'green' : 'grape'} onClick={handleLockShortName} variant="subtle">
									{stopsExplorerContext.form.values.short_name_auto ? <IconAB size={18} /> : <IconABOff size={18} />}
								</ActionIcon>
							</Tooltip>
						)}
					/>
					<TextInput
						label={t('form.tts_name.label')}
						placeholder={t('form.tts_name.placeholder')}
						{...stopsExplorerContext.form.getInputProps('tts_name')}
						rightSection={(
							<ActionIcon color="blue" disabled={!stopsExplorerContext.form.values.tts_name} onClick={handlePlayPhoneticName} variant="subtle">
								<IconVolume size="18px" />
							</ActionIcon>
						)}
						readOnly
					/>
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<Select
						data={operationalStatusOptionsData}
						label={t('form.operational_status.label')}
						nothingFoundMessage={t('form.operational_status.nothingFound')}
						placeholder={t('form.operational_status.placeholder')}
						{...stopsExplorerContext.form.getInputProps('operational_status')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection description={t('sections.zoning.description')} title={t('sections.zoning.title')}>
				<SimpleGrid cols={1}>
					<MultiSelect label={t('form.zones.label')} placeholder={t('form.zones.placeholder')} {...stopsExplorerContext.form.getInputProps('zones')} data={allZonesDataFormatted} readOnly={stopsExplorerContext.page.is_read_only_zones} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection description={t('sections.admin.description')} title={t('sections.admin.title')}>
				<SimpleGrid cols={3}>
					<Select label={t('form.municipality.label')} placeholder={t('form.municipality.placeholder')} {...stopsExplorerContext.form.getInputProps('municipality')} data={allMunicipalitiesDataFormatted} readOnly={stopsExplorerContext.page.is_read_only_location} />
					<TextInput label={t('form.parish.label')} placeholder={t('form.parish.placeholder')} {...stopsExplorerContext.form.getInputProps('parish')} readOnly={stopsExplorerContext.page.is_read_only_location} />
					<TextInput label={t('form.locality.label')} placeholder={t('form.locality.placeholder')} {...stopsExplorerContext.form.getInputProps('locality')} readOnly={stopsExplorerContext.page.is_read_only_location} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<TextInput label={t('form.jurisdiction.label')} placeholder={t('form.jurisdiction.placeholder')} {...stopsExplorerContext.form.getInputProps('jurisdiction')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection description={t('sections.infrastructure.description')} title={t('sections.infrastructure.title')}>
				<SimpleGrid cols={3}>
					<Select
						data={hasPoleOptionsData}
						label={t('form.has_pole.label')}
						nothingFoundMessage={t('form.has_pole.nothingFound')}
						placeholder={t('form.has_pole.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_pole')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasCoverOptionsData}
						label={t('form.has_cover.label')}
						nothingFoundMessage={t('form.has_cover.nothingFound')}
						placeholder={t('form.has_cover.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_cover')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasShelterOptionsData}
						label={t('form.has_shelter.label')}
						nothingFoundMessage={t('form.has_shelter.nothingFound')}
						placeholder={t('form.has_shelter.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_shelter')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput
						label={t('form.shelter_code.label')}
						placeholder={t('form.shelter_code.placeholder')}
						{...stopsExplorerContext.form.getInputProps('shelter_code')}
						disabled={!stopsExplorerContext.form.values.has_shelter || stopsExplorerContext.form.values.has_shelter === 'UNKNOWN' || stopsExplorerContext.form.values.has_shelter === 'NO'}
						readOnly={stopsExplorerContext.page.is_read_only}
					/>
					<TextInput
						label={t('form.shelter_maintainer.label')}
						placeholder={t('form.shelter_maintainer.placeholder')}
						{...stopsExplorerContext.form.getInputProps('shelter_maintainer')}
						disabled={!stopsExplorerContext.form.values.has_shelter || stopsExplorerContext.form.values.has_shelter === 'UNKNOWN' || stopsExplorerContext.form.values.has_shelter === 'NO'}
						readOnly={stopsExplorerContext.page.is_read_only}
					/>
				</SimpleGrid>
				<SimpleGrid cols={3}>
					<Select
						data={hasMupiOptionsData}
						label={t('form.has_mupi.label')}
						nothingFoundMessage={t('form.has_mupi.nothingFound')}
						placeholder={t('form.has_mupi.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_mupi')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasBenchOptionsData}
						label={t('form.has_bench.label')}
						nothingFoundMessage={t('form.has_bench.nothingFound')}
						placeholder={t('form.has_bench.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_bench')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasTrashBinOptionsData}
						label={t('form.has_trash_bin.label')}
						nothingFoundMessage={t('form.has_trash_bin.nothingFound')}
						placeholder={t('form.has_trash_bin.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_trash_bin')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						data={hasLightingOptionsData}
						label={t('form.has_lighting.label')}
						nothingFoundMessage={t('form.has_lighting.nothingFound')}
						placeholder={t('form.has_lighting.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_lighting')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasElectricityOptionsData}
						label={t('form.has_electricity.label')}
						nothingFoundMessage={t('form.has_electricity.nothingFound')}
						placeholder={t('form.has_electricity.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_electricity')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<Select
						data={dockingBayTypeOptionsData}
						label={t('form.docking_bay_type.label')}
						nothingFoundMessage={t('form.docking_bay_type.nothingFound')}
						placeholder={t('form.docking_bay_type.placeholder')}
						{...stopsExplorerContext.form.getInputProps('docking_bay_type')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.last_infrastructure_maintenance.label')} placeholder={t('form.last_infrastructure_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_infrastructure_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
					<TextInput label={t('form.last_infrastructure_check.label')} placeholder={t('form.last_infrastructure_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_infrastructure_check')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection description={t('sections.public_info.description')} title={t('sections.public_info.title')}>
				<SimpleGrid cols={2}>
					<Select
						data={hasFlagOptionsData}
						label={t('form.has_flag.label')}
						nothingFoundMessage={t('form.has_flag.nothingFound')}
						placeholder={t('form.has_flag.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_flag')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<TextInput label={t('form.flag_maintainer.label')} placeholder={t('form.flag_maintainer.placeholder')} {...stopsExplorerContext.form.getInputProps('flag_maintainer')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<Select
						data={hasPipStaticOptionsData}
						label={t('form.has_pip_static.label')}
						nothingFoundMessage={t('form.has_pip_static.nothingFound')}
						placeholder={t('form.has_pip_static.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_pip_static')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						data={hasPipAudioOptionsData}
						label={t('form.has_pip_audio.label')}
						nothingFoundMessage={t('form.has_pip_audio.nothingFound')}
						placeholder={t('form.has_pip_audio.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_pip_audio')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<TextInput
						label={t('form.pip_audio_code.label')}
						placeholder={t('form.pip_audio_code.placeholder')}
						{...stopsExplorerContext.form.getInputProps('pip_audio_code')}
						disabled={!stopsExplorerContext.form.values.has_pip_audio || stopsExplorerContext.form.values.has_pip_audio === 'UNKNOWN' || stopsExplorerContext.form.values.has_pip_audio === 'NO'}
						readOnly={stopsExplorerContext.page.is_read_only}
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						data={hasPipRealtimeOptionsData}
						label={t('form.has_pip_realtime.label')}
						nothingFoundMessage={t('form.has_pip_realtime.nothingFound')}
						placeholder={t('form.has_pip_realtime.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_pip_realtime')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<TextInput
						label={t('form.pip_realtime_code.label')}
						placeholder={t('form.pip_realtime_code.placeholder')}
						{...stopsExplorerContext.form.getInputProps('pip_realtime_code')}
						disabled={!stopsExplorerContext.form.values.has_pip_realtime || stopsExplorerContext.form.values.has_pip_realtime === '0'}
						readOnly={stopsExplorerContext.page.is_read_only}
					/>
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<Select
						data={hasH2oaSignageOptionsData}
						label={t('form.has_h2oa_signage.label')}
						nothingFoundMessage={t('form.has_h2oa_signage.nothingFound')}
						placeholder={t('form.has_h2oa_signage.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_h2oa_signage')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						data={hasSchedulesOptionsData}
						label={t('form.has_schedules.label')}
						nothingFoundMessage={t('form.has_schedules.nothingFound')}
						placeholder={t('form.has_schedules.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_schedules')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasTactileSchedulesOptionsData}
						label={t('form.has_tactile_schedules.label')}
						nothingFoundMessage={t('form.has_tactile_schedules.nothingFound')}
						placeholder={t('form.has_tactile_schedules.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_tactile_schedules')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<Select
						data={hasNetworkMapOptionsData}
						label={t('form.has_network_map.label')}
						nothingFoundMessage={t('form.has_network_map.nothingFound')}
						placeholder={t('form.has_network_map.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_network_map')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
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

			<AppLayoutSection description={t('sections.accessibility.description')} title={t('sections.accessibility.title')}>
				<SimpleGrid cols={2}>
					<Select
						data={hasSidewalkOptionsData}
						label={t('form.has_sidewalk.label')}
						nothingFoundMessage={t('form.has_sidewalk.nothingFound')}
						placeholder={t('form.has_sidewalk.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_sidewalk')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<TextInput label={t('form.sidewalk_type.label')} placeholder={t('form.sidewalk_type.placeholder')} {...stopsExplorerContext.form.getInputProps('sidewalk_type')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={4}>
					<Select
						data={hasCrossingOptionsData}
						label={t('form.has_crossing.label')}
						nothingFoundMessage={t('form.has_crossing.nothingFound')}
						placeholder={t('form.has_crossing.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_crossing')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasFlatAccessOptionsData}
						label={t('form.has_flat_access.label')}
						nothingFoundMessage={t('form.has_flat_access.nothingFound')}
						placeholder={t('form.has_flat_access.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_flat_access')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasWideAccessOptionsData}
						label={t('form.has_wide_access.label')}
						nothingFoundMessage={t('form.has_wide_access.nothingFound')}
						placeholder={t('form.has_wide_access.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_wide_access')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={hasTactileAccessOptionsData}
						label={t('form.has_tactile_access.label')}
						nothingFoundMessage={t('form.has_tactile_access.nothingFound')}
						placeholder={t('form.has_tactile_access.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_tactile_access')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						data={hasAbusiveParkingOptionsData}
						label={t('form.has_abusive_parking.label')}
						nothingFoundMessage={t('form.has_abusive_parking.nothingFound')}
						placeholder={t('form.has_abusive_parking.placeholder')}
						{...stopsExplorerContext.form.getInputProps('has_abusive_parking')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
					<Select
						data={wheelchairBoardingOptionsData}
						label={t('form.wheelchair_boarding.label')}
						nothingFoundMessage={t('form.wheelchair_boarding.nothingFound')}
						placeholder={t('form.wheelchair_boarding.placeholder')}
						{...stopsExplorerContext.form.getInputProps('wheelchair_boarding')}
						readOnly={stopsExplorerContext.page.is_read_only}
						clearable
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.last_accessibility_maintenance.label')} placeholder={t('form.last_accessibility_maintenance.placeholder')} {...stopsExplorerContext.form.getInputProps('last_accessibility_maintenance')} readOnly={stopsExplorerContext.page.is_read_only} />
					<TextInput label={t('form.last_accessibility_check.label')} placeholder={t('form.last_accessibility_check.placeholder')} {...stopsExplorerContext.form.getInputProps('last_accessibility_check')} readOnly={stopsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection description={t('sections.services.description')} title={t('sections.services.title')}>
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

			<AppLayoutSection description={t('sections.connections.description')} title={t('sections.connections.title')}>
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

			<AppLayoutSection description={t('sections.media.description')} title={t('sections.media.title')}>
				<StopsExplorerIdPageItemMedia />
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection description={t('sections.notes.description')} title={t('sections.notes.title')}>
				<Textarea aria-label={t('form.notes.label')} maxRows={15} minRows={5} placeholder={t('form.notes.placeholder')} autosize {...stopsExplorerContext.form.getInputProps('notes')} readOnly={stopsExplorerContext.page.is_read_only} />
			</AppLayoutSection>
		</Pannel>
	);

	//
}
