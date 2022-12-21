import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import Pannel from '../../components/Pannel';
import { TbPlus } from 'react-icons/tb';
import API from '../../services/API';
import notify from '../../services/notify';
import { Spacer } from '../../components/LayoutUtils';
import ErrorDisplay from '../../components/ErrorDisplay';

/* * */
/* TEMPLATES > LIST */
/* List all available templates. */
/* * */

export default function TemplatesList() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: templatesData, error: templatesError } = useSWR('/api/templates');

  //
  // C. Handle actions

  const handleCreateAuditTemplate = async () => {
    try {
      setIsCreating(true);
      const response = await API({ service: 'templates', operation: 'create', method: 'POST', body: {} });
      router.push(`/templates/${response._id}/edit`);
      notify('new', 'success', 'A new Audit Template was created.');
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/templates/${row._id}`);
  }

  //
  // D. Render components

  return (
    <PageContainer title={['Modelos']}>
      <ErrorDisplay error={templatesError} />

      <Group>
        <Button onClick={handleCreateAuditTemplate} loading={isCreating} leftIcon={<TbPlus />}>
          Criar Novo Modelo
        </Button>
        <Spacer width={'full'} />
      </Group>

      <Pannel title={'Todos os Modelos'}>
        <DynamicTable
          data={templatesData || []}
          isLoading={!templatesError && !templatesData}
          onRowClick={handleRowClick}
          columns={[{ label: 'Title', key: 'title' }]}
          searchFieldPlaceholder={'Search by audit code, supplier, etc...'}
        />
      </Pannel>
    </PageContainer>
  );
}
