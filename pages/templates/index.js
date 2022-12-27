import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group, Modal, Stack, Text, Select, Divider } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import Pannel from '../../components/Pannel';
import { TbPlus, TbArrowRight } from 'react-icons/tb';
import API from '../../services/API';
import notify from '../../services/notify';
import { Spacer } from '../../components/LayoutUtils';
import ErrorDisplay from '../../components/ErrorDisplay';
import { forwardRef } from 'react';

/* * */
/* TEMPLATES > LIST */
/* List all available templates. */
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

const ModalOptionBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray1',
  border: '1px solid $gray7',
  borderRadius: '$md',
  overflow: 'hidden',
  padding: '$md',
  gap: '$md',
  '& div': {
    '& h1': {
      fontSize: '18px',
      fontWeight: '$bold',
      lineHeight: 1.5,
      margin: 0,
    },
    '& p': {
      fontSize: '14px',
      lineHeight: 1.5,
      opacity: 0.5,
    },
  },
});

export default function TemplatesList() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingModelOpen, setIsCreatingModelOpen] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState(false);

  //
  // B. Fetch data

  const { data: auditsData, error: auditsError } = useSWR('/api/audits/asSelectOptions');
  const { data: templatesData, error: templatesError } = useSWR('/api/templates');

  //
  // C. Handle actions

  const handleCreateTemplate = async () => {
    try {
      setIsCreating(true);
      const response = await API({ service: 'templates', operation: 'create', method: 'POST', body: {} });
      router.push(`/templates/${response._id}/edit`);
      notify('new', 'success', 'A new Template was created.');
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  const handleCreateTemplateFromAudit = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'templates',
        operation: 'createFromAudit',
        method: 'POST',
        body: { audit_id: selectedAuditId },
      });
      router.push(`/templates/${response._id}/edit`);
      notify('new', 'success', 'A new Template was created.');
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
    <PageContainer title={['Todos os Modelos']}>
      <Modal
        opened={isCreatingModelOpen}
        onClose={() => setIsCreatingModelOpen(false)}
        title={
          <Text size={'lg'} fw={700}>
            Criar Novo Modelo
          </Text>
        }
      >
        <Stack>
          <Text size={'sm'}>Selecione o modelo mais adequado para esta Auditoria.</Text>
          <ModalOptionBox>
            <div>
              <h1>Criar Modelo de Raíz</h1>
              <p>Construa um novo modelo a partir do zero.</p>
            </div>
            <Button onClick={handleCreateTemplate} loading={isCreating} rightIcon={<TbArrowRight />}>
              Criar Modelo
            </Button>
          </ModalOptionBox>

          <ModalOptionBox>
            <div>
              <h1>Criar Modelo com base numa Auditoria</h1>
              <p>Utilize o modelo de uma Auditoria já existente como base para o novo modelo.</p>
            </div>
            <Select
              clearable
              maxDropdownHeight={300}
              placeholder='Escolha uma opção'
              data={auditsData || []}
              value={selectedAuditId}
              itemComponent={SelectItem}
              nothingFound='Nenhum modelo disponível'
              onChange={(value) => setSelectedAuditId(value)}
            />
            <Button
              onClick={handleCreateTemplateFromAudit}
              loading={isCreating}
              rightIcon={<TbArrowRight />}
              disabled={!selectedAuditId}
            >
              Copiar Modelo desta Auditoria
            </Button>
            <Text size={'xs'} c='dimmed'>
              Esta operação não terá qualquer efeito na Auditoria.
            </Text>
          </ModalOptionBox>
        </Stack>
      </Modal>

      <ErrorDisplay error={templatesError} />

      <Group>
        <Button onClick={() => setIsCreatingModelOpen(true)} loading={isCreating} leftIcon={<TbPlus />}>
          Criar Novo Modelo
        </Button>
      </Group>

      <DynamicTable
        data={templatesData || []}
        isLoading={!templatesError && !templatesData}
        onRowClick={handleRowClick}
        columns={[{ label: 'Title', key: 'title' }]}
        searchFieldPlaceholder={'Search by audit code, supplier, etc...'}
      />
    </PageContainer>
  );
}
