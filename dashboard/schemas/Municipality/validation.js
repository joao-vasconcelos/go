import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: MUNICIPALITY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const MunicipalityValidation = yup.object({
  code: yup
    .string()
    .required()
    .max(4)
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  prefix: yup
    .string()
    .required()
    .max(2)
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  name: yup
    .string()
    .required()
    .max(50)
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  district: yup
    .string()
    .required()
    .max(2)
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  region: yup
    .string()
    .required()
    .max(5)
    .transform((value) => value.replace(/  +/g, ' ').trim()),
});
