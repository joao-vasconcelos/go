import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: CALENDAR */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const CalendarValidation = yup.object({
	code: yup
		.string()
		.required()
		.max(100)
		.uppercase()
		.matches(/^[a-zA-Z0-9_\s]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	dates: yup.array(yup.string().max(8)),
	description: yup
		.string()
		.max(250)
		.matches(/^[a-zA-ZÀ-ÿ0-9().|-\s]*$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	name: yup
		.string()
		.required()
		.max(250)
		.matches(/^[a-zA-ZÀ-ÿ0-9(),|#._-\s]*$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	numeric_code: yup.number().required().min(0).max(99999).integer(),
});
