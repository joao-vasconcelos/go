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
      tags: {
        view: { is_allowed: { type: Boolean } },
        edit: { is_allowed: { type: Boolean } },
        lock: { is_allowed: { type: Boolean } },
        create: { is_allowed: { type: Boolean } },
        delete: { is_allowed: { type: Boolean } },
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
      lines: {
        view: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        edit: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        lock: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        create: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        delete: { is_allowed: { type: Boolean }, fields: { agencies: [{ type: String }] } },
        navigate: { is_allowed: { type: Boolean } },
      },

      // --------

      //
      issues: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        lock: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      agencies: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        lock: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // USERS
      users: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },

      //
      // TYPOLOGIES
      typologies: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        lock: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // FARES
      fares: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        lock: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // ZONES
      zones: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        lock: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // STOPS
      stops: {
        view: {
          type: Boolean,
        },
        propose: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        edit_code: {
          type: Boolean,
        },
        lock: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
        batch_update: {
          type: Boolean,
        },
        municipalities: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Municipality',
          },
        ],
      },
      //
      // MUNICIPALITIES
      municipalities: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        lock: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // ALERTS
      alerts: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        publish: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // CALENDARS
      calendars: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        lock: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // DATES
      dates: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // THREADS
      threads: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
      //
      // CONFIGS
      configs: {
        admin: {
          type: Boolean,
        },
      },
    },
  },
  { timestamps: true }
);

/* * */

export const UserModel = mongoose?.models?.User || mongoose.model('User', UserSchema);
