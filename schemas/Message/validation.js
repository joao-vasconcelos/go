import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: MESSAGE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  thread_id: yup.string(),
  content: yup.string().required('Please write your message here.').max(1000, ''),
  sent_by: yup.string(),
  files: yup.array({ filename: yup.string(), url: yup.string() }),
});
