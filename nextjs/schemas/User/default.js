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
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
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
      view: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      lock: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      create: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      delete: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      download: { is_allowed: false, fields: { agencies: [], export_types: [] } },
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
};

/* * */

const UserDefaultPermissions = {
  admin: {
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
      lock: { is_allowed: false },
      create: { is_allowed: false },
      delete: { is_allowed: false },
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
      view: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      lock: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      create: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      delete: { is_allowed: false, fields: { agencies: [], export_types: [] } },
      download: { is_allowed: false, fields: { agencies: [], export_types: [] } },
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
};
