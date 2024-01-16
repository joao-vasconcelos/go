/*
 * FIXED OPTIONS FOR EXPORT
 * These options are here because they should not, or don't need to be,
 * editable by any user. Most of them are encoded as part of the GTFS specification.
 *
 */

//
//
//

export const ExportOptions = {
  //

  /*
   * TYPE
   */

  export_type: ['gtfs_v29', 'netex_v1'],

  /*
   * DEFAULTS
   */

  defaults: {
    export_type: 'gtfs_v29',
    agency_id: null,
    lines_included: [],
    lines_excluded: [],
    feed_start_date: null,
    feed_end_date: null,
    clip_calendars: true,
    calendars_clip_start_date: null,
    calendars_clip_end_date: null,
    numeric_calendar_codes: false,
    stop_sequence_start: 1,
    notify_user: true,
  },

  /*
   * STATUS
   */

  status: ['WAITING', 'PROGRESS', 'COMPLETED', 'ERROR'],

  //
};
