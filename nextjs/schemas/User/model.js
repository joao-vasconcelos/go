/* * */

import mongoose from 'mongoose';

/* * */

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      maxlength: 50,
      unique: true,
    },
    phone: {
      type: String,
      maxlength: 50,
    },
    last_active: {
      type: Date,
    },
    permissions: {
      //
      alerts: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      reporting: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      audits: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      feedback: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      issues: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      stops: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        edit_code: { is_allowed: { type: Boolean } },
        edit_name: { is_allowed: { type: Boolean } },
        edit_location: { is_allowed: { type: Boolean } },
        edit_zones: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        export: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      calendars: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
        edit_dates: { is_allowed: { type: Boolean } },
      },
      //
      lines: {
        view: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        edit: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        lock: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      exports: {
        view: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }], export_types: [{ type: String }] } },
        lock: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }], export_types: [{ type: String }] } },
        create: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }], export_types: [{ type: String }] } },
        delete: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }], export_types: [{ type: String }] } },
        download: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }], export_types: [{ type: String }] } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      archives: {
        view: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        download: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      municipalities: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      zones: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      fares: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      typologies: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      agencies: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      tags: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      media: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      users: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
        navigate: { is_allowed: { type: Boolean } },
      },
      //
      configs: {
        admin: { is_allowed: { type: Boolean } },
      },
      //
    },
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */

export const UserModel = mongoose?.models?.User || mongoose.model('User', UserSchema);
