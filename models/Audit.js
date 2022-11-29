/* * * * * */
/* MODEL: AUDIT */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Audit"] Object */
module.exports =
  mongoose.models.Audit ||
  mongoose.model(
    'Audit',
    new mongoose.Schema(
      {
        unique_code: {
          type: String,
          minlength: 6,
          maxlength: 6,
        },
        first_name: {
          type: String,
          maxlength: 50,
        },
      },
      { timestamps: true }
    )
  );
