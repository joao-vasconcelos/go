'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../services/API';
import { Validation as StopValidation } from '../../../../schemas/Stop/validation';
import { Default as StopDefault } from '../../../../schemas/Stop/default';
import { Tooltip, Select, SimpleGrid, TextInput, ActionIcon, Divider, Text } from '@mantine/core';
import { TbSquaresFilled, TbTrash } from 'react-icons/tb';
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
  const hasUpdatedFields = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const { _id } = useParams();

  //
  // B. Fetch data

  const { data: stopData, error: stopError, isLoading: stopLoading, isValidating: stopValidating, mutate: stopMutate } = useSWR(_id && `/api/stops/${_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(StopValidation),
    initialValues: StopDefault,
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && stopData) {
      form.setValues(stopData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [stopData, form]);

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/stops/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      const res = await API({ service: 'stops', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      stopMutate({ ...stopData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
      router.push(`/dashboard/stops/${res._id}`);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, form.values, stopMutate, stopData, router]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Paragem?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar esta Paragem para sempre?</Text>,
      labels: { confirm: 'Eliminar Paragem', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(_id, 'loading', 'A eliminar Paragem...');
          await API({ service: 'stops', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/stops');
          notify(_id, 'success', 'Paragem eliminada!');
        } catch (err) {
          console.log(err);
          notify(_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={stopLoading}
            isValidating={stopValidating}
            isErrorValidating={stopError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <HeaderTitle text={form.values.stop_name || 'Paragem Sem Nome'} />
          <Tooltip label='Eliminar Paragem' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <TbTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Configuração da Paragem</SectionTitle>
          <SimpleGrid cols={1}>
            <TextInput placeholder='Nome do Operador' label='Nome da Paragem' {...form.getInputProps('stop_name')} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput placeholder='41' label='ID da Paragem' {...form.getInputProps('stop_id')} />
            <Select label='Idioma' placeholder='Idioma' searchable nothingFound='Sem opções' data={['Português (Portugal)']} {...form.getInputProps('stop_lang')} />
            <Select label='Timezone' placeholder='Lisboa, Portugal' searchable nothingFound='Sem opções' data={['GMT:0 - Lisboa, Portugal']} {...form.getInputProps('stop_timezone')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput placeholder='+351 912 345 678' label='Contacto Telefónico' {...form.getInputProps('stop_phone')} />
            <TextInput placeholder='email@agencia.pt' label='Contacto Eletrónico' {...form.getInputProps('stop_email')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput placeholder='https://...' label='Website Público' {...form.getInputProps('stop_url')} />
            <TextInput placeholder='https://...' label='Website dos Tarifários' {...form.getInputProps('stop_fare_url')} />
          </SimpleGrid>
        </Section>
        <Divider />
      </form>
    </Pannel>
  );
}
