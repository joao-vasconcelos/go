import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: FARE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const AlertSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 200,
    },
    published: {
      type: Boolean,
    },
    title: {
      type: String,
      maxlength: 250,
    },
    active_period_start: {
      type: Date,
    },
    active_period_end: {
      type: Date,
    },
    municipalities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Municipality',
      },
    ],
    lines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Line',
      },
    ],
    stops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
      },
    ],
    cause: {
      type: String,
      maxlength: 50,
    },
    effect: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 2500,
    },
    images: [
      {
        media_type: {
          type: String,
          maxlength: 50,
        },
        image_url: {
          type: String,
          maxlength: 50,
        },
      },
    ],
    url: {
      type: String,
      maxlength: 50,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const AlertModel = mongoose?.models?.Alert || mongoose.model('Alert', AlertSchema);
