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
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Calendar || mongoose.model('Calendar', Schema);
