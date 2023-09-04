/* * */
/* DOCUMENT TYPE: USER */
/* Explanation needed. */
/* * */

/* * */
/* A. Default Values */
export const UserDefault = {
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
      lock: false,
      delete: false,
    },
    // EXPORTS
    exports: {
      view: false,
      gtfs_v18: false,
      gtfs_v29: false,
      gtfs_v30: false,
      netex_v1: false,
      agencies: [],
    },
    // USERS
    users: {
      view: false,
      create_edit: false,
      delete: false,
    },
    // USERS
    lines: {
      view: false,
      create_edit: false,
      lock: false,
      delete: false,
      agencies: [],
    },
    // TYPOLOGIES
    typologies: {
      view: false,
      create_edit: false,
      lock: false,
      delete: false,
    },
    // FARES
    fares: {
      view: false,
      create_edit: false,
      lock: false,
      delete: false,
    },
    // ZONES
    zones: {
      view: false,
      create_edit: false,
      lock: false,
      delete: false,
    },
    // STOPS
    stops: {
      view: false,
      propose: false,
      create_edit: false,
      edit_code: false,
      lock: false,
      delete: false,
      batch_update: false,
      municipalities: [],
    },
    // MUNICIPALITIES
    municipalities: {
      view: false,
      create_edit: false,
      lock: false,
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
      lock: false,
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
    // CONFIGS
    configs: {
      admin: false,
    },
  },
};
