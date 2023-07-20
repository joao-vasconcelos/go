import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: EXPORT */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const ExportSchema = new mongoose.Schema({
  type: {
    type: Number,
  },
  status: {
    type: Number,
  },
  exported_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    expires: 3600, // Auto remove document after x seconds have passed from createdAt value
  },
});

/* * */
/* C. Mongoose Model */
export const ExportModel = mongoose?.models?.Export || mongoose.model('Export', ExportSchema);
