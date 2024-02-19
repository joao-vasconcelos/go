/* * */

import { IssueOptions } from './options';

/* * */

export const IssueDefault = {
  //
  code: '',
  //
  created_by: null,
  created_at: new Date(),
  //
  title: '',
  summary: '',
  tags: [],
  //
  status: IssueOptions.status[0],
  priority: IssueOptions.priority[0],
  due_date: '',
  assigned_to: null,
  //
  related_lines: [],
  related_stops: [],
  related_reports: [],
  related_issues: [],
  //
  media: [],
  //
  comments: [],
  //
  milestones: [],
  //
  is_locked: false,
  //
};

/* * */

export const DefaultCommment = {
  //
  created_by: null,
  created_at: new Date(),
  text: '',
  //
};

/* * */

export const DefaultMilestone = {
  //
  created_by: null,
  created_at: new Date(),
  type: '',
  value: null,
  //
};
