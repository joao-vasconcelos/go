/* * */

import { createOperationalDate, CreatePlanDto } from '@tmlmobilidade/services/types';

/* * */

export const PlanDefault: CreatePlanDto = {
	agency_id: '',
	feeder_status: 'waiting',
	is_approved: false,
	is_locked: false,
	operation_file: '',
	reference_file: '',
	valid_from: createOperationalDate('20340101'),
	valid_until: createOperationalDate('20340101'),
};
