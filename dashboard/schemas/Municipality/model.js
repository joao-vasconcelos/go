import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: MUNICIPALITY */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 4,
      unique: true,
    },
    prefix: {
      type: String,
      maxlength: 2,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    district: {
      type: String,
      maxlength: 2,
    },
    region: {
      type: String,
      maxlength: 5,
    },
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Municipality || mongoose.model('Municipality', Schema);
