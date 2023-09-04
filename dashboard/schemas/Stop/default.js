/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. Default Values */
export const Default = {
  //
  // General
  code: '',
  name: '',
  short_name: '',
  tts_name: '',
  latitude: 0,
  longitude: 0,
  location_type: '',
  platform_code: '',
  parent_station: '',
  url: '',
  public_visible: true,

  // Operation
  zones: [],
  agencies: [],

  // Administrative
  address: '',
  postal_code: '',
  jurisdiction: '',
  municipality: null,
  parish: '',
  locality: '',

  // Infrastructure
  has_pole: 0,
  pole_material: '',
  has_shelter: 0,
  shelter_code: '',
  shelter_maintainer: '',
  has_mupi: 0,
  has_bench: 0,
  has_trash_bin: 0,
  has_lighting: 0,
  has_electricity: 0,
  docking_bay_type: '',
  last_infrastructure_maintenance: '',
  last_infrastructure_check: '',

  // Public Information
  has_stop_sign: '',
  stop_sign_maintainer: '',
  has_pole_frame: '',
  shelter_frame_area_cm: '',
  has_pip_real_time: '',
  pip_real_time_code: '',
  has_h2oa_signage: '',
  has_schedules: '',
  has_network_map: '',
  last_schedules_maintenance: '',
  last_schedules_check: '',
  last_stop_sign_maintenance: '',
  last_stop_sign_check: '',

  // Accessibility
  has_sidewalk: '',
  sidewalk_type: '',
  has_tactile_schedules: '',
  stop_access_type: '',
  has_crosswalk: '',
  has_tactile_pavement: '',
  has_abusive_parking: '',
  has_audio_stop_info: '',
  wheelchair_boarding: '',
  last_accessibility_check: '',

  // Services
  near_health_clinic: false,
  near_hospital: false,
  near_university: false,
  near_school: false,
  near_police_station: false,
  near_fire_station: false,
  near_shopping: false,
  near_historic_building: false,
  near_transit_office: false,

  // Intermodal Connections
  near_subway: false,
  near_light_rail: false,
  near_train: false,
  near_boat: false,
  near_airport: false,
  near_bike_sharing: false,
  near_bike_parking: false,
  near_car_parking: false,

  // Notes
  notes: '',

  // Lock
  is_locked: false,

  //
};
