/* * * * * */
/* MODEL: USER */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["User"] Object */
module.exports =
  mongoose.models.User ||
  mongoose.model(
    'User',
    new mongoose.Schema({
      _id: {
        type: String,
        minlength: 6,
        maxlength: 6,
      },
      email: {
        type: String,
        maxlength: 50,
      },
      emailVerified: {
        type: String,
        maxlength: 15,
      },
    })
  );
