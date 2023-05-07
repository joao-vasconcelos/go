import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: DATE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    date: {
      type: String,
      maxlength: 8,
      unique: true,
    },
    default_period: {
      type: Number,
    },
    default_holiday: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Date || mongoose.model('Date', Schema);
