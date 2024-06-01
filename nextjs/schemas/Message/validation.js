import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: MESSAGE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
	content: yup.string().required('Please write your message here.').max(1000, ''),
	files: yup.array({ filename: yup.string(), url: yup.string() }),
	sent_by: yup.string(),
	thread_id: yup.string(),
});
