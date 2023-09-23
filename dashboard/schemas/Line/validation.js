import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: LINE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const LineValidation = yup.object({
  code: yup
    .string()
    .required()
    .max(5)
    .uppercase()
    .matches(/^[0-9]+$/),
  name: yup
    .string()
    .required()
    .max(150)
    .matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/),
  short_name: yup
    .string()
    .required()
    .max(5)
    .uppercase()
    .matches(/^[a-zA-ZÀ-ÿ0-9()|-\s]+$/),
  transport_type: yup.string().required().max(2),
  circular: yup.boolean(),
  school: yup.boolean(),
  continuous: yup.boolean(),
  typology: yup.string().required(),
  fare: yup.string().required(),
  agency: yup.string().required(),
  routes: yup.array(yup.string()),
});
