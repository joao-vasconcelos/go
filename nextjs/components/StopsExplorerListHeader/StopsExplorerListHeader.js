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
  // C. Handle actions

  const handleCreate = async () => {
    stopsExplorerNewStopWizardContext.openWizard();
  };

  const handleExportAsFile = async () => {
    stopsExplorerContext.exportAsFile();
  };

  //
  // D. Render components

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
            <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
              {t('operations.create.title')}
            </Menu.Item>
          </AppAuthenticationCheck>
          <AppAuthenticationCheck permissions={[{ scope: 'stops', action: 'create' }]}>
            <Menu.Item leftSection={<IconDownload size={20} />} onClick={handleExportAsFile}>
              {/* {t('operations.create.title')} */}
              Download as TXT file
            </Menu.Item>
          </AppAuthenticationCheck>
        </Menu.Dropdown>
      </Menu>
    </ListHeader>
  );

  //
}
