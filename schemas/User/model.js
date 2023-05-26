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
    agencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
      },
    ],
    municipalities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Municipalities',
      },
    ],
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
        export: {
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
      // ALERTS
      alerts_view: {
        type: Boolean,
      },
      alerts_create: {
        type: Boolean,
      },
      alerts_edit: {
        type: Boolean,
      },
      alerts_delete: {
        type: Boolean,
      },
      //
      // CALENDARS
      calendars_view: {
        type: Boolean,
      },
      calendars_create: {
        type: Boolean,
      },
      calendars_edit: {
        type: Boolean,
      },
      calendars_delete: {
        type: Boolean,
      },
      //
      // DATES
      dates_view: {
        type: Boolean,
      },
      dates_create: {
        type: Boolean,
      },
      dates_edit: {
        type: Boolean,
      },
      dates_delete: {
        type: Boolean,
      },
      //
      // FARES
      fares_view: {
        type: Boolean,
      },
      fares_create: {
        type: Boolean,
      },
      fares_edit: {
        type: Boolean,
      },
      fares_delete: {
        type: Boolean,
      },
      //
      // LINES
      lines_view: {
        type: Boolean,
      },
      lines_create: {
        type: Boolean,
      },
      lines_edit: {
        type: Boolean,
      },
      lines_delete: {
        type: Boolean,
      },
      //
      // MUNICIPALITIES
      municipalities_view: {
        type: Boolean,
      },
      municipalities_create: {
        type: Boolean,
      },
      municipalities_edit: {
        type: Boolean,
      },
      municipalities_delete: {
        type: Boolean,
      },
      //
      // SHAPES
      shapes_view: {
        type: Boolean,
      },
      shapes_create: {
        type: Boolean,
      },
      shapes_edit: {
        type: Boolean,
      },
      shapes_delete: {
        type: Boolean,
      },
      //
      // STOPS
      stops_view: {
        type: Boolean,
      },
      stops_create: {
        type: Boolean,
      },
      stops_edit: {
        type: Boolean,
      },
      stops_delete: {
        type: Boolean,
      },
      //
      // THREADS
      threads_view: {
        type: Boolean,
      },
      threads_create: {
        type: Boolean,
      },
      threads_edit: {
        type: Boolean,
      },
      threads_delete: {
        type: Boolean,
      },
    },
  },
  { timestamps: true }
);

/* * */
/* B. Mongoose Model */
export const Model = mongoose?.models?.User || mongoose.model('User', Schema);
