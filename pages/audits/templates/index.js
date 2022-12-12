import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group } from '@mantine/core';
import PageContainer from '../../../components/PageContainer';
import DynamicTable from '../../../components/DynamicTable';
import Pannel from '../../../components/Pannel';
import { TbPlus } from 'react-icons/tb';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { Spacer } from '../../../components/LayoutUtils';
import ErrorDisplay from '../../../components/ErrorDisplay';

/* * */
/* AUDITS > TEMPLATES > LIST */
/* List all available audit templates. */
/* * */

export default function AuditsTemplatesList() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: auditsTemplatesData, error: auditsTemplatesError } = useSWR('/api/audits/templates');

  //
  // C. Handle actions

  const handleCreateAuditTemplate = async () => {
    try {
      setIsCreating(true);
      const response = await API({ service: 'audits/templates', operation: 'create', method: 'POST', body: {} });
      router.push(`/audits/templates/${response._id}/edit`);
      notify('new', 'success', 'A new Audit Template was created.');
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/audits/templates/${row._id}`);
  }

  //
  // D. Render components

  return (
    <PageContainer title={['Audits', 'Templates']}>
      <ErrorDisplay error={auditsTemplatesError} />

      <Group>
        <Button onClick={handleCreateAuditTemplate} loading={isCreating} leftIcon={<TbPlus />}>
          Create New Audit Template
        </Button>
        <Spacer width={'full'} />
      </Group>

      <Pannel title={'All Audits Templates'}>
        <DynamicTable
          data={auditsTemplatesData || []}
          isLoading={!auditsTemplatesError && !auditsTemplatesData}
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
