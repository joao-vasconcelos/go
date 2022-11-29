import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, LoadingOverlay, Group } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import TableSort from '../../components/TableSort';
import Pannel from '../../components/Pannel';
import { TbPlus } from 'react-icons/tb';
import API from '../../services/API';
import notify from '../../services/notify';

export default function AuditsList() {
  //

  const router = useRouter();

  const { data, error } = useSWR('/api/audits/');

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAudit = async () => {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Starting new Audit...');
      const response = await API({ service: 'audits', operation: 'create', method: 'POST', body: {} });
      router.push(`/audits/${response._id}/edit`);
      notify('new', 'success', 'A new Audit has started.');
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/audits/${row._id}`);
  }

  return (
    <PageContainer title={'Audits'}>
      <Group>
        <Button leftIcon={<TbPlus />} onClick={handleCreateAudit} loading={isLoading}>
          Start New Audit
        </Button>
      </Group>
      <Pannel title={'All Audits'}>
        <TableSort
          data={data || []}
          isLoading={!error && !data}
          onRowClick={handleRowClick}
          columns={[
            { label: '_id', key: '_id' },
            { label: 'Unique Code', key: 'unique_code' },
            { label: 'First Name', key: 'first_name' },
          ]}
          searchFieldPlaceholder={'Search by stop code, name, etc...'}
        />
      </Pannel>
    </PageContainer>
  );
}
