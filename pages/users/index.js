import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Alert, Group } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import Pannel from '../../components/Pannel';
import { TbPlus, TbAlertCircle } from 'react-icons/tb';
import notify from '../../services/notify';
import API from '../../services/API';

export default function UsersList() {
  //

  const router = useRouter();

  const { data, error } = useSWR('/api/users/');

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Creating new User...');
      const response = await API({ service: 'users', operation: 'create', method: 'POST', body: {} });
      router.push(`/users/${response._id}/edit`);
      notify('new', 'success', 'A new User has been created.');
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/users/${row._id}`);
  }

  return (
    <PageContainer title={['Users']}>
      {error && (
        <Alert icon={<TbAlertCircle />} title={error.message} color='red'>
          {error.description}
        </Alert>
      )}

      <Group>
        <Button leftIcon={<TbPlus />} onClick={handleCreateUser} loading={isLoading}>
          Create New User
        </Button>
      </Group>

      <Pannel title={'All Users'}>
        <DynamicTable
          data={data || []}
          isLoading={!error && !data}
          onRowClick={handleRowClick}
          columns={[
            { label: 'Name', key: 'name' },
            { label: 'Email', key: 'email' },
          ]}
          searchFieldPlaceholder={'Search by Name or Email...'}
        />
      </Pannel>
    </PageContainer>
  );
}
