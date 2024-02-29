/* * */

import { AlertOptions } from './options';

/* * */

export const AlertDefault = {
  //
  code: '',
  //
  created_by: null,
  created_at: new Date(),
  //
  title: '',
  description: '',
  tags: [],
  //
  status: 'draft',
  publish_start: new Date(),
  publish_end: null,
  //
  active_period_start: null,
  active_period_end: null,
  //
  cause: null,
  effect: null,
  //
  type: AlertOptions.type[0],
  //
  affected_stops: [],
  affected_routes: [],
  affected_agencies: [],
  affected_municipalities: [],
  //
  url: '',
  media: null,
  //
  is_locked: false,
  //
};

/* * */

export const AlertAffectedStopDefault = {
  //
  stop_id: null,
  specific_routes: [],
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
