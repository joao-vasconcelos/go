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
    associated_lines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Line',
      },
    ],
    associated_stops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
      messages: {
        options: {
          ref: 'Message',
          localField: '_id',
          foreignField: 'thread_id',
        },
      },
    },
  }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Thread || mongoose.model('Thread', Schema);
