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
		.transform(value => value.replace(/  +/g, ' ').trim()),
	destination: yup
		.string()
		.required()
		.max(50)
		.matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	direction: yup.string().required(),
	headsign: yup
		.string()
		.required()
		.max(50)
		.matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	origin: yup
		.string()
		.required()
		.max(50)
		.matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	parent_line: yup.string().required(),
	parent_route: yup.string().required(),
	path: yup
		.array(
			yup.object({
				allow_drop_off: yup.boolean(),
				allow_pickup: yup.boolean(),
				default_dwell_time: yup.number().integer().required(),
				default_travel_time: yup.number().integer().required(),
				default_velocity: yup.number().integer().required(),
				distance_delta: yup.number().required(),
				stop: yup.string().required(),
				zones: yup.array(yup.string()),
			}),
		)
		.min(2),
	presets: yup.object({
		dwell_time: yup.number().integer(),
		velocity: yup.number().integer(),
	}),
	schedules: yup.array(),
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
});
