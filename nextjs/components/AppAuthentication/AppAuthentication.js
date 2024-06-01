'use client';

/* * */

import { CMLogo } from '@/components/AppLogos/AppLogos';
import Loader from '@/components/Loader/Loader';
import { useRouter } from '@/translations/navigation';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import appBackground from 'public/background.jpg';
import { useEffect } from 'react';

import styles from './AppAuthentication.module.css';

/* * */

export default function AppAuthentication({ children }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const searchParams = useSearchParams();
	const { status } = useSession();

	//
	// B. Handle actions

	useEffect(() => {
		const checkAuthStatusInterval = setInterval(() => {
			if (status === 'authenticated') {
				const callbackUrl = searchParams.get('callbackUrl');
				if (callbackUrl) router.push(callbackUrl);
				else router.push('/');
			}
		}, 500);
		return () => clearInterval(checkAuthStatusInterval);
	}, [router, status, searchParams]);

	//
	// C. Render components

	return (
		<div className={styles.container} style={{ backgroundImage: `url(${appBackground.src})` }}>
			<div className={styles.loginForm}>
				<div className={styles.logoWrapper}>
					<CMLogo />
				</div>
				<div className={styles.formWrapper}>{status === 'unauthenticated' ? children : <Loader fill visible />}</div>
			</div>
		</div>
	);

	//
}
