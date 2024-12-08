/* * */

import { createOperationalDate, CreatePlanDto, OPERATIONAL_DATE_FORMAT } from '@tmlmobilidade/services/types';
import { DateTime } from 'luxon';

/* * */

export const PlanDefault: CreatePlanDto = {
	agency_id: '',
	feeder_status: 'waiting',
	is_approved: false,
	is_locked: false,
	operation_file: '',
	reference_file: '',
	valid_from: createOperationalDate(DateTime.now().toFormat(OPERATIONAL_DATE_FORMAT)),
	valid_until: createOperationalDate(DateTime.now().toFormat(OPERATIONAL_DATE_FORMAT)),
};
