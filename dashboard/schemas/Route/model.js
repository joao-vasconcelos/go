import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: ROUTE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const RouteSchema = new mongoose.Schema(
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
      type: String,
      maxlength: 2,
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
export const RouteModel = mongoose?.models?.Route || mongoose.model('Route', RouteSchema);
