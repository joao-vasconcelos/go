/* * */

export const UserDefault = {
  name: '',
  email: '',
  phone: '',
  emailVerified: '',
  last_active: '',
  permissions: {
    //
    alerts: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    reporting: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    audits: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    feedback: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    issues: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    stops: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      edit_code: { is_allowed: false },
      edit_name: { is_allowed: false },
      edit_location: { is_allowed: false },
      edit_zones: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      export: { is_allowed: false },
      export_deleted: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    calendars: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
      edit_dates: { is_allowed: false },
      export_dates: { is_allowed: false },
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
    exports: {
      view: { is_allowed: false, fields: { agency: [], kind: [] } },
      lock: { is_allowed: false, fields: { agency: [], kind: [] } },
      create: { is_allowed: false, fields: { agency: [], kind: [] } },
      delete: { is_allowed: false, fields: { agency: [], kind: [] } },
      download: { is_allowed: false, fields: { agency: [], kind: [] } },
      navigate: { is_allowed: false },
    },
    //
    archives: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      download: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    municipalities: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    zones: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    fares: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    typologies: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    agencies: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
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
    media: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    users: {
      view: { is_allowed: false },
      edit: { is_allowed: false },
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
      navigate: { is_allowed: false },
    },
    //
    configs: {
      admin: { is_allowed: false },
    },
    //
  },
  is_locked: false,
};
