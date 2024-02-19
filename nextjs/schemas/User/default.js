/* * */

export const UserDefault = {
  name: '',
  email: '',
  phone: '',
  emailVerified: '',
  last_active: '',
  permissions: {
    //
    tags: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    exports: {
      view: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      lock: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      create: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      delete: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      download: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      navigate: { is_allowed: false },
    },
    //
    lines: {
      view: { is_allowed: false, fields: { agencies: [] } },
      edit: { is_allowed: false, fields: { agencies: [] } },
      lock: { is_allowed: false, fields: { agencies: [] } },
      create: { is_allowed: false, fields: { agencies: [] } },
      delete: { is_allowed: false, fields: { agencies: [] } },
      navigate: { is_allowed: false },
    },
    //
    issues: {
      view: false,
      create_edit: false,
      lock: false,
      delete: false,
    },
    //
    agencies: {
      view: false,
      create_edit: false,
      lock: false,
      delete: false,
    },
    //
    users: {
      view: false,
      create_edit: false,
      delete: false,
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
