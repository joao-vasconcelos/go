/* * */

import mongoose from 'mongoose';

/* * */

export const ArchiveSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    status: {
      type: String,
      maxlength: 50,
    },
    agency: {
      type: String,
      maxlength: 50,
    },
    start_date: {
      type: Number,
      maxlength: 50,
    },
    end_date: {
      type: String,
      maxlength: 50,
    },
    reference_plan: {
      type: String,
      maxlength: 50,
    },
    offer_plan: {
      type: String,
      maxlength: 50,
    },
    operation_plan: {
      type: String,
      maxlength: 50,
    },
    apex_files: {
      type: String,
      maxlength: 50,
    },
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */

export const ArchiveModel = mongoose?.models?.Archive || mongoose.model('Archive', ArchiveSchema);
