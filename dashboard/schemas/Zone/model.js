import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: ZONE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    color: {
      type: String,
      maxlength: 7,
    },
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
          default: 'Polygon',
        },
        coordinates: [mongoose.Schema.Types.Mixed],
      },
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Zone || mongoose.model('Zone', Schema);
