'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../services/API';
import { Validation as UserValidation } from '../../../../schemas/User/validation';
import { Default as UserDefault } from '../../../../schemas/User/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, Text } from '@mantine/core';
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

  const { data: userData, error: userError, isLoading: userLoading, isValidating: userValidating, mutate: userMutate } = useSWR(_id && `/api/users/${_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(UserValidation),
    initialValues: UserDefault,
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && userData) {
      form.setValues(userData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [userData, form]);

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
      const res = await API({ service: 'users', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      userMutate({ ...userData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
      router.push(`/dashboard/users/${res._id}`);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, form.values, userMutate, userData, router]);

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
          notify(_id, 'loading', 'A eliminar Utilizador...');
          await API({ service: 'users', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/users');
          notify(_id, 'success', 'Utilizador eliminado!');
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
            isLoading={userLoading}
            isValidating={userValidating}
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
              <TbTrash size='20px' />
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
        <Divider />
      </form>
    </Pannel>
  );
}
