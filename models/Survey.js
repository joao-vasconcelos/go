/* * * * * */
/* MODEL: SURVEY */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Survey"] Object */
module.exports =
  mongoose.models.Survey ||
  mongoose.model(
    'Survey',
    new mongoose.Schema({
      unique_code: {
        type: String,
        minlength: 6,
        maxlength: 6,
      },
      name: {
        type: String,
        maxlength: 50,
      },
      short_name: {
        type: String,
        maxlength: 15,
      },
      description: {
        type: String,
        maxlength: 300,
      },
    })
  );
