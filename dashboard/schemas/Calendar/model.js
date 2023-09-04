import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: CALENDAR */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const CalendarSchema = new mongoose.Schema(
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
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const CalendarModel = mongoose?.models?.Calendar || mongoose.model('Calendar', CalendarSchema);
