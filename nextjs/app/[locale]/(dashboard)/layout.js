'use client';

/* * */

import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Loader from '@/components/Loader/Loader';
import { useSession } from 'next-auth/react';

/* * */

export default function Layout({ children }) {
	//

	//
	// A. Handle session

	const { status: sessionStatus } = useSession({
		onUnauthenticated() {
			if (!window.location.pathname || window.location.pathname === '/') window.location = '/login';
			else window.location = `/login?callbackUrl=${window.location.pathname}`;
		},
		required: true,
	});

	//
	// B. Render components

	return sessionStatus === 'authenticated' ? <AppWrapper>{children}</AppWrapper> : <Loader fill visible />;

	//
}
