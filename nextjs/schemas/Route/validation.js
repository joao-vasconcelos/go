import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: ROUTE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const RouteValidation = yup.object({
	code: yup
		.string()
		.required()
		.max(15)
		.uppercase()
		.matches(/^[0-9_\s]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	name: yup
		.string()
		.required()
		.max(150)
		.matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	parent_line: yup.string().required(),
	path_type: yup.string().required().max(2),
	patterns: yup.array(yup.string()),
});
