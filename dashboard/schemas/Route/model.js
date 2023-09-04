import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: ROUTE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 15,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 150,
    },
    path_type: {
      type: Number,
    },
    parent_line: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Line',
    },
    patterns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pattern',
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
export const Model = mongoose?.models?.Route || mongoose.model('Route', Schema);
