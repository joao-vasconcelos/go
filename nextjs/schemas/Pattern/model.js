import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: PATTERN */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 25,
      unique: true,
    },
    parent_route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    direction: {
      type: Number,
    },
    headsign: {
      type: String,
      maxlength: 50,
    },
    shape: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shape',
      unique: true,
    },
    path: [
      {
        stop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Stop',
        },
        allow_pickup: {
          type: Boolean,
        },
        allow_drop_off: {
          type: Boolean,
        },
        distance_delta: {
          type: Number,
        },
        default_velocity: {
          type: Number,
        },
        default_travel_time: {
          type: Number,
        },
        default_dwell_time: {
          type: Number,
        },
        zones: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Zone',
          },
        ],
      },
    ],
    schedules: [
      {
        start_time: {
          type: String,
          maxlength: 100,
        },
        calendars_on: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Calendar',
          },
        ],
        calendars_off: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Calendar',
          },
        ],
        calendar_desc: {
          type: String,
          maxlength: 500,
        },
        vehicle_features: {
          type: {
            type: Number,
            default: 0,
          },
          propulsion: {
            type: Number,
            default: 0,
          },
          allow_bicycles: {
            type: Boolean,
            default: true,
          },
          passenger_counting: {
            type: Boolean,
          },
          video_surveillance: {
            type: Boolean,
          },
        },
        path_overrides: [
          {
            sequence_index: {
              type: Number,
            },
            velocity: {
              type: Number,
            },
            travel_time: {
              type: Number,
            },
            dwell_time: {
              type: Number,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Pattern || mongoose.model('Pattern', Schema);
