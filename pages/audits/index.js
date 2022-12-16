import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group, Text, Modal, Select } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import Pannel from '../../components/Pannel';
import { TbPlus } from 'react-icons/tb';
import API from '../../services/API';
import notify from '../../services/notify';
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
  const [isCreatingModelOpen, setIsCreatingModelOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState();

  //
  // B. Fetch data

  const { data: auditsData, error: auditsError } = useSWR('/api/audits');
  const { data: templatesData, error: templatesError } = useSWR('/api/templates/forSelect');

  //
  // C. Handle actions

  const handleCreateAudit = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'audits',
        operation: 'create',
        method: 'POST',
        body: { template: { _id: selectedTemplateId } },
      });
      router.push(`/audits/${response._id}/edit`);
      notify('new', 'success', 'A new Audit has started.');
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  const handleRowClick = (row) => {
    router.push(`/audits/${row._id}`);
  };

  //
  // D. Render components

  return (
    <PageContainer title={['Audits']}>
      <Modal
        opened={isCreatingModelOpen}
        onClose={() => setIsCreatingModelOpen(false)}
        title={
          <Text size={'lg'} fw={700}>
            Select Template
          </Text>
        }
      >
        <Select
          label='Audit Template'
          placeholder='Pick one'
          clearable
          data={templatesData || []}
          value={selectedTemplateId}
          onChange={(value) => setSelectedTemplateId(value)}
        />
        <Button onClick={handleCreateAudit} loading={isCreating} leftIcon={<TbPlus />} disabled={!selectedTemplateId}>
          Start
        </Button>
      </Modal>

      <ErrorDisplay error={auditsError} />

      <Group>
        <Button onClick={() => setIsCreatingModelOpen(true)} loading={isCreating} leftIcon={<TbPlus />}>
          Start New Audit
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
