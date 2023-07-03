import pjson from '../../package.json';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next-intl/client';
import { Menu, ActionIcon } from '@mantine/core';
import { IconSettings, IconLanguage, IconLogin } from '@tabler/icons-react';
import { availableLocales } from '../../translations/config';
import { signOut } from 'next-auth/react';

export default function LocaleSwitcher() {
  //

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('AppOptions');

  const handleLocaleSwitch = (selectedLocale) => {
    router.replace(`/${selectedLocale}${pathname}`);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <Menu offset={15} position='bottom-end' shadow='lg'>
      <Menu.Target>
        <ActionIcon>
          <IconSettings size='20px' />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t('language.label')}</Menu.Label>
        {availableLocales.map((availableLocale) => (
          <Menu.Item key={availableLocale} icon={<IconLanguage size={20} />} onClick={() => handleLocaleSwitch(availableLocale)} disabled={locale === availableLocale}>
            {t('language.locale', { locale: availableLocale })}
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Item icon={<IconLogin size={20} />} color='red' onClick={handleLogout}>
          {t('auth.logout')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>{t('version.label', { version: pjson.version })}</Menu.Label>
      </Menu.Dropdown>
    </Menu>
  );
}
