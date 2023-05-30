/* * */
/* DOCUMENT TYPE: USER */
/* Explanation needed. */
/* * */

/* * */
/* A. Default Values */
export const Default = {
  name: '',
  email: '',
  phone: '',
  emailVerified: '',
  last_active: '',
  permissions: {
    // AGENCIES
    agencies: {
      view: false,
      create_edit: false,
      delete: false,
    },
    // EXPORT
    export: {
      view: false,
      v18: false,
      v29: false,
      agencies: [],
    },
    // USERS
    users: {
      view: false,
      create_edit: false,
      delete: false,
      export: false,
    },
    // USERS
    lines: {
      view: false,
      create_edit: false,
      delete: false,
      agencies: [],
    },
    // ALERTS
    alerts_view: false,
    alerts_create: false,
    alerts_edit: false,
    alerts_delete: false,
    // CALENDARS
    calendars_view: false,
    calendars_create: false,
    calendars_edit: false,
    calendars_delete: false,
    // DATES
    dates_view: false,
    dates_create: false,
    dates_edit: false,
    dates_delete: false,
    // FARES
    fares_view: false,
    fares_create: false,
    fares_edit: false,
    fares_delete: false,
    // LINES
    lines_view: false,
    lines_create: false,
    lines_edit: false,
    lines_delete: false,
    // MUNICIPALITIES
    municipalities_view: false,
    municipalities_create: false,
    municipalities_edit: false,
    municipalities_delete: false,
    // SHAPES
    shapes_view: false,
    shapes_create: false,
    shapes_edit: false,
    shapes_delete: false,
    // STOPS
    stops_view: false,
    stops_create: false,
    stops_edit: false,
    stops_delete: false,
    // THREADS
    threads_view: false,
    threads_create: false,
    threads_edit: false,
    threads_delete: false,
  },
};
