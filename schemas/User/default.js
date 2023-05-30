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
    // FARES
    fares: {
      view: false,
      create_edit: false,
      delete: false,
    },
    // STOPS
    stops: {
      view: false,
      propose: false,
      create_edit: false,
      edit_code: false,
      delete: false,
      municipalities: [],
    },
    // MUNICIPALITIES
    municipalities: {
      view: false,
      create_edit: false,
      delete: false,
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
    // SHAPES
    shapes_view: false,
    shapes_create: false,
    shapes_edit: false,
    shapes_delete: false,
    // THREADS
    threads_view: false,
    threads_create: false,
    threads_edit: false,
    threads_delete: false,
  },
};
