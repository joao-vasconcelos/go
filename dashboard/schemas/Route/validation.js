import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: ROUTE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  code: yup.string().required().max(15),
  name: yup.string().required().max(150),
  path_type: yup.number().integer().required(),
  parent_line: yup.string().required(),
  patterns: yup.array(yup.string()),
});
