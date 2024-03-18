'use client';

/* * */

import useSWR from 'swr';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots, IconDownload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import SearchField from '@/components/SearchField/SearchField';
import ListHeader from '@/components/ListHeader/ListHeader';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';

/* * */

export default function StopsExplorerListHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopsExplorerListHeader');
  const stopsExplorerContext = useStopsExplorerContext();
  const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

  //
  // B. Fetch data

  const { isLoading: allStopsLoading } = useSWR('/api/stops');

  //
  // C. Render components

  return (
    <ListHeader>
      <SearchField query={stopsExplorerContext.list.search_query} onChange={stopsExplorerContext.updateSearchQuery} />
      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="light" size="lg" color="gray" loading={allStopsLoading}>
            <IconDots size={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <AppAuthenticationCheck permissions={[{ scope: 'stops', action: 'create' }]}>
            <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={stopsExplorerNewStopWizardContext.openWizard}>
              {t('operations.create.title')}
            </Menu.Item>
          </AppAuthenticationCheck>
          <AppAuthenticationCheck permissions={[{ scope: 'stops', action: 'export' }]}>
            <Menu.Item leftSection={<IconDownload size={20} />} onClick={stopsExplorerContext.exportAsFile}>
              {t('operations.export.title')}
            </Menu.Item>
          </AppAuthenticationCheck>
          <AppAuthenticationCheck permissions={[{ scope: 'stops', action: 'export' }]}>
            <Menu.Item leftSection={<IconDownload size={20} />} onClick={stopsExplorerContext.exportDeletedAsFile}>
              {t('operations.export_deleted.title')}
            </Menu.Item>
          </AppAuthenticationCheck>
        </Menu.Dropdown>
      </Menu>
    </ListHeader>
  );

  //
}
