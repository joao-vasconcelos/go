'use client';

/* * */

import { useSession } from 'next-auth/react';
import { useRouter } from '@/translations/navigation';
import { useEffect, useMemo } from 'react';
import isAllowed from '@/authentication/isAllowed';

/* * */

export default function AppAuthenticationCheck({ permissions = [], redirect = false, children }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { data: sessionData, status: sessionStatus } = useSession();

	//
	// B. Transform data

	const hasPermission = useMemo(() => {
		return isAllowed(sessionData, permissions, { handleError: true });
	}, [permissions, sessionData]);

	//
	// C. Handle actions

	useEffect(() => {
		if (sessionStatus === 'authenticated') {
			if (!hasPermission && redirect) router.push('/dashboard');
		}
	}, [hasPermission, redirect, router, sessionStatus]);

	//
	// D. Render components

	if (hasPermission) return children;
	else return <></>;

	//
}