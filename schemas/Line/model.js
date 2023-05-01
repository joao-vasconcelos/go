import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: LINE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    line_code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    line_short_name: {
      type: String,
      maxlength: 50,
    },
    line_long_name: {
      type: String,
      maxlength: 50,
    },
    agencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
      },
    ],
    line_color: {
      type: String,
      maxlength: 50,
    },
    line_text_color: {
      type: String,
      maxlength: 50,
    },
    circular: {
      type: Boolean,
    },
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
