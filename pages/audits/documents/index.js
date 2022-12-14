import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group, Text, Modal, Select } from '@mantine/core';
import PageContainer from '../../../components/PageContainer';
import DynamicTable from '../../../components/DynamicTable';
import Pannel from '../../../components/Pannel';
import { TbPlus, TbSettings } from 'react-icons/tb';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { Spacer } from '../../../components/LayoutUtils';
import ErrorDisplay from '../../../components/ErrorDisplay';

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
  const [isCreatingModelOpen, setIsCreatingModelOpen] = useState(false);
  const [selectedAuditTemplate, setSelectedAuditTemplate] = useState();

  //
  // B. Fetch data

  const { data: auditsData, error: auditsError } = useSWR('/api/audits/documents');
  const { data: auditsTemplatesData, error: auditsTemplatesError } = useSWR('/api/audits/templates/forSelect');

  //
  // C. Handle actions

  const handleCreateAudit = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'audits/documents',
        operation: 'create',
        method: 'POST',
        body: { template_id: selectedAuditTemplate },
      });
      router.push(`/audits/documents/${response._id}/edit`);
      notify('new', 'success', 'A new Audit has started.');
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/audits/documents/${row._id}`);
  }

  function handleOpenTemplates() {
    router.push('/audits/templates');
  }

  //
  // D. Render components

  return (
    <PageContainer title={['Audits']}>
      <Modal
        opened={isCreatingModelOpen}
        onClose={() => setIsCreatingModelOpen(false)}
        title={
          <Text size={'lg'} fw={700}>
            Select Audit Template
          </Text>
        }
      >
        <Select
          label='Audit Template'
          placeholder='Pick one'
          clearable
          data={auditsTemplatesData || []}
          value={selectedAuditTemplate}
          onChange={(value) => setSelectedAuditTemplate(value)}
        />
        <Button
          onClick={handleCreateAudit}
          loading={isCreating}
          leftIcon={<TbPlus />}
          disabled={!selectedAuditTemplate}
        >
          Start
        </Button>
      </Modal>

      <ErrorDisplay error={auditsError} />

      <Group>
        <Button onClick={() => setIsCreatingModelOpen(true)} loading={isCreating} leftIcon={<TbPlus />}>
          Start New Audit
        </Button>
        <Spacer width={'full'} />
        <Button onClick={handleOpenTemplates} leftIcon={<TbSettings />} variant='light'>
          Templates
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
