/* * */

export const AuditTripDefault = {
  //
  code: '20240101|41|WHFY|1001_0_1|ESC_SAB|0700',
  //
  status: 'waiting',
  is_locked: false,
  //
  plan_id: 'WHFY',
  plan_start_date: '2024-01-01',
  plan_end_date: '2024-01-31',
  //
  agency_id: '41',
  //
  line_id: 'WHFY|1001',
  line_short_name: '',
  line_long_name: '',
  //
  route_id: 'WHFY|1001_0',
  route_short_name: '',
  route_long_name: '',
  //
  pattern_id: 'WHFY|1001_0_1',
  pattern_headsign: 'Loures (Circular)',
  trip_id: 'WHFY|1001_0_1|ESC_SAB|0700',
  //
  calendar_id: 'WHFY|ESC_SAB',
  //
  operational_day: '20240101',
  //
  color: '',
  text_color: '',
  //
  parse_timestamp: '',
  analysis_timestamp: '',
  //
  analysis: [],
  //
  user_notes: '',
  //
};

/* * */

export const AuditTripAnalysisDefault = {
  //
  code: 'FOLLOWS_SHAPE_PATH',
  version: '2023.01.01',
  //
  result: 'OK' || 'ERROR' || null,
  //
  timestamp: '',
  //
};
