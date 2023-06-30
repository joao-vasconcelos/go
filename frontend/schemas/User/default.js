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
    // TYPOLOGIES
    typologies: {
      view: false,
      create_edit: false,
      delete: false,
    },
    // FARES
    fares: {
      view: false,
      create_edit: false,
      delete: false,
    },
    // ZONES
    zones: {
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
    alerts: {
      view: false,
      create_edit: false,
      publish: false,
      delete: false,
    },
    // CALENDARS
    calendars: {
      view: false,
      create_edit: false,
      delete: false,
    },
    // DATES
    dates: {
      view: false,
      create_edit: false,
      delete: false,
    },
    // THREADS
    threads: {
      view: false,
      create_edit: false,
      delete: false,
    },
  },
};
