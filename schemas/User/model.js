import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: USER */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema({
  user_name: {
    type: String,
    maxlength: 50,
  },
  user_email: {
    type: String,
    maxlength: 50,
    unique: true,
  },
  user_phone: {
    type: String,
    maxlength: 50,
  },
  emailVerified: {
    type: String,
    maxlength: 15,
  },
});

/* * */
/* B. Mongoose Model */
export const Model = mongoose?.models?.User || mongoose.model('User', Schema);
