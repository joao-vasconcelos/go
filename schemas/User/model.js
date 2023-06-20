import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: USER */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
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
        delete: {
          type: Boolean,
        },
      },
      //
      // EXPORT
      export: {
        view: {
          type: Boolean,
        },
        gtfs_v18: {
          type: Boolean,
        },
        gtfs_v29: {
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
        export: {
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
      // FARES
      fares: {
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
      // ZONES
      zones: {
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
        delete: {
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
      // SHAPES
      shapes: {
        view: {
          type: Boolean,
        },
        create_edit: {
          type: Boolean,
        },
        bulk_import: {
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
    },
  },
  { timestamps: true }
);

/* * */
/* B. Mongoose Model */
export const Model = mongoose?.models?.User || mongoose.model('User', Schema);
