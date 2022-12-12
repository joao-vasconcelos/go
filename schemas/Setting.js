/* * * * * */
/* SCHEMA: SETTING */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["Setting"] Object */
export default yup.object({
  slug: yup.string().required('Slug is a required field'),
});
