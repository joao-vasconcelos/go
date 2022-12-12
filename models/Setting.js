/* * * * * */
/* MODEL: SETTING */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Setting"] Object */
module.exports =
  mongoose.models.Setting ||
  mongoose.model(
    'Setting',
    new mongoose.Schema(
      {
        slug: {
          type: String,
          maxlength: 50,
        },
        schema: [
          {
            fields: [
              {
                id: {
                  type: String,
                  maxlength: 50,
                },
                label: {
                  type: String,
                  maxlength: 50,
                },
                description: {
                  type: String,
                  maxlength: 50,
                },
                placeholder: {
                  type: String,
                  maxlength: 50,
                },
                section: {
                  type: String,
                  maxlength: 50,
                },
                type: {
                  type: String,
                  maxlength: 50,
                },
              },
            ],
          },
        ],
      },
      { timestamps: true }
    )
  );
