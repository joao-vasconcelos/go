/* * */

const examplePermissions = [
	{
		scope: 'stops',
		action: 'view',
		fields: [
			{
				key: 'municipalities',
				values: ['001', '002'],
			},
		],
	},
];

/* * */

export default function isAllowed(session, permissions, options = { handleError: false }) {
	try {
		//

		// 1.
		// Check if user is logged in and if user object is well formed

		if (!session) throw new Error('Denied: You must be logged in to access this feature.');
		if (!session.user) throw new Error('Error: Session does not contain current user object.');
		if (!session.user.permissions) throw new Error('Error: User object has no permissions.');

		// 2.
		// Iterate on all the requested permission checks

		if (permissions.length) {
			for (const permission of permissions) {
				//

				// 2.1.
				// Check if the current user is allowed to perform the action on the given scope

				if (session.user.permissions[permission.scope][permission.action].is_allowed !== true) {
					throw new Error(`Permission denied for user "${session?.user?.name}" | Scope: ${permission.scope} | Action: ${permission.action}`);
				}

				// 2.2.
				// If extra field checks are defined, check if the current user has the required values

				if (permission.fields?.length > 0) {
					for (const field of permission.fields) {
						for (const value of field.values) {
							if (!session.user.permissions[permission.scope][permission.action].fields[field.key]?.includes(value)) {
								throw new Error(`Permission denied for user "${session?.user?.name}" | Scope: ${permission.scope} | Action: ${permission.action} | Field: ${field.key} | Value: ${value}`);
							}
						}
					}
				}

				//
			}
		}

		// 3.
		// If session is valid then return it to the caller

		return true;

		//
	} catch (error) {
		if (!options.handleError) throw error;
		return false;
	}
}