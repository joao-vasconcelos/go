import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: SHAPE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 100,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 100,
    },
    extension: {
      type: String,
      maxlength: 100,
    },
    points: [
      {
        shape_pt_lat: {
          type: String,
          maxlength: 100,
        },
        shape_pt_lon: {
          type: String,
          maxlength: 100,
        },
        shape_pt_sequence: {
          type: String,
          maxlength: 100,
        },
        shape_dist_traveled: {
          type: String,
          maxlength: 100,
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
              maxlength: 100,
            },
          ],
        ],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
      associated_pattern: {
        options: {
          ref: 'Pattern',
          localField: '_id',
          foreignField: 'shape',
          justOne: true,
        },
      },
    },
  }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Shape || mongoose.model('Shape', Schema);
