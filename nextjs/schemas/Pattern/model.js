/* * */

import mongoose from 'mongoose';

/* * */

export const PatternSchema = new mongoose.Schema(
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
    origin: {
      type: String,
      maxlength: 100,
    },
    destination: {
      type: String,
      maxlength: 100,
    },
    headsign: {
      type: String,
      maxlength: 100,
    },
    presets: {
      velocity: {
        type: Number,
        default: 20,
      },
      dwell_time: {
        type: Number,
        default: 0,
      },
    },
    shape: {
      extension: {
        type: Number,
      },
      points: [
        {
          shape_pt_lat: {
            type: Number,
          },
          shape_pt_lon: {
            type: Number,
          },
          shape_pt_sequence: {
            type: Number,
          },
          shape_dist_traveled: {
            type: Number,
          },
        },
      ],
      geojson: {
        type: {
          type: String,
          maxlength: 100,
          default: 'Feature',
        },
        geometry: {
          type: {
            type: String,
            maxlength: 100,
            default: 'LineString',
          },
          coordinates: [
            [
              {
                type: Number,
              },
            ],
          ],
        },
      },
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
            type: String,
            maxlength: 2,
            default: '0',
          },
          propulsion: {
            type: String,
            maxlength: 2,
            default: '0',
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
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */

export const PatternModel = mongoose?.models?.Pattern || mongoose.model('Pattern', PatternSchema);
