/* * */

import * as yup from 'yup';
import { StopOptions } from './options';

/* * */

export const StopValidation = yup.object({
  //
  // General
  code: yup
    .string()
    .min(6)
    .max(6)
    .matches(/^[0-9]+$/)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value))
    .required(),
  name: yup
    .string()
    .min(StopOptions.min_stop_name_length)
    .max(StopOptions.max_stop_name_length)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value))
    .required(),
  short_name: yup
    .string()
    .max(StopOptions.max_stop_short_name_length)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value))
    .required(),
  tts_name: yup
    .string()
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value))
    .required(),
  latitude: yup.number().required(),
  longitude: yup.number().required(),
  platform_code: yup
    .string()
    .max(100)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)),
  parent_station: yup
    .string()
    .max(100)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)),
  current_status: yup.string().max(2),

  // Operation
  zones: yup.array(),

  // Administrative
  jurisdiction: yup
    .string()
    .max(100)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)),
  municipality: yup
    .string()
    .max(100)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)),
  parish: yup
    .string()
    .max(100)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)),
  locality: yup
    .string()
    .max(100)
    .transform((value) => (value.length > 0 ? value.replace(/  +/g, ' ').trim() : value)),

  // Infrastructure
  has_pole: yup.string().max(2).nullable(),
  pole_material: yup.string().max(100),
  has_shelter: yup.string().max(2).nullable(),
  shelter_code: yup.string().max(100),
  shelter_maintainer: yup.string().max(100),
  has_mupi: yup.string().max(2).nullable(),
  has_bench: yup.string().max(2).nullable(),
  has_trash_bin: yup.string().max(2).nullable(),
  has_lighting: yup.string().max(2).nullable(),
  has_electricity: yup.string().max(2).nullable(),
  docking_bay_type: yup.string().max(100),
  last_infrastructure_maintenance: yup.string().max(100).nullable(),
  last_infrastructure_check: yup.string().max(100).nullable(),

  // Public Information
  has_stop_sign: yup.string().max(2).nullable(),
  stop_sign_maintainer: yup.string().max(100),
  has_pole_frame: yup.string().max(2).nullable(),
  shelter_frame_area_cm: yup.string().max(100),
  has_pip_real_time: yup.string().max(2).nullable(),
  pip_real_time_code: yup.string().max(100),
  has_h2oa_signage: yup.string().max(2).nullable(),
  has_schedules: yup.string().max(2).nullable(),
  has_network_map: yup.string().max(2).nullable(),
  last_schedules_maintenance: yup.string().max(100).nullable(),
  last_schedules_check: yup.string().max(100).nullable(),
  last_stop_sign_maintenance: yup.string().max(100).nullable(),
  last_stop_sign_check: yup.string().max(100).nullable(),

  // Accessibility
  has_sidewalk: yup.string().max(2).nullable(),
  sidewalk_type: yup.string().max(100),
  has_tactile_schedules: yup.string().max(2).nullable(),
  stop_access_type: yup.string().max(100),
  has_crosswalk: yup.string().max(2).nullable(),
  has_tactile_pavement: yup.string().max(2).nullable(),
  has_abusive_parking: yup.string().max(2).nullable(),
  has_audio_stop_info: yup.string().max(2).nullable(),
  wheelchair_boarding: yup.string().max(100),
  last_accessibility_check: yup.string().max(100).nullable(),

  // Services
  near_health_clinic: yup.boolean(),
  near_hospital: yup.boolean(),
  near_university: yup.boolean(),
  near_school: yup.boolean(),
  near_police_station: yup.boolean(),
  near_fire_station: yup.boolean(),
  near_shopping: yup.boolean(),
  near_historic_building: yup.boolean(),
  near_transit_office: yup.boolean(),

  // Intermodal Connections
  near_light_rail: yup.boolean(),
  near_subway: yup.boolean(),
  near_train: yup.boolean(),
  near_boat: yup.boolean(),
  near_airport: yup.boolean(),
  near_bike_sharing: yup.boolean(),
  near_bike_parking: yup.boolean(),
  near_car_parking: yup.boolean(),

  // Notes
  notes: yup.string().max(10000),

  //
});
