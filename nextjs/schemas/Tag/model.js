/* * */

import mongoose from 'mongoose';

/* * */

export const TagSchema = new mongoose.Schema({
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
    maxlength: 20,
    unique: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  color: {
    type: String,
    maxlength: 50,
    default: '#5aaf00',
  },
  text_color: {
    type: String,
    maxlength: 50,
    default: '#ffffff',
  },
  //
  is_locked: {
    type: Boolean,
  },
  //
});

/* * */

export const TagModel = mongoose?.models?.Tag || mongoose.model('Tag', TagSchema);
