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
			<Button fullWidth variant="light" onClick={handleSignInRetry}>
				{t('retry.label')}
			</Button>
		</SimpleGrid>
	);

	//
}