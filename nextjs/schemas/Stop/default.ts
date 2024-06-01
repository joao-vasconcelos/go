/* * */

import { StopPropertyDockingBayType, StopPropertyHasAbusiveParking, StopPropertyHasBench, StopPropertyHasCover, StopPropertyHasCrossing, StopPropertyHasElectricity, StopPropertyHasFlag, StopPropertyHasFlatAccess, StopPropertyHasH2oaSignage, StopPropertyHasLighting, StopPropertyHasMupi, StopPropertyHasNetworkMap, StopPropertyHasPipAudio, StopPropertyHasPipRealtime, StopPropertyHasPipStatic, StopPropertyHasPole, StopPropertyHasSchedules, StopPropertyHasShelter, StopPropertyHasSidewalk, StopPropertyHasTactileAccess, StopPropertyHasTactileSchedules, StopPropertyHasTrashBin, StopPropertyHasWideAccess, StopPropertyOperationalStatus, StopPropertyWheelchairBoarding } from '@/schemas/Stop/options';

/* * */

export const StopDefault = {

	/*
   * GENERAL
   */

	code: '',
	docking_bay_type: StopPropertyDockingBayType.Unknown,
	flag_maintainer: '',
	has_abusive_parking: StopPropertyHasAbusiveParking.Unknown,
	has_bench: StopPropertyHasBench.Unknown,
	has_cover: StopPropertyHasCover.Unknown,
	has_crossing: StopPropertyHasCrossing.Unknown,
	has_electricity: StopPropertyHasElectricity.Unknown,
	has_flag: StopPropertyHasFlag.Unknown,
	has_flat_access: StopPropertyHasFlatAccess.Unknown,

	/*
	* OPERATION
	*/

	has_h2oa_signage: StopPropertyHasH2oaSignage.Unknown,
	has_lighting: StopPropertyHasLighting.Unknown,

	/*
   * ADMINISTRATIVE
   */

	has_mupi: StopPropertyHasMupi.Unknown,
	has_network_map: StopPropertyHasNetworkMap.Unknown,
	has_pip_audio: StopPropertyHasPipAudio.Unknown,
	has_pip_realtime: StopPropertyHasPipRealtime.Unknown,

	/*
   * INFRASTRUCTURE
   */

	has_pip_static: StopPropertyHasPipStatic.Unknown,
	has_pole: StopPropertyHasPole.Unknown,
	has_schedules: StopPropertyHasSchedules.Unknown,
	has_shelter: StopPropertyHasShelter.Unknown,
	has_sidewalk: StopPropertyHasSidewalk.Unknown,
	has_tactile_access: StopPropertyHasTactileAccess.Unknown,
	has_tactile_schedules: StopPropertyHasTactileSchedules.Unknown,
	has_trash_bin: StopPropertyHasTrashBin.Unknown,
	has_wide_access: StopPropertyHasWideAccess.Unknown,
	is_locked: false,
	jurisdiction: '',
	last_accessibility_check: '',
	last_accessibility_maintenance: '',

	/*
   * PUBLIC INFORMATION
   */

	last_flag_check: '',
	last_flag_maintenance: '',
	last_infrastructure_check: null,
	last_infrastructure_maintenance: null,
	last_schedules_check: '',
	last_schedules_maintenance: '',
	latitude: 0,
	locality: '',
	longitude: 0,
	media: [],
	municipality: null,
	name: '',
	name_new: '',
	near_airport: false,
	near_beach: false,

	/*
   * ACCESSIBILITY
   */

	near_bike_parking: false,
	near_bike_sharing: false,
	near_boat: false,
	near_car_parking: false,
	near_fire_station: false,
	near_health_clinic: false,
	near_historic_building: false,
	near_hospital: false,
	near_light_rail: false,
	near_police_station: false,

	/*
   * SERVICES
   */

	near_school: false,
	near_shopping: false,
	near_subway: false,
	near_train: false,
	near_transit_office: false,
	near_university: false,
	notes: '',
	operational_status: StopPropertyOperationalStatus.Active,
	parent_station: '',
	parish: '',

	/*
   * CONNECTIONS
   */

	pip_audio_code: '',
	pip_realtime_code: '',
	platform_code: '',
	shelter_code: '',
	shelter_maintainer: '',
	short_name: '',
	short_name_auto: true,
	sidewalk_type: '',

	/*
   * MEDIA
   */

	tts_name: '',

	/*
   * USER NOTES
   */

	wheelchair_boarding: StopPropertyWheelchairBoarding.Unknown,

	/*
   * LOCK STATUS
   */

	zones: [],

	//
};
