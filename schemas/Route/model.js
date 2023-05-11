import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: ROUTE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    route_code: {
      type: String,
      maxlength: 50,
      unique: true,
    },
    parent_line: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Line',
    },
    route_name: {
      type: String,
      maxlength: 50,
    },
    patterns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pattern',
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Route || mongoose.model('Route', Schema);
