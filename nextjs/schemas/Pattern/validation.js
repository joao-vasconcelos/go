/* * */

import * as yup from 'yup';

/* * */

export const PatternValidation = yup.object({
	code: yup
		.string()
		.required()
		.max(25)
		.uppercase()
		.matches(/^[0-9_\s]+$/)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	parent_line: yup.string().required(),
	parent_route: yup.string().required(),
	origin: yup
		.string()
		.required()
		.max(50)
		.matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	destination: yup
		.string()
		.required()
		.max(50)
		.matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	headsign: yup
		.string()
		.required()
		.max(50)
		.matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	presets: yup.object({
		velocity: yup.number().integer(),
		dwell_time: yup.number().integer(),
	}),
	shape: yup.object({
		extension: yup.number(),
		//   points: yup.array(
		//     yup.object({
		//       shape_pt_lat: yup.string(),
		//       shape_pt_lon: yup.string(),
		//       shape_pt_sequence: yup.string(),
		//       shape_dist_traveled: yup.string(),
		//     })
		//   ),
	}),
	path: yup
		.array(
			yup.object({
				stop: yup.string().required(),
				allow_pickup: yup.boolean(),
				allow_drop_off: yup.boolean(),
				distance_delta: yup.number().required(),
				default_velocity: yup.number().integer().required(),
				default_travel_time: yup.number().integer().required(),
				default_dwell_time: yup.number().integer().required(),
				zones: yup.array(yup.string()),
			}),
		)
		.min(2),
	schedules: yup.array(),
});