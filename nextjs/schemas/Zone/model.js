/* * */

import mongoose from 'mongoose';

/* * */

export const ZoneSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 30,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    fill_color: {
      type: String,
      maxlength: 7,
    },
    fill_opacity: {
      type: Number,
    },
    border_color: {
      type: String,
      maxlength: 7,
    },
    border_opacity: {
      type: Number,
    },
    border_width: {
      type: Number,
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
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */

export const ZoneModel = mongoose?.models?.Zone || mongoose.model('Zone', ZoneSchema);
