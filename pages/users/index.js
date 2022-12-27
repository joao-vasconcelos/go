import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import { TbPlus } from 'react-icons/tb';
import notify from '../../services/notify';
import API from '../../services/API';
import ErrorDisplay from '../../components/ErrorDisplay';

export default function UsersList() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  //
  // B. Fetch data

  const { data: usersData, error: usersError } = useSWR('/api/users/');

  //
  // C. Handle actions

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

  //
  // D. Render components

  return (
    <PageContainer title={['Utilizadores']}>
      <ErrorDisplay error={usersError} />

      <Group>
        <Button leftIcon={<TbPlus />} onClick={handleCreateUser} loading={isLoading}>
          Criar Novo Utilizador
        </Button>
      </Group>

      <DynamicTable
        data={usersData || []}
        isLoading={!usersError && !usersData}
        onRowClick={handleRowClick}
        columns={[
          { label: 'Name', key: 'name' },
          { label: 'Email', key: 'email' },
        ]}
        searchFieldPlaceholder={'Procurar por nome, email, etc...'}
      />
    </PageContainer>
  );
}
