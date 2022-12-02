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
      email: {
        type: String,
        maxlength: 50,
        unique: true,
      },
      name: {
        type: String,
        maxlength: 50,
      },
      role: {
        type: String,
        maxlength: 50,
      },
      emailVerified: {
        type: String,
        maxlength: 15,
      },
    })
  );
