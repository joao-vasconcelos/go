import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import Pannel from '../../components/Pannel';
import { TbPlus, TbSettings } from 'react-icons/tb';
import API from '../../services/API';
import notify from '../../services/notify';
import { Spacer } from '../../components/LayoutUtils';
import ErrorDisplay from '../../components/ErrorDisplay';

/* * */
/* AUDITS > LIST */
/* List all available audits. */
/* * */

export default function AuditsList() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: auditsData, error: auditsError } = useSWR('/api/audits/');

  //
  // C. Handle actions

  const handleCreateAudit = async () => {
    try {
      setIsCreating(true);
      const response = await API({ service: 'audits', operation: 'create', method: 'POST', body: {} });
      router.push(`/audits/${response._id}/edit`);
      notify('new', 'success', 'A new Audit has started.');
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/audits/${row._id}`);
  }

  function handleOpenSettings() {
    router.push('/audits/settings');
  }

  //
  // D. Render components

  return (
    <PageContainer title={['Audits']}>
      <ErrorDisplay error={auditsError} />

      <Group>
        <Button onClick={handleCreateAudit} loading={isCreating} leftIcon={<TbPlus />}>
          Start New Audit
        </Button>
        <Spacer width={'full'} />
        <Button onClick={handleOpenSettings} leftIcon={<TbSettings />} variant='light'>
          Settings
        </Button>
      </Group>

      <Pannel title={'All Audits'}>
        <DynamicTable
          data={auditsData || []}
          isLoading={!auditsError && !auditsData}
          onRowClick={handleRowClick}
          columns={[
            { label: '_id', key: '_id' },
            { label: 'Unique Code', key: 'unique_code' },
            { label: 'First Name', key: 'first_name' },
          ]}
          searchFieldPlaceholder={'Search by audit code, supplier, etc...'}
        />
      </Pannel>
    </PageContainer>
  );
}
