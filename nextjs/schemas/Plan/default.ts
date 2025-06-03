/* * */

import { type CreatePlanDto } from '@tmlmobilidade/types';
import { Dates } from '@tmlmobilidade/utils';

/* * */

export const PlanDefault: CreatePlanDto = {
	agency_id: '',
	feeder_status: 'waiting',
	is_approved: false,
	is_locked: false,
	operation_file: '',
	reference_file: '',
	valid_from: Dates.now('Europe/Lisbon').operational_date,
	valid_until: Dates.now('Europe/Lisbon').operational_date,
};
