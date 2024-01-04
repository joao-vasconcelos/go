import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: EXPORT */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const ExportValidation = yup.object({
  type: yup.number().required(),
  status: yup.number().required(),
  progress_current: yup.number().required(),
  progress_total: yup.number().required(),
  filename: yup.string().required(),
  workdir: yup.string().required(),
});
