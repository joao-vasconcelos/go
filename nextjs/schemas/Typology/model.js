import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: TYPOLOGY */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const TypologySchema = new mongoose.Schema(
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
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const TypologyModel = mongoose?.models?.Typology || mongoose.model('Typology', TypologySchema);