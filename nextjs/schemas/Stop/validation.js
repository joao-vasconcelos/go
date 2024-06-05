/* eslint-disable perfectionist/sort-objects */

/* * */

import { StopOptions } from '@/schemas/Stop/options';
import * as yup from 'yup';

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
	short_name: yup
		.string()
		.max(StopOptions.max_stop_short_name_length)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	short_name_auto: yup.boolean(),
	tts_name: yup
		.string()
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)
		.required(),
	latitude: yup.number().required(),
	longitude: yup.number().required(),
	platform_code: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	parent_station: yup
		.string()
		.max(6)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	operational_status: yup.string().max(25),

	/*
	 * OPERATION
   */

	zones: yup.array(),

	/*
	 * ADMINISTRATIVE
   */

	municipality: yup.string().max(100),
	parish_code: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	parish_name: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	locality: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),
	jurisdiction: yup
		.string()
		.max(100)
		.transform(value => value.length > 0 ? value.replace(/  +/g, ' ').trim() : value),

	/*
	 * INFRASTRUCTURE
   */

	has_pole: yup.string().max(50),
	has_cover: yup.string().max(50),
	has_shelter: yup.string().max(50),
	shelter_code: yup.string().max(100),
	shelter_maintainer: yup.string().max(100),
	has_mupi: yup.string().max(50),
	has_bench: yup.string().max(50),
	has_trash_bin: yup.string().max(50),
	has_lighting: yup.string().max(50),
	has_electricity: yup.string().max(50),
	docking_bay_type: yup.string().max(50),
	last_infrastructure_maintenance: yup.string().max(100).nullable(),
	last_infrastructure_check: yup.string().max(100).nullable(),

	/*
	 * PUBLIC INFORMATION
   */

	has_flag: yup.string().max(50),
	flag_maintainer: yup.string().max(100),
	has_pip_static: yup.string().max(50),
	has_pip_audio: yup.string().max(50),
	pip_audio_code: yup.string().max(100),
	has_pip_realtime: yup.string().max(50),
	pip_realtime_code: yup.string().max(100),
	has_h2oa_signage: yup.string().max(50),
	has_schedules: yup.string().max(50),
	has_tactile_schedules: yup.string().max(50),
	has_network_map: yup.string().max(50),
	last_schedules_maintenance: yup.string().max(100).nullable(),
	last_schedules_check: yup.string().max(100).nullable(),
	last_flag_maintenance: yup.string().max(100).nullable(),
	last_flag_check: yup.string().max(100).nullable(),

	/*
	* ACCESSIBILITY
	*/

	has_sidewalk: yup.string().max(50),
	sidewalk_type: yup.string().max(100),
	stop_access_type: yup.string().max(100),
	has_crossing: yup.string().max(50),
	has_tactile_access: yup.string().max(50),
	has_abusive_parking: yup.string().max(50),
	has_audio_stop_info: yup.string().max(50),
	wheelchair_boarding: yup.string().max(100),
	last_accessibility_maintenance: yup.string().max(100).nullable(),
	last_accessibility_check: yup.string().max(100).nullable(),

	/*
	 * SERVICES
   */

	near_health_clinic: yup.boolean(),
	near_hospital: yup.boolean(),
	near_university: yup.boolean(),
	near_school: yup.boolean(),
	near_police_station: yup.boolean(),
	near_fire_station: yup.boolean(),
	near_shopping: yup.boolean(),
	near_historic_building: yup.boolean(),
	near_transit_office: yup.boolean(),

	/*
	 * CONNECTIONS
   */

	near_subway: yup.boolean(),
	near_light_rail: yup.boolean(),
	near_train: yup.boolean(),
	near_boat: yup.boolean(),
	near_airport: yup.boolean(),
	near_bike_sharing: yup.boolean(),
	near_bike_parking: yup.boolean(),
	near_car_parking: yup.boolean(),

	/*
   * MEDIA
   */

	media: yup.array(),

	/*
   * USER NOTES
   */

	notes: yup.string().max(10000),

	/*
   * LOCK STATUS
   */

	is_locked: yup.boolean(),

	//
});
