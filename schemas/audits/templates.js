import * as yup from 'yup';
import mongoose from 'mongoose';

/* * */
/* SCHEMA: AUDIT TEMPLATE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  unique_code: yup
    .string()
    .min(6, 'Unique Code must have exactly ${min} characters')
    .max(6, 'Unique Code must have exactly ${max} characters')
    .required('Unique Code is a required field'),
  title: yup.string().max(50, 'Title must be no longer than ${max} characters'),
  sections: yup.array(
    yup.object({
      key: yup.string(),
      title: yup.string().max(50, 'Section Title must be no longer than ${max} characters'),
      description: yup.string().max(50, 'Section Description must be no longer than ${max} characters'),
      fields: yup.array(
        yup.object({
          key: yup.string(),
          label: yup.string().max(50, 'Field Label must be no longer than ${max} characters'),
          placeholder: yup.string().max(50, 'Field Placeholder must be no longer than ${max} characters'),
          type: yup.string().max(50, 'Field Type must be no longer than ${max} characters').nullable(),
        })
      ),
    })
  ),
});

/* * */
/* B. MongoDB Model Schema */
export const Model =
  mongoose?.models?.AuditTemplate ||
  mongoose.model(
    'AuditTemplate',
    new mongoose.Schema(
      {
        unique_code: {
          type: String,
          minlength: 6,
          maxlength: 6,
        },
        title: {
          type: String,
          maxlength: 50,
        },
        sections: [
          {
            key: {
              type: String,
              maxlength: 50,
            },
            title: {
              type: String,
              maxlength: 50,
            },
            description: {
              type: String,
              maxlength: 50,
            },
            fields: [
              {
                key: {
                  type: String,
                  maxlength: 50,
                },
                label: {
                  type: String,
                  maxlength: 50,
                },
                placeholder: {
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
