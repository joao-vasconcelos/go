import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: LINE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    short_name: {
      type: String,
      maxlength: 50,
    },
    long_name: {
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
    circular: {
      type: Boolean,
    },
    school: {
      type: Boolean,
    },
    agencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
      },
    ],
    routes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Line || mongoose.model('Line', Schema);
