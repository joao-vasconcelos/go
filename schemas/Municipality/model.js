import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: MUNICIPALITY */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    municipality_code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    district: {
      type: String,
      maxlength: 50,
    },
    nuts_iii: {
      type: String,
      maxlength: 50,
    },
    dico: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Municipality || mongoose.model('Municipality', Schema);
