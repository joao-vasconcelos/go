/* * */
/* DOCUMENT TYPE: PATTERN */
/* Explanation needed. */
/* * */

/* * */
/* A. Default Values */
export const Default = {
  code: '',
  parent_route: null,
  direction: null,
  headsign: '',
  shape: null,
  path: [
    {
      stop: null,
      allow_pickup: true,
      allow_drop_off: true,
      distance_delta: 0,
      default_velocity: 20,
      default_travel_time: 0,
      default_dwell_time: 30,
      apex: [],
    },
  ],
  schedules: [
    {
      calendars_on: [],
      calendars_off: [],
      start_time: '',
      path_overrides: [],
    },
  ],
};
