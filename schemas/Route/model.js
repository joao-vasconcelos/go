import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: ROUTE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    route_name: {
      type: String,
      maxlength: 50,
    },
    inbound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pattern',
    },
    outbound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pattern',
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Route || mongoose.model('Route', Schema);
