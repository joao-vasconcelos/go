/* * */

import mongoose from 'mongoose';

/* * */

export const ExportSchema = new mongoose.Schema({
  kind: {
    type: String,
    maxlength: 50,
  },
  status: {
    type: String,
    maxlength: 50,
  },
  exported_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notify_user: {
    type: Boolean,
  },
  progress_current: {
    type: Number,
  },
  progress_total: {
    type: Number,
  },
  filename: {
    type: String,
    maxlength: 50,
  },
  workdir: {
    type: String,
    maxlength: 200,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 14400, // Auto remove document after x seconds have passed from createdAt value
  },
});

/* * */

export const ExportModel = mongoose?.models?.Export || mongoose.model('Export', ExportSchema);
