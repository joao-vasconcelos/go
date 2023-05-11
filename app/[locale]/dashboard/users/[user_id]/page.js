'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../services/API';
import { Validation as UserValidation } from '../../../../../schemas/User/validation';
import { Default as UserDefault } from '../../../../../schemas/User/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '../../../../../components/Pannel/Pannel';
import SaveButtons from '../../../../../components/SaveButtons';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import HeaderTitle from '../../../../../components/lists/HeaderTitle';

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

  const { user_id } = useParams();

  //
  // B. Fetch data

  const { data: userData, error: userError, isLoading: userLoading } = useSWR(user_id && `/api/users/${user_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(UserValidation),
    initialValues: userData || UserDefault,
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
    router.push(`/dashboard/users/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'users', resourceId: user_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [user_id, form]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Utilizador?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar este Utilizador para sempre?</Text>,
      labels: { confirm: 'Eliminar Utilizador', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(user_id, 'loading', 'A eliminar Utilizador...');
          await API({ service: 'users', resourceId: user_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/users');
          notify(user_id, 'success', 'Utilizador eliminado!');
        } catch (err) {
          console.log(err);
          notify(user_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={userLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={userLoading}
            isErrorValidating={userError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <HeaderTitle text={form.values.name || 'Utilizador Sem Nome'} />
          <Tooltip label='Eliminar Utilizador' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <IconTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Configuração do Utilizador</SectionTitle>
          <SimpleGrid cols={1}>
            <TextInput placeholder='Nome Apelido' label='Nome do Utilizador' {...form.getInputProps('name')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput placeholder='email@tmlmobilidade.pt' label='Email do Utilizador' {...form.getInputProps('email')} />
            <TextInput placeholder='+351 912 345 678' label='Contacto Telefónico' {...form.getInputProps('phone')} />
          </SimpleGrid>
          <SimpleGrid cols={1}>
            <TextInput placeholder='Sem Informação' label='Último Login' {...form.getInputProps('emailVerified')} readOnly />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
