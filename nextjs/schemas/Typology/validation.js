import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: TYPOLOGY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const TypologyValidation = yup.object({
	code: yup
		.string()
		.required()
		.max(10)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	name: yup
		.string()
		.max(100)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	short_name: yup
		.string()
		.max(100)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	color: yup
		.string()
		.max(100)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	text_color: yup
		.string()
		.max(100)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
});