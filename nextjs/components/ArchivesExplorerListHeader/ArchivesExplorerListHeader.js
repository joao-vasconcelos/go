'use client';

/* * */

import { useState } from 'react';
import useSWR from 'swr';
import API from '@/services/API';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import notify from '@/services/notify';
import { useTranslations } from 'next-intl';
import ListHeader from '@/components/ListHeader/ListHeader';
import SearchField from '@/components/SearchField/SearchField';
import { useArchivesExplorerContext } from '@/contexts/ArchivesExplorerContext';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function ArchivesExplorerListHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ArchivesExplorerListHeader');
  const [isCreating, setIsCreating] = useState(false);
  const archivesExplorerContext = useArchivesExplorerContext();

  //
  // B. Fetch data

  const { isLoading: allArchivesLoading, mutate: allArchivesMutate } = useSWR('/api/archives');

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      await API({ service: 'archives', operation: 'create', method: 'GET' });
      allArchivesMutate();
      notify('new', 'success', t('operations.create.success'));
      setIsCreating(false);
    } catch (err) {
      notify('new', 'error', err.message || t('operations.create.error'));
      setIsCreating(false);
      console.log(err);
    }
  };

  const handleMerge = async () => {
    try {
      setIsCreating(true);
      notify('merge', 'loading', 'merging...');
      const archiveBlob = await API({ service: 'archives', operation: 'merge', method: 'GET', parseType: 'blob' });
      const objectURL = URL.createObjectURL(archiveBlob);
      const zipDownload = document.createElement('a');
      zipDownload.href = objectURL;
      zipDownload.download = '1234.zip';
      document.body.appendChild(zipDownload);
      zipDownload.click();
      notify('merge', 'success', 'merged! yeeey');
      setIsCreating(false);
    } catch (err) {
      notify('merge', 'error', err.message || 'error merging');
      setIsCreating(false);
      console.log(err);
    }
  };

  //
  // D. Render components

  return (
    <ListHeader>
      <AppAuthenticationCheck permissions={[{ scope: 'archives', action: 'create' }]}>
        <div>
          <Button variant="light" color="gray" leftSection={<IconPlus size={20} />} loading={allArchivesLoading || isCreating} onClick={handleCreate}>
            {t('operations.create.title')}
          </Button>
        </div>
        <div>
          <Button variant="light" color="gray" leftSection={<IconPlus size={20} />} loading={allArchivesLoading || isCreating} onClick={handleMerge}>
            Merge
          </Button>
        </div>
      </AppAuthenticationCheck>
      <SearchField query={archivesExplorerContext.list.search_query} onChange={archivesExplorerContext.updateSearchQuery} />
    </ListHeader>
  );

  //
}
