/* * */

import { StopPropertyDockingBayType, StopPropertyHasAbusiveParking, StopPropertyHasBench, StopPropertyHasCover, StopPropertyHasCrossing, StopPropertyHasElectricity, StopPropertyHasFlag, StopPropertyHasFlatAccess, StopPropertyHasH2oaSignage, StopPropertyHasLighting, StopPropertyHasMupi, StopPropertyHasNetworkMap, StopPropertyHasPipAudio, StopPropertyHasPipRealtime, StopPropertyHasPipStatic, StopPropertyHasPole, StopPropertyHasSchedules, StopPropertyHasShelter, StopPropertyHasSidewalk, StopPropertyHasTactileAccess, StopPropertyHasTactileSchedules, StopPropertyHasTrashBin, StopPropertyHasWideAccess, StopPropertyOperationalStatus, StopPropertyWheelchairBoarding } from '@/schemas/Stop/options';

/* * */

export const StopDefault = {

	/*
   * GENERAL
   */

	code: '',
	name: '',
	name_new: '',
	short_name: '',
	short_name_auto: true,
	tts_name: '',
	latitude: 0,
	longitude: 0,
	platform_code: '',
	parent_station: '',

	/*
	* OPERATION
	*/

	operational_status: StopPropertyOperationalStatus.Active,
	zones: [],

	/*
   * ADMINISTRATIVE
   */

	municipality: null,
	parish: '',
	locality: '',
	jurisdiction: '',

	/*
   * INFRASTRUCTURE
   */

	has_pole: StopPropertyHasPole.Unknown,
	has_cover: StopPropertyHasCover.Unknown,
	has_shelter: StopPropertyHasShelter.Unknown,
	shelter_code: '',
	shelter_maintainer: '',
	has_mupi: StopPropertyHasMupi.Unknown,
	has_bench: StopPropertyHasBench.Unknown,
	has_trash_bin: StopPropertyHasTrashBin.Unknown,
	has_lighting: StopPropertyHasLighting.Unknown,
	has_electricity: StopPropertyHasElectricity.Unknown,
	docking_bay_type: StopPropertyDockingBayType.Unknown,
	last_infrastructure_maintenance: null,
	last_infrastructure_check: null,

	/*
   * PUBLIC INFORMATION
   */

	has_flag: StopPropertyHasFlag.Unknown,
	flag_maintainer: '',
	has_pip_static: StopPropertyHasPipStatic.Unknown,
	has_pip_audio: StopPropertyHasPipAudio.Unknown,
	pip_audio_code: '',
	has_pip_realtime: StopPropertyHasPipRealtime.Unknown,
	pip_realtime_code: '',
	has_h2oa_signage: StopPropertyHasH2oaSignage.Unknown,
	has_schedules: StopPropertyHasSchedules.Unknown,
	has_tactile_schedules: StopPropertyHasTactileSchedules.Unknown,
	has_network_map: StopPropertyHasNetworkMap.Unknown,
	last_schedules_maintenance: '',
	last_schedules_check: '',
	last_flag_maintenance: '',
	last_flag_check: '',

	/*
   * ACCESSIBILITY
   */

	has_sidewalk: StopPropertyHasSidewalk.Unknown,
	sidewalk_type: '',
	has_crossing: StopPropertyHasCrossing.Unknown,
	has_flat_access: StopPropertyHasFlatAccess.Unknown,
	has_wide_access: StopPropertyHasWideAccess.Unknown,
	has_tactile_access: StopPropertyHasTactileAccess.Unknown,
	has_abusive_parking: StopPropertyHasAbusiveParking.Unknown,
	wheelchair_boarding: StopPropertyWheelchairBoarding.Unknown,
	last_accessibility_maintenance: '',
	last_accessibility_check: '',

	/*
   * SERVICES
   */

	near_health_clinic: false,
	near_hospital: false,
	near_university: false,
	near_school: false,
	near_police_station: false,
	near_fire_station: false,
	near_shopping: false,
	near_historic_building: false,
	near_transit_office: false,
	near_beach: false,

	/*
   * CONNECTIONS
   */

	near_subway: false,
	near_light_rail: false,
	near_train: false,
	near_boat: false,
	near_airport: false,
	near_bike_sharing: false,
	near_bike_parking: false,
	near_car_parking: false,

	/*
   * MEDIA
   */

	media: [],

	/*
   * USER NOTES
   */

	notes: '',

	/*
   * LOCK STATUS
   */

	is_locked: false,

	//
};