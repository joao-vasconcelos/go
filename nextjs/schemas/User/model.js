import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: USER */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
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
      // AGENCIES
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
      // EXPORTS
      exports: {
        view: {
          type: Boolean,
        },
        gtfs_v18: {
          type: Boolean,
        },
        gtfs_v29: {
          type: Boolean,
        },
        gtfs_v30: {
          type: Boolean,
        },
        netex_v1: {
          type: Boolean,
        },
        agencies: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Agency',
          },
        ],
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
      // LINES
      lines: {
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
        agencies: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Agency',
          },
        ],
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
/* B. Mongoose Model */
export const UserModel = mongoose?.models?.User || mongoose.model('User', UserSchema);
