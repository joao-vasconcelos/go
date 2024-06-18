/* * */
/* DOCUMENT TYPE: PATTERN */
/* Explanation needed. */
/* * */

/* * */
/* A. Default Pattern Preset Values */

export const PatternPresetsDefault = {
	dwell_time: 0,
	velocity: 20,
};

/* * */
/* B. Default Pattern Shape Values */

export const PatternShapeDefault = {
	extension: 0,
	geojson: {
		geometry: {
			coordinates: [],
			type: 'LineString',
		},
		type: 'Feature',
	},
	points: [],
};

/* * */
/* B. Default Pattern Shape Values */

export const PatternShapePointDefault = {
	shape_dist_traveled: 0,
	shape_pt_lat: 0,
	shape_pt_lon: 0,
	shape_pt_sequence: 0,
};

/* * */
/* C. Default Pattern Path Values */

export const PatternPathDefault = {
	allow_drop_off: true,
	allow_pickup: true,
	default_dwell_time: 0,
	default_travel_time: 0,
	default_velocity: 20,
	distance_delta: 0,
	stop: null,
	zones: [],
};

/* * */
/* D. Default Pattern Schedule Values */

export const PatternScheduleDefault = {
	calendar_desc: '',
	calendars_off: [],
	calendars_on: [],
	path_overrides: [],
	start_time: '',
	vehicle_features: {
		allow_bicycles: true,
		passenger_counting: true,
		propulsion: '0',
		type: '0',
		video_surveillance: true,
	},
};

/* * */
/* E. Default Pattern Values */

export const PatternDefault = {
	code: '',
	destination: '',
	direction: '0',
	headsign: '',
	is_locked: false,
	origin: '',
	parent_line: null,
	parent_route: null,
	path: [],
	presets: PatternPresetsDefault,
	schedules: [],
	shape: PatternShapeDefault,
};
