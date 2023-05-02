'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../services/API';
import { Validation as FareValidation } from '../../../../schemas/Fare/validation';
import { Default as FareDefault } from '../../../../schemas/Fare/default';
import { Tooltip, NumberInput, Select, SimpleGrid, TextInput, ActionIcon, Text, MultiSelect } from '@mantine/core';
import { TbTrash } from 'react-icons/tb';
import Pannel from '../../../../layouts/Pannel';
import SaveButtons from '../../../../components/SaveButtons';
import notify from '../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import HeaderTitle from '../../../../components/lists/HeaderTitle';

const SectionTitle = styled('p', {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '$gray12',
});

const Section = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$lg',
  gap: '$md',
  width: '100%',
  maxHeight: '100%',
});

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const { fare_id } = useParams();

  //
  // B. Fetch data

  const { data: fareData, error: fareError, isLoading: fareLoading } = useSWR(fare_id && `/api/fares/${fare_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: agenciesData } = useSWR('/api/agencies');

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(FareValidation),
    initialValues: fareData || FareDefault,
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      form.setValues(data);
      form.resetDirty(data);
    }
  };

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/fares/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'fares', resourceId: fare_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [fare_id, form]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Tarifário?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar este Tarifário para sempre?</Text>,
      labels: { confirm: 'Eliminar Tarifário', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(fare_id, 'loading', 'A eliminar Tarifário...');
          await API({ service: 'fares', resourceId: fare_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/fares');
          notify(fare_id, 'success', 'Tarifário eliminado!');
        } catch (err) {
          console.log(err);
          notify(fare_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={fareLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={fareLoading}
            isErrorValidating={fareError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <HeaderTitle text={form.values.fare_long_name || 'Tarifário Sem Nome'} />
          <Tooltip label='Eliminar Tarifário' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <TbTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Configuração do Tarifário</SectionTitle>
          <SimpleGrid cols={3}>
            <TextInput label='Nome do Tarifário' placeholder='Tarifa 1' {...form.getInputProps('fare_long_name')} />
            <TextInput label='Abreviatura' placeholder='1' {...form.getInputProps('fare_short_name')} />
            <TextInput label='Código do Tarifário' placeholder='FARE_1' {...form.getInputProps('fare_code')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <NumberInput label='Preço' placeholder='3.50' precision={2} step={0.05} min={0.0} {...form.getInputProps('price')} />
            <Select label='Moeda' placeholder='EUR' searchable nothingFound='Sem opções' data={[{ value: 'EUR', label: 'Euro' }]} {...form.getInputProps('currency_type')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Select
              label='Modalidade de Pagamento'
              placeholder='Escolha uma opção'
              searchable
              nothingFound='Sem opções'
              data={[
                { value: '0', label: 'Pagamento a Bordo (navegante® a bordo)' },
                { value: '1', label: 'Pré-pagamento (navegante® pré-pago, navegante®)' },
              ]}
              {...form.getInputProps('payment_method')}
            />
            <Select
              label='Permite Transbordos'
              placeholder='Sim / Não'
              nothingFound='Sem opções'
              data={[
                { value: '0', label: 'Não, não são permitidos transbordos.' },
                { value: '1', label: 'Sim, é permitido apenas 1 transbordo.' },
                { value: '2', label: 'Sim, são permitidos apenas 2 transbordos.' },
                { value: '', label: 'Sim, são permitidos transbordos ilimitados.' },
              ]}
              {...form.getInputProps('transfers')}
            />
          </SimpleGrid>
          <SimpleGrid cols={1}>
            <MultiSelect
              label='Agências'
              placeholder='Agências relacionadas'
              searchable
              nothingFound='Sem opções'
              data={
                agenciesData
                  ? agenciesData.map((item) => {
                      return { value: item._id, label: item.agency_name || 'Agência Sem Nome' };
                    })
                  : []
              }
              {...form.getInputProps('agencies')}
            />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
