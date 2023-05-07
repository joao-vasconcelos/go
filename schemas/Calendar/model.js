import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: CALENDAR */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    calendar_code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    calendar_name: {
      type: String,
      maxlength: 50,
    },
    agencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
      },
    ],
    dates: [
      {
        date: {
          type: String,
          maxlength: 8,
        },
        period: {
          type: Number,
        },
        holiday: {
          type: Boolean,
        },
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Calendar || mongoose.model('Calendar', Schema);
