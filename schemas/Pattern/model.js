import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: PATTERN */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    pattern_code: {
      type: String,
      maxlength: 50,
    },
    parent_route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    direction_code: {
      type: Number,
    },
    headsign: {
      type: String,
      maxlength: 50,
    },
    shape: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shape',
    },
    path: [
      {
        stop_id: {
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
        apex: [
          {
            type: String,
            maxlength: 100,
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
        path_overrides: [
          {
            stop_sequence: {
              type: Number,
            },
            pickup_type: {
              type: String,
              maxlength: 6,
            },
            drop_off_type: {
              type: String,
              maxlength: 6,
            },
            time_delta: {
              type: String,
              maxlength: 6,
            },
            wait_time: {
              type: String,
              maxlength: 6,
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
