'use client';

/* * */

import { useRouter } from '@/translations/navigation';
import { Button, SimpleGrid, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

/* * */

export default function AppAuthenticationLoginError() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations('AppAuthenticationLoginError');

	//
	// B. Transform data

	const getErrorMessage = () => {
		switch (searchParams.get('error')) {
			case 'Configuration':
				return t('error_type.configuration');
			case 'AccessDenied':
				return t('error_type.access_denied');
			case 'Verification':
				return t('error_type.verification');
			default:
				return t('error_type.unknown');
		}
	};

	//
	// C. Handle actions

	const handleSignInRetry = () => {
		router.push('/login');
	};

	//
	// D. Render components

	return (
		<SimpleGrid>
			<Text align="center" c="red" fw="bold" lh={1.2}>
				{getErrorMessage()}
			</Text>
			<Button onClick={handleSignInRetry} variant="light" fullWidth>
				{t('retry.label')}
			</Button>
		</SimpleGrid>
	);

	//
}
