/* * */

export const AlertOptions = {
	//

	/*
   * STORAGE SCOPE
   */

	storage_scope: 'alerts',

	/*
   * STATUS
   */

	status: ['draft', 'published'],

	/*
   * TYPE
   */

	type: ['select_routes', 'select_stops', 'select_agencies'],

	/*
   * CAUSES
   * More info: https://gtfs.org/realtime/reference/#enum-cause
   */

	cause: ['UNKNOWN_CAUSE', 'OTHER_CAUSE', 'TECHNICAL_PROBLEM', 'STRIKE', 'DEMONSTRATION', 'ACCIDENT', 'HOLIDAY', 'WEATHER', 'MAINTENANCE', 'CONSTRUCTION', 'POLICE_ACTIVITY', 'MEDICAL_EMERGENCY'],

	/*
   * EFFECTS
   * More info: https://gtfs.org/realtime/reference/#enum-effect
   */

	effect: ['NO_SERVICE', 'REDUCED_SERVICE', 'SIGNIFICANT_DELAYS', 'DETOUR', 'ADDITIONAL_SERVICE', 'MODIFIED_SERVICE', 'OTHER_EFFECT', 'UNKNOWN_EFFECT', 'STOP_MOVED', 'NO_EFFECT', 'ACCESSIBILITY_ISSUE'],

	//
};