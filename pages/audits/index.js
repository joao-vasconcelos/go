import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group, Text, Modal, Select, Stack } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import Pannel from '../../components/Pannel';
import { TbPlus, TbArrowRight } from 'react-icons/tb';
import API from '../../services/API';
import notify from '../../services/notify';
import ErrorDisplay from '../../components/ErrorDisplay';
import { forwardRef } from 'react';

/* * */
/* AUDITS > LIST */
/* List all available audits. */
/* * */

const SelectItem = forwardRef(({ label, description, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Text size='md'>{label}</Text>
    <Text size='xs' opacity={0.65}>
      {description}
    </Text>
  </div>
));
SelectItem.displayName = 'SelectItem';

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
  const { data: templatesData, error: templatesError } = useSWR('/api/templates/asSelectOptions');

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
            Selecionar Modelo
          </Text>
        }
      >
        <Stack>
          <Text size={'sm'}>Selecione o modelo mais adequado para esta Auditoria.</Text>
          <Select
            clearable
            maxDropdownHeight={300}
            placeholder='Escolha uma opção'
            data={templatesData || []}
            value={selectedTemplateId}
            itemComponent={SelectItem}
            nothingFound='Nenhum modelo disponível'
            onChange={(value) => setSelectedTemplateId(value)}
          />
          <Button
            onClick={handleCreateAudit}
            loading={isCreating}
            rightIcon={<TbArrowRight />}
            disabled={!selectedTemplateId}
          >
            Iniciar Auditoria
          </Button>
          <Text size={'xs'} c='dimmed'>
            Uma vez escolhido o modelo, não será possível alterar a estrutura de informação da Auditoria.
          </Text>
        </Stack>
      </Modal>

      <ErrorDisplay error={auditsError} />

      <Group>
        <Button onClick={() => setIsCreatingModelOpen(true)} loading={isCreating} leftIcon={<TbPlus />}>
          Iniciar Nova Auditoria
        </Button>
      </Group>

      <Pannel title={'Todas as Auditorias'}>
        <DynamicTable
          data={auditsData || []}
          isLoading={!auditsError && !auditsData}
          onRowClick={handleRowClick}
          columns={[
            { label: '_id', key: '_id' },
            { label: 'Unique Code', key: 'unique_code' },
            { label: 'First Name', key: 'first_name' },
          ]}
          searchFieldPlaceholder={'Procurar por código, intervenintes, etc...'}
        />
      </Pannel>
    </PageContainer>
  );
}
