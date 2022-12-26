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
  description: yup.string().max(300, 'Description must be no longer than ${max} characters'),
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
          description: yup.string().max(50, 'Field Description must be no longer than ${max} characters'),
          type: yup.string().max(50, 'Field Type must be no longer than ${max} characters').nullable(),
          isOpen: yup.boolean().default(true),
          options: yup.array(
            yup.object({
              id: yup.string().max(50, 'Field ID must be no longer than ${max} characters'),
              label: yup.string().max(50, 'Field Label must be no longer than ${max} characters'),
              value: yup.string().max(50, 'Field Label must be no longer than ${max} characters'),
            })
          ),
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
      default: '',
    },
    description: {
      type: String,
      maxlength: 50,
      default: '',
    },
    sections: [
      {
        key: {
          type: String,
          maxlength: 50,
          default: '',
        },
        title: {
          type: String,
          maxlength: 50,
          default: '',
        },
        description: {
          type: String,
          maxlength: 50,
          default: '',
        },
        fields: [
          {
            key: {
              type: String,
              maxlength: 50,
              default: '',
            },
            label: {
              type: String,
              maxlength: 50,
              default: '',
            },
            placeholder: {
              type: String,
              maxlength: 50,
              default: '',
            },
            description: {
              type: String,
              maxlength: 50,
              default: '',
            },
            type: {
              type: String,
              maxlength: 50,
              default: '',
            },
            isOpen: {
              type: Boolean,
              default: true,
            },

            options: [
              {
                value: {
                  type: String,
                  maxlength: 50,
                  default: '',
                },
                label: {
                  type: String,
                  maxlength: 50,
                  default: '',
                },
              },
            ],
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
