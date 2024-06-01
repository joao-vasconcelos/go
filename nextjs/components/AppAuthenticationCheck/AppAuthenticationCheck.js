'use client';

/* * */

import isAllowed from '@/authentication/isAllowed';
import { useRouter } from '@/translations/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';

/* * */

export default function AppAuthenticationCheck({ children, permissions = [], redirect = false }) {
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
