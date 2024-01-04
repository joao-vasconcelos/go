import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: DATE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const DateSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      maxlength: 8,
      unique: true,
    },
    period: {
      type: Number,
    },
    day_type: {
      type: Number,
    },
    is_holiday: {
      type: Boolean,
    },
    notes: {
      type: String,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const DateModel = mongoose?.models?.Date || mongoose.model('Date', DateSchema);
