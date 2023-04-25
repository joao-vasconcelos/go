import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: FARE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  fare_id: yup.string().max(10, 'ID da Agência deve ter apenas ${max} caracteres.'),
  fare_short_name: yup.string().max(100, 'Nome da Agência não deve exceder os ${max} caracteres.'),
  fare_long_name: yup.string(),
  price: yup.number().min(0),
  currency_type: yup.string(),
  payment_method: yup.string(),
  transfers: yup.string(),
  agencies: yup.array(yup.string()),
});
