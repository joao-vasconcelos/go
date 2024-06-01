/* * */

import { UserDefault } from '@/schemas/User/default';

/* * */

export default function ensureUserPermissions(permissionsData) {
	//

	// 1.
	// Make a copy of the permissions object

	const formattedPermissions = { ...permissionsData };

	// 2.
	// Verify permissions for each scope

	if (!formattedPermissions?.alerts?.view?.is_allowed) formattedPermissions.alerts = UserDefault.permissions.alerts;
	if (!formattedPermissions?.reports?.view?.is_allowed) formattedPermissions.reports = UserDefault.permissions.reports;
	if (!formattedPermissions?.audits?.view?.is_allowed) formattedPermissions.audits = UserDefault.permissions.audits;
	if (!formattedPermissions?.feedback?.view?.is_allowed) formattedPermissions.feedback = UserDefault.permissions.feedback;
	if (!formattedPermissions?.issues?.view?.is_allowed) formattedPermissions.issues = UserDefault.permissions.issues;
	if (!formattedPermissions?.stops?.view?.is_allowed) formattedPermissions.stops = UserDefault.permissions.stops;
	if (!formattedPermissions?.calendars?.view?.is_allowed) formattedPermissions.calendars = UserDefault.permissions.calendars;
	if (!formattedPermissions?.lines?.view?.is_allowed) formattedPermissions.lines = UserDefault.permissions.lines;
	if (!formattedPermissions?.exports?.view?.is_allowed) formattedPermissions.exports = UserDefault.permissions.exports;
	if (!formattedPermissions?.municipalities?.view?.is_allowed) formattedPermissions.municipalities = UserDefault.permissions.municipalities;
	if (!formattedPermissions?.zones?.view?.is_allowed) formattedPermissions.zones = UserDefault.permissions.zones;
	if (!formattedPermissions?.fares?.view?.is_allowed) formattedPermissions.fares = UserDefault.permissions.fares;
	if (!formattedPermissions?.typologies?.view?.is_allowed) formattedPermissions.typologies = UserDefault.permissions.typologies;
	if (!formattedPermissions?.agencies?.view?.is_allowed) formattedPermissions.agencies = UserDefault.permissions.agencies;
	if (!formattedPermissions?.tags?.view?.is_allowed) formattedPermissions.tags = UserDefault.permissions.tags;
	if (!formattedPermissions?.media?.view?.is_allowed) formattedPermissions.media = UserDefault.permissions.media;
	if (!formattedPermissions?.users?.view?.is_allowed) formattedPermissions.users = UserDefault.permissions.users;

	// 3.
	// Return the formatted permissions object

	return formattedPermissions;

	//
}
