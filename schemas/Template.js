import * as yup from 'yup';
import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: TEMPLATE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  title: yup.string().max(50, 'Title must be no longer than ${max} characters'),
  description: yup.string().max(50, 'Description must be no longer than ${max} characters'),
  sections: yup.array(
    yup.object({
      key: yup.string(),
      id: yup.string().max(50, 'Section ID must be no longer than ${max} characters'),
      title: yup.string().max(50, 'Section Title must be no longer than ${max} characters'),
      description: yup.string().max(50, 'Section Description must be no longer than ${max} characters'),
      fields: yup.array(
        yup.object({
          key: yup.string(),
          id: yup.string().max(50, 'Field ID must be no longer than ${max} characters'),
          label: yup.string().max(50, 'Field Label must be no longer than ${max} characters'),
          placeholder: yup.string().max(50, 'Field Placeholder must be no longer than ${max} characters'),
          type: yup.string().max(50, 'Field Type must be no longer than ${max} characters').nullable(),
        })
      ),
    })
  ),
});

/* * */
/* B. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
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
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Template || mongoose.model('Template', Schema);
