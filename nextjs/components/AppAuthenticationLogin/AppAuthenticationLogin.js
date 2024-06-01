'use client';

/* * */

import { EmailDefault } from '@/schemas/Email/default';
import { EmailValidation } from '@/schemas/Email/validation';
import { Button, SimpleGrid, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* * */

export default function AppAuthenticationLogin() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AppAuthenticationLogin');
	const [isLoading, setIsLoading] = useState(false);

	//
	// B. Setup form

	const form = useForm({
		clearInputErrorOnChange: true,
		initialValues: EmailDefault,
		validate: yupResolver(EmailValidation),
	});

	//
	// C. Handle actions

	const handleSignIn = async () => {
		setIsLoading(true);
		signIn('email', { callbackUrl: '/', email: form.values.email });
	};

	//
	// D. Render components

	return (
		<form onSubmit={form.onSubmit(handleSignIn)}>
			<SimpleGrid>
				<TextInput aria-label={t('email.label')} placeholder={t('email.placeholder')} {...form.getInputProps('email')} disabled={isLoading} />
				<Button loading={isLoading} type="submit" fullWidth>
					{t('login.label')}
				</Button>
			</SimpleGrid>
		</form>
	);

	//
}
