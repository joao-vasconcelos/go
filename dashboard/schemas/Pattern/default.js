/* * */
/* DOCUMENT TYPE: PATTERN */
/* Explanation needed. */
/* * */

/* * */
/* A. Default Pattern Values */

export const PatternDefault = {
  code: '',
  parent_route: null,
  direction: null,
  headsign: '',
  shape: null,
  path: [],
  schedules: [],
};

/* * */
/* B. Default Pattern Shape Values */

export const PatternShapeDefault = {
  extension: 0,
  points: [],
  geojson: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
  },
};

/* * */
/* C. Default Pattern Path Values */

export const PatternPathDefault = {
  stop: null,
  allow_pickup: true,
  allow_drop_off: true,
  distance_delta: 0,
  default_velocity: 20,
  default_travel_time: 0,
  default_dwell_time: 30,
  zones: [],
};

/* * */
/* D. Default Pattern Schedule Values */

export const PatternScheduleDefault = {
  calendars_on: [],
  calendars_off: [],
  start_time: '',
  calendar_desc: '',
  vehicle_features: {
    type: 0,
    propulsion: 0,
    allow_bicycles: true,
    passenger_counting: true,
    video_surveillance: true,
  },
  path_overrides: [],
};
