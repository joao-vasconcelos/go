/* * */

import { IssueOptions } from './options';

/* * */

export const IssueDefault = {
	assigned_to: null,
	//
	code: '',
	//
	comments: [],
	created_at: new Date(),
	//
	created_by: null,
	due_date: '',
	//
	is_locked: false,
	//
	media: [],
	//
	milestones: [],
	priority: IssueOptions.priority[0],
	related_issues: [],
	//
	related_lines: [],
	related_reports: [],
	related_stops: [],
	//
	status: IssueOptions.status[0],
	summary: '',
	tags: [],
	//
	title: '',
	//
};

/* * */

export const DefaultCommment = {
	created_at: new Date(),
	//
	created_by: null,
	text: '',
	//
};

/* * */

export const DefaultMilestone = {
	created_at: new Date(),
	//
	created_by: null,
	type: '',
	value: null,
	//
};
