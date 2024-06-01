/* * */

import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

/* * */

export default async function getSession(req, res) {
	return await getServerSession(req, res, authOptions);
}
