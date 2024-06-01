/* * */

import * as yup from 'yup';

import { StopOptions } from './options';

/* * */

export const StopValidation = yup.object({

	/*
   * GENERAL
   */

	code: yup
		.string()
		.min(6)
		.max(6)
		.matches(/^[0-9]+$/)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)
		.required(),
	docking_bay_type: yup.string().max(50),
	flag_maintainer: yup.string().max(100),
	has_abusive_parking: yup.string().max(50),
	has_audio_stop_info: yup.string().max(50),
	has_bench: yup.string().max(50),
	has_cover: yup.string().max(50),
	has_crossing: yup.string().max(50),
	has_electricity: yup.string().max(50),
	has_flag: yup.string().max(50),
	has_h2oa_signage: yup.string().max(50),

	/*
	 * OPERATION
   */

	has_lighting: yup.string().max(50),

	/*
	 * ADMINISTRATIVE
   */

	has_mupi: yup.string().max(50),
	has_network_map: yup.string().max(50),
	has_pip_audio: yup.string().max(50),
	has_pip_realtime: yup.string().max(50),
	has_pip_static: yup.string().max(50),

	/*
	 * INFRASTRUCTURE
   */

	has_pole: yup.string().max(50),
	has_schedules: yup.string().max(50),
	has_shelter: yup.string().max(50),
	has_sidewalk: yup.string().max(50),
	has_tactile_access: yup.string().max(50),
	has_tactile_schedules: yup.string().max(50),
	has_trash_bin: yup.string().max(50),
	is_locked: yup.boolean(),
	jurisdiction: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	last_accessibility_check: yup.string().max(100).nullable(),
	last_accessibility_maintenance: yup.string().max(100).nullable(),
	last_flag_check: yup.string().max(100).nullable(),
	last_flag_maintenance: yup.string().max(100).nullable(),

	/*
	 * PUBLIC INFORMATION
   */

	last_infrastructure_check: yup.string().max(100).nullable(),
	last_infrastructure_maintenance: yup.string().max(100).nullable(),
	last_schedules_check: yup.string().max(100).nullable(),
	last_schedules_maintenance: yup.string().max(100).nullable(),
	latitude: yup.number().required(),
	locality: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	longitude: yup.number().required(),
	media: yup.array(),
	municipality: yup.string().max(100),
	name: yup
		.string()
		.min(StopOptions.min_stop_name_length)
		.max(StopOptions.max_stop_name_length)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)
		.required(),
	name_new: yup
		.string()
		.max(StopOptions.max_stop_name_length)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	near_airport: yup.boolean(),
	near_bike_parking: yup.boolean(),
	near_bike_sharing: yup.boolean(),
	near_boat: yup.boolean(),

	/*
	* ACCESSIBILITY
	*/

	near_car_parking: yup.boolean(),
	near_fire_station: yup.boolean(),
	near_health_clinic: yup.boolean(),
	near_historic_building: yup.boolean(),
	near_hospital: yup.boolean(),
	near_light_rail: yup.boolean(),
	near_police_station: yup.boolean(),
	near_school: yup.boolean(),
	near_shopping: yup.boolean(),
	near_subway: yup.boolean(),

	/*
	 * SERVICES
   */

	near_train: yup.boolean(),
	near_transit_office: yup.boolean(),
	near_university: yup.boolean(),
	notes: yup.string().max(10000),
	operational_status: yup.string().max(25),
	parent_station: yup
		.string()
		.max(6)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	parish_code: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	parish_name: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	pip_audio_code: yup.string().max(100),

	/*
	 * CONNECTIONS
   */

	pip_realtime_code: yup.string().max(100),
	platform_code: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	shelter_code: yup.string().max(100),
	shelter_maintainer: yup.string().max(100),
	short_name: yup
		.string()
		.max(StopOptions.max_stop_short_name_length)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	short_name_auto: yup.boolean(),
	sidewalk_type: yup.string().max(100),
	stop_access_type: yup.string().max(100),

	/*
   * MEDIA
   */

	tts_name: yup
		.string()
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)
		.required(),

	/*
   * USER NOTES
   */

	wheelchair_boarding: yup.string().max(100),

	/*
   * LOCK STATUS
   */

	zones: yup.array(),

	//
});
