import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: THREAD */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    subject: {
      type: String,
      maxlength: 100,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      maxlength: 50,
    },
    theme: {
      type: String,
      maxlength: 50,
    },
    associated_line: {
      type: String,
      maxlength: 50,
    },
    associated_stop: {
      type: String,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
    virtuals: {
      messages: {
        ref: 'Message',
        localField: '_id',
        foreignField: 'thread',
      },
    },
  }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Thread || mongoose.model('Thread', Schema);
