/* * */

import * as yup from 'yup';

/* * */

export const LineValidation = yup.object({
  code: yup
    .string()
    .required()
    .max(5)
    .uppercase()
    .matches(/^[0-9]+$/)
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  name: yup
    .string()
    .required()
    .max(150)
    .matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  short_name: yup
    .string()
    .required()
    .max(5)
    .uppercase()
    .matches(/^[a-zA-ZÀ-ÿ0-9()|-\s]+$/)
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  transport_type: yup.string().required().max(2),
  circular: yup.boolean(),
  school: yup.boolean(),
  continuous: yup.boolean(),
  typology: yup.string().required(),
  fares: yup.array(yup.string()).min(1),
  agency: yup.string().required(),
  routes: yup.array(yup.string()),
});
