import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

/* * * * * */
/* CHECK AUTHENTICATION */
/* * */

export default async function checkAuthentication({ scope, permission, req, res }) {
  //
  // 1.0.
  // Fetch latest session data from the database
  const session = await getServerSession(req, res, authOptions);

  // 1.1.
  // Check if user is logged in. Cancel the request if not.
  if (!session) {
    throw new Error('You must be logged in to access this feature.');
  }

  // 1.2.
  // Check if the current user has permission to access the feature
  if (!session?.user?.permissions[scope][permission] === true) {
    throw new Error(`Permission denied for user "${session?.user?.name}" | Scope: ${scope} | Permission: ${permission}`);
  }

  // 1.3.
  // If session is valid then return it to the caller
  return session;

  //
}
