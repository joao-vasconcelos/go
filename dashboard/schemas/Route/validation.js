import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: ROUTE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const RouteValidation = yup.object({
  code: yup
    .string()
    .required()
    .max(15)
    .uppercase()
    .matches(/^[0-9_\s]+$/),
  name: yup
    .string()
    .required()
    .max(150)
    .matches(/^[a-zA-ZÀ-ÿ0-9()|-\s]+$/),
  path_type: yup.number().integer().required(),
  parent_line: yup.string().required(),
  patterns: yup.array(yup.string()),
});
