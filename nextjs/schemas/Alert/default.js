/* * */

import { AlertOptions } from './options';

/* * */

export const AlertDefault = {
	active_period_end: null,
	//
	active_period_start: null,
	affected_agencies: [],
	affected_municipalities: [],
	affected_routes: [],
	//
	affected_stops: [],
	//
	cause: null,
	//
	code: '',
	created_at: new Date(),
	//
	created_by: null,
	description: '',
	effect: null,
	//
	is_locked: false,
	media: null,
	publish_end: null,
	publish_start: new Date(),
	//
	status: 'draft',
	tags: [],
	//
	title: '',
	//
	type: AlertOptions.type[0],
	//
	url: '',
	//
};

/* * */

export const AlertAffectedStopDefault = {
	specific_routes: [],
	//
	stop_id: null,
	//
};

export const AlertAffectedRouteDefault = {
	//
	route_id: null,
	specific_stops: [],
	//
};

export const AlertAffectedAgencyDefault = {
	//
	agency_id: 'CM',
	//
};

export const AlertAffectedMunicipalityDefault = {
	//
	municipality_id: null,
	//
};
