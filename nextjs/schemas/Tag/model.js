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
  label: {
    type: String,
    maxlength: 10,
    unique: true,
  },
  description: {
    type: String,
    maxlength: 50,
  },
  color: {
    type: String,
    maxlength: 50,
  },
  text_color: {
    type: String,
    maxlength: 50,
  },
  //
  is_locked: {
    type: Boolean,
  },
  //
});

/* * */

export const Model = mongoose?.models?.Tag || mongoose.model('Tag', Schema);
