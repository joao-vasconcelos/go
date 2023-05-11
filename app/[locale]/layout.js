//
// LOCALE LAYOUT

import { ServerStylesheet } from '../stitches';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

export default async function LocaleLayout({ children, params: { locale } }) {
  //

  let messages;
  try {
    messages = (await import(`../../translations/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ServerStylesheet>{children}</ServerStylesheet>
    </NextIntlClientProvider>
  );
}
