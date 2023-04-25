'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../services/API';
import { Validation as AgencyValidation } from '../../../../schemas/Agency/validation';
import { Default as AgencyDefault } from '../../../../schemas/Agency/default';
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

  const { data: agencyData, error: agencyError, isLoading: agencyLoading, isValidating: agencyValidating, mutate: agencyMutate } = useSWR(_id && `/api/agencies/${_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(AgencyValidation),
    initialValues: AgencyDefault,
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && agencyData) {
      form.setValues(agencyData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [agencyData, form]);

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/agencies/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      const res = await API({ service: 'agencies', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      agencyMutate({ ...agencyData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
      router.push(`/dashboard/agencies/${res._id}`);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, form.values, agencyMutate, agencyData, router]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Agência?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar esta Agência para sempre?</Text>,
      labels: { confirm: 'Eliminar Agência', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(_id, 'loading', 'A eliminar Agência...');
          await API({ service: 'agencies', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/agencies');
          notify(_id, 'success', 'Agência eliminada!');
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
            isLoading={agencyLoading}
            isValidating={agencyValidating}
            isErrorValidating={agencyError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <HeaderTitle text={form.values.agency_name || 'Agência Sem Nome'} />
          <Tooltip label='Eliminar Agência' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <TbTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Configuração da Agência</SectionTitle>
          <SimpleGrid cols={1}>
            <TextInput placeholder='Nome do Operador' label='Nome da Agência' {...form.getInputProps('agency_name')} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput placeholder='41' label='ID da Agência' {...form.getInputProps('agency_id')} />
            <Select label='Idioma' placeholder='Idioma' searchable nothingFound='Sem opções' data={['Português (Portugal)']} {...form.getInputProps('agency_lang')} />
            <Select label='Timezone' placeholder='Lisboa, Portugal' searchable nothingFound='Sem opções' data={['GMT:0 - Lisboa, Portugal']} {...form.getInputProps('agency_timezone')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput placeholder='+351 912 345 678' label='Contacto Telefónico' {...form.getInputProps('agency_phone')} />
            <TextInput placeholder='email@agencia.pt' label='Contacto Eletrónico' {...form.getInputProps('agency_email')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput placeholder='https://...' label='Website Público' {...form.getInputProps('agency_url')} />
            <TextInput placeholder='https://...' label='Website dos Tarifários' {...form.getInputProps('agency_fare_url')} />
          </SimpleGrid>
        </Section>
        <Divider />
      </form>
    </Pannel>
  );
}
