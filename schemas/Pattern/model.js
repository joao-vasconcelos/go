import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: PATTERN */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    parent_route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    direction_code: {
      type: Number,
      maxlength: 50,
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
        stop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Stop',
        },
        pickup_type: {
          type: String,
          maxlength: 6,
        },
        drop_off_type: {
          type: String,
          maxlength: 6,
        },
        distance_delta: {
          type: String,
          maxlength: 6,
        },
        default_time_delta: {
          type: String,
          maxlength: 6,
        },
        default_dwell_time: {
          type: String,
          maxlength: 6,
        },
        apex: [
          {
            type: String,
            maxlength: 6,
          },
        ],
      },
    ],
    schedules: [
      {
        schedule_id: {
          type: String,
          maxlength: 6,
        },
        calendar_id: {
          type: String,
          maxlength: 6,
        },
        start_time: {
          type: String,
          maxlength: 6,
        },
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
