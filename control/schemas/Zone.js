const mongoose = require('mongoose');

/* * */
/* DOCUMENT TYPE: Zone */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
const Schema = new mongoose.Schema(
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
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
module.exports = mongoose?.models?.Zone || mongoose.model('Zone', Schema);
