/* * */

import mongoose from 'mongoose';

/* * */

export const DateSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      maxlength: 8,
      unique: true,
    },
    period: {
      type: String,
      maxlength: 1,
    },
    is_holiday: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

/* * */

export const DateModel = mongoose?.models?.Date || mongoose.model('Date', DateSchema);
