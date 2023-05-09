'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../services/API';
import { Validation as MunicipalityValidation } from '../../../../schemas/Municipality/validation';
import { Default as MunicipalityDefault } from '../../../../schemas/Municipality/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Text } from '@mantine/core';
import { TbTrash } from 'react-icons/tb';
import Pannel from '../../../../components/Pannel/Pannel';
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

  const { municipality_id } = useParams();

  //
  // B. Fetch data

  const { data: municipalityData, error: municipalityError, isLoading: municipalityLoading } = useSWR(municipality_id && `/api/municipalities/${municipality_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(MunicipalityValidation),
    initialValues: municipalityData || MunicipalityDefault,
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
    router.push(`/dashboard/municipalities/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'municipalities', resourceId: municipality_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [municipality_id, form]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Município?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar este Município para sempre?</Text>,
      labels: { confirm: 'Eliminar Município', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(municipality_id, 'loading', 'A eliminar Município...');
          await API({ service: 'municipalities', resourceId: municipality_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/municipalities');
          notify(municipality_id, 'success', 'Município eliminado!');
        } catch (err) {
          console.log(err);
          notify(municipality_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={municipalityLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={municipalityLoading}
            isErrorValidating={municipalityError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <HeaderTitle text={form.values.municipality_name || 'Município Sem Nome'} />
          <Tooltip label='Eliminar Município' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <TbTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Configuração do Município</SectionTitle>
          <SimpleGrid cols={2}>
            <TextInput label='Código do Município' placeholder='FARE_1' {...form.getInputProps('municipality_code')} />
            <TextInput label='Nome do Município' placeholder='Tarifa 1' {...form.getInputProps('municipality_name')} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput label='Distrito' placeholder='Distrito' {...form.getInputProps('district')} />
            <TextInput label='DiCo' placeholder='DiCo' {...form.getInputProps('dico')} />
            <TextInput label='Nuts III' placeholder='Nuts III' {...form.getInputProps('nuts_iii')} />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
