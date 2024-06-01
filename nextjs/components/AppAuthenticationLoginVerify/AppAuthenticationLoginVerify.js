'use client';

/* * */

import { useRouter } from '@/translations/navigation';
import { Button, SimpleGrid, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

/* * */

export default function AppAuthenticationLoginVerify() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('AppAuthenticationLoginVerify');

	//
	// B. Handle actions

	const handleSignInRetry = () => {
		router.push('/login');
	};

	//
	// C. Render components

	return (
		<SimpleGrid>
			<Text align="center">{t('instruction')}</Text>
			<Button onClick={handleSignInRetry} variant="light" fullWidth>
				{t('retry.label')}
			</Button>
		</SimpleGrid>
	);

	//
}
