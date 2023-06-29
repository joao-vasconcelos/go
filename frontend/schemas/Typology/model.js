import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: TYPOLOGY */
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
    name: {
      type: String,
      maxlength: 50,
    },
    short_name: {
      type: String,
      maxlength: 50,
    },
    color: {
      type: String,
      maxlength: 7,
    },
    text_color: {
      type: String,
      maxlength: 7,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Typology || mongoose.model('Typology', Schema);
