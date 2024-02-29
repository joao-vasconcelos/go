/* * */

import mongoose from 'mongoose';

/* * */

export const AlertSchema = new mongoose.Schema({
  //
  code: {
    type: String,
    maxlength: 200,
  },
  //
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  //
  title: {
    type: String,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 5000,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
  //
  status: {
    type: String,
    maxlength: 30,
    default: 'draft',
  },
  publish_start: {
    type: Date,
  },
  publish_end: {
    type: Date,
  },
  //
  active_period_start: {
    type: Date,
  },
  active_period_end: {
    type: Date,
  },
  //
  cause: {
    type: String,
    maxlength: 50,
  },
  effect: {
    type: String,
    maxlength: 50,
  },
  //
  type: {
    type: String,
    maxlength: 50,
  },
  //
  affected_stops: [
    {
      stop_id: {
        type: String,
        maxlength: 10,
      },
      specific_routes: [
        {
          type: String,
          maxlength: 10,
        },
      ],
    },
  ],
  affected_routes: [
    {
      route_id: {
        type: String,
        maxlength: 10,
      },
      specific_stops: [
        {
          type: String,
          maxlength: 10,
        },
      ],
    },
  ],
  affected_agencies: [
    {
      agency_id: {
        type: String,
        maxlength: 10,
      },
    },
  ],
  affected_municipalities: [
    {
      municipality_id: {
        type: String,
        maxlength: 10,
      },
    },
  ],
  //
  url: {
    type: String,
    maxlength: 50,
  },
  media: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
  },
  //
  is_locked: {
    type: Boolean,
  },
  //
});

/* * */

export const AlertModel = mongoose?.models?.Alert || mongoose.model('Alert', AlertSchema);
