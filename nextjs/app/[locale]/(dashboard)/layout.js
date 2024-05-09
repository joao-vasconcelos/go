'use client';

/* * */

import { useSession } from 'next-auth/react';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Loader from '@/components/Loader/Loader';

/* * */

export default function Layout({ children }) {
	//

	//
	// A. Handle session

	const { status: sessionStatus } = useSession({
		required: true,
		onUnauthenticated() {
			if (!window.location.pathname || window.location.pathname === '/') window.location = '/login';
			else window.location = `/login?callbackUrl=${window.location.pathname}`;
		},
	});

	//
	// B. Render components

	return sessionStatus === 'authenticated' ? <AppWrapper>{children}</AppWrapper> : <Loader visible fill />;

	//
}