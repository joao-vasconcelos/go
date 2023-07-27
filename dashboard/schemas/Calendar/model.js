import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: CALENDAR */
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
      maxlength: 250,
    },
    description: {
      type: String,
      maxlength: 250,
    },
    dates: [
      {
        type: String,
        maxlength: 8,
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Calendar || mongoose.model('Calendar', Schema);
