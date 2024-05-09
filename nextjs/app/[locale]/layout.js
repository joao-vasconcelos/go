/* * */

import { notFound } from 'next/navigation';
import { availableFormats, availableLocales } from '@/translations/config';
import { NextIntlClientProvider, useMessages } from 'next-intl';

/* * */

export default function Layout({ children, params: { locale } }) {
	//

	if (!availableLocales.includes(locale)) notFound();

	const messages = useMessages();

	return (
		<NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Lisbon" now={Date.now()} formats={availableFormats}>
			{children}
		</NextIntlClientProvider>
	);

	//
}