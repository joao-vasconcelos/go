import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const AgencyValidation = yup.object({
  code: yup.string().required().max(2, 'ID da Agência deve ter apenas ${max} caracteres.'),
  name: yup.string().max(100, 'Nome da Agência não deve exceder os ${max} caracteres.'),
  timezone: yup.string().required('Fuso Horário é um campo obrigatório.'),
  lang: yup.string().required('Idioma é um campo obrigatório.'),
  phone: yup.string(),
  email: yup.string(),
  url: yup.string(),
  fare_url: yup.string(),
  price_per_km: yup.number(),
});
