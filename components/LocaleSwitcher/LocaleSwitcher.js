import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next-intl/client';
import { Menu, ActionIcon } from '@mantine/core';
import { IconLanguageHiragana } from '@tabler/icons-react';
import { availableLocales } from '../../translations/config';

export default function LocaleSwitcher() {
  //

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('LocaleSwitcher');

  const handleLocaleSwitch = (selectedLocale) => {
    router.replace(`/${selectedLocale}${pathname}`);
  };

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
          <IconLanguageHiragana size='20px' />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {availableLocales.map((availableLocale) => (
          <Menu.Item key={availableLocale} onClick={() => handleLocaleSwitch(availableLocale)} disabled={locale === availableLocale}>
            {t('locale', { locale: availableLocale })}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
