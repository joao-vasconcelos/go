import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: SHAPE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    shape_code: {
      type: String,
      maxlength: 100,
      unique: true,
    },
    shape_name: {
      type: String,
      maxlength: 100,
    },
    shape_distance: {
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
      },
      geometry: {
        type: {
          type: String,
          maxlength: 100,
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
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Shape || mongoose.model('Shape', Schema);
