/* * */

import mongoose from 'mongoose';

/* * */

export const Schema = new mongoose.Schema({
  //
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  //
  title: {
    type: String,
    maxlength: 50,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  //
  file_size: {
    type: Number,
  },
  file_mime_type: {
    type: String,
    maxlength: 50,
  },
  file_extension: {
    type: String,
    maxlength: 6,
  },
  //
  is_locked: {
    type: Boolean,
  },
  //
});

/* * */

export const Model = mongoose?.models?.Media || mongoose.model('Media', Schema);
